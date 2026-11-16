export interface NodeData {
  title: string;
  model: string;
  type: 'Input' | 'Image' | 'Video' | 'Output';
}

export interface SceneData {
  tab: number; // 0: Hair Couture, 1: Bridal & Skin, 2: Spa & Wellness
  name: string;
  word: string;
  category: string;
  mainImage: string;
  textColor: string;
  colors: [string, string, string]; // [accent1, accent2, background/dark]
  layout: [number, number, number, number][]; // [x%, y%, w%, h%] for nodes 0..4
  prompt: string;
  nodes: NodeData[];
  images: string[];
}

export interface TabItem {
  id: number;
  name: string;
  short: string;
}

export const TABS: TabItem[] = [
  { id: 0, name: 'Hair Couture', short: 'Hair' },
  { id: 1, name: 'Beard & Groom', short: 'Groom' },
  { id: 2, name: 'Nail Detailing', short: 'Nails' },
  { id: 3, name: 'Skin & Wax', short: 'Skin' },
  { id: 4, name: 'Regal Bridal', short: 'Bridal' },
  { id: 5, name: 'Spa Wellness', short: 'Spa' },
  { id: 6, name: 'Custom Tattoo', short: 'Tattoo' },
];

export const EDGES: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
];

export const GRADIENT_ANGLES = [35, 140, 75, 200, 310];

export const L1: [number, number, number, number][] = [
  [3, 6, 24, 38],
  [3, 54, 24, 38],
  [36, 28, 26, 42],
  [67, 4, 29, 42],
  [67, 54, 29, 42],
];

export const L2: [number, number, number, number][] = [
  [3, 10, 22, 34],
  [8, 56, 22, 34],
  [34, 6, 28, 44],
  [66, 28, 30, 32],
  [60, 64, 30, 32],
];

export const L3: [number, number, number, number][] = [
  [3, 4, 24, 40],
  [3, 56, 24, 40],
  [34, 30, 26, 40],
  [66, 6, 30, 40],
  [66, 56, 30, 40],
];

export const L4: [number, number, number, number][] = [
  [4, 8, 22, 36],
  [4, 54, 22, 36],
  [32, 30, 28, 44],
  [64, 8, 32, 40],
  [64, 56, 32, 38],
];

export const L5: [number, number, number, number][] = [
  [3, 8, 22, 34],
  [14, 58, 22, 34],
  [38, 24, 26, 42],
  [68, 2, 28, 40],
  [68, 52, 28, 44],
];

