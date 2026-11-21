import { Minus, Plus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { formatINR } from '../data/catalog';
import { SILK_EASE } from '../lib/motion';
import { BagItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface BagDrawerProps {
  open: boolean;
  items: BagItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
  onExploreCollection: () => void;
}

export function BagDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onExploreCollection,
}: BagDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-deep-ink/60"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: SILK_EASE }}
            className="relative z-10 bg-surface-white text-on-surface border-l border-outline w-full max-w-md h-full p-6 md:p-8 flex flex-col justify-between shadow-2xl"
          >
            <header className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <div>
                <h2 className="font-headline text-2xl text-on-surface">Your Bag</h2>
                <p className="font-body text-xs text-on-surface-muted mt-0.5 tabular-nums">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}{' '}
                  {items.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'Piece' : 'Pieces'} · Complimentary Express Shipping
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                className="w-11 h-11 flex items-center justify-center rounded-sm hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5">
              {items.length === 0 ? (
                <div className="my-auto text-center py-12 flex flex-col items-center gap-4">
                  <p className="font-headline text-xl text-on-surface">Your bag is currently empty.</p>
                  <p className="font-body text-sm text-on-surface-muted max-w-xs">
                    Explore handspun Bhagalpur tussars, Dhakai jamdanis, and heirloom Kanchipurams.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExploreCollection();
                    }}
                    className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
                  >
                    Explore the Collection
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.25, ease: SILK_EASE }}
                      className="flex gap-4 pb-5 border-b border-outline-variant"
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-xs bg-surface-sand shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-title text-base font-medium text-on-surface truncate">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.key)}
                              aria-label={`Remove ${item.name}`}
                              className="text-on-surface-muted hover:text-error p-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-body text-xs text-on-surface-muted mt-0.5">
                            {item.shadeName} ·{' '}
                            {item.finishing === 'fall-pico' ? 'Fall & Pico (+₹1,500)' : 'Unstitched Blouse'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-outline rounded-sm">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-label text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-title text-base font-medium text-on-surface tabular-nums">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <footer className="pt-4 border-t border-outline-variant flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-base text-on-surface-muted">Subtotal (GST Included)</span>
                  <span className="font-title text-xl font-medium text-on-surface tabular-nums">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="w-full min-h-[48px] bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
                >
                  Proceed to Checkout
                </button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
