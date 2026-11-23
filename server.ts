import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { PRODUCTS, SAMPLE_ORDERS } from './src/data/catalog.ts';
import type {
  BagItem,
  FinishingOption,
  OrderRecord,
  SupportQueryRecord,
  UserProfile,
} from './src/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const STORE_PATH = path.resolve(DATA_DIR, 'atelier-store.json');
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  pinCode?: string;
  passwordHash: string;
  createdAt: string;
}

interface StoreData {
  users: StoredUser[];
  orders: OrderRecord[];
  supportQueries: SupportQueryRecord[];
}

interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  authUser?: StoredUser;
}

const DEFAULT_STORE: StoreData = {
  users: [],
  orders: [],
  supportQueries: [],
};

let writeQueue: Promise<void> = Promise.resolve();

async function ensureStoreFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
  }
}

async function readStore(): Promise<StoreData> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      supportQueries: Array.isArray(parsed.supportQueries) ? parsed.supportQueries : [],
    };
  } catch {
    return { users: [], orders: [], supportQueries: [] };
  }
}

function mutateStore<T>(fn: (store: StoreData) => Promise<T> | T): Promise<T> {
  const next = writeQueue.then(async () => {
    const store = await readStore();
    const result = await fn(store);
    const tmpPath = `${STORE_PATH}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(store, null, 2), 'utf8');
    await fs.rename(tmpPath, STORE_PATH);
    return result;
  });
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function sanitizeMultilineText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().slice(0, 160);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeOrderNumber(value: string): string {
  return value.trim().replace(/^#/, '').toUpperCase().slice(0, 32);
}

function toPublicUser(user: StoredUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || '',
    city: user.city || '',
    pinCode: user.pinCode || '',
    createdAt: user.createdAt,
  };
}

function scryptHash(password: string, saltHex: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, saltHex, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const saltHex = crypto.randomBytes(16).toString('hex');
  const hashHex = await scryptHash(password, saltHex);
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [saltHex, expectedHex] = parts;
  if (!saltHex || !expectedHex) return false;
  const derivedHex = await scryptHash(password, saltHex);
  const a = Buffer.from(derivedHex, 'hex');
  const b = Buffer.from(expectedHex, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function signToken(user: StoredUser): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (!decoded.sub || typeof decoded.exp !== 'number' || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

async function extractAuthUser(req: Request): Promise<StoredUser | null> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  const payload = verifyToken(token);
  if (!payload) return null;
  const store = await readStore();
  return store.users.find((u) => u.id === payload.sub) || null;
}

async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await extractAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Please sign in to access your atelier account.' });
    return;
  }
  req.authUser = user;
  next();
}

function sanitizeCartItems(rawItems: unknown): BagItem[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 25) {
    return [];
  }
  const clean: BagItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const productId = sanitizeText(item.productId, 80);
    const catalogProduct = PRODUCTS.find((p) => p.id === productId);
    if (!catalogProduct) continue;

    const finishing: FinishingOption =
      item.finishing === 'fall-pico' ? 'fall-pico' : 'unstitched';
    const quantity = Math.min(10, Math.max(1, Math.floor(Number(item.quantity) || 1)));
    const shadeName = sanitizeText(item.shadeName, 60) || catalogProduct.shades[0].name;
    const unitPrice = catalogProduct.price + (finishing === 'fall-pico' ? 1500 : 0);

    clean.push({
      key: `${catalogProduct.id}::${shadeName}::${finishing}`,
      productId: catalogProduct.id,
      name: catalogProduct.name,
      subtitle: catalogProduct.subtitle,
      sku: catalogProduct.sku,
      image: catalogProduct.frontImage,
      shadeName,
      finishing,
      unitPrice,
      quantity,
    });
  }
  return clean;
}

function generateUniqueOrderNumber(existing: OrderRecord[]): string {
  const used = new Set(existing.map((o) => normalizeOrderNumber(o.orderNumber)));
  for (let i = 0; i < 30; i += 1) {
    const candidate = `NMW-${Math.floor(1045 + Math.random() * 8900)}`;
    if (!used.has(candidate)) return candidate;
  }
  return `NMW-${Date.now().toString().slice(-5)}`;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const name = sanitizeText(req.body?.name, 100);
    const email = normalizeEmail(req.body?.email);
    const phone = sanitizeText(req.body?.phone, 30);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (name.length < 2) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
      return;
    }

    try {
      const passwordHash = await hashPassword(password);
      const created = await mutateStore((store) => {
        if (store.users.some((u) => u.email === email)) {
          return null;
        }
        const user: StoredUser = {
          id: `usr_${crypto.randomBytes(8).toString('hex')}`,
          name,
          email,
          phone,
          address: '',
          city: '',
          pinCode: '',
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        store.users.push(user);

        // Link any prior guest orders matching this verified registration email
        for (const ord of store.orders) {
          if (!ord.userId && normalizeEmail(ord.email) === email) {
            ord.userId = user.id;
          }
        }
        return user;
      });

      if (!created) {
        res.status(409).json({
          error: 'An atelier account with this email already exists. Please sign in instead.',
        });
        return;
      }

      const token = signToken(created);
      res.status(201).json({ token, user: toPublicUser(created) });
    } catch {
      res.status(500).json({ error: 'Unable to create your account right now.' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!isValidEmail(email) || !password) {
      res.status(400).json({ error: 'Enter both your email address and password.' });
      return;
    }

    try {
      const store = await readStore();
      const user = store.users.find((u) => u.email === email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = signToken(user);
      res.json({ token, user: toPublicUser(user) });
    } catch {
      res.status(500).json({ error: 'Unable to sign in right now.' });
    }
  });

  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: toPublicUser(req.authUser!) });
  });

  app.patch('/api/auth/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const name = sanitizeText(req.body?.name, 100);
    const phone = sanitizeText(req.body?.phone, 30);
    const address = sanitizeText(req.body?.address, 220);
    const city = sanitizeText(req.body?.city, 80);
    const pinCode = sanitizeText(req.body?.pinCode, 20);

    if (name.length < 2) {
      res.status(400).json({ error: 'Name must be at least 2 characters.' });
      return;
    }

    try {
      const updated = await mutateStore((store) => {
        const target = store.users.find((u) => u.id === userId);
        if (!target) return null;
        target.name = name;
        target.phone = phone;
        target.address = address;
        target.city = city;
        target.pinCode = pinCode;
        return target;
      });
      if (!updated) {
        res.status(404).json({ error: 'Account not found.' });
        return;
      }
      res.json({ user: toPublicUser(updated) });
    } catch {
      res.status(500).json({ error: 'Unable to save profile updates.' });
    }
  });

  app.get('/api/orders', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.authUser!.id;
    const store = await readStore();
    const userOrders = store.orders
      .filter((ord) => ord.userId === userId)
      .slice()
      .reverse();
    res.json({ orders: userOrders });
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    const authUser = await extractAuthUser(req);
    const customerName = sanitizeText(req.body?.customerName, 120);
    const email = normalizeEmail(req.body?.email || authUser?.email);
    const address = sanitizeText(req.body?.address, 240);
    const city = sanitizeText(req.body?.city, 80);
    const pinCode = sanitizeText(req.body?.pinCode, 20);
    const paymentMethod =
      sanitizeText(req.body?.paymentMethod, 80) || 'Card / NetBanking / UPI';
    const promoCode = sanitizeText(req.body?.promoCode, 24).toUpperCase();
    const giftMessage = sanitizeMultilineText(req.body?.giftMessage, 500);
    const items = sanitizeCartItems(req.body?.items);

    if (!customerName || !isValidEmail(email) || !address || !city || !pinCode) {
      res.status(400).json({ error: 'Please complete all required delivery address fields.' });
      return;
    }
    if (items.length === 0) {
      res.status(400).json({ error: 'Your shopping bag has no valid items.' });
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    let discount = 0;
    if (promoCode === 'ATELIER10') {
      discount = Math.round(subtotal * 0.1);
    } else if (promoCode === 'NITMAGNAA') {
      discount = Math.min(3000, subtotal);
    }
    const total = Math.max(0, subtotal - discount);

    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + 5);

    try {
      const created = await mutateStore((store) => {
        const orderNumber = generateUniqueOrderNumber(store.orders);
        const record: OrderRecord = {
          orderNumber,
          userId: authUser ? authUser.id : null,
          placedAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          customerName,
          email,
          address,
          city,
          pinCode,
          paymentMethod,
          ...(giftMessage ? { giftMessage } : {}),
          items,
          subtotal,
          discount,
          total,
          statusStep: 2,
          courier: 'Blue Dart Insured Air',
          trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 89999999)}IN`,
          estimatedDelivery: etaDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        };
        store.orders.push(record);
        return record;
      });
      res.status(201).json({ order: created });
    } catch {
      res.status(500).json({ error: 'Unable to save order confirmation.' });
    }
  });

  app.post(
    '/api/orders/sample',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      const user = req.authUser!;
      const etaDate = new Date();
      etaDate.setDate(etaDate.getDate() + 3);
      const sampleProduct = PRODUCTS[0];
      const secondProduct = PRODUCTS[2];

      try {
        const created = await mutateStore((store) => {
          const orderNumber = generateUniqueOrderNumber(store.orders);
          const items: BagItem[] = [
            {
              key: `${sampleProduct.id}::Terracotta Clay::fall-pico`,
              productId: sampleProduct.id,
              name: sampleProduct.name,
              subtitle: sampleProduct.subtitle,
              sku: sampleProduct.sku,
              image: sampleProduct.frontImage,
              shadeName: 'Terracotta Clay',
              finishing: 'fall-pico',
              unitPrice: sampleProduct.price + 1500,
              quantity: 1,
            },
            {
              key: `${secondProduct.id}::Warm Ivory::unstitched`,
              productId: secondProduct.id,
              name: secondProduct.name,
              subtitle: secondProduct.subtitle,
              sku: secondProduct.sku,
              image: secondProduct.frontImage,
              shadeName: 'Warm Ivory',
              finishing: 'unstitched',
              unitPrice: secondProduct.price,
              quantity: 1,
            },
          ];
          const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
          const record: OrderRecord = {
            orderNumber,
            userId: user.id,
            placedAt: '18 November 2026',
            customerName: user.name,
            email: user.email,
            address: user.address || '14 Carmichael Road, Malabar Hill',
            city: user.city || 'Mumbai',
            pinCode: user.pinCode || '400026',
            paymentMethod: 'Card / NetBanking / UPI',
            items,
            subtotal,
            discount: 0,
            total: subtotal,
            statusStep: 3,
            courier: 'Blue Dart Insured Air',
            trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 89999999)}IN`,
            estimatedDelivery: etaDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          };
          store.orders.push(record);
          return record;
        });
        res.status(201).json({ order: created });
      } catch {
        res.status(500).json({ error: 'Unable to create sample order.' });
      }
    }
  );

  app.get('/api/orders/track/:orderNumber', async (req: Request, res: Response) => {
    const ref = normalizeOrderNumber(req.params.orderNumber || '');
    if (!ref) {
      res.status(400).json({ error: 'Order reference is required.' });
      return;
    }

    const authUser = await extractAuthUser(req);
    const sample = SAMPLE_ORDERS.find((s) => normalizeOrderNumber(s.orderNumber) === ref);
    if (sample) {
      res.json({ order: sample });
      return;
    }

    const store = await readStore();
    const match = store.orders.find((o) => normalizeOrderNumber(o.orderNumber) === ref);
    if (!match) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    const isOwner = Boolean(authUser && match.userId && authUser.id === match.userId);
    if (isOwner) {
      res.json({ order: match });
      return;
    }

    // Mask street address, email, and personal gift notes for unauthenticated reference lookup
    res.json({
      order: {
        ...match,
        address: 'Verified Delivery Destination (Sign in to view full address)',
        email: match.email.replace(/(^.).*(@.*$)/, '$1***$2'),
        ...(match.giftMessage
          ? { giftMessage: 'Private note enclosed (Sign in to view message)' }
          : {}),
      },
    });
  });

  app.get(
    '/api/support-queries',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.authUser!.id;
      const store = await readStore();
      const queries = store.supportQueries
        .filter((q) => q.userId === userId)
        .slice()
        .reverse();
      res.json({ queries });
    }
  );

  app.post('/api/support-queries', async (req: Request, res: Response) => {
    const authUser = await extractAuthUser(req);
    const name = sanitizeText(req.body?.name || authUser?.name, 100);
    const email = normalizeEmail(req.body?.email || authUser?.email);
    const category = sanitizeText(req.body?.category, 120);
    const message = sanitizeMultilineText(req.body?.message, 1500);
    const rawOrderNumber = sanitizeText(req.body?.orderNumber, 40);
    const orderNumber = rawOrderNumber ? normalizeOrderNumber(rawOrderNumber) : undefined;
    const channel: 'whatsapp' | 'atelier-desk' =
      req.body?.channel === 'whatsapp' ? 'whatsapp' : 'atelier-desk';

    if (!name || !isValidEmail(email) || !category || message.length < 4) {
      res.status(400).json({
        error: 'Please provide your name, email, query category, and a short message.',
      });
      return;
    }

    try {
      const created = await mutateStore((store) => {
        const ticketNumber = `NMQ-${Math.floor(2100 + Math.random() * 7800)}`;
        const record: SupportQueryRecord = {
          id: `qry_${crypto.randomBytes(8).toString('hex')}`,
          ticketNumber,
          userId: authUser ? authUser.id : null,
          name,
          email,
          ...(orderNumber ? { orderNumber } : {}),
          category,
          message,
          channel,
          status: 'Open',
          createdAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        store.supportQueries.push(record);
        return record;
      });
      res.status(201).json({ query: created });
    } catch {
      res.status(500).json({ error: 'Unable to log your support query right now.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nitmagnaa Atelier server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
