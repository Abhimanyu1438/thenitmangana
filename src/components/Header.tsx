import { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { PageRoute } from '../types';
import { ResilientImage } from './ResilientImage';

interface HeaderProps {
  currentRoute: PageRoute;
  bagCount: number;
  onNavigate: (route: PageRoute, opts?: { weave?: string; occasion?: string }) => void;
  onOpenBag: () => void;
  onOpenSearch: () => void;
}

export function Header({
  currentRoute,
  bagCount,
  onNavigate,
  onOpenBag,
  onOpenSearch,
}: HeaderProps) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItemClass = (active: boolean) =>
    `font-label text-sm lg:text-[15px] font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b ${
      active
        ? 'text-accent border-accent'
        : 'text-on-surface-walnut border-transparent hover:text-accent hover:border-accent/60'
    }`;

  const handleMobileNav = (route: PageRoute, opts?: { weave?: string; occasion?: string }) => {
    setMobileMenuOpen(false);
    onNavigate(route, opts);
  };

  return (
    <>
      {showAnnouncement && (
        <div className="bg-surface-walnut text-on-surface-walnut min-h-[30px] py-1 px-4 border-b border-outline/20 relative flex items-center justify-center">
          <p className="font-label text-xs tracking-wide text-center pr-8 truncate">
            Autumn–Winter 2026: The Raw Tussar &amp; Kanchipuram Edit — Complimentary Global Express Shipping
          </p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 w-6 h-6 flex items-center justify-center text-on-surface-walnut/80 hover:text-on-surface-walnut transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-surface-walnut text-on-surface-walnut border-b border-on-surface-walnut/15">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-[62px] md:h-[68px] grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
          {/* Zone 1: Left (Mobile menu trigger / Desktop split nav) */}
          <div className="justify-self-start flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-sm hover:text-accent transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Primary navigation">
              <button
                type="button"
                onClick={() => onNavigate('collection')}
                className={navItemClass(currentRoute === 'collection')}
              >
                Collection
              </button>
              <button
                type="button"
                onClick={() => onNavigate('collection', { weave: 'tussar' })}
                className={navItemClass(false)}
              >
                Weaves
              </button>
              <button
                type="button"
                onClick={() => onNavigate('collection', { occasion: 'Bridal Trousseau' })}
                className={navItemClass(false)}
              >
                Occasions
              </button>
              <button
                type="button"
                onClick={() => onNavigate('journal')}
                className={navItemClass(currentRoute === 'journal')}
              >
                Journal
              </button>
            </nav>
          </div>

          {/* Zone 2: Mathematically Centered Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            aria-label="The Nitmagnaa Weaves Home"
            className="justify-self-center inline-flex items-center justify-center h-[52px] md:h-[60px] overflow-hidden px-1 sm:px-2 shrink-0 focus-visible:outline-2 focus-visible:outline-accent rounded-sm transition-opacity hover:opacity-90"
          >
            <ResilientImage
              src={IMAGES.logo}
              alt="The Nitmagnaa Weaves"
              className="w-[164px] sm:w-[216px] md:w-[260px] h-auto object-contain"
            />
          </button>

          {/* Zone 3: Right (Private Styling + Search + Bag) */}
          <div className="justify-self-end flex items-center gap-1 md:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('styling')}
              className={`hidden md:inline-block ${navItemClass(currentRoute === 'styling')}`}
            >
              Private Styling
            </button>
            <span
              aria-hidden="true"
              className="hidden md:block h-4 w-px bg-on-surface-walnut/20"
            />
            <div className="flex items-center gap-0.5 md:gap-2">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search weaves"
                className="w-10 h-11 md:w-11 flex items-center justify-center rounded-sm hover:text-accent transition-colors"
              >
                <Search className="w-[19px] h-[19px]" />
              </button>
              <button
                type="button"
                onClick={onOpenBag}
                aria-label={`Open shopping bag, ${bagCount} items`}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-2 md:px-2.5 rounded-sm hover:text-accent transition-colors whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-[19px] h-[19px]" />
                <span className="font-label text-[13px] font-medium tabular-nums">{bagCount}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-deep-ink/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-surface-walnut text-on-surface-walnut h-full p-6 flex flex-col justify-between border-r border-outline/20">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-on-surface-walnut/20">
                <ResilientImage
                  src={IMAGES.logo}
                  alt="The Nitmagnaa Weaves"
                  className="w-[160px] h-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-11 h-11 flex items-center justify-center rounded-sm hover:text-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-2 pt-6" aria-label="Mobile navigation">
                <button
                  type="button"
                  onClick={() => handleMobileNav('home')}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('collection')}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  All Weaves
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('collection', { weave: 'tussar' })}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  Bhagalpur Tussar
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('collection', { occasion: 'Bridal Trousseau' })}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  Bridal Trousseau
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('journal')}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  The Journal
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('styling')}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  Private Styling
                </button>
                <button
                  type="button"
                  onClick={() => handleMobileNav('tracking')}
                  className="min-h-[44px] text-left font-headline text-xl py-2 hover:text-accent"
                >
                  Track Order
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-on-surface-walnut/20 text-xs text-on-surface-walnut/75 space-y-1">
              <p>Kala Ghoda, Mumbai · Indiranagar, Bengaluru</p>
              <p className="font-mono">atelier@nitmagnaa.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
