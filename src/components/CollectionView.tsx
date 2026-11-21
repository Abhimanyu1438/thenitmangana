import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import {
  OCCASION_FILTERS,
  PALETTE_FILTERS,
  PRODUCTS,
  WEAVE_FILTERS,
} from '../data/catalog';
import { OccasionKey, PaletteKey, Product, WeaveKey } from '../types';
import { ProductCard } from './ProductCard';

interface CollectionViewProps {
  selectedWeaves: WeaveKey[];
  selectedPalettes: PaletteKey[];
  selectedOccasions: OccasionKey[];
  searchQuery: string;
  wishlistIds: string[];
  onChangeWeaves: (weaves: WeaveKey[]) => void;
  onChangePalettes: (palettes: PaletteKey[]) => void;
  onChangeOccasions: (occasions: OccasionKey[]) => void;
  onClearSearch: () => void;
  onResetAllFilters: () => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export function CollectionView({
  selectedWeaves,
  selectedPalettes,
  selectedOccasions,
  searchQuery,
  wishlistIds,
  onChangeWeaves,
  onChangePalettes,
  onChangeOccasions,
  onClearSearch,
  onResetAllFilters,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}: CollectionViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleWeave = (w: WeaveKey) => {
    if (selectedWeaves.includes(w)) {
      onChangeWeaves(selectedWeaves.filter((item) => item !== w));
    } else {
      onChangeWeaves([...selectedWeaves, w]);
    }
  };

  const togglePalette = (p: PaletteKey) => {
    if (selectedPalettes.includes(p)) {
      onChangePalettes(selectedPalettes.filter((item) => item !== p));
    } else {
      onChangePalettes([...selectedPalettes, p]);
    }
  };

  const toggleOccasion = (o: OccasionKey) => {
    if (selectedOccasions.includes(o)) {
      onChangeOccasions(selectedOccasions.filter((item) => item !== o));
    } else {
      onChangeOccasions([...selectedOccasions, o]);
    }
  };

  const weaveCounts = useMemo(() => {
    const counts: Record<WeaveKey, number> = {
      tussar: 0,
      kanchipuram: 0,
      jamdani: 0,
      chanderi: 0,
      organza: 0,
    };
    for (const p of PRODUCTS) {
      counts[p.weaveKey] = (counts[p.weaveKey] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];
    if (selectedWeaves.length > 0) {
      list = list.filter((p) => selectedWeaves.includes(p.weaveKey));
    }
    if (selectedPalettes.length > 0) {
      list = list.filter((p) => p.shades.some((s) => selectedPalettes.includes(s.palette)));
    }
    if (selectedOccasions.length > 0) {
      list = list.filter((p) => p.occasions.some((o) => selectedOccasions.includes(o)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.weave.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.shades.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedWeaves, selectedPalettes, selectedOccasions, searchQuery, sortBy]);

  const filterRailContent = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
        <h2 className="font-title text-base font-medium text-on-surface">Filters</h2>
        <button
          type="button"
          onClick={onResetAllFilters}
          className="font-label text-xs font-medium text-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Weave Filter */}
      <div className="flex flex-col gap-2">
        <h3 className="font-label text-[13px] font-medium text-on-surface">Weave</h3>
        {WEAVE_FILTERS.map((wf) => {
          const checked = selectedWeaves.includes(wf.key);
          return (
            <label
              key={wf.key}
              className="flex items-center gap-2.5 min-h-[36px] cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleWeave(wf.key)}
                className="w-4 h-4 rounded-xs border-outline accent-primary cursor-pointer"
              />
              <span className="font-body text-sm text-on-surface">
                {wf.label}{' '}
                <span className="text-on-surface-muted tabular-nums">
                  ({weaveCounts[wf.key]})
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Palette Filter */}
      <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant">
        <h3 className="font-label text-[13px] font-medium text-on-surface">Palette</h3>
        <div className="flex flex-wrap gap-2">
          {PALETTE_FILTERS.map((pf) => {
            const active = selectedPalettes.includes(pf.key);
            return (
              <button
                key={pf.key}
                type="button"
                onClick={() => togglePalette(pf.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm font-label text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border border-on-surface bg-surface text-on-surface'
                    : 'border border-outline bg-surface-white text-on-surface-muted hover:border-on-surface'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-outline/60"
                  style={{ backgroundColor: pf.hex }}
                />
                {pf.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasion Filter */}
      <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant">
        <h3 className="font-label text-[13px] font-medium text-on-surface">Occasion</h3>
        {OCCASION_FILTERS.map((occ) => {
          const checked = selectedOccasions.includes(occ);
          return (
            <label
              key={occ}
              className="flex items-center gap-2.5 min-h-[36px] cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOccasion(occ)}
                className="w-4 h-4 rounded-xs border-outline accent-primary cursor-pointer"
              />
              <span className="font-body text-sm text-on-surface">{occ}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-10 md:py-14">
      {/* Header Row */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-outline-variant mb-8">
        <div>
          <span className="font-label text-xs font-medium text-primary">
            Autumn–Winter 2026 Archive
          </span>
          <h1 className="font-display text-4xl md:text-[56px] md:leading-[62px] text-on-surface mt-1">
            Handloom Collection
          </h1>
          {searchQuery.trim() && (
            <div className="flex items-center gap-3 mt-2 text-sm text-on-surface-muted">
              <span>
                Filtered by search: <strong className="text-on-surface">“{searchQuery}”</strong>
              </span>
              <button
                type="button"
                onClick={onClearSearch}
                className="text-primary font-label text-xs hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">
          <span className="font-label text-sm text-on-surface-muted tabular-nums">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 min-h-[44px] px-4 border border-outline bg-surface-white rounded-sm font-label text-xs font-medium text-on-surface"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort collection"
            className="min-h-[44px] px-4 bg-surface-white border border-outline rounded-sm font-label text-xs font-medium text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-surface-white border border-outline-variant rounded-sm p-6 sticky top-28">
          {filterRailContent}
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-surface-white border border-outline-variant rounded-sm p-12 text-center flex flex-col items-center gap-4">
              <h2 className="font-headline text-2xl text-on-surface">
                No weaves match these criteria
              </h2>
              <p className="font-body text-sm text-on-surface-muted max-w-md">
                Try clearing one or more weave, palette, or occasion filters to explore the full Autumn–Winter 2026 collection.
              </p>
              <button
                type="button"
                onClick={onResetAllFilters}
                className="min-h-[44px] px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-deep-ink/60"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-surface-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
                <span className="font-headline text-xl text-on-surface">Filter Collection</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterRailContent}
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full min-h-[48px] bg-primary text-on-primary rounded-sm font-label text-sm font-medium"
            >
              Show {filteredProducts.length} Pieces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
