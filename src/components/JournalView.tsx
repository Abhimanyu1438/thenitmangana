import { AnimatePresence, motion } from 'motion/react';
import { JOURNAL_ISSUES, PRODUCTS } from '../data/catalog';
import { SILK_EASE } from '../lib/motion';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface JournalViewProps {
  activeIssueId: string;
  wishlistIds: string[];
  onSelectIssue: (issueId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
}

export function JournalView({
  activeIssueId,
  wishlistIds,
  onSelectIssue,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
}: JournalViewProps) {
  const issue =
    JOURNAL_ISSUES.find((item) => item.id === activeIssueId) || JOURNAL_ISSUES[0];

  const featuredProducts = issue.featuredProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div>
      {/* Issue Switcher Bar */}
      <div className="bg-surface-white border-b border-outline-variant">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <span className="font-label text-xs font-medium text-on-surface-muted">
            The Nitmagnaa Journal · Field Notes &amp; Material Essays
          </span>
          <div className="flex items-center gap-2">
            {JOURNAL_ISSUES.map((j) => {
              const active = j.id === issue.id;
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => onSelectIssue(j.id)}
                  aria-pressed={active}
                  className={`relative px-3.5 py-2 rounded-sm font-label text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-on-surface-walnut'
                      : 'bg-surface text-on-surface-muted hover:text-on-surface'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="journal-issue-active"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 bg-surface-walnut rounded-sm"
                    />
                  )}
                  <span className="relative z-10">{j.issueLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editorial Article */}
      <AnimatePresence mode="wait">
        <motion.article
          key={issue.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: SILK_EASE }}
        >
        <header className="max-w-4xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-8 text-center flex flex-col items-center gap-4">
          <span className="font-label text-[13px] font-medium text-primary">
            {issue.issueLabel}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-[54px] md:leading-[60px] text-on-surface text-balance">
            {issue.title}
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-muted">{issue.byline}</p>
        </header>

        <div className="max-w-[1360px] mx-auto px-5 md:px-8 mb-12 md:mb-16">
          <div className="aspect-[16/9] rounded-sm overflow-hidden bg-surface-sand">
            <ResilientImage
              src={issue.heroImage}
              alt={issue.heroAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="max-w-prose mx-auto px-5 md:px-8 flex flex-col gap-6 mb-16">
          <p className="font-body text-lg text-on-surface text-pretty leading-relaxed">
            {issue.lead}
          </p>

          {issue.paragraphs.map((para) => (
            <p
              key={para}
              className="font-body text-base text-on-surface-muted text-pretty leading-relaxed"
            >
              {para}
            </p>
          ))}

          <blockquote className="border-y border-outline py-6 my-2 text-center">
            <p className="font-headline text-2xl text-on-surface italic leading-snug">
              {issue.quote}
            </p>
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            {issue.galleryImages.map((img) => (
              <div key={img.alt} className="aspect-[4/3] rounded-sm overflow-hidden bg-surface-sand">
                <ResilientImage
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <p className="font-body text-base text-on-surface-muted text-pretty leading-relaxed">
            {issue.closingParagraph}
          </p>
        </div>
        </motion.article>
      </AnimatePresence>

      {/* Featured Weaves From Essay */}
      <section className="bg-surface-white py-14 md:py-16 border-t border-outline-variant">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <h2 className="font-headline text-3xl text-on-surface mb-8">Featured in This Essay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                revealIndex={idx % 3}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
