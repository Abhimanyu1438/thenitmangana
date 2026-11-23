import { JournalIssue, OccasionKey, OrderRecord, PaletteKey, Product, WeaveKey } from '../types';

export const IMAGES = {
  logo: '/assets/aistudio/weave_macro_texture_1795446721352.jpg',
  heroCampaign: '/assets/aistudio/hero_courtyard_1795446721539.jpg',
  catTussar: '/assets/aistudio/tussar_terracotta_1795446721642.jpg',
  catKanchipuram: '/assets/aistudio/kanchipuram_walnut_1795446721917.jpg',
  catOrganza: '/assets/aistudio/jamdani_ivory_1795446723811.jpg',
  catChanderi: '/assets/aistudio/chanderi_olive_1795446722876.jpg',
  iraFront: '/assets/aistudio/tussar_terracotta_1795446721642.jpg',
  iraBack: '/assets/aistudio/pit_loom_craft_1795446721419.jpg',
  meeraFront: '/assets/aistudio/kanchipuram_walnut_1795446721917.jpg',
  meeraBack: '/assets/aistudio/weave_macro_texture_1795446721352.jpg',
  kavyaFront: '/assets/aistudio/jamdani_ivory_1795446723811.jpg',
  kavyaBack: '/assets/aistudio/pit_loom_craft_1795446721419.jpg',
  taraFront: '/assets/aistudio/chanderi_olive_1795446722876.jpg',
  taraBack: '/assets/aistudio/weave_macro_texture_1795446721352.jpg',
  craftLoom: '/assets/aistudio/pit_loom_craft_1795446721419.jpg',
  campaignEdgeToEdge: '/assets/aistudio/pavilion_motion_1795446720878.jpg',
  occasionCeremony: '/assets/aistudio/jamdani_ivory_1795446723811.jpg',
  occasionEvening: '/assets/aistudio/kanchipuram_walnut_1795446721917.jpg',
  textureTussar: '/assets/aistudio/weave_macro_texture_1795446721352.jpg',
  textureJamdani: '/assets/aistudio/jamdani_ivory_1795446723811.jpg',
  textureKanchi: '/assets/aistudio/kanchipuram_walnut_1795446721917.jpg',
  weddingEditorial: '/assets/aistudio/pavilion_motion_1795446720878.jpg',
  stylingAtelier: '/assets/aistudio/atelier_botanical_studio_1795446721593.jpg',
  journal1: '/assets/aistudio/atelier_botanical_studio_1795446721593.jpg',
  journal2: '/assets/aistudio/pavilion_motion_1795446720878.jpg',
} as const;

export const CATEGORIES: {
  id: WeaveKey;
  title: string;
  countLabel: string;
  image: string;
  alt: string;
}[] = [
  {
    id: 'tussar',
    title: 'Raw Tussar',
    countLabel: '18 Pieces',
    image: IMAGES.catTussar,
    alt: 'Handspun Bhagalpur Raw Tussar weave',
  },
  {
    id: 'kanchipuram',
    title: 'Kanchipuram',
    countLabel: '14 Pieces',
    image: IMAGES.catKanchipuram,
    alt: 'Contemporary Kanchipuram Mulberry Silk',
  },
  {
    id: 'organza',
    title: 'Silk Organza',
    countLabel: '11 Pieces',
    image: IMAGES.catOrganza,
    alt: 'Handwoven unbleached Silk Organza',
  },
  {
    id: 'chanderi',
    title: 'Chanderi',
    countLabel: '9 Pieces',
    image: IMAGES.catChanderi,
    alt: 'Chanderi Linen and Silk-Cotton weave',
  },
];

export const WEAVE_FILTERS: { key: WeaveKey; label: string }[] = [
  { key: 'tussar', label: 'Bhagalpur Tussar' },
  { key: 'kanchipuram', label: 'Kanchipuram Silk' },
  { key: 'jamdani', label: 'Dhakai Jamdani' },
  { key: 'chanderi', label: 'Chanderi Linen-Silk' },
  { key: 'organza', label: 'Silk Organza' },
];

export const PALETTE_FILTERS: { key: PaletteKey; hex: string }[] = [
  { key: 'Terracotta', hex: '#7A4631' },
  { key: 'Ivory', hex: '#DCCBB5' },
  { key: 'Ink', hex: '#241814' },
  { key: 'Olive', hex: '#686B55' },
  { key: 'Walnut', hex: '#4A2F20' },
];

export const OCCASION_FILTERS: OccasionKey[] = [
  'Daylight Ceremonies',
  'Gallery Evenings',
  'Bridal Trousseau',
];

