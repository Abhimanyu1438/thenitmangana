import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../data/catalog';
import { createOrderOnServer } from '../lib/api';
import { BagItem, OrderRecord, PageRoute, UserProfile } from '../types';
import { ResilientImage } from './ResilientImage';

interface CheckoutViewProps {
  items: BagItem[];
  authToken: string | null;
  currentUser: UserProfile | null;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onTrackOrder: (orderNumber: string) => void;
  onRaiseOrderQuery: (order: OrderRecord) => void;
  onNavigate: (route: PageRoute) => void;
}

export function CheckoutView({
  items,
  authToken,
  currentUser,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onTrackOrder,
  onRaiseOrderQuery,
  onNavigate,
}: CheckoutViewProps) {
  const defaultNameParts = (currentUser?.name || 'Ananya Rao').split(' ');
  const [firstName, setFirstName] = useState(defaultNameParts[0] || 'Ananya');
  const [lastName, setLastName] = useState(
    defaultNameParts.slice(1).join(' ') || 'Rao'
  );
  const [email, setEmail] = useState(currentUser?.email || 'ananya.rao@studio.in');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98201 44120');
  const [address, setAddress] = useState(
    currentUser?.address || '14 Carmichael Road, Malabar Hill'
  );
  const [city, setCity] = useState(currentUser?.city || 'Mumbai');
  const [pinCode, setPinCode] = useState(currentUser?.pinCode || '400026');
  const [paymentMethod, setPaymentMethod] = useState('Card / NetBanking / UPI');
  const [giftMessage, setGiftMessage] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      const parts = currentUser.name.trim().split(' ');
      if (parts[0]) setFirstName(parts[0]);
      if (parts.length > 1) setLastName(parts.slice(1).join(' '));
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.pinCode) setPinCode(currentUser.pinCode);
    }
  }, [currentUser]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedPromo === 'ATELIER10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo === 'NITMAGNAA') {
    discount = Math.min(3000, subtotal);
  }

  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'ATELIER10' || code === 'NITMAGNAA') {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try ATELIER10 or NITMAGNAA.');
      setAppliedPromo(null);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submittingOrder) return;
    setSubmitError(null);
    setSubmittingOrder(true);

    try {
      const { order } = await createOrderOnServer(authToken, {
        customerName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        pinCode: pinCode.trim(),
        paymentMethod,
        promoCode: appliedPromo || undefined,
        giftMessage: giftMessage.trim() || undefined,
        items,
      });
      setConfirmedOrder(order);
      onPlaceOrder(order);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to place order right now.'
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="bg-surface-white border border-outline rounded-sm p-8 md:p-10 flex flex-col gap-6">
          <div className="flex items-start gap-4 pb-6 border-b border-outline-variant">
            <CheckCircle2 className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <span className="font-mono text-xs text-primary">
                Order #{confirmedOrder.orderNumber} Confirmed — Preparing Shipment
              </span>
              <h1 className="font-headline text-3xl text-on-surface mt-1">
                Thank you, {confirmedOrder.customerName}
              </h1>
              <p className="font-body text-sm text-on-surface-muted mt-1">
                A dispatch confirmation and weave provenance certificate have been prepared for{' '}
                <span className="text-on-surface font-medium">{confirmedOrder.email}</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pb-6 border-b border-outline-variant">
            <div>
              <h2 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                Delivery Address
              </h2>
              <p className="font-body text-on-surface">{confirmedOrder.customerName}</p>
              <p className="font-body text-on-surface-muted">{confirmedOrder.address}</p>
              <p className="font-body text-on-surface-muted">
                {confirmedOrder.city} · {confirmedOrder.pinCode}
              </p>
            </div>
            <div>
              <h2 className="font-label text-xs font-medium text-on-surface-muted mb-1">
                Payment &amp; Dispatch
              </h2>
              <p className="font-body text-on-surface">{confirmedOrder.paymentMethod}</p>
              <p className="font-body text-on-surface-muted">
                Placed on {confirmedOrder.placedAt}
              </p>
              <p className="font-body text-on-surface-muted">
                Insured Global Express · Complimentary
              </p>
            </div>
          </div>

          {confirmedOrder.giftMessage && (
            <div className="p-4 bg-surface border border-outline-variant rounded-sm">
              <h2 className="font-label text-xs font-medium text-on-surface-muted mb-1.5">
                Gift Message / Special Instructions
              </h2>
              <p className="font-body text-sm text-on-surface whitespace-pre-line leading-relaxed">
                {confirmedOrder.giftMessage}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="font-label text-xs font-medium text-on-surface-muted">
              Itemized Receipt
            </h2>
            {confirmedOrder.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded-xs bg-surface-sand shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-title text-sm font-medium text-on-surface truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-on-surface-muted">
                      {item.shadeName} · Qty {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-title text-sm font-medium tabular-nums shrink-0">
                  {formatINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant space-y-2 text-sm">
            <div className="flex justify-between text-on-surface-muted">
              <span>Subtotal</span>
              <span className="tabular-nums text-on-surface">
                {formatINR(confirmedOrder.subtotal)}
              </span>
            </div>
            {confirmedOrder.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Atelier Privilege</span>
                <span className="tabular-nums">−{formatINR(confirmedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-title text-lg font-medium text-on-surface pt-2 border-t border-outline-variant">
              <span>Total Paid (GST Included)</span>
              <span className="tabular-nums">{formatINR(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onTrackOrder(confirmedOrder.orderNumber)}
              className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Track This Order
            </button>
            <button
              type="button"
              onClick={() => onRaiseOrderQuery(confirmedOrder)}
              className="min-h-[44px] px-6 border border-primary text-primary bg-surface-white rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Raise Query (WhatsApp)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collection')}
              className="min-h-[44px] px-6 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap"
            >
              Continue Exploring Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface mb-8">
        Bag &amp; Checkout
      </h1>

      {items.length === 0 ? (
        <div className="bg-surface-white border border-outline-variant rounded-sm p-12 text-center flex flex-col items-center gap-4">
          <h2 className="font-headline text-2xl text-on-surface">Your shopping bag is empty</h2>
          <p className="font-body text-sm text-on-surface-muted max-w-md">
            Select a handwoven saree from our Autumn–Winter 2026 collection to proceed with insured express checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('collection')}
            className="min-h-[44px] px-8 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Browse Weaves
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          {/* Left 7 Columns: Delivery & Payment */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-5">
              <h2 className="font-headline text-2xl text-on-surface">1. Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Email for Dispatch Updates
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-base focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-on-surface-muted mb-1.5">
                    PIN / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-headline text-2xl text-on-surface">
                  2. Gift Message &amp; Special Instructions
                </h2>
                <span className="font-label text-xs text-on-surface-muted">Optional</span>
              </div>
              <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                Include a personal gift note to be hand-lettered on linen stationery, or share Fall &amp; Pico tailoring measurements and delivery timing preferences.
              </p>
              <div>
                <label
                  htmlFor="checkout-gift-message"
                  className="block font-label text-xs text-on-surface-muted mb-1.5"
                >
                  Gift Message / Tailoring Notes
                </label>
                <textarea
                  id="checkout-gift-message"
                  rows={3}
                  maxLength={500}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="e.g. Please enclose a handwritten note: ‘Wishing you a joyful anniversary — Meera’. Requesting contrast piping on Fall & Pico finishing."
                  className="w-full px-4 py-3 bg-surface border border-outline rounded-sm font-body text-sm text-on-surface placeholder:text-on-surface-muted/65 focus:bg-surface-white focus:border-primary focus:outline-none transition-colors resize-y"
                />
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-label text-on-surface-muted">
                  <span>Saved permanently to your order archive</span>
                  <span className="tabular-nums">{giftMessage.length}/500</span>
                </div>
              </div>
            </section>

            <section className="bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-4">
              <h2 className="font-headline text-2xl text-on-surface">3. Payment</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Card / NetBanking / UPI', note: 'Instant' },
                  { label: 'International Wire / Amex Concierge', note: 'Global' },
                  { label: 'Cash on Delivery (India)', note: 'Complimentary' },
                ].map((opt) => {
                  const selected = paymentMethod === opt.label;
                  return (
                    <label
                      key={opt.label}
                      className={`flex items-center justify-between p-4 rounded-sm cursor-pointer transition-colors ${
                        selected
                          ? 'border border-on-surface bg-surface'
                          : 'border border-outline bg-surface-white hover:border-on-surface/60'
                      }`}
                    >
                      <span className="flex items-center gap-3 font-title text-base font-medium text-on-surface">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selected}
                          onChange={() => setPaymentMethod(opt.label)}
                          className="accent-primary"
                        />
                        {opt.label}
                      </span>
                      <span className="font-label text-xs text-on-surface-muted">{opt.note}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right 5 Columns: Sticky Order Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-5">
            <h2 className="font-headline text-2xl text-on-surface pb-3 border-b border-outline-variant">
              Order Summary
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 pb-4 border-b border-outline-variant"
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xs bg-surface-sand shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-title text-base font-medium text-on-surface truncate">
                          {item.name}
                        </h3>
                        <p className="font-body text-xs text-on-surface-muted mt-0.5">
                          {item.shadeName} ·{' '}
                          {item.finishing === 'fall-pico'
                            ? 'Fall & Pico (+₹1,500)'
                            : 'Unstitched Blouse'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-on-surface-muted hover:text-error p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-outline rounded-sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-label text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-surface"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-title text-base font-medium text-on-surface tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Privilege code (try ATELIER10)"
                  aria-label="Privilege code"
                  className="flex-1 min-h-[44px] px-4 bg-surface border border-outline rounded-sm font-body text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="min-h-[44px] px-5 border border-on-surface rounded-sm font-label text-xs font-medium hover:bg-on-surface hover:text-surface transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="font-body text-xs text-error mt-1.5">{promoError}</p>}
              {appliedPromo && (
                <p className="font-body text-xs text-primary mt-1.5">
                  Privilege code {appliedPromo} applied.
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-outline-variant">
              <div className="flex justify-between font-body text-sm text-on-surface-muted">
                <span>Subtotal</span>
                <span className="tabular-nums text-on-surface">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-body text-sm text-primary">
                  <span>Privilege Discount</span>
                  <span className="tabular-nums">−{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm text-on-surface-muted">
                <span>Insured Express Shipping</span>
                <span className="text-on-surface">Complimentary</span>
              </div>
              <div className="flex justify-between font-title text-lg font-medium text-on-surface pt-3 border-t border-outline-variant">
                <span>Total (GST Included)</span>
                <span className="tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            {submitError && (
              <p role="alert" className="font-body text-xs text-error">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingOrder}
              className="w-full min-h-[48px] bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {submittingOrder
                ? 'Confirming Order...'
                : `Complete Order · ${formatINR(total)}`}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}
