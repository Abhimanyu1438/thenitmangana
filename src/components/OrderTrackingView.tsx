import { useEffect, useState } from 'react';
import { Check, Home, MessageCircle, PackageCheck, Search, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { formatINR } from '../data/catalog';
import { trackOrderOnServer } from '../lib/api';
import { SILK_EASE } from '../lib/motion';
import { OrderRecord, OrderStatusStep, PageRoute } from '../types';
import { ResilientImage } from './ResilientImage';

interface OrderTrackingViewProps {
  orders: OrderRecord[];
  authToken: string | null;
  isSignedIn: boolean;
  initialOrderId?: string;
  onRaiseOrderQuery: (order: OrderRecord) => void;
  onNavigate: (route: PageRoute) => void;
}

const TIMELINE_STEPS: {
  step: OrderStatusStep;
  title: string;
  detail: string;
  icon: typeof Check;
}[] = [
  {
    step: 1,
    title: 'Order Confirmed',
    detail: 'Received by our Kala Ghoda atelier desk and assigned for weave verification.',
    icon: Check,
  },
  {
    step: 2,
    title: 'Atelier Quality & Muslin Wrap',
    detail: 'Selvedge inspected, hand-pressed, and folded into unbleached cotton muslin.',
    icon: PackageCheck,
  },
  {
    step: 3,
    title: 'Dispatched via Insured Courier',
    detail: 'Handed to insured express carrier with provenance certificate enclosed.',
    icon: Truck,
  },
  {
    step: 4,
    title: 'Delivered',
    detail: 'Signed and received at destination address.',
    icon: Home,
  },
];

function normalizeOrderRef(value: string): string {
  return value.trim().replace(/^#/, '').toUpperCase();
}

export function OrderTrackingView({
  orders,
  authToken,
  isSignedIn,
  initialOrderId,
  onRaiseOrderQuery,
  onNavigate,
}: OrderTrackingViewProps) {
  const [queryInput, setQueryInput] = useState(initialOrderId || 'NMW-1042');
  const [searchedRef, setSearchedRef] = useState(
    normalizeOrderRef(initialOrderId || 'NMW-1042')
  );
  const [remoteOrder, setRemoteOrder] = useState<OrderRecord | null>(null);
  const [lookingUpRemote, setLookingUpRemote] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setQueryInput(initialOrderId);
      setSearchedRef(normalizeOrderRef(initialOrderId));
      setRemoteOrder(null);
    }
  }, [initialOrderId]);

  const localMatch = orders.find(
    (order) => normalizeOrderRef(order.orderNumber) === searchedRef
  );

  useEffect(() => {
    if (!searchedRef || localMatch) {
      setRemoteOrder(null);
      return;
    }
    let cancelled = false;
    setLookingUpRemote(true);
    trackOrderOnServer(authToken, searchedRef)
      .then(({ order }) => {
        if (!cancelled) setRemoteOrder(order);
      })
      .catch(() => {
        if (!cancelled) setRemoteOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLookingUpRemote(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchedRef, localMatch, authToken]);

  const matchedOrder = localMatch || remoteOrder;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedRef(normalizeOrderRef(queryInput));
  };

  const handleQuickSelect = (orderNumber: string) => {
    setQueryInput(orderNumber);
    setSearchedRef(normalizeOrderRef(orderNumber));
  };

  const activeStepMeta = matchedOrder
    ? TIMELINE_STEPS.find((s) => s.step === matchedOrder.statusStep) || TIMELINE_STEPS[0]
    : null;

  return (
    <div className="max-w-[1120px] mx-auto px-5 md:px-8 py-12 md:py-16">
      {/* Header & Lookup Form */}
      <header className="max-w-2xl mb-10">
        <span className="font-label text-xs font-medium text-primary">Atelier Dispatch</span>
        <h1 className="font-display text-4xl md:text-[52px] md:leading-[58px] text-on-surface mt-1 text-balance">
          Order Tracking
        </h1>
        <p className="font-body text-base text-on-surface-muted mt-3 leading-relaxed">
          Enter your Nitmagnaa order reference ID to follow artisan inspection, muslin packing, and insured courier transit.
        </p>

        <form onSubmit={handleLookup} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-on-surface-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Order reference (e.g. NMW-1042)"
              aria-label="Order reference ID"
              className="w-full min-h-[48px] pl-11 pr-4 bg-surface-white border border-outline rounded-sm font-mono text-sm text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[48px] px-7 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap shrink-0"
          >
            Track Order
          </button>
        </form>

        {/* Available references saved in state/localStorage */}
        {orders.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-on-surface-muted">
            <span className="font-label">Available references:</span>
            {orders.map((ord) => {
              const isSelected = normalizeOrderRef(ord.orderNumber) === searchedRef;
              return (
                <button
                  key={ord.orderNumber}
                  type="button"
                  onClick={() => handleQuickSelect(ord.orderNumber)}
                  className={`font-mono px-2.5 py-1 rounded-xs border transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'border-on-surface bg-surface-white text-on-surface font-medium'
                      : 'border-outline bg-transparent text-on-surface-muted hover:border-on-surface hover:text-on-surface'
                  }`}
                >
                  #{ord.orderNumber}
                  {ord.orderNumber === 'NMW-1042' ? ' (Sample)' : ''}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Lookup Result */}
      {!searchedRef ? (
        <div className="bg-surface-white border border-outline-variant rounded-sm p-10 text-center">
          <p className="font-body text-sm text-on-surface-muted">
            Enter an order reference ID above to view fulfillment progress.
          </p>
        </div>
      ) : lookingUpRemote && !matchedOrder ? (
        <div className="bg-surface-white border border-outline-variant rounded-sm p-10 text-center">
          <p className="font-body text-sm text-on-surface-muted">
            Locating order #{searchedRef} in our atelier ledger...
          </p>
        </div>
      ) : !matchedOrder ? (
        <div className="bg-surface-white border border-outline-variant rounded-sm p-8 md:p-10 flex flex-col items-start gap-4">
          <span className="font-mono text-xs text-error">Reference #{searchedRef} Not Found</span>
          <h2 className="font-headline text-2xl text-on-surface">
            We could not locate an order with that reference
          </h2>
          <p className="font-body text-sm text-on-surface-muted max-w-lg leading-relaxed">
            Check the confirmation code from your receipt (formatted as <span className="font-mono text-on-surface">NMW-XXXX</span>), sign in to view your saved order history, or load our sample dispatch record.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleQuickSelect('NMW-1042')}
              className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Load Sample Order #NMW-1042
            </button>
            <button
              type="button"
              onClick={() => onNavigate('account')}
              className="min-h-[44px] px-6 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors"
            >
              {isSignedIn ? 'Open My Order History' : 'Sign In for Past Orders'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Status Overview Card */}
          <section className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-muted">
                  <span className="font-mono text-primary font-medium">
                    Order #{matchedOrder.orderNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Placed {matchedOrder.placedAt}</span>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl text-on-surface mt-1">
                  {activeStepMeta?.title}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="md:text-right">
                  <span className="block font-label text-xs text-on-surface-muted">
                    Estimated Delivery
                  </span>
                  <span className="font-title text-base font-medium text-on-surface tabular-nums">
                    {matchedOrder.estimatedDelivery}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRaiseOrderQuery(matchedOrder)}
                  className="min-h-[42px] px-5 bg-primary text-on-primary rounded-sm font-label text-xs font-medium hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  Raise Query (WhatsApp)
                </button>
              </div>
            </div>

            {/* 4-Step Dispatch Timeline */}
            <div className="py-8">
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-label text-on-surface-muted mb-2">
                  <span>Dispatch Progress</span>
                  <span className="tabular-nums font-medium text-on-surface">
                    Stage {matchedOrder.statusStep} of 4
                  </span>
                </div>
                <div className="h-1 w-full bg-outline-variant rounded-xs overflow-hidden">
                  <motion.div
                    key={matchedOrder.orderNumber}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: matchedOrder.statusStep / 4 }}
                    transition={{ duration: 0.75, ease: SILK_EASE }}
                    className="h-full bg-primary origin-left"
                  />
                </div>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {TIMELINE_STEPS.map((item, idx) => {
                  const Icon = item.icon;
                  const isCompleted = matchedOrder.statusStep > item.step;
                  const isCurrent = matchedOrder.statusStep === item.step;
                  const isActiveOrDone = isCompleted || isCurrent;
                  const stateLabel = isCompleted
                    ? 'Completed'
                    : isCurrent
                      ? 'Current Stage'
                      : 'Upcoming';

                  return (
                    <motion.li
                      key={`${matchedOrder.orderNumber}-${item.step}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: isActiveOrDone ? 1 : 0.75, y: 0 }}
                      transition={{ duration: 0.45, delay: idx * 0.08, ease: SILK_EASE }}
                      className={`flex flex-col gap-3 p-4 rounded-sm border ${
                        isCurrent
                          ? 'border-primary bg-surface'
                          : isCompleted
                            ? 'border-outline bg-surface-white'
                            : 'border-outline-variant bg-surface-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`w-9 h-9 rounded-sm flex items-center justify-center ${
                            isActiveOrDone
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface border border-outline text-on-surface-muted'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span
                          className={`font-label text-xs font-medium ${
                            isCurrent
                              ? 'text-primary'
                              : isCompleted
                                ? 'text-on-surface'
                                : 'text-on-surface-muted'
                          }`}
                        >
                          {stateLabel}
                        </span>
                      </div>

                      <div>
                        <p className="font-mono text-xs text-on-surface-muted">
                          0{item.step}.
                        </p>
                        <h3 className="font-title text-sm font-medium text-on-surface mt-0.5">
                          {item.title}
                        </h3>
                        <p className="font-body text-xs text-on-surface-muted mt-1 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            {/* Courier & Address Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-outline-variant text-sm">
              <div>
                <h3 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                  Courier &amp; Airway Bill
                </h3>
                <p className="font-body text-on-surface font-medium">{matchedOrder.courier}</p>
                <p className="font-mono text-xs text-on-surface-muted mt-0.5">
                  {matchedOrder.trackingNumber}
                </p>
              </div>
              <div>
                <h3 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                  Delivery Destination
                </h3>
                <p className="font-body text-on-surface">{matchedOrder.customerName}</p>
                <p className="font-body text-on-surface-muted">
                  {matchedOrder.address}, {matchedOrder.city} · {matchedOrder.pinCode}
                </p>
              </div>
              <div>
                <h3 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                  Payment &amp; Dispatch Updates
                </h3>
                <p className="font-body text-on-surface">{matchedOrder.paymentMethod}</p>
                <p className="font-body text-on-surface-muted">{matchedOrder.email}</p>
              </div>
            </div>

            {matchedOrder.giftMessage && (
              <div className="mt-5 p-4 bg-surface border border-outline-variant rounded-xs">
                <h3 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                  Gift Message / Special Instructions
                </h3>
                <p className="font-body text-sm text-on-surface whitespace-pre-line leading-relaxed">
                  {matchedOrder.giftMessage}
                </p>
              </div>
            )}
          </section>

          {/* Itemized Receipt Card */}
          <section className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="font-headline text-2xl text-on-surface">Itemized Receipt</h2>
              <span className="font-label text-xs text-on-surface-muted tabular-nums">
                {matchedOrder.items.reduce((sum, i) => sum + i.quantity, 0)}{' '}
                {matchedOrder.items.reduce((sum, i) => sum + i.quantity, 0) === 1
                  ? 'Piece'
                  : 'Pieces'}
              </span>
            </div>

            <div className="space-y-4">
              {matchedOrder.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 pb-4 border-b border-outline-variant last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xs bg-surface-sand shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-title text-base font-medium text-on-surface truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-on-surface-muted mt-0.5">
                        {item.shadeName} ·{' '}
                        {item.finishing === 'fall-pico'
                          ? 'Fall & Pico (+₹1,500)'
                          : 'Unstitched Blouse'}{' '}
                        · Qty {item.quantity}
                      </p>
                      <p className="font-mono text-xs text-on-surface-muted mt-1">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>

                  <span className="font-title text-base font-medium text-on-surface tabular-nums shrink-0">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-outline-variant space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-muted">
                <span>Subtotal</span>
                <span className="tabular-nums text-on-surface">
                  {formatINR(matchedOrder.subtotal)}
                </span>
              </div>
              {matchedOrder.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Atelier Privilege</span>
                  <span className="tabular-nums">−{formatINR(matchedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-muted">
                <span>Insured Express Shipping</span>
                <span className="text-on-surface">Complimentary</span>
              </div>
              <div className="flex justify-between font-title text-lg font-medium text-on-surface pt-3 border-t border-outline-variant">
                <span>Total Paid (GST Included)</span>
                <span className="tabular-nums">{formatINR(matchedOrder.total)}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