export const PRODUCTS: Product[] = [
  {
    id: 'ira-raw-tussar',
    sku: 'NMW-TS-042',
    name: 'Ira Raw Tussar Saree',
    subtitle: 'Handspun Bhagalpur Tussar',
    weave: 'Bhagalpur Tussar',
    weaveKey: 'tussar',
    price: 42000,
    tag: 'New Arrival',
    shades: [
      { name: 'Terracotta Clay', palette: 'Terracotta', hex: '#7A4631' },
      { name: 'Natural Ivory', palette: 'Ivory', hex: '#DCCBB5' },
      { name: 'Muted Olive', palette: 'Olive', hex: '#686B55' },
    ],
    occasions: ['Daylight Ceremonies', 'Gallery Evenings'],
    frontImage: IMAGES.iraFront,
    backImage: IMAGES.iraBack,
    textureImage: IMAGES.textureTussar,
    description:
      'Handwoven from wild Bhagalpur tussar cocoons and dyed in madder-root terracotta. Designed with an architectural unbleached selvedge and fluid, structured fall.',
    provenance:
      '100% handspun wild tussar silk woven by master artisans in Nathnagar, Bhagalpur over 14 days on a wooden pit loom.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Store folded in the accompanying unbleached muslin bag away from direct light.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'meera-mulberry-zari',
    sku: 'NMW-KN-018',
    name: 'Meera Mulberry Zari',
    subtitle: 'Kanchipuram Pure Silk',
    weave: 'Kanchipuram Silk',
    weaveKey: 'kanchipuram',
    price: 68500,
    tag: 'Limited Loom',
    shades: [
      { name: 'Deep Ink', palette: 'Ink', hex: '#241814' },
      { name: 'Walnut Brown', palette: 'Walnut', hex: '#4A2F20' },
    ],
    occasions: ['Gallery Evenings', 'Bridal Trousseau'],
    frontImage: IMAGES.meeraFront,
    backImage: IMAGES.meeraBack,
    textureImage: IMAGES.textureKanchi,
    description:
      'Three-ply twisted Kanchipuram mulberry silk anchored with understated antique silver-dipped zari korvai borders. Weighty, luminous, and free of metallic glare.',
    provenance:
      'Handwoven over 22 days by a third-generation korvai loom family in Kanchipuram using pure mulberry yarn and tested zari.',
    dimensions: 'Saree length: 5.5 metres · Width: 46 inches · Unstitched contrast blouse: 0.9 metres.',
    care: 'Dry clean only. Refold every four months to preserve crease geometry.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'kavya-ivory-jamdani',
    sku: 'NMW-JM-009',
    name: 'Kavya Ivory Jamdani',
    subtitle: '100-Count Cotton-Silk',
    weave: 'Dhakai Jamdani',
    weaveKey: 'jamdani',
    price: 54000,
    shades: [
      { name: 'Warm Ivory', palette: 'Ivory', hex: '#DCCBB5' },
      { name: 'Antique Gold', palette: 'Walnut', hex: '#B38A5D' },
    ],
    occasions: ['Daylight Ceremonies', 'Bridal Trousseau'],
    frontImage: IMAGES.kavyaFront,
    backImage: IMAGES.kavyaBack,
    textureImage: IMAGES.textureJamdani,
    description:
      'Featherlight 100-count cotton-silk jamdani with discontinuous supplementary weft geometric buttis hand-inserted by two weavers working in tandem.',
    provenance:
      'Woven in Phulia, West Bengal over 28 days without mechanical jacquard cards—each motif laid thread by thread by hand.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Includes 0.9m unbleached cotton-silk blouse.',
    care: 'Specialist dry clean or gentle cold hand soak with pH-neutral soap; steam press on reverse.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'tara-olive-linen-silk',
    sku: 'NMW-CH-027',
    name: 'Tara Olive Linen-Silk',
    subtitle: 'Handloom Chanderi',
    weave: 'Chanderi Linen-Silk',
    weaveKey: 'chanderi',
    price: 36500,
    shades: [
      { name: 'Muted Olive', palette: 'Olive', hex: '#686B55' },
      { name: 'Terracotta Clay', palette: 'Terracotta', hex: '#7A4631' },
    ],
    occasions: ['Daylight Ceremonies', 'Gallery Evenings'],
    frontImage: IMAGES.taraFront,
    backImage: IMAGES.taraBack,
    textureImage: IMAGES.catChanderi,
    description:
      'Crisp Chanderi silk warp interlaced with hand-reeled linen weft, botanically dyed in myrobalan and iron water for a cool sage-olive cast.',
    provenance:
      'Crafted on traditional throw-shuttle looms in Chanderi, Madhya Pradesh with an ultra-fine hairline temple border.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean recommended. Air out in shade after wear.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'veda-unbleached-tussar',
    sku: 'NMW-TS-051',
    name: 'Veda Unbleached Tussar',
    subtitle: 'Bhagalpur Tussar',
    weave: 'Bhagalpur Tussar',
    weaveKey: 'tussar',
    price: 39000,
    shades: [
      { name: 'Unbleached Sand', palette: 'Ivory', hex: '#DCCBB5' },
    ],
    occasions: ['Daylight Ceremonies'],
    frontImage: IMAGES.catTussar,
    backImage: IMAGES.textureTussar,
    textureImage: IMAGES.textureTussar,
    description:
      'Pure undyed wild tussar yarn celebrating the natural warm honey and oat slub of raw silk cocoons, finished with hand-knotted tassels.',
    provenance:
      'Spun and woven entirely in Bhagalpur without bleaching agents or chemical softeners.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Avoid direct steam on raw slubs.',
  },
  {
    id: 'nila-walnut-kanchipuram',
    sku: 'NMW-KN-033',
    name: 'Nila Walnut Kanchipuram',
    subtitle: 'Kanchipuram Silk',
    weave: 'Kanchipuram Silk',
    weaveKey: 'kanchipuram',
    price: 74000,
    tag: 'Bridal Edit',
    shades: [
      { name: 'Walnut Bark', palette: 'Walnut', hex: '#4A2F20' },
      { name: 'Antique Gold', palette: 'Ivory', hex: '#B38A5D' },
    ],
    occasions: ['Bridal Trousseau', 'Gallery Evenings'],
    frontImage: IMAGES.catKanchipuram,
    backImage: IMAGES.textureKanchi,
    textureImage: IMAGES.textureKanchi,
    description:
      'An heirloom bridal Kanchipuram in deep roasted walnut and burnished antique gold, stripped of heavy motifs for architectural purity.',
    provenance:
      'Handwoven in Kanchipuram using double-twisted mulberry silk dyed in pomegranate rind and black catechu.',
    dimensions: 'Saree length: 5.5 metres · Width: 46 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Store wrapped in pure cotton muslin.',
  },
  {
    id: 'rhea-ivory-organza',
    sku: 'NMW-OR-012',
    name: 'Rhea Unbleached Organza',
    subtitle: 'Handwoven Silk Organza',
    weave: 'Silk Organza',
    weaveKey: 'organza',
    price: 46000,
    tag: 'Bridal Edit',
    shades: [
      { name: 'Warm Ivory', palette: 'Ivory', hex: '#DCCBB5' },
    ],
    occasions: ['Daylight Ceremonies', 'Bridal Trousseau'],
    frontImage: IMAGES.catOrganza,
    backImage: IMAGES.occasionCeremony,
    textureImage: IMAGES.textureJamdani,
    description:
      'Translucent, sculptural pure silk organza with a crisp matte finish and tonal hand-embroidered selvedge, tailored for sunlit ceremonies.',
    provenance:
      'Woven from high-twist degummed kora silk yarns on narrow-width handlooms in Varanasi.',
    dimensions: 'Saree length: 5.5 metres · Width: 44 inches · Raw silk camisole blouse piece: 0.9 metres.',
    care: 'Dry clean only. Hang on padded hanger or roll around acid-free tissue.',
  },
];

