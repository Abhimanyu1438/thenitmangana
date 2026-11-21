/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BagDrawer } from './components/BagDrawer';
import { CheckoutView } from './components/CheckoutView';
import { CollectionView } from './components/CollectionView';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { JournalView } from './components/JournalView';
import { PrivateStylingView } from './components/PrivateStylingView';
import { ProductDetailView } from './components/ProductDetailView';
import { SearchOverlay } from './components/SearchOverlay';
import { PRODUCTS } from './data/catalog';
import {
  BagItem,
  FinishingOption,
  OccasionKey,
  OrderRecord,
  PageRoute,
  PaletteKey,
  Product,
  StylingAppointment,
  WeaveKey,
} from './types';

const STORAGE_KEYS = {
  bag: 'nitmagnaa_bag_v1',
  wishlist: 'nitmagnaa_wishlist_v1',
  appointment: 'nitmagnaa_appointment_v1',
};

const DEFAULT_BAG_ITEM: BagItem = {
  key: 'ira-raw-tussar::Terracotta Clay::unstitched',
  productId: PRODUCTS[0].id,
  name: PRODUCTS[0].name,
  subtitle: PRODUCTS[0].subtitle,
  sku: PRODUCTS[0].sku,
  image: PRODUCTS[0].frontImage,
  shadeName: PRODUCTS[0].shades[0].name,
  finishing: 'unstitched',
  unitPrice: PRODUCTS[0].price,
  quantity: 1,
};

function loadInitialBag(): BagItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.bag);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return [DEFAULT_BAG_ITEM];
}

function loadInitialWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.wishlist);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function loadInitialAppointment(): StylingAppointment | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.appointment);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.referenceId) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [activeIssueId, setActiveIssueId] = useState<string>('issue-09');

  const [selectedWeaves, setSelectedWeaves] = useState<WeaveKey[]>([]);
  const [selectedPalettes, setSelectedPalettes] = useState<PaletteKey[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionKey[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [bagItems, setBagItems] = useState<BagItem[]>(loadInitialBag);
  const [wishlistIds, setWishlistIds] = useState<string[]>(loadInitialWishlist);
  const [lastAppointment, setLastAppointment] = useState<StylingAppointment | null>(
    loadInitialAppointment
  );

  const [bagDrawerOpen, setBagDrawerOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bag, JSON.stringify(bagItems));
    } catch {
      // ignore
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (
    nextRoute: PageRoute,
    opts?: { weave?: string; occasion?: string; issueId?: string }
  ) => {
    if (nextRoute === 'collection') {
      if (opts?.weave) {
        setSelectedWeaves([opts.weave as WeaveKey]);
        setSelectedOccasions([]);
        setSelectedPalettes([]);
        setSearchQuery('');
      } else if (opts?.occasion) {
        setSelectedOccasions([opts.occasion as OccasionKey]);
        setSelectedWeaves([]);
        setSelectedPalettes([]);
        setSearchQuery('');
      } else if (!opts) {
        setSelectedWeaves([]);
        setSelectedOccasions([]);
        setSelectedPalettes([]);
        setSearchQuery('');
      }
    }
    if (opts?.issueId) {
      setActiveIssueId(opts.issueId);
    }
    setRoute(nextRoute);
    scrollToTop();
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setRoute('product');
    scrollToTop();
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToBag = (
    product: Product,
    shadeName: string,
    finishing: FinishingOption
  ) => {
    const unitPrice = product.price + (finishing === 'fall-pico' ? 1500 : 0);
    const key = `${product.id}::${shadeName}::${finishing}`;

    setBagItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          subtitle: product.subtitle,
          sku: product.sku,
          image: product.frontImage,
          shadeName,
          finishing,
          unitPrice,
          quantity: 1,
        },
      ];
    });
    setBagDrawerOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToBag(product, product.shades[0].name, 'unstitched');
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handlePlaceOrder = (_order: OrderRecord) => {
    setBagItems([]);
  };

  const handleBookAppointment = (appointment: StylingAppointment) => {
    const cleaned = appointment.referenceId ? appointment : null;
    setLastAppointment(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(STORAGE_KEYS.appointment, JSON.stringify(cleaned));
      } else {
        localStorage.removeItem(STORAGE_KEYS.appointment);
      }
    } catch {
      // ignore
    }
  };

  const bagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);
  const activeProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <Header
        currentRoute={route}
        bagCount={bagCount}
        onNavigate={handleNavigate}
        onOpenBag={() => setBagDrawerOpen(true)}
        onOpenSearch={() => setSearchOverlayOpen(true)}
      />

      <main className="flex-1">
        {route === 'home' && (
          <HomeView
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'collection' && (
          <CollectionView
            selectedWeaves={selectedWeaves}
            selectedPalettes={selectedPalettes}
            selectedOccasions={selectedOccasions}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            onChangeWeaves={setSelectedWeaves}
            onChangePalettes={setSelectedPalettes}
            onChangeOccasions={setSelectedOccasions}
            onClearSearch={() => setSearchQuery('')}
            onResetAllFilters={() => {
              setSelectedWeaves([]);
              setSelectedPalettes([]);
              setSelectedOccasions([]);
              setSearchQuery('');
            }}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {route === 'product' && (
          <ProductDetailView
            key={activeProduct.id}
            product={activeProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToBag={handleAddToBag}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'checkout' && (
          <CheckoutView
            items={bagItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'styling' && (
          <PrivateStylingView
            lastAppointment={lastAppointment}
            onBookAppointment={handleBookAppointment}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'journal' && (
          <JournalView
            activeIssueId={activeIssueId}
            wishlistIds={wishlistIds}
            onSelectIssue={setActiveIssueId}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <BagDrawer
        open={bagDrawerOpen}
        items={bagItems}
        onClose={() => setBagDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setBagDrawerOpen(false);
          handleNavigate('checkout');
        }}
        onExploreCollection={() => handleNavigate('collection')}
      />

      <SearchOverlay
        open={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        onSelectProduct={handleSelectProduct}
        onSelectJournal={(issueId) => handleNavigate('journal', { issueId })}
        onViewAllResults={(q) => {
          setSearchQuery(q);
          setSelectedWeaves([]);
          setSelectedOccasions([]);
          setSelectedPalettes([]);
          setRoute('collection');
          scrollToTop();
        }}
      />
    </div>
  );
}
