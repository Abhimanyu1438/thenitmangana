import { useState } from 'react';
import { Check, Heart, Plus, ShoppingBag, X } from 'lucide-react';
import { IMAGES, PRODUCTS, formatINR } from '../data/catalog';
import { FinishingOption, PageRoute, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: Product;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToBag: (product: Product, shadeName: string, finishing: FinishingOption) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onNavigate: (route: PageRoute, opts?: { weave?: string }) => void;
}

export function ProductDetailView({
  product,
  wishlistIds,
  onToggleWishlist,
  onAddToBag,
  onQuickAdd,
  onSelectProduct,
  onNavigate,
}: ProductDetailViewProps) {
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const [finishing, setFinishing] = useState<FinishingOption>('unstitched');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const selectedShade = product.shades[selectedShadeIndex] || product.shades[0];
  const finalPrice = product.price + (finishing === 'fall-pico' ? 1500 : 0);
  const isWishlisted = wishlistIds.includes(product.id);

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const galleryFrames = [
    { src: product.frontImage, alt: `${product.name} full length front drape`, span: false },
    { src: product.backImage, alt: `${product.name} pleated pallu drape`, span: false },
    { src: product.textureImage, alt: `Macro close-up of ${product.weave} weave`, span: false },
    { src: IMAGES.craftLoom, alt: 'Weaver hands dressing the warp on a wooden pit loom', span: true },
  ];

  const handleAdd = () => {
    onAddToBag(product, selectedShade.name, finishing);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-muted mb-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="hover:text-on-surface transition-colors"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => onNavigate('collection')}
          className="hover:text-on-surface transition-colors"
        >
          Collection
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => onNavigate('collection', { weave: product.weaveKey })}
          className="hover:text-on-surface transition-colors"
        >
          {product.weave}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-on-surface font-medium truncate">{product.name}</span>
      </nav>

      {/* Main PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left 7 Columns: Gallery */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {galleryFrames.map((frame, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxImage({ src: frame.src, alt: frame.alt })}
              className={`${
                frame.span ? 'sm:col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
              } rounded-sm overflow-hidden bg-surface-sand group relative focus-visible:outline-2 focus-visible:outline-primary`}
            >
              <ResilientImage
                src={frame.src}
                alt={frame.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>

        {/* Right 5 Columns: Sticky Purchase Module */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-surface-white border border-outline-variant rounded-sm p-6 md:p-8 flex flex-col gap-6">
          <header className="flex flex-col gap-1.5 border-b border-outline-variant pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-label text-xs font-medium text-primary">{product.weave}</span>
              <span className="font-mono text-xs text-on-surface-muted">SKU: {product.sku}</span>
            </div>
            <h1 className="font-headline text-3xl md:text-[40px] md:leading-[46px] text-on-surface">
              {product.name}
            </h1>
            <p className="font-title text-xl font-medium text-on-surface tabular-nums mt-1">
              {formatINR(finalPrice)}
            </p>
            <p className="font-body text-sm text-on-surface-muted">
              Inclusive of all taxes · Ready to ship in 48 hours
            </p>
          </header>

          <p className="font-body text-base text-on-surface text-pretty leading-relaxed">
            {product.description}
          </p>

          {/* Shade Selector */}
          <div className="flex flex-col gap-2.5">
            <span className="font-label text-[13px] font-medium text-on-surface">
              Shade: <strong className="font-semibold">{selectedShade.name}</strong>
            </span>
            <div className="flex items-center gap-3">
              {product.shades.map((shade, idx) => {
                const active = idx === selectedShadeIndex;
                return (
                  <button
                    key={shade.name}
                    type="button"
                    onClick={() => setSelectedShadeIndex(idx)}
                    aria-label={shade.name}
                    aria-pressed={active}
                    style={{ backgroundColor: shade.hex }}
                    className={`w-8 h-8 rounded-full transition-all ${
                      active
                        ? 'ring-2 ring-offset-2 ring-on-surface'
                        : 'border border-outline hover:ring-1 hover:ring-on-surface'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Blouse & Finishing Configuration */}
          <div className="flex flex-col gap-2.5">
            <span className="font-label text-[13px] font-medium text-on-surface">
              Finishing &amp; Blouse
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFinishing('unstitched')}
                aria-pressed={finishing === 'unstitched'}
                className={`min-h-[44px] px-4 py-2 rounded-sm font-label text-xs font-medium text-left transition-colors ${
                  finishing === 'unstitched'
                    ? 'border border-on-surface bg-surface text-on-surface'
                    : 'border border-outline bg-surface-white text-on-surface-muted hover:border-on-surface'
                }`}
              >
                Unstitched Blouse
              </button>
              <button
                type="button"
                onClick={() => setFinishing('fall-pico')}
                aria-pressed={finishing === 'fall-pico'}
                className={`min-h-[44px] px-4 py-2 rounded-sm font-label text-xs font-medium text-left transition-colors ${
                  finishing === 'fall-pico'
                    ? 'border border-on-surface bg-surface text-on-surface'
                    : 'border border-outline bg-surface-white text-on-surface-muted hover:border-on-surface'
                }`}
              >
                Fall &amp; Pico (+₹1,500)
              </button>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-[18px] h-[18px]" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  <span>Add to Bag · {formatINR(finalPrice)}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={isWishlisted}
              className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                isWishlisted
                  ? 'border-primary bg-surface text-primary'
                  : 'border-outline bg-surface-white text-on-surface hover:border-on-surface hover:text-primary'
              }`}
            >
              <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Minimal Accordions */}
          <div className="border-t border-outline divide-y divide-outline">
            <details className="group py-3" open>
              <summary className="flex items-center justify-between cursor-pointer list-none min-h-[44px]">
                <span className="font-title text-base font-medium text-on-surface">
                  Weave &amp; Provenance
                </span>
                <Plus className="w-5 h-5 text-on-surface transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <div className="pt-2 pb-1">
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  {product.provenance}
                </p>
              </div>
            </details>

            <details className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none min-h-[44px]">
                <span className="font-title text-base font-medium text-on-surface">
                  Dimensions &amp; Drape
                </span>
                <Plus className="w-5 h-5 text-on-surface transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <div className="pt-2 pb-1">
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  {product.dimensions}
                </p>
              </div>
            </details>

            <details className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none min-h-[44px]">
                <span className="font-title text-base font-medium text-on-surface">
                  Care &amp; Preservation
                </span>
                <Plus className="w-5 h-5 text-on-surface transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <div className="pt-2 pb-1">
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  {product.care}
                </p>
              </div>
            </details>
          </div>
        </aside>
      </div>

      {/* Related Weaves */}
      <section className="mt-20 pt-14 border-t border-outline-variant">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-label text-xs font-medium text-primary">From the Archive</span>
            <h2 className="font-headline text-3xl text-on-surface mt-1">Companion Weaves</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('collection')}
            className="font-label text-sm font-medium text-on-surface border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors whitespace-nowrap"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-deep-ink/85 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image preview"
            className="absolute top-6 right-6 w-11 h-11 rounded-sm bg-surface-white text-on-surface flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-sm">
            <ResilientImage
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
