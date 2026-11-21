export type GalleryCategory =
  | 'all'
  | 'hair'
  | 'beard'
  | 'nail'
  | 'face'
  | 'waxing'
  | 'bridal'
  | 'spa'
  | 'tattoo';

export type AspectRatioType =
  | 'portrait-lg'   // 3:4 or taller portrait (~440-460px)
  | 'portrait-md'   // 3:4 medium portrait (~360-390px)
  | 'portrait-sm'   // 4:5 small portrait (~300-330px)
  | 'tall'          // 9:16 or 1:2 extra-tall (~520-560px)
  | 'landscape-md'  // 16:10 medium landscape (~240-270px)
  | 'landscape-sm'  // 4:3 small landscape (~220-250px)
  | 'square';       // 1:1 square (~260-300px)

export interface MasonryGalleryItem {
  id: string;
  src: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  aspect: AspectRatioType;
  alt: string;
  width?: number;
  height?: number;
}

export interface CategoryFilterTab {
  id: GalleryCategory;
  label: string;
}

export const CATEGORY_TABS: CategoryFilterTab[] = [
  { id: 'all', label: 'All' },
  { id: 'hair', label: 'Hair' },
  { id: 'beard', label: 'Beard' },
  { id: 'nail', label: 'Nail' },
  { id: 'face', label: 'Face' },
  { id: 'waxing', label: 'Waxing' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'spa', label: 'Spa' },
  { id: 'tattoo', label: 'Tattoo' },
];

/**
 * 36 curated editorial photography cards with verified real assets.
 * Distributed into 4 distinct desktop visual columns with asymmetric heights.
 */
