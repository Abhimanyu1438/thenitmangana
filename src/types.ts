export type PageRoute =
  | 'home'
  | 'collection'
  | 'product'
  | 'checkout'
  | 'styling'
  | 'journal'
  | 'tracking';

export type WeaveKey = 'tussar' | 'kanchipuram' | 'jamdani' | 'chanderi' | 'organza';

export type PaletteKey = 'Terracotta' | 'Ivory' | 'Ink' | 'Olive' | 'Walnut';

export type OccasionKey = 'Daylight Ceremonies' | 'Gallery Evenings' | 'Bridal Trousseau';

export interface ProductShade {
  name: string;
  palette: PaletteKey;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  weave: string;
  weaveKey: WeaveKey;
  price: number;
  tag?: string;
  shades: ProductShade[];
  occasions: OccasionKey[];
  frontImage: string;
  backImage: string;
  textureImage: string;
  description: string;
  provenance: string;
  dimensions: string;
  care: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export type FinishingOption = 'unstitched' | 'fall-pico';

export interface BagItem {
  key: string;
  productId: string;
  name: string;
  subtitle: string;
  sku: string;
  image: string;
  shadeName: string;
  finishing: FinishingOption;
  unitPrice: number;
  quantity: number;
}

export interface JournalIssue {
  id: string;
  issueLabel: string;
  title: string;
  subtitle: string;
  byline: string;
  heroImage: string;
  heroAlt: string;
  lead: string;
  paragraphs: string[];
  quote: string;
  galleryImages: { src: string; alt: string }[];
  closingParagraph: string;
  featuredProductIds: string[];
}

export type OrderStatusStep = 1 | 2 | 3 | 4;

export interface OrderRecord {
  orderNumber: string;
  placedAt: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  paymentMethod: string;
  items: BagItem[];
  subtotal: number;
  discount: number;
  total: number;
  statusStep: OrderStatusStep;
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface StylingAppointment {
  referenceId: string;
  format: 'Mumbai' | 'Bengaluru' | 'Video Call';
  focus: string;
  date: string;
  time: string;
  name: string;
  email: string;
  notes: string;
}
