import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { JOURNAL_ISSUES, PRODUCTS, formatINR } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectJournal: (issueId: string) => void;
  onViewAllResults: (query: string) => void;
}

export function SearchOverlay({
  open,
  onClose,
  onSelectProduct,
  onSelectJournal,
  onViewAllResults,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.weave.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.shades.some((s) => s.name.toLowerCase().includes(q)) ||
        p.occasions.some((o) => o.toLowerCase().includes(q))
    );
  }, [query]);

  const matchedStories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOURNAL_ISSUES;
    return JOURNAL_ISSUES.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.issueLabel.toLowerCase().includes(q) ||
        j.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4">
      <div className="fixed inset-0 bg-deep-ink/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search The Nitmagnaa Weaves"
        className="relative z-10 bg-surface-white text-on-surface border border-outline rounded-sm w-full max-w-3xl p-6 md:p-8 shadow-xl max-h-[80vh] overflow-y-auto"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            onViewAllResults(query);
          }}
          className="flex items-center gap-3 pb-4 border-b border-outline-variant"
        >
          <Search className="w-5 h-5 text-on-surface-muted shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by weave (tussar, jamdani), shade (terracotta, ivory), or piece..."
            aria-label="Search weaves and pieces"
            className="flex-1 bg-transparent font-body text-base text-on-surface placeholder:text-on-surface-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="pt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-label text-xs font-medium text-primary">
                {query.trim() ? `Weaves (${matchedProducts.length})` : 'Curated Pieces'}
              </span>
              {query.trim() && matchedProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewAllResults(query);
                  }}
                  className="inline-flex items-center gap-1 font-label text-xs font-medium text-on-surface hover:text-primary"
                >
                  View in Collection <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {matchedProducts.length === 0 ? (
              <p className="font-body text-sm text-on-surface-muted py-4">
                No pieces matched “{query}”. Try “Tussar”, “Kanchipuram”, “Jamdani”, or “Ivory”.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedProducts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(p.id);
                    }}
                    className="flex items-center gap-3 p-2 rounded-sm hover:bg-surface transition-colors text-left"
                  >
                    <ResilientImage
                      src={p.frontImage}
                      alt={p.name}
                      className="w-16 h-20 object-cover rounded-xs bg-surface-sand shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-title text-sm font-medium text-on-surface truncate">
                        {p.name}
                      </p>
                      <p className="font-body text-xs text-on-surface-muted truncate">
                        {p.subtitle}
                      </p>
                      <p className="font-title text-sm font-medium text-on-surface tabular-nums mt-1">
                        {formatINR(p.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {matchedStories.length > 0 && (
            <div className="pt-4 border-t border-outline-variant">
              <span className="block font-label text-xs font-medium text-primary mb-3">
                Journal Essays
              </span>
              <div className="space-y-2">
                {matchedStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectJournal(story.id);
                    }}
                    className="w-full text-left p-2.5 rounded-sm hover:bg-surface transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-label text-xs text-primary">{story.issueLabel}</p>
                      <p className="font-headline text-base text-on-surface truncate">
                        {story.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-on-surface-muted shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
