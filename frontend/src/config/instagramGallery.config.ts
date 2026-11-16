/**
 * Spark International Salon — Instagram Gallery Configuration
 * Official Instagram: https://www.instagram.com/spark_international_salon/
 *
 * Configurable collection of Reels (video) and Photo posts.
 * Supports direct manual reel/post mapping as well as Instagram Graph API synchronization.
 */

export type InstagramMediaType = 'reel' | 'video' | 'post';

export interface InstagramGalleryItem {
  id: string;
  type: InstagramMediaType;
  title: string;
  mediaUrl: string;
  posterUrl: string;
  instagramUrl: string;
  category: string;
  alt: string;
}

export const INSTAGRAM_ACCOUNT_CONFIG = {
  profileUrl: 'https://www.instagram.com/spark_international_salon/',
  handle: '@spark_international_salon',
  salonName: 'Byju Spark International Salon & Spa',
};

/**
 * Curated Instagram Media Collection for Spark International Salon
 * Combines high-resolution photography and silent, looping Reels videos.
 */
export const INSTAGRAM_GALLERY_ITEMS: InstagramGalleryItem[] = [
  {
    id: 'ig-01-hair-styling',
    type: 'reel',
    title: 'Hair Styling & Sculpting Transformation',
    mediaUrl: '/spiral/reels/reel-hair-styling.mp4',
    posterUrl: '/spiral/01-hair-styling.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Hair Couture',
    alt: 'Master stylist performing precision hair cut and styling transformation',
  },
  {
    id: 'ig-02-balayage',
    type: 'reel',
    title: 'French Balayage & Dimensional Colour Glow',
    mediaUrl: '/spiral/reels/reel-balayage.mp4',
    posterUrl: '/spiral/02-balayage.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Colour Artistry',
    alt: 'French balayage hand-painted caramel highlights and blow-dry finish',
  },
  {
    id: 'ig-03-bridal-makeup',
    type: 'post',
    title: 'Royal Heritage Bridal Makeover & Adornment',
    mediaUrl: '/spiral/03-bridal-makeup.jpg',
    posterUrl: '/spiral/03-bridal-makeup.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Royal Bridal',
    alt: 'Exquisite royal Kerala bridal makeover with traditional gold jewellery',
  },
  {
    id: 'ig-04-nail-art',
    type: 'reel',
    title: 'Russian Apex Manicure & Chrome Detailing',
    mediaUrl: '/spiral/reels/reel-nail-art.mp4',
    posterUrl: '/spiral/04-nail-art.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Nail Lounge',
    alt: 'Russian diamond apex manicure with chrome fine-line art extensions',
  },
  {
    id: 'ig-05-facial',
    type: 'reel',
    title: '24K Liquid Gold Cellular Dermal Facial',
    mediaUrl: '/spiral/reels/reel-facial.mp4',
    posterUrl: '/spiral/05-facial.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Clinical Derma',
    alt: '24K liquid gold facial mask application and cellular skin rejuvenation',
  },
  {
    id: 'ig-06-spa',
    type: 'reel',
    title: 'Holistic Heated Volcanic Stone Spa Ritual',
    mediaUrl: '/spiral/reels/reel-spa.mp4',
    posterUrl: '/spiral/06-spa.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Spa Sanctuary',
    alt: 'Balinese deep pressure heated volcanic stone massage therapy',
  },
  {
    id: 'ig-07-grooming',
    type: 'reel',
    title: 'Master Barber Beard Sculpting & Razor Fade',
    mediaUrl: '/spiral/reels/reel-grooming.mp4',
    posterUrl: '/spiral/07-grooming.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Barber Atelier',
    alt: 'Bespoke precision beard architecture and hot towel soothing treatment',
  },
  {
    id: 'ig-08-tattoo',
    type: 'reel',
    title: 'Single-Needle Sacred Geometry Tattoo Art',
    mediaUrl: '/spiral/reels/reel-tattoo.mp4',
    posterUrl: '/spiral/08-tattoo.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Ink Atelier',
    alt: 'Single-needle delicate fine-line talisman tattoo artistry session',
  },
  {
    id: 'ig-09-salon-interior',
    type: 'post',
    title: 'Byju Spark Atelier Interior & Lighting',
    mediaUrl: '/spiral/09-salon-interior.jpg',
    posterUrl: '/spiral/09-salon-interior.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'The Atelier',
    alt: 'Spark International Salon luxurious interior styling suites',
  },
  {
    id: 'ig-10-precision-cut',
    type: 'reel',
    title: 'Architectural Japanese Shears Layered Cut',
    mediaUrl: '/spiral/reels/reel-hair-styling.mp4',
    posterUrl: '/spiral/10-precision-cut.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Hair Couture',
    alt: 'Master stylist cutting textured hair layers with Japanese steel shears',
  },
  {
    id: 'ig-11-hair-colour',
    type: 'post',
    title: 'Gloss Velvet Mocha Hair Colour Transformation',
    mediaUrl: '/spiral/11-hair-colour.jpg',
    posterUrl: '/spiral/11-hair-colour.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Colour Artistry',
    alt: 'Gloss velvet mocha rich hair color transition with mirror shine',
  },
  {
    id: 'ig-12-bridal-hair',
    type: 'post',
    title: 'Haute Parisian Chignon & Floral Adornment',
    mediaUrl: '/spiral/12-bridal-hair.jpg',
    posterUrl: '/spiral/12-bridal-hair.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Royal Bridal',
    alt: 'Intricate couture bridal chignon bun adorned with fresh flowers and pearls',
  },
  {
    id: 'ig-13-gel-manicure',
    type: 'post',
    title: 'Diamond Powder Glazed Gel Manicure',
    mediaUrl: '/spiral/13-gel-manicure.jpg',
    posterUrl: '/spiral/13-gel-manicure.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Nail Lounge',
    alt: 'Diamond powder glazed nude gel nails with immaculate cuticle finish',
  },
  {
    id: 'ig-14-skin-glow',
    type: 'post',
    title: 'Hydra-Oxygen Dewy Skin Resurfacing Treatment',
    mediaUrl: '/spiral/14-skin-glow.jpg',
    posterUrl: '/spiral/14-skin-glow.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Clinical Derma',
    alt: 'Hydra-infusion dermabrasion facial delivering instant glass-skin radiance',
  },
  {
    id: 'ig-15-massage',
    type: 'post',
    title: 'Essential Herb-Infused Deep Aromatherapy Massage',
    mediaUrl: '/spiral/15-massage.jpg',
    posterUrl: '/spiral/15-massage.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Spa Sanctuary',
    alt: 'Aromatic warm herbal compress and tension-release back massage',
  },
  {
    id: 'ig-16-beard',
    type: 'post',
    title: 'Gentlemen Razor Fade & Beard Line Sculpture',
    mediaUrl: '/spiral/16-beard.jpg',
    posterUrl: '/spiral/16-beard.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Barber Atelier',
    alt: 'Clean geometric beard line sculpting and mustache grooming',
  },
  {
    id: 'ig-17-linework',
    type: 'post',
    title: 'Micro-Realism Botanical Fine-Line Tattoo',
    mediaUrl: '/spiral/17-linework.jpg',
    posterUrl: '/spiral/17-linework.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'Ink Atelier',
    alt: 'Botanical floral fine-line tattoo on forearm with micro shading',
  },
  {
    id: 'ig-18-salon-dusk',
    type: 'post',
    title: 'Spark International Salon Suites at Twilight',
    mediaUrl: '/spiral/18-salon-dusk.jpg',
    posterUrl: '/spiral/18-salon-dusk.jpg',
    instagramUrl: 'https://www.instagram.com/spark_international_salon/',
    category: 'The Atelier',
    alt: 'Warm amber sunset glow over the private styling suites and salon mirrors',
  },
];

