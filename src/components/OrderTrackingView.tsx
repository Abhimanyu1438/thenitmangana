import { useEffect, useState } from 'react';
import { Check, Home, PackageCheck, Search, Truck } from 'lucide-react';
import { formatINR } from '../data/catalog';
import { OrderRecord, OrderStatusStep, PageRoute } from '../types';
import { ResilientImage } from './ResilientImage';

interface OrderTrackingViewProps {
  orders: OrderRecord[];
  initialOrderId?: string;
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
  initialOrderId,
  onNavigate,
}: OrderTrackingViewProps) {
  const [queryInput, setQueryInput] = useState(initialOrderId || 'NMW-1042');
  const [searchedRef, setSearchedRef] = useState(
    normalizeOrderRef(initialOrderId || 'NMW-1042')
  );

  useEffect(() => {
    if (initialOrderId) {
      setQueryInput(initialOrderId);
      setSearchedRef(normalizeOrderRef(initialOrderId));
    }
  }, [initialOrderId]);

  const matchedOrder = orders.find(
    (order) => normalizeOrderRef(order.orderNumber) === searchedRef
  );

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
      ) : !matchedOrder ? (
        <div className="bg-surface-white border border-outline-variant rounded-sm p-8 md:p-10 flex flex-col items-start gap-4">
          <span className="font-mono text-xs text-error">Reference #{searchedRef} Not Found</span>
          <h2 className="font-headline text-2xl text-on-surface">
            We could not locate an order with that reference
          </h2>
          <p className="font-body text-sm text-on-surface-muted max-w-lg leading-relaxed">
            Check the confirmation code from your receipt (formatted as <span className="font-mono text-on-surface">NMW-XXXX</span>), or load our sample dispatch record to preview the tracking timeline.
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
              onClick={() => onNavigate('collection')}
              className="min-h-[44px] px-6 border border-outline bg-surface text-on-surface rounded-sm font-label text-sm font-medium hover:border-on-surface transition-colors"
            >
              Explore Collection
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

              <div className="md:text-right">
                <span className="block font-label text-xs text-on-surface-muted">
                  Estimated Delivery
                </span>
                <span className="font-title text-base font-medium text-on-surface tabular-nums">
                  {matchedOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* 4-Step Dispatch Timeline */}
            <div className="py-8">
              <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {TIMELINE_STEPS.map((item) => {
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
                    <li
                      key={item.step}
                      className={`flex flex-col gap-3 p-4 rounded-sm border ${
                        isCurrent
                          ? 'border-primary bg-surface'
                          : isCompleted
                            ? 'border-outline bg-surface-white'
                            : 'border-outline-variant bg-surface-white/60 opacity-75'
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
                    </li>
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