export const SCENES: SceneData[] = [
  {
    tab: 0,
    name: 'Hair Couture & Styling',
    word: 'HAIR',
    category: 'Signature Hair Studio',
    mainImage: '/images/services/hair-couture.jpg',
    textColor: '#f5d79e',
    colors: ['#7A4B22', '#C99757', '#140B04'],
    layout: L1,
    prompt:
      'Architectural haircutting, bespoke blowout rituals and dimensional balayage tailored to your facial silhouette.',
    nodes: [
      { title: 'Silhouette Study', model: '', type: 'Input' },
      { title: 'Palette Customization', model: '', type: 'Input' },
      { title: 'Architectural Cut', model: 'Master Stylist', type: 'Image' },
      { title: 'Dimensional Color', model: 'Couture Blend', type: 'Video' },
      { title: 'Signature Finish', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/hair-couture.jpg',
      '/images/gallery/signature-brunette.webp',
      '/images/experience/exp-hair.jpg',
      '/images/gallery/precision-shears-cutting.webp',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/gallery/glamour-makeup-portrait.webp',
      '/images/experience/exp-bridal.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/sections/atelier-creed.jpg',
      '/images/gallery/cellular-facial-mask.webp',
      '/images/gallery/bridal-updo-profile.webp',
      '/images/experience/exp-skin.jpg',
      '/images/about/spa-lounge.jpg',
    ],
  },
  {
    tab: 1,
    name: 'Bespoke Beard & Grooming',
    word: 'GROOM',
    category: "Royal Men's Atelier",
    mainImage: '/images/services/beard-grooming.jpg',
    textColor: '#f0d5b5',
    colors: ['#8C532B', '#C99757', '#1A0E06'],
    layout: L2,
    prompt:
      'Sculptural beard architecture, razor fade contouring, hot towel herbal steam and organic cedarwood conditioning.',
    nodes: [
      { title: 'Beard Line Scan', model: '', type: 'Input' },
      { title: 'Fade Mapping', model: '', type: 'Input' },
      { title: 'Sculptural Shape', model: 'Master Barber', type: 'Image' },
      { title: 'Herbal Steam Infusion', model: 'Cedar Elixir', type: 'Video' },
      { title: 'Groomed Finish', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/beard-grooming.jpg',
      '/images/gallery/precision-shears-cutting.webp',
      '/images/experience/exp-hair.jpg',
      '/images/gallery/signature-brunette.webp',
      '/images/about/massage-suite.jpg',
      '/images/sections/atelier-creed.jpg',
      '/images/experience/exp-spa.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/gallery/dewy-skin-radiance.webp',
    ],
  },
  {
    tab: 2,
    name: 'Luxury Nail Detailing',
    word: 'NAILS',
    category: 'Haute Nail Atelier',
    mainImage: '/images/services/nail-detailing.jpg',
    textColor: '#fce4ec',
    colors: ['#A0526B', '#E8B4C8', '#1A0810'],
    layout: L3,
    prompt:
      'Russian apex cuticle sculpting, BIAB structural overlay, bespoke chrome nail artistry and warm marble hand ritual.',
    nodes: [
      { title: 'Nail Bed Analysis', model: '', type: 'Input' },
      { title: 'Apex Geometry', model: '', type: 'Input' },
      { title: 'Russian Manicure', model: 'Nail Artist', type: 'Image' },
      { title: 'Chrome & Gloss', model: 'Mirror Glaze', type: 'Video' },
      { title: 'Diamond Finish', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/nail-detailing.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/about/spa-lounge.jpg',
      '/images/gallery/glamour-makeup-portrait.webp',
      '/images/experience/exp-bridal.jpg',
      '/images/sections/atelier-creed.jpg',
      '/images/experience/exp-skin.jpg',
    ],
  },
  {
    tab: 3,
    name: 'Botanic Waxing & Derma Care',
    word: 'SKIN',
    category: 'Botanic Derma Care',
    mainImage: '/images/services/skin-waxing.jpg',
    textColor: '#fce3dc',
    colors: ['#A45D4B', '#DBA493', '#1F0C06'],
    layout: L2,
    prompt:
      'Botanical smooth waxing and cellular derma-hydration for silky, radiant, luminous skin without irritation.',
    nodes: [
      { title: 'Skin Sensitivity Scan', model: '', type: 'Input' },
      { title: 'Organic Wax Blend', model: '', type: 'Input' },
      { title: 'Precision Waxing', model: 'Derma Specialist', type: 'Image' },
      { title: 'Soothing Elixir', model: 'Calming Mist', type: 'Video' },
      { title: 'Silken Glow', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/skin-waxing.jpg',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/experience/exp-skin.jpg',
      '/images/gallery/cellular-facial-mask.webp',
      '/images/gallery/glamour-makeup-portrait.webp',
      '/images/about/spa-lounge.jpg',
      '/images/about/massage-suite.jpg',
      '/images/gallery/bridal-updo-profile.webp',
      '/images/gallery/signature-brunette.webp',
      '/images/experience/exp-spa.jpg',
      '/images/gallery/precision-shears-cutting.webp',
      '/images/experience/exp-hair.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
    ],
  },
  {
    tab: 4,
    name: 'Regal Bridal Masterpiece',
    word: 'BRIDAL',
    category: 'Haute Bridal Atelier',
    mainImage: '/images/services/bridal-masterpiece.jpg',
    textColor: '#ffebad',
    colors: ['#7A162B', '#C99738', '#1A0409'],
    layout: L3,
    prompt:
      'Regal bridal makeover: airbrush HD radiance, bespoke eye artistry, luxury jewelry adornment and couture chignon.',
    nodes: [
      { title: 'Couture Palette', model: '', type: 'Input' },
      { title: 'Jewelry Placement', model: '', type: 'Input' },
      { title: 'HD Airbrush Radiance', model: 'Master MUA', type: 'Image' },
      { title: 'Royal Eye Artistry', model: 'Kohl & Gold', type: 'Video' },
      { title: 'Regal Bride', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/bridal-masterpiece.jpg',
      '/images/gallery/regal-bridal-couture.webp',
      '/images/experience/exp-bridal.jpg',
      '/images/gallery/glamour-makeup-portrait.webp',
      '/images/gallery/bridal-updo-profile.webp',
      '/images/about/massage-suite.jpg',
      '/images/sections/bg-2.webp',
      '/images/gallery/signature-brunette.webp',
      '/images/sections/atelier-creed.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/experience/exp-skin.jpg',
      '/images/about/spa-lounge.jpg',
    ],
  },
  {
    tab: 5,
    name: 'Cellular Spa Sanctuary',
    word: 'SPA',
    category: 'Holistic Wellness',
    mainImage: '/images/services/spa-wellness.jpg',
    textColor: '#d9efe0',
    colors: ['#285B42', '#86B38E', '#08170F'],
    layout: L4,
    prompt:
      'Restorative aromatherapy, deep tissue tension relief, hot stone therapy and botanical scrubs in our private VIP suites.',
    nodes: [
      { title: 'Aromatherapy Profile', model: '', type: 'Input' },
      { title: 'Botanical Infusion', model: '', type: 'Input' },
      { title: 'Deep Tissue Ritual', model: 'Master Therapist', type: 'Image' },
      { title: 'Hot Stone Renewal', model: 'Warm Basalt', type: 'Video' },
      { title: 'Zen Nirvana', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/spa-wellness.jpg',
      '/images/about/massage-suite.jpg',
      '/images/about/spa-lounge.jpg',
      '/images/experience/exp-spa.jpg',
      '/images/gallery/cellular-facial-mask.webp',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/experience/exp-skin.jpg',
      '/images/gallery/signature-brunette.webp',
      '/images/gallery/precision-shears-cutting.webp',
      '/images/experience/exp-bridal.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/sections/atelier-creed.jpg',
    ],
  },
  {
    tab: 6,
    name: 'Custom Tattoo & Body Art',
    word: 'TATTOO',
    category: 'Fine-Line Body Art',
    mainImage: '/images/services/custom-tattoo.jpg',
    textColor: '#ececf0',
    colors: ['#38383e', '#737380', '#070709'],
    layout: L5,
    prompt:
      'Fine-line illustrative tattoos, sacred geometric mandalas and bespoke custom ink crafted with hospital-grade sterility.',
    nodes: [
      { title: 'Concept Sketch', model: '', type: 'Input' },
      { title: 'Anatomy Mapping', model: '', type: 'Input' },
      { title: 'Fine-Line Linework', model: 'Ink Master', type: 'Image' },
      { title: 'Shading & Stippling', model: 'Bespoke Ink', type: 'Video' },
      { title: 'Healed Masterpiece', model: '', type: 'Output' },
    ],
    images: [
      '/images/services/custom-tattoo.jpg',
      '/images/gallery/luxury-marble-manicure.webp',
      '/images/sections/atelier-creed.jpg',
      '/images/gallery/signature-brunette.webp',
      '/images/about/spa-lounge.jpg',
      '/images/experience/exp-spa.jpg',
      '/images/gallery/precision-shears-cutting.webp',
      '/images/gallery/cellular-facial-mask.webp',
      '/images/gallery/dewy-skin-radiance.webp',
      '/images/sections/bg-2.webp',
      '/images/experience/exp-hair.jpg',
      '/images/gallery/glamour-makeup-portrait.webp',
      '/images/experience/exp-bridal.jpg',
    ],
  },
];
