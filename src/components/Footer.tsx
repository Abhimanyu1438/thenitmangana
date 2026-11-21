import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES } from '../data/catalog';
import { SILK_EASE } from '../lib/motion';
import { PageRoute } from '../types';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  onNavigate: (route: PageRoute, opts?: { weave?: string; occasion?: string }) => void;
}

type CareTopic = 'shipping' | 'care' | 'returns' | null;

const CARE_TOPICS: Record<Exclude<CareTopic, null>, { title: string; body: string[] }> = {
  shipping: {
    title: 'Shipping & Global Duties',
    body: [
      'Every Nitmagnaa weave ships complimentary via insured courier across India (2–4 business days) and internationally via DHL Express (5–7 business days).',
      'Orders with Fall & Pico hand-finishing require an additional 48 hours in our Mumbai atelier prior to dispatch.',
    ],
  },
  care: {
    title: 'Handloom Silk Care Guide',
    body: [
      'Store handspun tussar, mulberry Kanchipuram, and jamdani weaves folded in the unbleached cotton muslin bag included with your order, away from direct sunlight and cedar oil.',
      'Dry clean only with a trusted specialist. Refold heirloom zari pieces every four months along alternating lines to preserve selvedge tension.',
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    body: [
      'Unworn weaves in original condition with intact atelier seal may be exchanged or returned within 14 days of delivery.',
      'Sarees commissioned with custom Fall & Pico finishing or bespoke botanical dye orders are final sale.',
    ],
  },
};

export function Footer({ onNavigate }: FooterProps) {
  const [activeTopic, setActiveTopic] = useState<CareTopic>(null);

  return (
    <footer className="bg-surface-walnut text-on-surface-walnut py-16">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-on-surface-walnut/20">
          <div className="md:col-span-4 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="self-start focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
            >
              <ResilientImage
                src={IMAGES.logo}
                alt="The Nitmagnaa Weaves"
                className="w-[210px] min-h-[42px] h-auto object-contain"
              />
            </button>
            <p className="font-body text-sm text-on-surface-walnut/80 max-w-xs leading-relaxed">
              Contemporary Indian handloom house dedicated to quiet luxury, natural fibers, and living weaving traditions.
            </p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2.5">
            <h3 className="font-label text-[13px] font-medium text-surface-sand mb-1">Collections</h3>
            <button
              type="button"
              onClick={() => onNavigate('collection')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collection', { weave: 'tussar' })}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Raw Tussar
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collection', { weave: 'kanchipuram' })}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Kanchipuram
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collection', { occasion: 'Bridal Trousseau' })}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Bridal Trousseau
            </button>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h3 className="font-label text-[13px] font-medium text-surface-sand mb-1">Client Care</h3>
            <button
              type="button"
              onClick={() => onNavigate('tracking')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={() => onNavigate('styling')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Private Styling
            </button>
            <button
              type="button"
              onClick={() => setActiveTopic('shipping')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Shipping &amp; Duties
            </button>
            <button
              type="button"
              onClick={() => setActiveTopic('care')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Silk Care Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTopic('returns')}
              className="text-left font-body text-sm hover:text-surface-sand transition-colors"
            >
              Returns &amp; Exchanges
            </button>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2">
            <h3 className="font-label text-[13px] font-medium text-surface-sand mb-1">Ateliers</h3>
            <p className="font-body text-sm text-on-surface-walnut/80">Kala Ghoda, Mumbai</p>
            <p className="font-body text-sm text-on-surface-walnut/80">Indiranagar, Bengaluru</p>
            <button
              type="button"
              onClick={() => onNavigate('styling')}
              className="text-left font-mono text-xs text-on-surface-walnut/75 hover:text-surface-sand mt-1 transition-colors"
            >
              atelier@nitmagnaa.com
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-label text-xs text-on-surface-walnut/70">
            © 2026 The Nitmagnaa Weaves. All rights reserved.
          </p>
          <p className="font-label text-xs text-on-surface-walnut/70">
            INR ₹ · Handwoven in India · Ships Worldwide
          </p>
        </div>
      </div>

      <AnimatePresence>
        {activeTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-ink/60"
            onClick={() => setActiveTopic(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.28, ease: SILK_EASE }}
              className="bg-surface-white text-on-surface border border-outline rounded-sm max-w-lg w-full p-8 flex flex-col gap-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <h3 className="font-headline text-2xl text-on-surface">
                  {CARE_TOPICS[activeTopic].title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  aria-label="Close guide"
                  className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {CARE_TOPICS[activeTopic].body.map((p) => (
                  <p key={p} className="font-body text-sm text-on-surface-muted leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
