export const ATELIER_WHATSAPP_NUMBER = '919820144120';
export const ATELIER_WHATSAPP_DISPLAY = '+91 98201 44120';

export interface OrderQueryOption {
  id: string;
  label: string;
  summary: string;
  template: (orderNumber: string) => string;
}

export const ORDER_QUERY_OPTIONS: OrderQueryOption[] = [
  {
    id: 'delivery-status',
    label: 'Delivery & Courier Tracking Update',
    summary: 'Check live courier movement, airway bill status, or estimated arrival date.',
    template: (orderNumber) =>
      `I would like a live dispatch and courier tracking update for Order #${orderNumber}.`,
  },
  {
    id: 'address-change',
    label: 'Update Delivery Address or Slot',
    summary: 'Request an address correction or preferred delivery timing before handoff.',
    template: (orderNumber) =>
      `I need assistance updating the delivery address or preferred delivery slot for Order #${orderNumber}.`,
  },
  {
    id: 'finishing-blouse',
    label: 'Fall, Pico & Blouse Inquiry',
    summary: 'Ask about hand-rolled Fall & Pico finishing timelines or unstitched blouse fabric.',
    template: (orderNumber) =>
      `I have a question regarding Fall & Pico finishing or the blouse piece in Order #${orderNumber}.`,
  },
  {
    id: 'exchange-quality',
    label: 'Return, Exchange or Weave Inspection',
    summary: 'Initiate an atelier exchange within 14 days or report transit packaging concerns.',
    template: (orderNumber) =>
      `I would like to request an exchange or quality assistance for Order #${orderNumber}.`,
  },
  {
    id: 'invoice-provenance',
    label: 'GST Invoice & Provenance Certificate',
    summary: 'Request a duplicate digital GST invoice or weaver cluster provenance card.',
    template: (orderNumber) =>
      `Could you please share the GST invoice and weave provenance certificate for Order #${orderNumber}?`,
  },
];

export const GENERAL_SUPPORT_CATEGORIES = [
  'Order Status & Dispatch',
  'Weave Consultation & Fabric Care',
  'Bridal Trousseau & Custom Dyeing',
  'Returns, Exchanges & Finishing',
  'International Duties & Shipping',
] as const;

export function buildOrderQueryMessage(params: {
  orderNumber: string;
  queryLabel: string;
  queryBaseText: string;
  extraNote?: string;
  customerName?: string;
  itemsSummary?: string;
}): string {
  const lines = [
    'Namaste Nitmagnaa Atelier,',
    '',
    `Order Reference: #${params.orderNumber}`,
    `Query Topic: ${params.queryLabel}`,
  ];

  if (params.itemsSummary) {
    lines.push(`Pieces: ${params.itemsSummary}`);
  }
  if (params.customerName) {
    lines.push(`Client Name: ${params.customerName}`);
  }

  lines.push('', params.queryBaseText);

  if (params.extraNote && params.extraNote.trim()) {
    lines.push('', `Additional Details: ${params.extraNote.trim()}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ATELIER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