export const MASONRY_GALLERY_ITEMS: MasonryGalleryItem[] = [
  // --- INITIAL DESKTOP BATCH: 12 CARDS FOLLOWING EXACT BLUEPRINT ---
  // Column 1 Blueprint: 1 large portrait, 1 medium landscape, 1 smaller image
  {
    id: 'hair-01',
    src: '/images/gallery/signature-brunette.webp',
    title: 'Signature Brunette Balayage',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'portrait-lg',
    alt: 'Brunette balayage with dimensional tones and soft waves',
  },
  {
    id: 'hair-02',
    src: '/images/services/hair-couture.jpg',
    title: 'French Couture Haircut & Blowout',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'landscape-md',
    alt: 'Stylist finishing precision French haircut',
  },
  {
    id: 'nail-01',
    src: '/images/gallery/luxury-marble-manicure.webp',
    title: 'Russian Marble Gel Manicure',
    category: 'nail',
    categoryLabel: 'Nail Atelier',
    aspect: 'square',
    alt: 'Intricate marble nail art with gold accents',
  },

  // Column 2 Blueprint: 1 small landscape, 1 medium portrait, 1 large vertical
  {
    id: 'beard-01',
    src: '/images/testimonials/client-zameel.jpg',
    title: 'Executive Razor Shave & Beard Contour',
    category: 'beard',
    categoryLabel: 'Barber Studio',
    aspect: 'landscape-sm',
    alt: 'Master barber shaping sharp beard lines',
  },
  {
    id: 'bridal-01',
    src: '/images/gallery/bridal-updo-profile.webp',
    title: 'Sculpted Romantic Bridal Chignon',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'portrait-md',
    alt: 'Side profile of elegant textured bridal updo with pearls',
  },
  {
    id: 'face-01',
    src: '/images/gallery/dewy-skin-radiance.webp',
    title: '24K Gold Cellular Skin Radiance',
    category: 'face',
    categoryLabel: 'Face & Skin',
    aspect: 'tall',
    alt: 'Glowing radiant facial treatment result',
  },

  // Column 3 Blueprint: 1 medium landscape, 1 large portrait, 1 small landscape
  {
    id: 'spa-01',
    src: '/images/about/spa-lounge.jpg',
    title: 'Zen Thermal Relaxation Sanctuary',
    category: 'spa',
    categoryLabel: 'Spa & Wellness',
    aspect: 'landscape-md',
    alt: 'Serene spa lounge with ambient warm lighting',
  },
  {
    id: 'bridal-02',
    src: '/images/gallery/glamour-makeup-portrait.webp',
    title: 'Airbrush HD Bridal Glamour',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'portrait-lg',
    alt: 'Flawless HD bridal makeup portrait',
  },
  {
    id: 'waxing-01',
    src: '/images/services/skin-waxing.jpg',
    title: 'Botanical Velvet Silk Wax Ritual',
    category: 'waxing',
    categoryLabel: 'Waxing Suite',
    aspect: 'landscape-sm',
    alt: 'Gentle luxury wax application suite',
  },

  // Column 4 Blueprint: 1 extra-tall featured, 1 medium landscape, 1 smaller portrait
  {
    id: 'bridal-03',
    src: '/images/gallery/regal-bridal-couture.webp',
    title: 'Royal Ceremonial Veil & Adornment',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'tall',
    alt: 'Full-length royal bridal couture portrait with gold veil',
  },
  {
    id: 'hair-03',
    src: '/images/experience/exp-hair.jpg',
    title: 'Dimensional Foilyage Atelier',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'landscape-md',
    alt: 'Salon styling station in action with client hair transformation',
  },
  {
    id: 'hair-04',
    src: '/images/gallery/precision-shears-cutting.webp',
    title: 'Architectural Shears Detailing',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'portrait-sm',
    alt: 'Close-up of Japanese steel shears cutting hair texture',
  },

  // --- SECOND BATCH: LOAD MORE EXPANSION (12 ADDITIONAL EDITORIAL CARDS) ---
  {
    id: 'beard-02',
    src: '/images/services/beard-grooming.jpg',
    title: 'Precision Taper & Sculpted Jawline',
    category: 'beard',
    categoryLabel: 'Barber Studio',
    aspect: 'portrait-lg',
    alt: 'Sharp beard line styling and grooming',
  },
  {
    id: 'nail-02',
    src: '/images/services/nail-detailing.jpg',
    title: 'High-Gloss Gel-X Sculpture',
    category: 'nail',
    categoryLabel: 'Nail Atelier',
    aspect: 'landscape-md',
    alt: 'Nail artist hand-painting delicate accents',
  },
  {
    id: 'face-02',
    src: '/images/gallery/cellular-facial-mask.webp',
    title: 'Hydra-Infusion Collagen Facial',
    category: 'face',
    categoryLabel: 'Face & Skin',
    aspect: 'portrait-md',
    alt: 'Client receiving deep hydration cellular mask therapy',
  },
  {
    id: 'tattoo-01',
    src: '/images/services/custom-tattoo.jpg',
    title: 'Fine-Line Minimalist Botanical Art',
    category: 'tattoo',
    categoryLabel: 'Tattoo Studio',
    aspect: 'tall',
    alt: 'Intricate fine-line botanical floral tattoo',
  },
  {
    id: 'spa-02',
    src: '/images/about/massage-suite.jpg',
    title: 'Private Aromatic Stone Therapy Suite',
    category: 'spa',
    categoryLabel: 'Spa & Wellness',
    aspect: 'landscape-md',
    alt: 'Luxury private massage suite with therapeutic stones',
  },
  {
    id: 'works-01',
    src: '/works/1.webp',
    title: 'Luminous Balayage Transformation',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'portrait-lg',
    alt: 'Client showing flowing honey-blonde waves',
  },
  {
    id: 'works-02',
    src: '/works/2.webp',
    title: 'Velvet Gloss Conditioning Polish',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'landscape-sm',
    alt: 'Silky smooth glass hair transformation',
  },
  {
    id: 'works-03',
    src: '/works/3.webp',
    title: 'Classic Gentleman Fade & Lineup',
    category: 'beard',
    categoryLabel: 'Barber Studio',
    aspect: 'portrait-md',
    alt: 'Clean skin fade haircut with styled beard',
  },
  {
    id: 'works-04',
    src: '/works/4.webp',
    title: 'Textured Crop & Grooming Ritual',
    category: 'beard',
    categoryLabel: 'Barber Studio',
    aspect: 'square',
    alt: 'Modern textured mens hair styling and trim',
  },
  {
    id: 'works-05',
    src: '/works/5.webp',
    title: 'Chrome Glass Architectural Nails',
    category: 'nail',
    categoryLabel: 'Nail Atelier',
    aspect: 'tall',
    alt: 'Mirror chrome finish designer nails',
  },
  {
    id: 'works-06',
    src: '/works/6.webp',
    title: 'French Minimalist Almond Tips',
    category: 'nail',
    categoryLabel: 'Nail Atelier',
    aspect: 'landscape-md',
    alt: 'Delicate nude French manicure',
  },
  {
    id: 'works-07',
    src: '/works/7.webp',
    title: 'Deep Pore Purification & Glow',
    category: 'face',
    categoryLabel: 'Face & Skin',
    aspect: 'portrait-sm',
    alt: 'Client skin glowing post clinical facial',
  },

  // --- THIRD BATCH: ADDITIONAL SPECIALITIES & ATELIERS (12 MORE CARDS) ---
  {
    id: 'bridal-04',
    src: '/images/services/bridal-masterpiece.jpg',
    title: 'Traditional Royal Saree Styling',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'landscape-md',
    alt: 'Traditional bride with handcrafted gold jewellery and bridal makeup',
  },
  {
    id: 'bridal-05',
    src: '/images/experience/exp-bridal.jpg',
    title: 'Couture Reception Makeover',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'tall',
    alt: 'Glowing bride during pre-wedding editorial photoshoot',
  },
  {
    id: 'spa-03',
    src: '/images/services/spa-wellness.jpg',
    title: 'Ayurvedic Shirodhara Oil Therapy',
    category: 'spa',
    categoryLabel: 'Spa & Wellness',
    aspect: 'portrait-lg',
    alt: 'Traditional warm herbal oil stream treatment',
  },
  {
    id: 'spa-04',
    src: '/images/experience/exp-spa.jpg',
    title: 'Hydrothermal Soak & Steam Ritual',
    category: 'spa',
    categoryLabel: 'Spa & Wellness',
    aspect: 'square',
    alt: 'Aroma bath hydrotherapy session in wooden tub',
  },
  {
    id: 'tattoo-02',
    src: '/images/nav/promo_scissors.jpg',
    title: 'Geometric Sacred Needlework',
    category: 'tattoo',
    categoryLabel: 'Tattoo Studio',
    aspect: 'landscape-sm',
    alt: 'Custom artistic needlework on forearm',
  },
  {
    id: 'tattoo-03',
    src: '/works/8.webp',
    title: 'Micro-Realism Fine Line Silhouette',
    category: 'tattoo',
    categoryLabel: 'Tattoo Studio',
    aspect: 'portrait-md',
    alt: 'Delicate fine line tattoo craftsmanship',
  },
  {
    id: 'face-03',
    src: '/images/experience/exp-skin.jpg',
    title: 'Clinical Microdermabrasion Peel',
    category: 'face',
    categoryLabel: 'Face & Skin',
    aspect: 'landscape-md',
    alt: 'Esthetician performing gentle exfoliating treatment',
  },
  {
    id: 'works-09',
    src: '/works/9.webp',
    title: 'Modern Sangeet Glamour Eye Makeup',
    category: 'bridal',
    categoryLabel: 'Bridal Studio',
    aspect: 'portrait-lg',
    alt: 'Smokey metallic eye makeup for bridal reception',
  },
  {
    id: 'works-10',
    src: '/works/10.webp',
    title: 'Head-to-Toe Body Polish Polish Ritual',
    category: 'spa',
    categoryLabel: 'Spa & Wellness',
    aspect: 'square',
    alt: 'Exfoliating salt scrub and body mask therapy',
  },
  {
    id: 'nav-mens',
    src: '/images/nav/mens_salon.jpg',
    title: 'Signature Executive Cut & Finish',
    category: 'beard',
    categoryLabel: 'Barber Studio',
    aspect: 'portrait-md',
    alt: 'Modern executive haircut with sharp neckline',
  },
  {
    id: 'nav-womens',
    src: '/images/nav/womens_salon.jpg',
    title: 'Glamour Hollywood Red Carpet Waves',
    category: 'hair',
    categoryLabel: 'Hair Studio',
    aspect: 'landscape-md',
    alt: 'Glossy red-carpet waves styled for evening gala',
  },
  {
    id: 'waxing-02',
    src: '/images/about/massage-suite.jpg',
    title: 'Full Body Velvet Wax & Hydrate',
    category: 'waxing',
    categoryLabel: 'Waxing Suite',
    aspect: 'portrait-sm',
    alt: 'Comfort waxing suite with soothing botanicals',
  },
];

/**
 * Normalises studio slugs to gallery category keys
 */
export function slugToCategory(slug?: string): GalleryCategory {
  if (!slug) return 'all';
  const s = slug.toLowerCase();
  if (s.includes('hair')) return 'hair';
  if (s.includes('beard') || s.includes('barber')) return 'beard';
  if (s.includes('nail')) return 'nail';
  if (s.includes('face') || s.includes('facial') || s.includes('skin')) return 'face';
  if (s.includes('waxing')) return 'waxing';
  if (s.includes('bridal') || s.includes('makeup')) return 'bridal';
  if (s.includes('spa') || s.includes('wellness') || s.includes('massage')) return 'spa';
  if (s.includes('tattoo')) return 'tattoo';
  return 'all';
}
