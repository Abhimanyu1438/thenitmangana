import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  showInteractiveControls?: boolean;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  showInteractiveControls = true,
}: ProductCardProps) {
  const [loadBackImage, setLoadBackImage] = useState(false);

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setLoadBackImage(true)}
      onFocus={() => setLoadBackImage(true)}
      onTouchStart={() => setLoadBackImage(true)}
    >
      <div className="relative aspect-[3/4] bg-surface-sand rounded-sm overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          aria-label={`View ${product.name}`}
          className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ResilientImage
            src={product.frontImage}
            alt={`${product.name} front drape`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          {loadBackImage && (
            <ResilientImage
              src={product.backImage}
              alt={`${product.name} pallu detail`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </button>

        {showInteractiveControls && product.tag && (
          <span className="pointer-events-none absolute top-4 left-4 bg-surface-white text-on-surface px-2 py-1 rounded-xs font-label text-xs font-medium">
            {product.tag}
          </span>
        )}

        {showInteractiveControls && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={
              isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            className={`absolute top-2.5 right-2.5 w-11 h-11 rounded-full bg-surface-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              isWishlisted ? 'text-primary' : 'text-on-surface hover:text-primary'
            }`}
          >
            <Heart className="w-[18px] h-[18px]" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}

        {showInteractiveControls && (
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              className="w-full min-h-[44px] bg-surface-white text-on-surface border border-outline rounded-sm font-label text-[13px] font-medium hover:bg-primary hover:text-on-primary hover:border-primary transition-colors whitespace-nowrap shrink-0"
            >
              Quick Add
            </button>
          </div>
        )}
      </div>

      <header className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="text-left min-w-0 group/title focus-visible:outline-2 focus-visible:outline-primary rounded-xs"
        >
          <h3 className="font-title text-base font-medium text-on-surface group-hover/title:text-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="font-body text-sm text-on-surface-muted truncate">{product.subtitle}</p>
        </button>
        <span className="font-title text-base font-medium text-on-surface tabular-nums shrink-0">
          {formatINR(product.price)}
        </span>
      </header>

      {showInteractiveControls && (
        <footer className="mt-2 flex items-center gap-2">
          {product.shades.map((shade, idx) => (
            <span
              key={shade.name}
              title={shade.name}
              style={{ backgroundColor: shade.hex }}
              className={`w-3.5 h-3.5 rounded-full border ${
                idx === 0 ? 'border-on-surface' : 'border-outline'
              }`}
            />
          ))}
        </footer>
      )}
    </article>
  );
}
