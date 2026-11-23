import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { submitSupportQuery } from '../lib/api';
import { SILK_EASE } from '../lib/motion';
import {
  ATELIER_WHATSAPP_DISPLAY,
  ORDER_QUERY_OPTIONS,
  buildOrderQueryMessage,
  buildWhatsAppUrl,
} from '../lib/whatsapp';
import { OrderRecord, SupportQueryRecord, UserProfile } from '../types';

interface OrderQueryModalProps {
  order: OrderRecord | null;
  authToken: string | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onQueryLogged?: (query: SupportQueryRecord) => void;
}

export function OrderQueryModal({
  order,
  authToken,
  currentUser,
  onClose,
  onQueryLogged,
}: OrderQueryModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    ORDER_QUERY_OPTIONS[0].id
  );
  const [extraNote, setExtraNote] = useState('');
  const [savingDeskTicket, setSavingDeskTicket] = useState(false);
  const [loggedTicket, setLoggedTicket] = useState<SupportQueryRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setSelectedOptionId(ORDER_QUERY_OPTIONS[0].id);
      setExtraNote('');
      setLoggedTicket(null);
      setErrorMsg(null);
    }
  }, [order?.orderNumber]);

  useEffect(() => {
    if (!order) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [order, onClose]);

  if (!order) return null;

  const activeOption =
    ORDER_QUERY_OPTIONS.find((o) => o.id === selectedOptionId) ||
    ORDER_QUERY_OPTIONS[0];
  const itemsSummary = order.items
    .map((item) => `${item.name} (${item.shadeName}) ×${item.quantity}`)
    .join(', ');
  const previewMessage = buildOrderQueryMessage({
    orderNumber: order.orderNumber,
    queryLabel: activeOption.label,
    queryBaseText: activeOption.template(order.orderNumber),
    extraNote,
    customerName: currentUser?.name || order.customerName,
    itemsSummary,
  });
  const whatsappUrl = buildWhatsAppUrl(previewMessage);

  const recordQueryOnServer = async (channel: 'whatsapp' | 'atelier-desk') => {
    try {
      const { query } = await submitSupportQuery(authToken, {
        name: currentUser?.name || order.customerName || 'Atelier Patron',
        email: currentUser?.email || order.email || 'client@nitmagnaa.com',
        orderNumber: order.orderNumber,
        category: activeOption.label,
        message: extraNote.trim()
          ? `${activeOption.template(order.orderNumber)} — ${extraNote.trim()}`
          : activeOption.template(order.orderNumber),
        channel,
      });
      setLoggedTicket(query);
      onQueryLogged?.(query);
    } catch (err) {
      if (channel === 'atelier-desk') {
        setErrorMsg(
          err instanceof Error ? err.message : 'Unable to save support query.'
        );
      }
    }
  };

  const handleDeskTicket = async () => {
    setErrorMsg(null);
    setSavingDeskTicket(true);
    await recordQueryOnServer('atelier-desk');
    setSavingDeskTicket(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 bg-deep-ink/60"
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Raise query for Order ${order.orderNumber}`}
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.985 }}
          transition={{ duration: 0.26, ease: SILK_EASE }}
          className="relative z-10 bg-surface-white text-on-surface border border-outline rounded-sm max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl flex flex-col gap-5"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-outline-variant">
            <div>
              <span className="font-mono text-xs text-primary">
                Order #{order.orderNumber} · Concierge Desk
              </span>
              <h2 className="font-headline text-2xl text-on-surface mt-0.5">
                Raise a Query for This Order
              </h2>
              <p className="font-body text-xs text-on-surface-muted mt-1">
                Select your query topic below to launch WhatsApp ({ATELIER_WHATSAPP_DISPLAY}) with your order reference pre-filled.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order query dialog"
              className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-surface shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Select Query Topic */}
          <div className="flex flex-col gap-2">
            <span className="font-label text-xs font-medium text-on-surface-muted">
              1. Select Query Topic
            </span>
            <div className="grid grid-cols-1 gap-2">
              {ORDER_QUERY_OPTIONS.map((opt) => {
                const selected = opt.id === selectedOptionId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`text-left p-3.5 rounded-sm border transition-colors ${
                      selected
                        ? 'border-primary bg-surface'
                        : 'border-outline-variant bg-surface-white hover:border-outline'
                    }`}
                  >
                    <p className="font-title text-sm font-medium text-on-surface">
                      {opt.label}
                    </p>
                    <p className="font-body text-xs text-on-surface-muted mt-0.5">
                      {opt.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label
              htmlFor="order-query-note"
              className="block font-label text-xs font-medium text-on-surface-muted mb-1.5"
            >
              2. Additional Details (Optional)
            </label>
            <textarea
              id="order-query-note"
              rows={2}
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder="Share preferred callback time, address details, or garment notes..."
              className="w-full p-3 bg-surface border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* WhatsApp Message Preview */}
          <div className="bg-surface border border-outline-variant rounded-sm p-3.5">
            <span className="block font-label text-[11px] uppercase tracking-wider text-on-surface-muted mb-1.5">
              Pre-filled WhatsApp Message Preview
            </span>
            <pre className="font-body text-xs text-on-surface whitespace-pre-wrap leading-relaxed">
              {previewMessage}
            </pre>
          </div>

          {errorMsg && <p className="font-body text-xs text-error">{errorMsg}</p>}

          {loggedTicket && (
            <div className="bg-surface border border-primary/40 rounded-sm p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs font-body text-on-surface">
                <span className="font-medium">
                  Query logged ({loggedTicket.ticketNumber})
                </span>{' '}
                for Order #{order.orderNumber}. You can view it anytime under Support &amp; Queries.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                void recordQueryOnServer('whatsapp');
              }}
              className="flex-1 min-h-[46px] px-5 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp with Query
            </a>
            <button
              type="button"
              disabled={savingDeskTicket}
              onClick={handleDeskTicket}
              className="min-h-[46px] px-5 border border-outline bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:border-on-surface transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {savingDeskTicket ? 'Logging...' : 'Log Atelier Ticket'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
