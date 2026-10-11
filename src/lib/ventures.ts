export type Venture = {
  slug: string;
  name: string;
  category: string;
  eyebrow: string;
  description: string;
  status: 'active-brand' | 'prototype' | 'research';
  products: string[];
};

export const ventures: Venture[] = [
  {
    slug: 'lumora', name: 'LUMÓRA', category: 'Aroma & lifestyle', eyebrow: 'Rituals for everyday living',
    description: 'Aroma products designed for thoughtful gifting and everyday rituals.', status: 'active-brand',
    products: ['Aromatherapy candle: Lavender', 'Aromatherapy candle: Rose', 'Aromatherapy candle: Layali', 'Perfume: Rose', 'Perfume: Aqua'],
  },
  {
    slug: 'nexora', name: 'NEXORA', category: 'Technology & robotics', eyebrow: 'Build what comes next',
    description: 'An emerging technology venture exploring accessible AI, robotics and connected products.', status: 'prototype',
    products: ['Mochi AI Mini Robot 1.0'],
  },
  {
    slug: 'razzaq-home-care', name: 'RAZZAQ HOME CARE', category: 'Home care', eyebrow: 'A concept in development',
    description: 'An early-stage home-care initiative. Products remain in research and validation, not presented as retail-ready.', status: 'research',
    products: ['Dishwashing liquid — research & validation'],
  },
];
