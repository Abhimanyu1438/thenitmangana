import type {
  BagItem,
  OrderRecord,
  SupportQueryRecord,
  UserProfile,
} from '../types';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

async function apiRequest<T>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH';
    token?: string | null;
    body?: unknown;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : 'An unexpected server error occurred.'
    );
  }
  return data as T;
}

export function registerAccount(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginAccount(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function updateProfile(
  token: string,
  payload: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pinCode: string;
  }
): Promise<{ user: UserProfile }> {
  return apiRequest<{ user: UserProfile }>('/api/auth/profile', {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export function fetchUserOrders(token: string): Promise<{ orders: OrderRecord[] }> {
  return apiRequest<{ orders: OrderRecord[] }>('/api/orders', { token });
}

export function createOrderOnServer(
  token: string | null,
  payload: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    pinCode: string;
    paymentMethod: string;
    promoCode?: string;
    giftMessage?: string;
    items: BagItem[];
  }
): Promise<{ order: OrderRecord }> {
  return apiRequest<{ order: OrderRecord }>('/api/orders', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function createSamplePastOrder(token: string): Promise<{ order: OrderRecord }> {
  return apiRequest<{ order: OrderRecord }>('/api/orders/sample', {
    method: 'POST',
    token,
    body: {},
  });
}

export function trackOrderOnServer(
  token: string | null,
  orderNumber: string
): Promise<{ order: OrderRecord }> {
  return apiRequest<{ order: OrderRecord }>(
    `/api/orders/track/${encodeURIComponent(orderNumber.trim())}`,
    { token }
  );
}

export function fetchUserSupportQueries(
  token: string
): Promise<{ queries: SupportQueryRecord[] }> {
  return apiRequest<{ queries: SupportQueryRecord[] }>('/api/support-queries', {
    token,
  });
}

export function submitSupportQuery(
  token: string | null,
  payload: {
    name: string;
    email: string;
    orderNumber?: string;
    category: string;
    message: string;
    channel: 'whatsapp' | 'atelier-desk';
  }
): Promise<{ query: SupportQueryRecord }> {
  return apiRequest<{ query: SupportQueryRecord }>('/api/support-queries', {
    method: 'POST',
    token,
    body: payload,
  });
}