export const WEAVE_LIBRARY: {
  key: WeaveKey;
  title: string;
  description: string;
  image: string;
  alt: string;
}[] = [
  {
    key: 'tussar',
    title: 'Bhagalpur Tussar',
    description: 'Organic slubs, matte golden undertone, structured drape.',
    image: IMAGES.textureTussar,
    alt: 'Macro texture of raw Bhagalpur tussar silk',
  },
  {
    key: 'jamdani',
    title: 'Dhakai Jamdani',
    description: 'Featherlight supplementary weft motifs woven by hand.',
    image: IMAGES.textureJamdani,
    alt: 'Macro texture of fine ivory Jamdani handloom',
  },
  {
    key: 'kanchipuram',
    title: 'Kanchipuram Mulberry',
    description: 'Three-ply twisted mulberry silk with pure silver-dipped zari.',
    image: IMAGES.textureKanchi,
    alt: 'Macro texture of walnut mulberry Kanchipuram silk',
  },
];

export const JOURNAL_ISSUES: JournalIssue[] = [
  {
    id: 'issue-09',
    issueLabel: 'Issue 09 · Natural Dyeing',
    title: 'Madder, Pomegranate & Iron Water: Color Without Synthetics',
    subtitle:
      'How our dye house achieves deep terracotta and muted walnut tones using mineral-rich river water and fermented botanicals.',
    byline: 'By Meenakshi Verma · Photographed in Bhagalpur · 6 min read',
    heroImage: IMAGES.journal1,
    heroAlt: 'Botanical dye vats, madder root, and raw silk skeins',
    lead:
      'Before a single shuttle crosses the warp on our Bhagalpur looms, the raw tussar yarn spends four days in copper and clay vats steeped with dried Rubia cordifolia roots, crushed pomegranate rinds, and fermented jaggery-iron liquor.',
    paragraphs: [
      'Unlike synthetic reactive dyes that coat fiber in a uniform, flat film, botanical pigments bond unevenly with the natural sericin in wild silk. The result is our signature Terracotta Clay—a living hue that shifts between warm rust in noon sunlight and deep walnut in evening rooms.',
    ],
    quote: '“Botanical color never shouts. It settles into the grain of the yarn and ages with the wearer.”',
    galleryImages: [
      { src: IMAGES.journal2, alt: 'Sunlit weaving studio' },
      { src: IMAGES.textureTussar, alt: 'Macro texture of raw tussar silk' },
    ],
    closingParagraph:
      'Every dye bath is exhausted and neutralized before returning to the garden beds surrounding our partner workshops, keeping the river basin clean for the next generation of weavers.',
    featuredProductIds: ['ira-raw-tussar', 'tara-olive-linen-silk', 'kavya-ivory-jamdani'],
  },
  {
    id: 'issue-08',
    issueLabel: 'Issue 08 · Architecture',
    title: 'Light, Shadow, and the Unbleached Selvedge',
    subtitle: 'A photographic study of weaver workshops in West Bengal at four in the afternoon.',
    byline: 'By Arvind Subramanian · Photographed in Phulia · 5 min read',
    heroImage: IMAGES.journal2,
    heroAlt: 'Sunlit handloom weaving studio in West Bengal',
    lead:
      'At four in the afternoon, low western light cuts through lime-washed brick louvers in Phulia, illuminating thousands of suspended 100-count cotton-silk warp threads like architectural drafting lines.',
    paragraphs: [
      'In a pit loom studio, humidity and temperature live inside the earth below the weaver’s feet. Rather than forcing brittle unbleached yarns through industrial air-conditioned halls, the damp clay pit keeps each delicate weft pliable without synthetic sizing.',
    ],
    quote: '“An unbleached selvedge carries the exact tension of the afternoon light in which it was thrown.”',
    galleryImages: [
      { src: IMAGES.craftLoom, alt: 'Weaver hands dressing raw silk warp threads' },
      { src: IMAGES.textureJamdani, alt: 'Fine ivory Dhakai Jamdani weave structure' },
    ],
    closingParagraph:
      'When you hold a Kavya Jamdani up to a window, the space between threads matters as much as the yarn itself—precision measured by touch, patience, and inherited rhythm.',
    featuredProductIds: ['kavya-ivory-jamdani', 'meera-mulberry-zari', 'nila-walnut-kanchipuram'],
  },
];

