import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatINR } from '../data/catalog';
import {
  PRODUCT_CARD_VIEWPORT,
  getProductCardRevealVariants,
} from '../lib/motion';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  showInteractiveControls?: boolean;
  revealIndex?: number;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  showInteractiveControls = true,
  revealIndex = 0,
}: ProductCardProps) {
  const [loadBackImage, setLoadBackImage] = useState(false);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const activeShade = product.shades[selectedShadeIndex] || product.shades[0];
  const revealVariants = getProductCardRevealVariants(revealIndex);

  return (
    <motion.article
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={PRODUCT_CARD_VIEWPORT}
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
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-0"
          />
          {loadBackImage && (
            <ResilientImage
              src={product.backImage}
              alt={`${product.name} pallu detail`}
              revealOnLoad={false}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
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
            className={`absolute top-2.5 right-2.5 w-11 h-11 rounded-full bg-surface-white/95 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              isWishlisted ? 'text-primary' : 'text-on-surface hover:text-primary'
            }`}
          >
            <motion.span
              key={isWishlisted ? 'saved' : 'unsaved'}
              initial={{ scale: 0.78 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
              className="inline-flex items-center justify-center"
            >
              <Heart className="w-[18px] h-[18px]" fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.span>
          </button>
        )}

        {showInteractiveControls && (
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 ease-out">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              className="w-full min-h-[44px] bg-surface-white/95 text-on-surface border border-outline rounded-sm font-label text-[13px] font-medium hover:bg-primary hover:text-on-primary hover:border-primary transition-colors whitespace-nowrap shrink-0"
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
        <footer className="mt-2.5 flex items-center gap-2 min-h-[20px]">
          <div className="flex items-center gap-2" role="group" aria-label={`Available shades for ${product.name}`}>
            {product.shades.map((shade, idx) => {
              const selected = idx === selectedShadeIndex;
              return (
                <button
                  key={shade.name}
                  type="button"
                  onClick={() => setSelectedShadeIndex(idx)}
                  aria-label={`Preview ${shade.name} shade`}
                  aria-pressed={selected}
                  title={shade.name}
                  style={{ backgroundColor: shade.hex }}
                  className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 ${
                    selected
                      ? 'ring-1 ring-offset-2 ring-on-surface scale-110'
                      : 'border border-outline hover:scale-110'
                  }`}
                />
              );
            })}
          </div>
          {activeShade && (
            <span className="font-label text-[11px] text-on-surface-muted truncate ml-1">
              · {activeShade.name}
            </span>
          )}
        </footer>
      )}
    </motion.article>
  );
}
