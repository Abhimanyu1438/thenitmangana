import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Phone,
  PlusCircle,
  User as UserIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES, formatINR } from '../data/catalog';
import {
  createSamplePastOrder,
  loginAccount,
  registerAccount,
  updateProfile,
} from '../lib/api';
import { SILK_EASE } from '../lib/motion';
import {
  OrderRecord,
  PageRoute,
  SupportQueryRecord,
  UserProfile,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface AccountViewProps {
  authToken: string | null;
  currentUser: UserProfile | null;
  orders: OrderRecord[];
  supportQueries: SupportQueryRecord[];
  loadingAccountData: boolean;
  onAuthSuccess: (token: string, user: UserProfile) => void;
  onProfileUpdated: (user: UserProfile) => void;
  onSignOut: () => void;
  onTrackOrder: (orderNumber: string) => void;
  onRaiseOrderQuery: (order: OrderRecord) => void;
  onSampleOrderAdded: (order: OrderRecord) => void;
  onNavigate: (route: PageRoute) => void;
}

const STEP_LABELS: Record<number, string> = {
  1: 'Order Confirmed',
  2: 'Atelier Quality & Muslin Wrap',
  3: 'Dispatched via Insured Courier',
  4: 'Delivered',
};

export function AccountView({
  authToken,
  currentUser,
  orders,
  supportQueries,
  loadingAccountData,
  onAuthSuccess,
  onProfileUpdated,
  onSignOut,
  onTrackOrder,
  onRaiseOrderQuery,
  onSampleOrderAdded,
  onNavigate,
}: AccountViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'queries' | 'profile'>(
    'orders'
  );

  // Auth form fields
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Order & sample helpers
  const [addingSample, setAddingSample] = useState(false);

  // Profile editor fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || '');
  const [profilePin, setProfilePin] = useState(currentUser?.pinCode || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const syncProfileForm = (user: UserProfile) => {
    setProfileName(user.name || '');
    setProfilePhone(user.phone || '');
    setProfileAddress(user.address || '');
    setProfileCity(user.city || '');
    setProfilePin(user.pinCode || '');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res =
        authMode === 'register'
          ? await registerAccount({
              name: nameInput.trim(),
              email: emailInput.trim(),
              phone: phoneInput.trim(),
              password: passwordInput,
            })
          : await loginAccount({
              email: emailInput.trim(),
              password: passwordInput,
            });
      syncProfileForm(res.user);
      onAuthSuccess(res.token, res.user);
      setPasswordInput('');
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to complete authentication.'
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAddSampleOrder = async () => {
    if (!authToken) return;
    setAddingSample(true);
    try {
      const { order } = await createSamplePastOrder(authToken);
      onSampleOrderAdded(order);
    } finally {
      setAddingSample(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setProfileErr(null);
    setProfileSavedMsg(null);
    setProfileSaving(true);
    try {
      const { user } = await updateProfile(authToken, {
        name: profileName.trim(),
        phone: profilePhone.trim(),
        address: profileAddress.trim(),
        city: profileCity.trim(),
        pinCode: profilePin.trim(),
      });
      onProfileUpdated(user);
      setProfileSavedMsg('Client profile details updated.');
    } catch (err) {
      setProfileErr(
        err instanceof Error ? err.message : 'Could not update profile.'
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const passwordStrength = (() => {
    if (!passwordInput) return { score: 0, label: 'Minimum 8 characters' };
    let score = 0;
    if (passwordInput.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput)) score += 1;
    if (/[0-9]/.test(passwordInput) || /[^A-Za-z0-9]/.test(passwordInput)) score += 1;
    if (passwordInput.length < 8) return { score: 1, label: 'Needs at least 8 characters' };
    if (score === 1) return { score: 2, label: 'Fair — add numbers or uppercase for stronger security' };
    if (score === 2) return { score: 3, label: 'Good password strength' };
    return { score: 4, label: 'Strong atelier password' };
  })();

  if (!authToken || !currentUser) {
    const isRegister = authMode === 'register';

    return (
      <div className="max-w-[1220px] mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch bg-surface-white border border-outline-variant rounded-sm overflow-hidden shadow-[0_24px_64px_-32px_rgba(36,24,20,0.22)]">
          {/* Left 5 cols: Editorial Atelier Showcase */}
          <aside className="lg:col-span-5 relative min-h-[300px] lg:min-h-[640px] bg-surface-dark text-on-surface-dark flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0.45, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.45 }}
                transition={{ duration: 0.55, ease: SILK_EASE }}
                className="absolute inset-0"
              >
                <ResilientImage
                  src={isRegister ? IMAGES.craftLoom : IMAGES.stylingAtelier}
                  alt={
                    isRegister
                      ? 'Master handloom weaver preparing raw silk warp threads'
                      : 'The Nitmagnaa Weaves private atelier and textile studio'
                  }
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Measured dark gradient scrim for >7:1 legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-deep-ink/95 via-deep-ink/55 to-deep-ink/40"
            />

            <div className="relative z-10 p-7 md:p-10 flex items-center justify-between border-b border-warm-ivory/15">
              <span className="font-label text-xs tracking-wider uppercase text-accent">
                Kala Ghoda · Indiranagar
              </span>
              <span className="font-mono text-xs text-warm-ivory/75">
                Est. Atelier Archive
              </span>
            </div>

            <div className="relative z-10 p-7 md:p-10 mt-auto flex flex-col gap-6">
              <div>
                <p className="font-label text-xs text-accent tracking-wide">
                  {isRegister ? 'Patron Membership' : 'Patron Ledger'}
                </p>
                <h2 className="font-display text-2xl md:text-3xl leading-snug text-warm-ivory mt-1.5 text-balance">
                  {isRegister
                    ? 'A private archive for every handloom weave you commission.'
                    : 'Return to your curated weaves, receipts, and dispatch desk.'}
                </h2>
              </div>

              <div className="space-y-3 pt-4 border-t border-warm-ivory/15 font-body text-xs md:text-sm text-warm-ivory/85">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-warm-ivory font-medium">01.</span>
                  <p className="flex-1 leading-relaxed">
                    Inspect full order history with itemized receipts and 4-stage insured courier tracking.
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-warm-ivory font-medium">02.</span>
                  <p className="flex-1 leading-relaxed">
                    One-tap WhatsApp order concierge pre-filled with your order ID and weave details.
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-warm-ivory font-medium">03.</span>
                  <p className="flex-1 leading-relaxed">
                    Saved delivery preferences for effortless express checkout and Fall &amp; Pico notes.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-warm-ivory/15 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onNavigate('tracking')}
                  className="font-label text-xs font-medium text-warm-ivory hover:text-accent transition-colors inline-flex items-center gap-1.5 py-1"
                >
                  Track Order by ID
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="font-label text-xs font-medium text-warm-ivory/85 hover:text-accent transition-colors inline-flex items-center gap-1.5 py-1"
                >
                  Contact Atelier Support
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>

          {/* Right 7 cols: Form Suite */}
          <section className="lg:col-span-7 p-7 sm:p-10 lg:p-14 flex flex-col justify-center">
            {/* Editorial Underline Tab Switcher */}
            <div
              className="flex items-center gap-8 border-b border-outline-variant"
              role="tablist"
              aria-label="Account access mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`relative pb-3.5 font-headline text-lg md:text-xl transition-colors whitespace-nowrap ${
                  !isRegister
                    ? 'text-on-surface'
                    : 'text-on-surface-muted hover:text-on-surface'
                }`}
              >
                Sign In
                {!isRegister && (
                  <motion.span
                    layoutId="account-auth-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                  />
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className={`relative pb-3.5 font-headline text-lg md:text-xl transition-colors whitespace-nowrap ${
                  isRegister
                    ? 'text-on-surface'
                    : 'text-on-surface-muted hover:text-on-surface'
                }`}
              >
                Create Account
                {isRegister && (
                  <motion.span
                    layoutId="account-auth-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: SILK_EASE }}
                className="pt-7"
              >
                <span className="font-label text-xs font-medium text-primary">
                  {isRegister ? 'New Patron Registration' : 'Returning Patron'}
                </span>
                <h1 className="font-display text-3xl md:text-[38px] md:leading-[44px] text-on-surface mt-1 text-balance">
                  {isRegister ? 'Begin Your Atelier Archive' : 'Welcome Back to Nitmagnaa'}
                </h1>
                <p className="font-body text-sm text-on-surface-muted mt-2 max-w-lg leading-relaxed">
                  {isRegister
                    ? 'Register your personal account to track custom weaves, download invoices, and connect directly with our Mumbai and Bengaluru stylists.'
                    : 'Sign in with your email and password to review previous saree commissions, delivery timelines, and raised queries.'}
                </p>

                <form onSubmit={handleAuthSubmit} className="mt-7 flex flex-col gap-5">
                  {isRegister && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="auth-name"
                          className="block font-label text-xs font-medium text-on-surface-muted mb-1.5"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-on-surface-muted/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="auth-name"
                            type="text"
                            required
                            minLength={2}
                            autoComplete="name"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Ananya Rao"
                            className="w-full min-h-[48px] pl-10 pr-4 bg-surface/50 border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:bg-surface-white focus:border-primary focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="auth-phone"
                          className="block font-label text-xs font-medium text-on-surface-muted mb-1.5"
                        >
                          WhatsApp / Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-on-surface-muted/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="auth-phone"
                            type="tel"
                            autoComplete="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="+91 98201 44120"
                            className="w-full min-h-[48px] pl-10 pr-4 bg-surface/50 border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:bg-surface-white focus:border-primary focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-email"
                      className="block font-label text-xs font-medium text-on-surface-muted mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-on-surface-muted/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="patron@studio.in"
                        className="w-full min-h-[48px] pl-10 pr-4 bg-surface/50 border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:bg-surface-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="auth-password"
                        className="block font-label text-xs font-medium text-on-surface-muted"
                      >
                        Password
                      </label>
                      {!isRegister && (
                        <button
                          type="button"
                          onClick={() => onNavigate('support')}
                          className="font-label text-xs text-primary hover:underline"
                        >
                          Need help signing in?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-on-surface-muted/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={
                          isRegister
                            ? 'Create a password (8+ characters)'
                            : 'Enter your password'
                        }
                        className="w-full min-h-[48px] pl-10 pr-12 bg-surface/50 border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:bg-surface-white focus:border-primary focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-on-surface-muted hover:text-on-surface rounded-xs transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {isRegister && (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="grid grid-cols-4 gap-1.5 h-1">
                          {[1, 2, 3, 4].map((level) => (
                            <span
                              key={level}
                              className={`rounded-xs transition-colors duration-200 ${
                                passwordStrength.score >= level
                                  ? passwordStrength.score <= 1
                                    ? 'bg-error/70'
                                    : passwordStrength.score === 2
                                      ? 'bg-accent'
                                      : 'bg-primary'
                                  : 'bg-outline-variant'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-label text-[11px] text-on-surface-muted">
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {authError && (
                    <div
                      role="alert"
                      className="px-4 py-3 bg-error/5 border border-error/30 rounded-sm font-body text-xs text-error"
                    >
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="group min-h-[50px] mt-1 px-6 bg-deep-ink text-warm-ivory rounded-sm font-label text-sm font-medium hover:bg-primary transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span>
                      {authSubmitting
                        ? isRegister
                          ? 'Creating Your Account...'
                          : 'Signing In...'
                        : isRegister
                          ? 'Create Atelier Account'
                          : 'Sign In to My Archive'}
                    </span>
                    {!authSubmitting && (
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>

                <div className="mt-7 pt-6 border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-muted">
                  <p className="font-body">
                    {isRegister ? 'Already have an atelier account?' : 'First time visiting our online atelier?'}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(isRegister ? 'login' : 'register');
                        setAuthError(null);
                      }}
                      className="font-label font-medium text-primary hover:underline ml-1"
                    >
                      {isRegister ? 'Sign In' : 'Create an account'}
                    </button>
                  </p>
                  <span className="font-label text-[11px] text-on-surface-muted/80">
                    Protected session · Private order archive
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
      {/* Signed-in Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant">
        <div>
          <span className="font-label text-xs font-medium text-primary">
            Signed In · Atelier Patron
          </span>
          <h1 className="font-display text-4xl md:text-[46px] md:leading-[52px] text-on-surface mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="font-body text-sm text-on-surface-muted mt-1.5">
            {currentUser.email}
            {currentUser.phone ? ` · ${currentUser.phone}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('support')}
            className="min-h-[44px] px-5 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="min-h-[44px] px-5 border border-outline bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:border-on-surface transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Account Section Tabs */}
      <div className="flex flex-wrap gap-2 mt-8 pb-6 border-b border-outline-variant">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`min-h-[42px] px-5 rounded-sm font-label text-sm font-medium transition-colors inline-flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-white border border-outline text-on-surface hover:border-on-surface'
          }`}
        >
          <Package className="w-4 h-4" />
          Previous Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('queries')}
          className={`min-h-[42px] px-5 rounded-sm font-label text-sm font-medium transition-colors inline-flex items-center gap-2 ${
            activeTab === 'queries'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-white border border-outline text-on-surface hover:border-on-surface'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Support &amp; Raised Queries ({supportQueries.length})
        </button>
        <button
          type="button"
          onClick={() => {
            syncProfileForm(currentUser);
            setProfileSavedMsg(null);
            setActiveTab('profile');
          }}
          className={`min-h-[42px] px-5 rounded-sm font-label text-sm font-medium transition-colors inline-flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-white border border-outline text-on-surface hover:border-on-surface'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Client Profile
        </button>
      </div>

      {/* Tab 1: Previous Orders */}
      {activeTab === 'orders' && (
        <section className="pt-8">
          {loadingAccountData ? (
            <div className="bg-surface-white border border-outline-variant rounded-sm p-10 text-center">
              <p className="font-body text-sm text-on-surface-muted">
                Retrieving your atelier order archive...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-surface-white border border-outline-variant rounded-sm p-8 md:p-12 text-center flex flex-col items-center gap-4">
              <h2 className="font-headline text-2xl text-on-surface">
                No previous orders on this account yet
              </h2>
              <p className="font-body text-sm text-on-surface-muted max-w-lg leading-relaxed">
                Any weaves you commission during checkout will appear here automatically. You can also add a sample past order to preview live dispatch tracking and WhatsApp order queries.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('collection')}
                  className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Explore Collection
                </button>
                <button
                  type="button"
                  disabled={addingSample}
                  onClick={handleAddSampleOrder}
                  className="min-h-[44px] px-6 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <PlusCircle className="w-4 h-4" />
                  {addingSample
                    ? 'Creating Sample Order...'
                    : 'Add Sample Past Order to History'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <article
                  key={order.orderNumber}
                  className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-muted">
                        <span className="font-mono text-primary font-medium">
                          Order #{order.orderNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Placed {order.placedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.courier}</span>
                      </div>
                      <h2 className="font-headline text-2xl text-on-surface mt-1">
                        {STEP_LABELS[order.statusStep] || 'In Fulfillment'}
                      </h2>
                    </div>

                    <div className="md:text-right">
                      <span className="block font-label text-xs text-on-surface-muted">
                        Order Total (GST Incl.)
                      </span>
                      <span className="font-title text-lg font-medium text-on-surface tabular-nums">
                        {formatINR(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Dispatch Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-label text-on-surface-muted mb-1.5">
                      <span>Stage {order.statusStep} of 4</span>
                      <span className="font-mono">{order.trackingNumber}</span>
                    </div>
                    <div className="h-1 w-full bg-outline-variant rounded-xs overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(order.statusStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-3.5 p-3 bg-surface border border-outline-variant rounded-xs"
                      >
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-18 object-cover rounded-xs bg-surface-sand shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-title text-sm font-medium text-on-surface truncate">
                            {item.name}
                          </p>
                          <p className="font-body text-xs text-on-surface-muted mt-0.5">
                            {item.shadeName} ·{' '}
                            {item.finishing === 'fall-pico'
                              ? 'Fall & Pico'
                              : 'Unstitched'}{' '}
                            · Qty {item.quantity}
                          </p>
                          <p className="font-mono text-xs text-on-surface mt-1 tabular-nums">
                            {formatINR(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gift Message / Special Instructions */}
                  {order.giftMessage && (
                    <div className="p-4 bg-surface border border-outline-variant rounded-xs">
                      <span className="block font-label text-[11px] font-medium text-on-surface-muted mb-1">
                        Gift Message / Special Instructions
                      </span>
                      <p className="font-body text-sm text-on-surface whitespace-pre-line leading-relaxed">
                        {order.giftMessage}
                      </p>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant">
                    <p className="font-body text-xs text-on-surface-muted">
                      Est. Delivery:{' '}
                      <span className="text-on-surface font-medium">
                        {order.estimatedDelivery}
                      </span>{' '}
                      · {order.city} {order.pinCode}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onTrackOrder(order.orderNumber)}
                        className="min-h-[42px] px-5 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-xs font-medium hover:bg-surface transition-colors whitespace-nowrap"
                      >
                        Track Order Timeline
                      </button>
                      <button
                        type="button"
                        onClick={() => onRaiseOrderQuery(order)}
                        className="min-h-[42px] px-5 bg-primary text-on-primary rounded-sm font-label text-xs font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Raise Query (WhatsApp)
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Raised Support Queries */}
      {activeTab === 'queries' && (
        <section className="pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-headline text-2xl text-on-surface">
                Support &amp; Order Queries
              </h2>
              <p className="font-body text-sm text-on-surface-muted mt-0.5">
                All WhatsApp order inquiries and atelier support tickets submitted from your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="min-h-[42px] px-5 bg-primary text-on-primary rounded-sm font-label text-xs font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Raise New Query
            </button>
          </div>

          {supportQueries.length === 0 ? (
            <div className="bg-surface-white border border-outline-variant rounded-sm p-10 text-center flex flex-col items-center gap-3">
              <p className="font-body text-sm text-on-surface-muted max-w-md">
                You have not raised any support or order queries yet.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('support')}
                className="min-h-[42px] px-6 border border-on-surface rounded-sm font-label text-xs font-medium hover:bg-surface transition-colors"
              >
                Open Support Desk
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {supportQueries.map((qry) => (
                <article
                  key={qry.id}
                  className="bg-surface-white border border-outline-variant rounded-sm p-5 md:p-6 flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-primary font-medium">
                        {qry.ticketNumber}
                      </span>
                      {qry.orderNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-on-surface">
                            Order #{qry.orderNumber}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="text-on-surface-muted">{qry.createdAt}</span>
                    </div>
                    <span className="font-label text-xs font-medium text-on-surface">
                      {qry.status} ·{' '}
                      {qry.channel === 'whatsapp' ? 'WhatsApp Concierge' : 'Atelier Desk'}
                    </span>
                  </div>
                  <h3 className="font-title text-base font-medium text-on-surface">
                    {qry.category}
                  </h3>
                  <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                    {qry.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Client Profile */}
      {activeTab === 'profile' && (
        <section className="pt-8 max-w-2xl">
          <form
            onSubmit={handleSaveProfile}
            className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-4"
          >
            <h2 className="font-headline text-2xl text-on-surface">
              Client Delivery Preferences
            </h2>
            <p className="font-body text-xs text-on-surface-muted">
              Saved details automatically pre-fill during insured express checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                  WhatsApp / Phone
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                  Default Street Address
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Apartment, street, landmark"
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                  PIN / Postal Code
                </label>
                <input
                  type="text"
                  value={profilePin}
                  onChange={(e) => setProfilePin(e.target.value)}
                  placeholder="400026"
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-mono text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {profileErr && <p className="font-body text-xs text-error">{profileErr}</p>}
            {profileSavedMsg && (
              <div className="flex items-center gap-2 text-xs font-body text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="min-h-[44px] px-7 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
              >
                {profileSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
