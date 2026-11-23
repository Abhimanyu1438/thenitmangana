import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CATEGORIES,
  CLIENT_REVIEWS,
  IMAGES,
  JOURNAL_ISSUES,
  PRODUCTS,
  WEAVE_LIBRARY,
  formatINR,
} from '../data/catalog';
import {
  SILK_EASE,
  VIEWPORT_ONCE,
  cardStaggerItemVariants,
  fadeUpVariants,
  staggerContainerVariants,
} from '../lib/motion';
import { PageRoute, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface HomeViewProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onNavigate: (
    route: PageRoute,
    opts?: { weave?: string; occasion?: string; issueId?: string }
  ) => void;
}

export function HomeView({
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  onNavigate,
}: HomeViewProps) {
  const newArrivalsRef = useRef<HTMLDivElement | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival);
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller);

  const scrollArrivals = (dir: number) => {
    if (newArrivalsRef.current) {
      newArrivalsRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribedEmail(newsletterEmail.trim());
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* 1. Cinematic Full-Screen Hero */}
      <section className="relative min-h-[540px] lg:min-h-[calc(100vh-98px)] lg:max-h-[760px] flex items-end bg-surface-dark overflow-hidden">
        <motion.div
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.25, ease: SILK_EASE }}
          className="absolute inset-0"
        >
          <ResilientImage
            src={IMAGES.heroCampaign}
            alt="Model draped in a sculptural terracotta and warm ivory handwoven tussar silk saree in a sunlit travertine courtyard"
            className="w-full h-full object-cover object-[center_12%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-ink/95 via-deep-ink/65 to-deep-ink/20" />
        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 md:px-8 pb-14 md:pb-16 pt-24 flex items-end justify-between gap-8">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl flex flex-col gap-4"
          >
            <motion.span
              variants={fadeUpVariants}
              className="font-label text-[13px] font-medium tracking-wide text-on-surface-dark"
            >
              Autumn–Winter 2026 Campaign
            </motion.span>
            <motion.h1
              variants={fadeUpVariants}
              className="font-display text-4xl sm:text-5xl lg:text-[72px] lg:leading-[78px] tracking-[-0.02em] text-on-surface-dark text-balance"
            >
              Woven for the Modern Silhouette
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="font-body text-base md:text-lg text-on-surface-dark/90 max-w-lg text-pretty leading-relaxed"
            >
              Architectural handloom sarees in raw Bhagalpur tussar, unbleached organza, and quiet Kanchipuram silk.
            </motion.p>
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('collection')}
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap shrink-0"
              >
                Explore New Arrivals
              </button>
              <a
                href="#craft-story"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-transparent text-on-surface-dark border border-on-surface-dark rounded-sm font-label text-sm font-medium hover:bg-on-surface-dark hover:text-surface-dark transition-colors whitespace-nowrap shrink-0"
              >
                Our Craft
              </a>
            </motion.div>
          </motion.div>

          <motion.a
            href="#curated-categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: SILK_EASE }}
            className="hidden lg:flex flex-col items-center gap-3 text-on-surface-dark/75 hover:text-on-surface-dark transition-colors pb-1 shrink-0"
          >
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Scroll</span>
            <span className="w-px h-10 bg-on-surface-dark/30 relative overflow-hidden">
              <motion.span
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-0 top-0 h-1/2 bg-accent"
              />
            </span>
          </motion.a>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section id="curated-categories" className="bg-surface-white py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="font-label text-xs font-medium text-primary">Curated Textiles</span>
              <h2 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface mt-1">
                Shop by Category
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('collection')}
              className="font-label text-sm font-medium text-on-surface border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors whitespace-nowrap shrink-0"
            >
              View All Weaves
            </button>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                variants={cardStaggerItemVariants}
                type="button"
                onClick={() => onNavigate('collection', { weave: cat.id })}
                className="group block text-left focus-visible:outline-2 focus-visible:outline-primary rounded-sm"
              >
                <div className="aspect-[3/4] rounded-sm overflow-hidden bg-surface-sand mb-3">
                  <ResilientImage
                    src={cat.image}
                    alt={cat.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="font-title text-lg md:text-xl font-medium text-on-surface group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="font-body text-sm text-on-surface-muted tabular-nums">
                  {cat.countLabel}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. New Arrivals Showcase */}
      <section id="new-arrivals" className="bg-surface py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="font-label text-xs font-medium text-primary">Season 04</span>
              <h2 className="font-display text-3xl md:text-[56px] md:leading-[62px] text-on-surface mt-1">
                New Arrivals
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollArrivals(-1)}
                aria-label="Previous products"
                className="w-11 h-11 rounded-sm border border-outline bg-surface-white flex items-center justify-center hover:border-on-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollArrivals(1)}
                aria-label="Next products"
                className="w-11 h-11 rounded-sm border border-outline bg-surface-white flex items-center justify-center hover:border-on-surface transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div
            ref={newArrivalsRef}
            className="grid grid-flow-col auto-cols-[75%] sm:auto-cols-[46%] lg:grid-flow-row lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory"
          >
            {newArrivals.map((product, idx) => (
              <div key={product.id} className="snap-start">
                <ProductCard
                  product={product}
                  revealIndex={idx % 4}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Asymmetrical Split-Screen Craft Story */}
      <section id="craft-story" className="bg-surface-sand text-on-surface-sand py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden bg-surface">
              <ResilientImage
                src={IMAGES.craftLoom}
                alt="Master weaver hands guiding raw silk warp threads on a wooden pit loom"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 flex flex-col gap-6 lg:pl-6"
          >
            <motion.span variants={fadeUpVariants} className="font-label text-xs font-medium text-primary">
              Atelier Provenance
            </motion.span>
            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-3xl md:text-[52px] md:leading-[58px] text-on-surface-sand text-balance"
            >
              Eighteen Days on a Pit Loom
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="font-body text-base md:text-lg text-on-surface-sand/90 text-pretty leading-relaxed"
            >
              We partner directly with 42 master weaving families across Bhagalpur, Phulia, and Kanchipuram. Every warp is hand-dressed in small batches using unbleached yarns and botanical dyes—madder root, iron-rich clay, and dried marigold.
            </motion.p>
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 gap-6 py-5 border-y border-on-surface-sand/20"
            >
              <div>
                <p className="font-headline text-3xl text-on-surface-sand tabular-nums">100%</p>
                <p className="font-body text-sm text-on-surface-muted mt-0.5">Hand-thrown shuttle</p>
              </div>
              <div>
                <p className="font-headline text-3xl text-on-surface-sand tabular-nums">Zero</p>
                <p className="font-body text-sm text-on-surface-muted mt-0.5">
                  Synthetic lustre finishes
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeUpVariants}>
              <button
                type="button"
                onClick={() => onNavigate('journal', { issueId: 'issue-09' })}
                className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 border border-on-surface-sand text-on-surface-sand rounded-sm font-label text-sm font-medium hover:bg-on-surface-sand hover:text-surface-sand transition-colors whitespace-nowrap"
              >
                Read the Craft Dossier
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Edge-to-Edge Campaign Image */}
      <section className="relative min-h-[480px] md:min-h-[600px] bg-surface-dark flex items-end overflow-hidden">
        <ResilientImage
          src={IMAGES.campaignEdgeToEdge}
          alt="Two models in ivory and walnut brown handloom sarees walking across a minimalist limestone pavilion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-ink/85 via-deep-ink/30 to-transparent" />
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="relative z-10 max-w-[1360px] w-full mx-auto px-5 md:px-8 py-12 md:py-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <span className="font-mono text-xs text-accent">
              Monograph 02 · Mandawa Pavilion Study
            </span>
            <h2 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface-dark mt-1">
              Architecture in Motion
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCampaignModalOpen(true)}
            className="self-start sm:self-auto font-label text-sm font-medium text-on-surface-dark border-b border-on-surface-dark pb-1 hover:text-accent hover:border-accent transition-colors whitespace-nowrap shrink-0"
          >
            View Campaign Film
          </button>
        </motion.div>
      </section>

      {/* 6. Shop by Occasion */}
      <section id="occasions" className="bg-surface-white py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mb-8"
          >
            <span className="font-label text-xs font-medium text-primary">Dressing Guide</span>
            <h2 className="font-display text-3xl md:text-[56px] md:leading-[62px] text-on-surface mt-1">
              Shop by Occasion
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.button
              variants={cardStaggerItemVariants}
              type="button"
              onClick={() => onNavigate('collection', { occasion: 'Daylight Ceremonies' })}
              className="group relative block aspect-[4/5] rounded-sm overflow-hidden bg-surface-dark text-left"
            >
              <ResilientImage
                src={IMAGES.occasionCeremony}
                alt="Intimate courtyard ceremony ivory and gold saree"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-ink/85 via-deep-ink/25 to-transparent p-8 flex flex-col justify-end">
                <span className="font-label text-xs font-medium text-on-surface-dark/85">
                  Daylight Ceremonies
                </span>
                <h3 className="font-headline text-2xl md:text-3xl text-on-surface-dark mt-1">
                  Intimate Gatherings &amp; Vows
                </h3>
              </div>
            </motion.button>

            <motion.button
              variants={cardStaggerItemVariants}
              type="button"
              onClick={() => onNavigate('collection', { occasion: 'Gallery Evenings' })}
              className="group relative block aspect-[4/5] rounded-sm overflow-hidden bg-surface-dark text-left"
            >
              <ResilientImage
                src={IMAGES.occasionEvening}
                alt="Contemporary evening reception deep ink silk saree"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-ink/85 via-deep-ink/25 to-transparent p-8 flex flex-col justify-end">
                <span className="font-label text-xs font-medium text-on-surface-dark/85">
                  After Dusk
                </span>
                <h3 className="font-headline text-2xl md:text-3xl text-on-surface-dark mt-1">
                  Gallery Evenings &amp; Receptions
                </h3>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 7. Shop by Weave (Material Library) */}
      <section id="weaves" className="bg-surface py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="font-label text-xs font-medium text-primary">Material Library</span>
              <h2 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface mt-1">
                Shop by Weave
              </h2>
            </div>
            <p className="font-body text-base text-on-surface-muted max-w-md md:text-right">
              Every textile is defined by its yarn twist, reed count, and tactile hand-feel.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {WEAVE_LIBRARY.map((w, idx) => (
              <motion.button
                key={w.key}
                variants={cardStaggerItemVariants}
                type="button"
                onClick={() => onNavigate('collection', { weave: w.key })}
                className="group block text-left bg-surface-white border border-outline-variant rounded-sm overflow-hidden focus-visible:outline-2 focus-visible:outline-primary hover:border-outline transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-surface-sand">
                  <ResilientImage
                    src={w.image}
                    alt={w.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6 border-t border-outline-variant">
                  <span className="font-mono text-xs text-accent block mb-1.5">
                    0{idx + 1}.
                  </span>
                  <h3 className="font-headline text-2xl text-on-surface group-hover:text-primary transition-colors">
                    {w.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-muted mt-1.5">{w.description}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. Full-Width Wedding Editorial */}
      <section id="wedding" className="bg-surface-dark text-on-surface-dark py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10"
          >
            <div className="lg:col-span-7">
              <span className="font-label text-xs font-medium text-accent">
                The Bridal Trousseau
              </span>
              <h2 className="font-display text-3xl md:text-[56px] md:leading-[62px] text-on-surface-dark mt-1 text-balance">
                A Quieter Language for Modern Weddings
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <p className="font-body text-base text-on-surface-dark/85 leading-relaxed">
                Heirloom Kanchipurams and ivory organzas stripped of heavy ornamentation—crafted to be re-worn for decades.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('collection', { occasion: 'Bridal Trousseau' })}
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                Explore Bridal Edit
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="aspect-[16/9] rounded-sm overflow-hidden"
          >
            <ResilientImage
              src={IMAGES.weddingEditorial}
              alt="Modern Indian wedding editorial on a sandstone terrace at dusk"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 9. House Icons / Bestseller Grid */}
      <section className="bg-surface-white py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="font-label text-xs font-medium text-primary">House Icons</span>
              <h2 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface mt-1">
                Most Requested Weaves
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('collection')}
              className="font-label text-sm font-medium text-on-surface border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors whitespace-nowrap shrink-0"
            >
              Shop Bestsellers
            </button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                revealIndex={idx % 4}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onSelectProduct={onSelectProduct}
                showInteractiveControls={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Private Styling Panel */}
      <section id="atelier" className="bg-surface py-16 md:py-24 border-t border-outline-variant">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            <motion.span variants={fadeUpVariants} className="font-label text-xs font-medium text-primary">
              Concierge Service
            </motion.span>
            <motion.h2
              variants={fadeUpVariants}
              className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface text-balance"
            >
              Private Styling &amp; Trousseau Consultations
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="font-body text-base text-on-surface-muted text-pretty leading-relaxed"
            >
              Meet with our textile archivists in Mumbai, Bengaluru, or via private video appointment for custom blouse tailoring, drape guidance, and bespoke dye commissions.
            </motion.p>
            <motion.div variants={fadeUpVariants}>
              <button
                type="button"
                onClick={() => onNavigate('styling')}
                className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                Book a Private Styling
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7"
          >
            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-surface-sand">
              <ResilientImage
                src={IMAGES.stylingAtelier}
                alt="Minimalist luxury fashion atelier with folded handwoven silk sarees on travertine table"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. Client Perspectives */}
      <section className="bg-surface-white py-16 md:py-24 border-t border-outline-variant">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <span className="font-label text-xs font-medium text-primary">Client Perspectives</span>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-on-surface tabular-nums">4.9</span>
              <span className="font-body text-sm text-on-surface-muted">
                from 318 verified clients
              </span>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              {[
                { label: '5 ★', pct: 92 },
                { label: '4 ★', pct: 7 },
                { label: '3 ★', pct: 1 },
              ].map((row, idx) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="font-label text-xs w-8 tabular-nums">{row.label}</span>
                  <div className="flex-1 h-1.5 bg-outline-variant rounded-xs overflow-hidden">
                    <div className="h-full" style={{ width: `${row.pct}%` }}>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={VIEWPORT_ONCE}
                        transition={{ duration: 0.75, delay: idx * 0.1, ease: SILK_EASE }}
                        className="h-full w-full bg-primary origin-left"
                      />
                    </div>
                  </div>
                  <span className="font-label text-xs text-on-surface-muted w-9 text-right tabular-nums">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {CLIENT_REVIEWS.map((rev) => (
              <motion.article
                key={rev.author}
                variants={cardStaggerItemVariants}
                className="bg-surface p-6 rounded-sm border border-outline-variant flex flex-col justify-between gap-6"
              >
                <p className="font-body text-base text-on-surface text-pretty leading-relaxed">
                  {rev.quote}
                </p>
                <div className="flex items-center gap-4">
                  <ResilientImage
                    src={rev.image}
                    alt={rev.alt}
                    className="w-12 h-12 rounded-sm object-cover shrink-0"
                  />
                  <div>
                    <p className="font-title text-base font-medium text-on-surface">{rev.author}</p>
                    <p className="font-body text-sm text-on-surface-muted">{rev.meta}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 12. Journal Stories */}
      <section id="journal" className="bg-surface py-16 md:py-24 border-t border-outline-variant">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="font-label text-xs font-medium text-primary">
                The Nitmagnaa Journal
              </span>
              <h2 className="font-headline text-3xl md:text-[44px] md:leading-[50px] text-on-surface mt-1">
                Field Notes &amp; Material Essays
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('journal', { issueId: 'issue-09' })}
              className="font-label text-sm font-medium text-on-surface border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors whitespace-nowrap shrink-0"
            >
              All Stories
            </button>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {JOURNAL_ISSUES.map((story, idx) => (
              <motion.article
                key={story.id}
                variants={cardStaggerItemVariants}
                className={`${
                  idx === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
                } bg-surface-white border border-outline-variant rounded-sm overflow-hidden flex flex-col group`}
              >
                <button
                  type="button"
                  onClick={() => onNavigate('journal', { issueId: story.id })}
                  className="text-left flex-1 flex flex-col focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <div
                    className={`${
                      idx === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                    } w-full overflow-hidden bg-surface-sand`}
                  >
                    <ResilientImage
                      src={story.heroImage}
                      alt={story.heroAlt}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col gap-2">
                    <span className="font-label text-xs font-medium text-primary">
                      {story.issueLabel}
                    </span>
                    <h3
                      className={`font-headline ${
                        idx === 0 ? 'text-2xl md:text-3xl' : 'text-2xl'
                      } text-on-surface group-hover:text-primary transition-colors`}
                    >
                      {story.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-on-surface-muted max-w-prose">
                      {story.subtitle}
                    </p>
                  </div>
                </button>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 13. Newsletter Module */}
      <section className="bg-surface-white py-16 border-t border-outline-variant">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-2xl mx-auto px-5 md:px-8 text-center flex flex-col items-center gap-4"
        >
          <span className="font-label text-xs font-medium text-primary">Private Dispatches</span>
          <h2 className="font-headline text-3xl text-on-surface">
            Receive Early Access to Loom Releases
          </h2>
          <p className="font-body text-base text-on-surface-muted">
            Seasonal lookbooks, limited-edition weave drops, and private trunk show invitations.
          </p>

          {subscribedEmail ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: SILK_EASE }}
              className="mt-2 px-6 py-4 bg-surface border border-outline rounded-sm flex items-center gap-3 text-left"
            >
              <Check className="w-5 h-5 text-primary shrink-0" />
              <p className="font-body text-sm text-on-surface">
                Added <span className="font-medium">{subscribedEmail}</span> to Private Dispatches.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="w-full flex flex-col sm:flex-row gap-3 mt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="flex-1 min-h-[48px] px-4 bg-surface border border-outline rounded-sm font-body text-base text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[48px] px-8 bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Monograph 02 Campaign Lookbook Modal */}
      <AnimatePresence>
        {campaignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-ink/75"
            onClick={() => setCampaignModalOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Monograph 02: Architecture in Motion"
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.32, ease: SILK_EASE }}
              className="bg-surface-dark text-on-surface-dark border border-outline/30 rounded-sm max-w-4xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-on-surface-dark/15">
                <div>
                  <span className="font-label text-xs text-accent">Monograph 02</span>
                  <h3 className="font-headline text-2xl text-on-surface-dark">
                    Architecture in Motion — Lookbook Study
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCampaignModalOpen(false)}
                  aria-label="Close lookbook"
                  className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-on-surface-dark/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 aspect-[16/10] md:aspect-auto md:h-[420px]">
                  <ResilientImage
                    src={IMAGES.campaignEdgeToEdge}
                    alt="Architecture in Motion Campaign"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <p className="font-body text-sm text-on-surface-dark/85 leading-relaxed">
                      Filmed on 16mm across a sunlit limestone pavilion in Mandawa, Monograph 02 studies how unbleached tussar and three-ply Kanchipuram respond to wind, shadow, and unhurried movement.
                    </p>
                    <p className="font-mono text-xs text-on-surface-dark/60">
                      Featured pieces: Ira Raw Tussar ({formatINR(42000)}) · Meera Mulberry Zari (
                      {formatINR(68500)})
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCampaignModalOpen(false);
                        onSelectProduct('ira-raw-tussar');
                      }}
                      className="w-full min-h-[44px] bg-primary text-on-primary rounded-sm font-label text-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                      Inspect Ira Raw Tussar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCampaignModalOpen(false);
                        onNavigate('collection');
                      }}
                      className="w-full min-h-[44px] border border-on-surface-dark/40 text-on-surface-dark rounded-sm font-label text-sm font-medium hover:bg-on-surface-dark hover:text-surface-dark transition-colors"
                    >
                      Shop the Autumn–Winter Edit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
