import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { submitSupportQuery } from '../lib/api';
import {
  ATELIER_WHATSAPP_DISPLAY,
  GENERAL_SUPPORT_CATEGORIES,
  ORDER_QUERY_OPTIONS,
  buildOrderQueryMessage,
  buildWhatsAppUrl,
} from '../lib/whatsapp';
import {
  OrderRecord,
  PageRoute,
  SupportQueryRecord,
  UserProfile,
} from '../types';

interface SupportViewProps {
  authToken: string | null;
  currentUser: UserProfile | null;
  orders: OrderRecord[];
  supportQueries: SupportQueryRecord[];
  onQuerySubmitted: (query: SupportQueryRecord) => void;
  onNavigate: (route: PageRoute) => void;
}

export function SupportView({
  authToken,
  currentUser,
  orders,
  supportQueries,
  onQuerySubmitted,
  onNavigate,
}: SupportViewProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [selectedOrderRef, setSelectedOrderRef] = useState<string>(
    orders[0]?.orderNumber || ''
  );
  const [customOrderRef, setCustomOrderRef] = useState('');
  const [orderQueryOptionId, setOrderQueryOptionId] = useState(
    ORDER_QUERY_OPTIONS[0].id
  );
  const [generalCategory, setGeneralCategory] = useState<string>(
    GENERAL_SUPPORT_CATEGORIES[0]
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] =
    useState<SupportQueryRecord | null>(null);

  const effectiveOrderId =
    selectedOrderRef === '__custom__'
      ? customOrderRef.trim().replace(/^#/, '').toUpperCase()
      : selectedOrderRef;

  const isOrderQuery = Boolean(effectiveOrderId);
  const activeOrderOption =
    ORDER_QUERY_OPTIONS.find((o) => o.id === orderQueryOptionId) ||
    ORDER_QUERY_OPTIONS[0];
  const matchedOrder = orders.find(
    (o) => o.orderNumber.toUpperCase() === effectiveOrderId.toUpperCase()
  );

  const whatsappMessage = isOrderQuery
    ? buildOrderQueryMessage({
        orderNumber: effectiveOrderId,
        queryLabel: activeOrderOption.label,
        queryBaseText: activeOrderOption.template(effectiveOrderId),
        extraNote: message,
        customerName: name || currentUser?.name,
        itemsSummary: matchedOrder
          ? matchedOrder.items
              .map((i) => `${i.name} (${i.shadeName}) ×${i.quantity}`)
              .join(', ')
          : undefined,
      })
    : [
        'Namaste Nitmagnaa Atelier,',
        '',
        `Inquiry Topic: ${generalCategory}`,
        name ? `Name: ${name}` : '',
        '',
        message.trim() ||
          `I would like assistance regarding ${generalCategory}.`,
      ]
        .filter(Boolean)
        .join('\n');

  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  const persistQuery = async (channel: 'whatsapp' | 'atelier-desk') => {
    setErrorMsg(null);
    const resolvedName = (name || currentUser?.name || '').trim();
    const resolvedEmail = (email || currentUser?.email || '').trim();
    const finalCategory = isOrderQuery
      ? activeOrderOption.label
      : generalCategory;
    const finalMessage = isOrderQuery
      ? message.trim()
        ? `${activeOrderOption.template(effectiveOrderId)} — ${message.trim()}`
        : activeOrderOption.template(effectiveOrderId)
      : message.trim();

    if (!resolvedName || !resolvedEmail || (!isOrderQuery && finalMessage.length < 4)) {
      if (channel === 'atelier-desk') {
        setErrorMsg(
          'Please complete your name, email address, and inquiry details before submitting.'
        );
      }
      return;
    }

    setSubmitting(true);
    try {
      const { query } = await submitSupportQuery(authToken, {
        name: resolvedName,
        email: resolvedEmail,
        orderNumber: effectiveOrderId || undefined,
        category: finalCategory,
        message: finalMessage,
        channel,
      });
      setSubmittedTicket(query);
      onQuerySubmitted(query);
      if (channel === 'atelier-desk') {
        setMessage('');
      }
    } catch (err) {
      if (channel === 'atelier-desk') {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to submit support query.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDesk = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistQuery('atelier-desk');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
      <header className="max-w-2xl mb-10">
        <span className="font-label text-xs font-medium text-primary">
          Client Concierge
        </span>
        <h1 className="font-display text-4xl md:text-[52px] md:leading-[58px] text-on-surface mt-1 text-balance">
          Contact Support &amp; Raise a Query
        </h1>
        <p className="font-body text-base text-on-surface-muted mt-3 leading-relaxed">
          Speak directly with our Kala Ghoda atelier team regarding an order, courier update, weave care, or bespoke commissioning. Select an order to launch WhatsApp with your reference ID pre-filled.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left 7 cols: Interactive Query & WhatsApp Launcher */}
        <section className="lg:col-span-7 bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-5">
          <div className="pb-3 border-b border-outline-variant">
            <h2 className="font-headline text-2xl text-on-surface">
              Raise an Order or General Query
            </h2>
            <p className="font-body text-xs text-on-surface-muted mt-1">
              Choose an existing order to auto-format a WhatsApp concierge message, or log a ticket below.
            </p>
          </div>

          <form onSubmit={handleSubmitDesk} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="support-name"
                  className="block font-label text-xs text-on-surface-muted mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="support-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Rao"
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="support-email"
                  className="block font-label text-xs text-on-surface-muted mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="support-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@studio.in"
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Link to Order */}
            <div>
              <label
                htmlFor="support-order-select"
                className="block font-label text-xs text-on-surface-muted mb-1.5"
              >
                Related Order Reference (Optional — required for WhatsApp Order Query)
              </label>
              <select
                id="support-order-select"
                value={selectedOrderRef}
                onChange={(e) => setSelectedOrderRef(e.target.value)}
                className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="">General Atelier Inquiry (No Order)</option>
                {orders.map((ord) => (
                  <option key={ord.orderNumber} value={ord.orderNumber}>
                    #{ord.orderNumber} — {ord.items[0]?.name || 'Atelier Order'} (
                    {ord.placedAt})
                  </option>
                ))}
                {!orders.some((o) => o.orderNumber === 'NMW-1042') && (
                  <option value="NMW-1042">
                    #NMW-1042 — Sample Order (Ira Raw Tussar Saree)
                  </option>
                )}
                <option value="__custom__">Enter another Order Reference ID...</option>
              </select>

              {selectedOrderRef === '__custom__' && (
                <input
                  type="text"
                  value={customOrderRef}
                  onChange={(e) => setCustomOrderRef(e.target.value)}
                  placeholder="Enter Order ID (e.g. NMW-1042)"
                  aria-label="Custom Order Reference ID"
                  className="mt-2.5 w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-mono text-sm focus:border-primary focus:outline-none"
                />
              )}
            </div>

            {/* Query Category Selector */}
            {isOrderQuery ? (
              <div>
                <span className="block font-label text-xs text-on-surface-muted mb-1.5">
                  Select Query for Order #{effectiveOrderId}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ORDER_QUERY_OPTIONS.map((opt) => {
                    const active = opt.id === orderQueryOptionId;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setOrderQueryOptionId(opt.id)}
                        className={`text-left p-3 rounded-sm border transition-colors ${
                          active
                            ? 'border-primary bg-surface'
                            : 'border-outline-variant bg-surface-white hover:border-outline'
                        }`}
                      >
                        <p className="font-title text-xs font-medium text-on-surface">
                          {opt.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="support-general-category"
                  className="block font-label text-xs text-on-surface-muted mb-1.5"
                >
                  Inquiry Category
                </label>
                <select
                  id="support-general-category"
                  value={generalCategory}
                  onChange={(e) => setGeneralCategory(e.target.value)}
                  className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm text-on-surface focus:border-primary focus:outline-none"
                >
                  {GENERAL_SUPPORT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Input */}
            <div>
              <label
                htmlFor="support-message"
                className="block font-label text-xs text-on-surface-muted mb-1.5"
              >
                {isOrderQuery
                  ? 'Additional Notes (Included in WhatsApp Message & Ticket)'
                  : 'Your Message'}
              </label>
              <textarea
                id="support-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isOrderQuery
                    ? 'Add any specifics regarding your delivery, finishing, or weave...'
                    : 'Tell us how our weavers or client desk can assist you...'
                }
                className="w-full p-3.5 bg-surface border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* Live WhatsApp Message Preview */}
            <div className="bg-surface border border-outline-variant rounded-sm p-3.5">
              <span className="block font-label text-[11px] uppercase tracking-wider text-on-surface-muted mb-1">
                WhatsApp Message Preview ({ATELIER_WHATSAPP_DISPLAY})
              </span>
              <pre className="font-body text-xs text-on-surface whitespace-pre-wrap leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>

            {errorMsg && <p className="font-body text-xs text-error">{errorMsg}</p>}

            {submittedTicket && (
              <div className="bg-surface border border-primary/40 rounded-sm p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm font-body text-on-surface">
                  <p className="font-medium">
                    Support query logged ({submittedTicket.ticketNumber})
                  </p>
                  <p className="text-xs text-on-surface-muted mt-0.5">
                    Our Kala Ghoda client desk responds within 4 business hours.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  void persistQuery('whatsapp');
                }}
                className="flex-1 min-h-[48px] px-5 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                {isOrderQuery
                  ? `Raise Order #${effectiveOrderId} Query on WhatsApp`
                  : 'Message Atelier on WhatsApp'}
              </a>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-[48px] px-6 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Desk Ticket'}
              </button>
            </div>
          </form>
        </section>

        {/* Right 5 cols: Atelier Contact Details & User Query Ledger */}
        <aside className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-walnut text-on-surface-walnut rounded-sm p-7 flex flex-col gap-4">
            <h2 className="font-headline text-2xl">Atelier Direct Desk</h2>
            <div className="space-y-3 text-sm font-body text-on-surface-walnut/85">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-accent shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-on-surface-walnut">
                    WhatsApp Concierge
                  </p>
                  <p className="font-mono text-xs">{ATELIER_WHATSAPP_DISPLAY}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-on-surface-walnut">Email</p>
                  <p className="font-mono text-xs">atelier@nitmagnaa.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-on-surface-walnut">Flagships</p>
                  <p className="text-xs">
                    Kala Ghoda, Mumbai · Indiranagar, Bengaluru
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-on-surface-walnut">Hours</p>
                  <p className="text-xs">Monday – Saturday, 10:30 AM – 7:30 PM IST</p>
                </div>
              </div>
            </div>

            {!currentUser && (
              <div className="pt-4 border-t border-on-surface-walnut/20">
                <p className="font-body text-xs text-on-surface-walnut/80 mb-3">
                  Have an account? Sign in to view all past orders and support ticket history.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('account')}
                  className="min-h-[40px] px-4 bg-accent text-deep-ink rounded-sm font-label text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="bg-surface-white border border-outline-variant rounded-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <h2 className="font-headline text-xl text-on-surface">
                  Your Recent Queries ({supportQueries.length})
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('account')}
                  className="font-label text-xs text-primary hover:underline"
                >
                  View in Account
                </button>
              </div>

              {supportQueries.length === 0 ? (
                <p className="font-body text-xs text-on-surface-muted">
                  No queries logged yet under {currentUser.email}.
                </p>
              ) : (
                <div className="space-y-3">
                  {supportQueries.slice(0, 4).map((qry) => (
                    <div
                      key={qry.id}
                      className="p-3 bg-surface border border-outline-variant rounded-xs"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-primary font-medium">
                          {qry.ticketNumber}
                          {qry.orderNumber ? ` · #${qry.orderNumber}` : ''}
                        </span>
                        <span className="text-on-surface-muted">{qry.createdAt}</span>
                      </div>
                      <p className="font-title text-xs font-medium text-on-surface mt-1">
                        {qry.category}
                      </p>
                      <p className="font-body text-xs text-on-surface-muted mt-0.5 line-clamp-2">
                        {qry.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