export const CLIENT_REVIEWS = [
  {
    quote:
      '“The Ira Raw Tussar drapes like liquid architecture. No stiffness, no loud shine—just extraordinary handspun texture that drew quiet compliments all evening.”',
    author: 'Ananya R.',
    meta: 'Mumbai · Verified Buyer',
    image: IMAGES.catTussar,
    alt: 'Client Ananya R. wearing Ira Raw Tussar',
  },
  {
    quote:
      '“I wore the Kavya Ivory Jamdani for my afternoon wedding registry. The 100-count cotton-silk felt weightless even in warm coastal weather.”',
    author: 'Devika M.',
    meta: 'London · Verified Buyer',
    image: IMAGES.catOrganza,
    alt: 'Client Devika M. wearing Kavya Ivory Jamdani',
  },
];

export const SAMPLE_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'NMW-1042',
    placedAt: '19 November 2026',
    customerName: 'Ananya Rao',
    email: 'ananya.rao@studio.in',
    address: '14 Carmichael Road, Malabar Hill',
    city: 'Mumbai',
    pinCode: '400026',
    paymentMethod: 'Card / NetBanking / UPI',
    items: [
      {
        key: 'ira-raw-tussar::Terracotta Clay::fall-pico',
        productId: 'ira-raw-tussar',
        name: 'Ira Raw Tussar Saree',
        subtitle: 'Handspun Bhagalpur Tussar',
        sku: 'NMW-TS-042',
        image: IMAGES.iraFront,
        shadeName: 'Terracotta Clay',
        finishing: 'fall-pico',
        unitPrice: 43500,
        quantity: 1,
      },
    ],
    subtotal: 43500,
    discount: 0,
    total: 43500,
    statusStep: 3,
    courier: 'Blue Dart Insured Air',
    trackingNumber: 'BD-88412094IN',
    estimatedDelivery: '24 November 2026',
  },
];

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
