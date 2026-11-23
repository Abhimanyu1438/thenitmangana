import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS, formatINR } from '../data/catalog';
import { SILK_EASE } from '../lib/motion';
import { FinishingOption, PageRoute, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface SavedWeavesViewProps {
  wishlistIds: string[];
  bagCount: number;
  onToggleWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onMoveToBag: (
    product: Product,
    shadeName: string,
    finishing: FinishingOption
  ) => void;
  onMoveAllToBag: (
    items: {
      product: Product;
      shadeName: string;
      finishing: FinishingOption;
    }[]
  ) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onOpenBag: () => void;
  onNavigate: (route: PageRoute) => void;
}

type SortMode = 'saved' | 'price-asc' | 'price-desc';

export function SavedWeavesView({
  wishlistIds,
  bagCount,
  onToggleWishlist,
  onClearWishlist,
  onMoveToBag,
  onMoveAllToBag,
  onQuickAdd,
  onSelectProduct,
  onOpenBag,
  onNavigate,
}: SavedWeavesViewProps) {
  const [sortMode, setSortMode] = useState<SortMode>('saved');
  const [selectedShades, setSelectedShades] = useState<Record<string, string>>({});
  const [selectedFinishings, setSelectedFinishings] = useState<
    Record<string, FinishingOption>
  >({});
  const [confirmClear, setConfirmClear] = useState(false);

  const savedProducts = useMemo(() => {
    const matched = wishlistIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (sortMode === 'price-asc') {
      return [...matched].sort((a, b) => a.price - b.price);
    }
    if (sortMode === 'price-desc') {
      return [...matched].sort((a, b) => b.price - a.price);
    }
    return matched;
  }, [wishlistIds, sortMode]);

  const getShadeFor = (product: Product): string =>
    selectedShades[product.id] || product.shades[0]?.name || 'Natural';

  const getFinishingFor = (product: Product): FinishingOption =>
    selectedFinishings[product.id] || 'unstitched';

  const getItemUnitPrice = (product: Product): number =>
    product.price + (getFinishingFor(product) === 'fall-pico' ? 1500 : 0);

  const totalSavedValue = savedProducts.reduce(
    (sum, product) => sum + getItemUnitPrice(product),
    0
  );

  const suggestedProducts = useMemo(
    () => PRODUCTS.filter((p) => !wishlistIds.includes(p.id)).slice(0, 4),
    [wishlistIds]
  );

  const handleMoveAll = () => {
    if (savedProducts.length === 0) return;
    onMoveAllToBag(
      savedProducts.map((product) => ({
        product,
        shadeName: getShadeFor(product),
        finishing: getFinishingFor(product),
      }))
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant">
        <div>
          <span className="font-label text-xs font-medium text-primary">
            Personal Curation
          </span>
          <h1 className="font-display text-4xl md:text-[52px] md:leading-[58px] text-on-surface mt-1">
            Saved Weaves
          </h1>
          <p className="font-body text-base text-on-surface-muted mt-2 max-w-xl leading-relaxed">
            Review your shortlisted handloom sarees, choose your preferred dye shade and Fall &amp; Pico finishing, and move pieces directly into your shopping bag.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {bagCount > 0 && (
            <button
              type="button"
              onClick={onOpenBag}
              className="min-h-[44px] px-5 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              Open Bag ({bagCount})
            </button>
          )}
          {savedProducts.length > 0 && (
            <button
              type="button"
              onClick={handleMoveAll}
              className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              Move All to Bag ({savedProducts.length})
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {savedProducts.length === 0 ? (
        <section className="py-12 flex flex-col gap-14">
          <div className="bg-surface-white border border-outline-variant rounded-sm p-10 md:p-14 text-center flex flex-col items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-primary">
              <Heart className="w-5 h-5" />
            </span>
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface">
              Your Saved Weaves list is empty
            </h2>
            <p className="font-body text-sm text-on-surface-muted max-w-md leading-relaxed">
              Tap the heart icon on any Bhagalpur Tussar, Kanchipuram Silk, or Jamdani piece to shortlist weaves here for side-by-side review and easy moving to your bag.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('collection')}
                className="min-h-[44px] px-7 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
              >
                Explore the Collection
                <ArrowRight className="w-4 h-4" />
              </button>
              {bagCount > 0 && (
                <button
                  type="button"
                  onClick={onOpenBag}
                  className="min-h-[44px] px-6 border border-on-surface bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:bg-surface transition-colors"
                >
                  Review Shopping Bag ({bagCount})
                </button>
              )}
            </div>
          </div>

          {/* Curated Suggestions so users can test saving immediately */}
          <div>
            <div className="flex items-end justify-between gap-4 pb-5 border-b border-outline-variant mb-8">
              <div>
                <span className="font-label text-xs font-medium text-primary inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Curated Shortlist Ideas
                </span>
                <h2 className="font-headline text-2xl md:text-3xl text-on-surface mt-1">
                  Popular Autumn–Winter Weaves
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('collection')}
                className="font-label text-sm font-medium text-primary hover:underline whitespace-nowrap"
              >
                View Full Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {suggestedProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  revealIndex={idx % 4}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="pt-8 flex flex-col gap-6">
          {/* Controls & Summary Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-white border border-outline-variant rounded-sm px-5 py-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-title font-medium text-on-surface tabular-nums">
                {savedProducts.length}{' '}
                {savedProducts.length === 1 ? 'Saved Piece' : 'Saved Pieces'}
              </span>
              <span aria-hidden="true" className="text-outline">
                ·
              </span>
              <span className="font-body text-on-surface-muted">
                Estimated Total:{' '}
                <strong className="font-title font-medium text-on-surface tabular-nums">
                  {formatINR(totalSavedValue)}
                </strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="saved-sort"
                  className="font-label text-xs text-on-surface-muted"
                >
                  Sort:
                </label>
                <select
                  id="saved-sort"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="min-h-[38px] px-3 bg-surface border border-outline rounded-sm font-label text-xs text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="saved">Order Saved</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {!confirmClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="min-h-[38px] px-3.5 border border-outline rounded-sm font-label text-xs text-on-surface-muted hover:text-error hover:border-error transition-colors"
                >
                  Clear All
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearWishlist();
                      setConfirmClear(false);
                    }}
                    className="min-h-[38px] px-3.5 bg-error text-surface-white rounded-sm font-label text-xs font-medium"
                  >
                    Confirm Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[38px] px-3 border border-outline rounded-sm font-label text-xs text-on-surface"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Saved Weaves List */}
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {savedProducts.map((product) => {
                const activeShade = getShadeFor(product);
                const activeFinishing = getFinishingFor(product);
                const itemPrice = getItemUnitPrice(product);

                return (
                  <motion.article
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: SILK_EASE }}
                    className="bg-surface-white border border-outline-variant rounded-sm p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start"
                  >
                    {/* Thumbnail */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id)}
                      aria-label={`Inspect ${product.name}`}
                      className="relative w-full sm:w-44 md:w-36 aspect-[3/4] bg-surface-sand rounded-xs overflow-hidden shrink-0 group focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <ResilientImage
                        src={product.frontImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {product.tag && (
                        <span className="absolute top-2.5 left-2.5 bg-surface-white/95 text-on-surface px-2 py-0.5 rounded-xs font-label text-[11px] font-medium">
                          {product.tag}
                        </span>
                      )}
                    </button>

                    {/* Center Details & Inline Configuration */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-outline-variant">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-muted">
                            <span className="font-mono">{product.sku}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-label">{product.weave}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product.id)}
                            className="text-left group/name focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
                          >
                            <h2 className="font-headline text-2xl text-on-surface group-hover/name:text-primary transition-colors mt-0.5">
                              {product.name}
                            </h2>
                          </button>
                          <p className="font-body text-sm text-on-surface-muted">
                            {product.subtitle}
                          </p>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="font-title text-xl font-medium text-on-surface tabular-nums">
                            {formatINR(itemPrice)}
                          </span>
                          <p className="font-label text-[11px] text-on-surface-muted">
                            GST Included · Free Express Shipping
                          </p>
                        </div>
                      </div>

                      <p className="font-body text-sm text-on-surface-muted leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Shade & Finishing Selectors */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="block font-label text-xs text-on-surface-muted mb-2">
                            Shade:{' '}
                            <strong className="font-medium text-on-surface">
                              {activeShade}
                            </strong>
                          </span>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {product.shades.map((shade) => {
                              const isSelected = shade.name === activeShade;
                              return (
                                <button
                                  key={shade.name}
                                  type="button"
                                  onClick={() =>
                                    setSelectedShades((prev) => ({
                                      ...prev,
                                      [product.id]: shade.name,
                                    }))
                                  }
                                  aria-label={`Select ${shade.name} shade`}
                                  aria-pressed={isSelected}
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border font-label text-xs transition-colors ${
                                    isSelected
                                      ? 'border-on-surface bg-surface text-on-surface font-medium'
                                      : 'border-outline-variant bg-surface-white text-on-surface-muted hover:border-outline'
                                  }`}
                                >
                                  <span
                                    className="w-3 h-3 rounded-full border border-outline/40 shrink-0"
                                    style={{ backgroundColor: shade.hex }}
                                  />
                                  {shade.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="block font-label text-xs text-on-surface-muted mb-2">
                            Atelier Finishing
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedFinishings((prev) => ({
                                  ...prev,
                                  [product.id]: 'unstitched',
                                }))
                              }
                              aria-pressed={activeFinishing === 'unstitched'}
                              className={`px-3 py-1.5 rounded-sm border font-label text-xs transition-colors ${
                                activeFinishing === 'unstitched'
                                  ? 'border-on-surface bg-surface text-on-surface font-medium'
                                  : 'border-outline-variant bg-surface-white text-on-surface-muted hover:border-outline'
                              }`}
                            >
                              Unstitched Blouse (Included)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedFinishings((prev) => ({
                                  ...prev,
                                  [product.id]: 'fall-pico',
                                }))
                              }
                              aria-pressed={activeFinishing === 'fall-pico'}
                              className={`px-3 py-1.5 rounded-sm border font-label text-xs transition-colors ${
                                activeFinishing === 'fall-pico'
                                  ? 'border-on-surface bg-surface text-on-surface font-medium'
                                  : 'border-outline-variant bg-surface-white text-on-surface-muted hover:border-outline'
                              }`}
                            >
                              Fall &amp; Pico (+₹1,500)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Row Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              onMoveToBag(product, activeShade, activeFinishing)
                            }
                            className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Move to Bag · {formatINR(itemPrice)}
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectProduct(product.id)}
                            className="min-h-[44px] px-5 border border-outline bg-surface-white text-on-surface rounded-sm font-label text-sm font-medium hover:border-on-surface transition-colors whitespace-nowrap"
                          >
                            Inspect Weave
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleWishlist(product.id)}
                          aria-label={`Remove ${product.name} from Saved Weaves`}
                          className="min-h-[40px] px-3.5 text-on-surface-muted hover:text-error rounded-sm font-label text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
