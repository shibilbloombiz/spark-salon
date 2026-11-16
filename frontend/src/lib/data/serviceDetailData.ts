/**
 * Service Detail Page Domain Data & Contract Mapping
 * Driven strictly by window.SERVICE and window.SITE data contracts.
 * Provides data for all 8 salon service detail pages.
 */

export interface ServiceDetailMediaItem {
  file: string;
  alt: string;
  src: string | null;
  caption?: string;
}

export interface ServiceDetailProcessStep {
  title: string;
  text: string;
}

export interface ServiceDetailArtist {
  id: string;
  placeholder: boolean;
  name: string;
  specialisation: string;
  experience: string | null;
  bio: string;
  skills: string[];
  portrait: {
    file: string;
    alt: string;
    src: string | null;
  };
}

export interface ServiceDetailRelated {
  slug: string;
  name: string;
  desc: string;
  hero: {
    file: string;
    alt: string;
    src: string | null;
  };
}

export interface ServiceDetailData {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  intro: string[];
  includes: string[];
  benefits: string[];
  suitableFor: string[];
  preparation: string[];
  aftercare: string[];
  duration: string;
  process: ServiceDetailProcessStep[];
  media: {
    hero: ServiceDetailMediaItem;
    supporting: ServiceDetailMediaItem;
    reel: {
      file: string;
      src: string | null;
    };
    gallery: ServiceDetailMediaItem[];
  };
  artists: ServiceDetailArtist[];
  related: ServiceDetailRelated[];
}

export interface SiteData {
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  enquiryEndpoint: string;
  timeZone: string;
  slots: string[];
}

export const SITE_DATA: SiteData = {
  name: 'Byju Spark Saloon International',
  phoneDisplay: '+91 85430 97899',
  phoneHref: 'tel:+918543097899',
  enquiryEndpoint: '', // Empty endpoint enforces honest failure message as specified
  timeZone: 'Asia/Kolkata',
  slots: [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
  ],
};

export const SERVICES_DETAIL_MAP: Record<string, ServiceDetailData> = {
  hair: {
    slug: 'hair',
    name: 'Hair',
    category: 'Hair Studio',
    tagline: 'Cut, colour and care shaped around your face, your texture and the way you actually live.',
    intro: [
      'Hair work begins with a conversation rather than a chair. Your artist reads your density, your natural movement and the maintenance you can realistically keep up, then designs a cut or colour that works with all three.',
      'From precision cuts and dimensional colour to smoothing and scalp-focused treatments, each appointment is built around hair health as much as the finished look. Nothing is recommended simply because it is fashionable.',
    ],
    includes: [
      'Consultation and hair analysis',
      'Precision cut or restyle',
      'Colour, tone or highlights, where chosen',
      'Blow-dry and finishing styling',
    ],
    benefits: [
      'A shape that suits your face and daily routine',
      'Colour planned for how it will grow out, not only the first day',
      'Clear home-care guidance between visits',
    ],
    suitableFor: [
      'Anyone wanting a considered, fresh change',
      'Clients with dry, damaged or chemically treated hair who need a careful plan',
      'Those preparing for an event and wanting a dependable result',
    ],
    preparation: [
      'Arrive with clean, dry hair unless your artist asks otherwise',
      'Tell us about recent chemical treatments, allergies or sensitivities',
      'Bring reference photos if you have them',
    ],
    aftercare: [
      'Wait 48 hours before washing after a colour service, if advised',
      'Use the products recommended for your hair type',
      'Book a gloss or trim at the interval your artist suggests',
    ],
    duration: 'Typically 60 to 150 minutes, depending on length and colour work. Confirmed at consultation.',
    process: [
      {
        title: 'Consultation',
        text: 'We discuss your goals, lifestyle and hair history, and check condition before any product touches your hair.',
      },
      {
        title: 'Style selection',
        text: 'Your artist proposes a cut and colour direction and explains the trade-offs of each choice.',
      },
      {
        title: 'Professional treatment',
        text: 'Cut, colour or treatment is carried out in stages, with checks along the way.',
      },
      {
        title: 'Final result',
        text: 'A finished style, a review of home care and a plan for your next visit.',
      },
    ],
    media: {
      hero: {
        file: 'hair/hero.jpg',
        alt: 'Hair service: precision cut in natural light',
        src: '/images/services/hair-couture.jpg',
      },
      supporting: {
        file: 'hair/detail.jpg',
        alt: 'Close detail of a dimensional colour finish',
        src: '/images/experience/exp-hair.jpg',
      },
      reel: {
        file: 'hair/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'hair/gallery-1.jpg',
          alt: 'Layered cut in natural light',
          caption: 'Layered cut in natural light',
          src: '/images/gallery/signature-brunette.webp',
        },
        {
          file: 'hair/gallery-2.jpg',
          alt: 'Colour detail close-up',
          caption: 'Colour detail close-up',
          src: '/images/gallery/precision-shears-cutting.webp',
        },
        {
          file: 'hair/gallery-3.jpg',
          alt: 'Blow-dry and finish',
          caption: 'Blow-dry and finish',
          src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'hair/gallery-4.jpg',
          alt: 'Consultation at the mirror',
          caption: 'Consultation at the mirror',
          src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'hair/gallery-5.jpg',
          alt: 'Texture and movement',
          caption: 'Texture and movement',
          src: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'hair-artist-1',
        placeholder: true,
        name: 'Adrian Ross',
        specialisation: 'Precision Geometric Cutting & Editorial Finishes',
        experience: '16+ Years International Experience',
        bio: 'Trained at the Vidal Sassoon Academy in London, Adrian specializes in architectural lines and effortless movement tailored to every face shape.',
        skills: ['Geometric Shears', 'Editorial Blowouts', 'Dry Hair Carving', 'Texture Architect'],
        portrait: {
          file: 'portraits/hair-artist-1.jpg',
          alt: 'Adrian Ross',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'hair-artist-2',
        placeholder: true,
        name: 'Elena Vance',
        specialisation: 'Seamless French Balayage & Color Alchemist',
        experience: '12+ Years Color Architecture',
        bio: 'Elena is renowned for sun-kissed hand-painted balayage transitions that preserve structural cuticle integrity.',
        skills: ['French Balayage', 'Corrective Color', 'Gloss Glazing'],
        portrait: {
          file: 'portraits/hair-artist-2.jpg',
          alt: 'Elena Vance',
          src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'beard-grooming',
        name: 'Beard & Grooming',
        desc: 'Precision beard sculpting and classic grooming, finished with the calm of a proper barber chair.',
        hero: {
          file: 'beard-grooming/hero.jpg',
          alt: 'Beard grooming: sharpened neckline',
          src: '/images/services/beard-grooming.jpg',
        },
      },
      {
        slug: 'nail',
        name: 'Nail',
        desc: 'Considered manicures and pedicures, from clean shaping to lasting colour and fine detail.',
        hero: {
          file: 'nail/hero.jpg',
          alt: 'Nail service: gel manicure close-up',
          src: '/images/services/nail-detailing.jpg',
        },
      },
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Facials built on a skin analysis, not a generic menu, so each treatment answers what your skin needs today.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial service: serum application in soft light',
          src: '/images/services/skin-waxing.jpg',
        },
      },
    ],
  },

  'beard-grooming': {
    slug: 'beard-grooming',
    name: 'Beard & Grooming',
    category: 'Barber Atelier',
    tagline: 'Precision beard architecture, straight-razor discipline and calming hot-towel craft.',
    intro: [
      'True grooming begins with an understanding of facial symmetry, hair growth direction, and skin sensitivity. We step away from rushed trims to sculpt beards with calculated line work and tapered graduation.',
      'From traditional hot-towel steam treatments to straight-edge razor line definition and botanical beard oil infusions, every appointment leaves your beard sculpted and your skin balanced.',
    ],
    includes: [
      'Facial geometry analysis & consultation',
      'Hot towel steam & botanical oil softening',
      'Straight-razor edge definition & graduation',
      'Aftershave cooling compress & beard balm finish',
    ],
    benefits: [
      'A sharp, defined neckline and jawline contour',
      'Reduced razor irritation and ingrown hairs',
      'Nourished beard hair with lasting natural sheen',
    ],
    suitableFor: [
      'Gentlemen maintaining short, medium or full-length beards',
      'Those with sensitive neck skin prone to razor burn',
      'Preparation for weddings, black-tie events, and executive portraits',
    ],
    preparation: [
      'Allow at least 3-4 days of beard growth for optimal sculpting',
      'Avoid heavy exfoliating scrubs immediately before your appointment',
      'Bring reference photos of your preferred beard silhouette if desired',
    ],
    aftercare: [
      'Apply prescribed cold-pressed beard oil daily to keep follicles supple',
      'Comb with an ox-horn or wide wooden comb to train growth direction',
      'Schedule maintenance every 2 to 3 weeks for crisp lines',
    ],
    duration: 'Typically 45 to 75 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Symmetry consultation',
        text: 'We evaluate jawline proportions, growth whorls, and skin condition to map the optimal beard line.',
      },
      {
        title: 'Steam & oil conditioning',
        text: 'Warm cedarwood towels and organic botanical oils soften coarse stubble and open the pores.',
      },
      {
        title: 'Architectural razor work',
        text: 'Freehand shears trim bulk followed by precision straight-edge razor lines with surgical accuracy.',
      },
      {
        title: 'Cooling compress & seal',
        text: 'Cold towels and natural sandalwood astringents close the pores and lock in moisture.',
      },
    ],
    media: {
      hero: {
        file: 'beard-grooming/hero.jpg',
        alt: 'Beard grooming: sharpened neckline',
        src: '/images/services/beard-grooming.jpg',
      },
      supporting: {
        file: 'beard-grooming/detail.jpg',
        alt: 'Hot towel and razor detail',
        src: '/images/services/beard-grooming.jpg',
      },
      reel: {
        file: 'beard-grooming/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'beard-grooming/gallery-1.jpg',
          alt: 'Razor crisp neckline finish',
          caption: 'Razor crisp neckline finish',
          src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'beard-grooming/gallery-2.jpg',
          alt: 'Hot towel steam ritual',
          caption: 'Hot towel steam ritual',
          src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'beard-grooming/gallery-3.jpg',
          alt: 'Scissor sculpt and gradient fade',
          caption: 'Scissor sculpt and gradient fade',
          src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'beard-grooming/gallery-4.jpg',
          alt: 'Beard oil nourishing massage',
          caption: 'Beard oil nourishing massage',
          src: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'beard-grooming/gallery-5.jpg',
          alt: 'Classic barber chair finish',
          caption: 'Classic barber chair finish',
          src: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'beard-artist-1',
        placeholder: true,
        name: 'Marcus Sterling',
        specialisation: 'Master Barber & Straight Razor Artisan',
        experience: '14+ Years Barbering',
        bio: 'Specializing in old-school European straight-razor shaves, hot-towel steam therapy, and contemporary graduated fades.',
        skills: ['Straight Razor', 'Hot Towel Rituals', 'Beard Sculpting', 'Skin Conditioning'],
        portrait: {
          file: 'portraits/beard-artist-1.jpg',
          alt: 'Marcus Sterling',
          src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'beard-artist-2',
        placeholder: true,
        name: 'Devan Nair',
        specialisation: 'Executive Grooming & Taper Specialist',
        experience: '9+ Years Barbering',
        bio: 'Expert in beard shaping, natural hairline contouring, and scalp therapy.',
        skills: ['Fade Geometry', 'Beard Conditioning', 'Razor Line Art'],
        portrait: {
          file: 'portraits/beard-artist-2.jpg',
          alt: 'Devan Nair',
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Precision cuts, dimensional colour, and scalp therapies shaped around your lifestyle.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair salon cut',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'spa',
        name: 'Spa',
        desc: 'Balinese deep pressure massage and holistic wellness rituals.',
        hero: {
          file: 'spa/hero.jpg',
          alt: 'Spa massage',
          src: '/images/services/spa-wellness.jpg',
        },
      },
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Facials built on diagnostic skin analysis for lasting clarity and rejuvenation.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial care',
          src: '/images/services/skin-waxing.jpg',
        },
      },
    ],
  },

  nail: {
    slug: 'nail',
    name: 'Nail',
    category: 'Nail Studio',
    tagline: 'Russian dry apex manicures, durable soft-gel architecture and refined hand artistry.',
    intro: [
      'High-end nail work is about cuticle health, structural strength, and clean geometry. We practice dry e-file manicures that clear the nail plate thoroughly without cutting live skin.',
      'Whether you choose minimal nude apex alignment, durable builder-gel extensions, or fine-line chrome details, your nails retain structural resilience for weeks without lifting or chipping.',
    ],
    includes: [
      'Diagnostic nail plate & cuticle assessment',
      'Russian dry apparatus cuticle alignment',
      'Rubber-base apex architecture & strengthening',
      'Long-wearing gel polish or minimalist nail art',
    ],
    benefits: [
      'Flawless cuticle line that grows out smoothly without hangnails',
      'Reinforced apex preventing natural nail cracking and splitting',
      'Chip-free, mirror-gloss durability for up to 4 weeks',
    ],
    suitableFor: [
      'Individuals with weak, brittle, or peeling natural nails',
      'Anyone desiring meticulous cuticle framing and clean lines',
      'Bridal parties and professionals requiring immaculate presentation',
    ],
    preparation: [
      'Avoid soaking nails in water or oils for 2 hours before your visit',
      'Do not pick, trim, or cut cuticles prior to your appointment',
      'Inform your artist of any nail sensitivities, allergies, or past acrylic damage',
    ],
    aftercare: [
      'Apply pure jojoba or cuticle elixir every evening before sleep',
      'Wear protective gloves when handling household chemicals or doing dishes',
      'Schedule infill or removal between 3 and 4 weeks to protect the apex',
    ],
    duration: 'Typically 60 to 120 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Nail health evaluation',
        text: 'We inspect curvature, plate thickness, and existing product to choose the ideal base system.',
      },
      {
        title: 'Dry Russian prep',
        text: 'Micro-diamond burs gently polish the cuticle perimeter, creating a pristine canvas.',
      },
      {
        title: 'Apex engineering',
        text: 'Self-leveling builder gel creates an anatomical stress point, reinforcing the natural nail.',
      },
      {
        title: 'Color & top seal',
        text: 'Pigment is pushed under the proximal nail fold for a deep finish, sealed with high-gloss topcoat.',
      },
    ],
    media: {
      hero: {
        file: 'nail/hero.jpg',
        alt: 'Nail service: gel manicure close-up',
        src: '/images/services/nail-detailing.jpg',
      },
      supporting: {
        file: 'nail/detail.jpg',
        alt: 'Nail art and cuticle detailing',
        src: '/images/gallery/luxury-marble-manicure.webp',
      },
      reel: {
        file: 'nail/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'nail/gallery-1.jpg',
          alt: 'Luxury marble manicure finish',
          caption: 'Luxury marble manicure finish',
          src: '/images/gallery/luxury-marble-manicure.webp',
        },
        {
          file: 'nail/gallery-2.jpg',
          alt: 'Russian dry cuticle alignment',
          caption: 'Russian dry cuticle alignment',
          src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'nail/gallery-3.jpg',
          alt: 'Chrome fine line accents',
          caption: 'Chrome fine line accents',
          src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'nail/gallery-4.jpg',
          alt: 'Soft gel nail extension architecture',
          caption: 'Soft gel nail extension architecture',
          src: 'https://images.unsplash.com/photo-1519014816548-bf785179c2ff?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'nail/gallery-5.jpg',
          alt: 'Natural nude apex reinforcement',
          caption: 'Natural nude apex reinforcement',
          src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'nail-artist-1',
        placeholder: true,
        name: 'Chloe Monet',
        specialisation: 'Master Nail Architect & Russian Dry Manicure',
        experience: '8+ Years Nail Artistry',
        bio: 'Certified Russian apparatus educator specializing in anatomical apex alignment and zero-damage cuticle smoothing.',
        skills: ['Russian Dry E-File', 'Soft Gel Extensions', 'Minimalist Fine-Line Art'],
        portrait: {
          file: 'portraits/nail-artist-1.jpg',
          alt: 'Chloe Monet',
          src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'nail-artist-2',
        placeholder: true,
        name: 'Priya Sharma',
        specialisation: 'Bridal Nail Art & Japanese Gel Overlay',
        experience: '6+ Years Nail Artistry',
        bio: 'Specialist in bridal ombré, crystalline encapsulation, and restorative keratin treatments.',
        skills: ['Japanese Gel', 'Bridal Ombre', 'Apex Repair'],
        portrait: {
          file: 'portraits/nail-artist-2.jpg',
          alt: 'Priya Sharma',
          src: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Cut, colour and care shaped around your face, your texture and routine.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair styling',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Facials built on skin diagnostics, not generic menus, for lasting radiance.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial treatments',
          src: '/images/services/skin-waxing.jpg',
        },
      },
      {
        slug: 'spa',
        name: 'Spa',
        desc: 'Deep pressure massage and holistic sensory relaxation.',
        hero: {
          file: 'spa/hero.jpg',
          alt: 'Spa wellness',
          src: '/images/services/spa-wellness.jpg',
        },
      },
    ],
  },

  facial: {
    slug: 'facial',
    name: 'Facial',
    category: 'Facial Studio',
    tagline: 'Facials built on skin diagnostics, not generic menus, restoring cellular vitality and barrier health.',
    intro: [
      'Healthy skin is not created by aggressive peeling; it requires biological respect, barrier restoration, and targeted active serums. Every facial begins with diagnostic skin scanning under polarized light.',
      'From cellular oxygen infusions and ultrasonic deep-pore clearing to 24K gold lifting masks and lymphatic sculpting, our protocols are personalized in real-time to what your skin barrier requires today.',
    ],
    includes: [
      'Comprehensive skin barrier & sebum diagnostic',
      'Ultrasonic gentle pore purification',
      'Targeted peptide or botanical active infusion',
      'Sculptural facial massage & LED phototherapy',
    ],
    benefits: [
      'Deep cellular hydration without pore congestion',
      'Strengthened lipid barrier resistant to urban environmental stressors',
      'Immediate luminous lift and refined skin texture',
    ],
    suitableFor: [
      'Dehydrated, dull, or stressed skin needing immediate recovery',
      'Congested or acne-prone skin requiring careful non-inflammatory extraction',
      'Clients preparing for red carpet, bridal, or photo events',
    ],
    preparation: [
      'Discontinue prescription retinoids or harsh chemical exfoliants 4 days prior',
      'Arrive without heavy makeup when convenient',
      'Mention any skin allergies, pregnancy, or recent aesthetic procedures',
    ],
    aftercare: [
      'Avoid heavy makeup, saunas, and intense workouts for 24 hours',
      'Apply broad-spectrum mineral SPF 50 daily to protect active ingredients',
      'Maintain cellular hydration with recommended hyaluronic home serums',
    ],
    duration: 'Typically 60 to 90 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Diagnostic mapping',
        text: 'We analyze hydration depth, melanin distribution, and lipid barrier integrity under magnification.',
      },
      {
        title: 'Ultrasonic cleansing',
        text: 'Gentle acoustic wave cavitation clears clogged pores without redness or trauma.',
      },
      {
        title: 'Active infusion',
        text: 'Custom serums rich in ceramides, hyaluronic acid, and peptides are delivered into cellular layers.',
      },
      {
        title: 'Sculpt & illuminate',
        text: 'Contouring lymphatic massage stimulates microcirculation, finalized under medical-grade LED light.',
      },
    ],
    media: {
      hero: {
        file: 'facial/hero.jpg',
        alt: 'Facial service: serum application in soft light',
        src: '/images/experience/exp-skin.jpg',
      },
      supporting: {
        file: 'facial/detail.jpg',
        alt: 'Skin analysis and serum preparation',
        src: '/images/gallery/dewy-skin-radiance.webp',
      },
      reel: {
        file: 'facial/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'facial/gallery-1.jpg',
          alt: 'Cellular facial mask application',
          caption: 'Cellular facial mask application',
          src: '/images/gallery/cellular-facial-mask.webp',
        },
        {
          file: 'facial/gallery-2.jpg',
          alt: 'Dewy skin radiance finish',
          caption: 'Dewy skin radiance finish',
          src: '/images/gallery/dewy-skin-radiance.webp',
        },
        {
          file: 'facial/gallery-3.jpg',
          alt: 'Ultrasonic pore purification',
          caption: 'Ultrasonic pore purification',
          src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'facial/gallery-4.jpg',
          alt: 'Lymphatic drainage face massage',
          caption: 'Lymphatic drainage face massage',
          src: 'https://images.unsplash.com/photo-1512290903048-791e8f817004?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'facial/gallery-5.jpg',
          alt: 'LED collagen phototherapy',
          caption: 'LED collagen phototherapy',
          src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'facial-artist-1',
        placeholder: true,
        name: 'Dr. Celine Laurent',
        specialisation: 'Clinical Aesthetician & Dermal Therapist',
        experience: '11+ Years Clinical Aesthetics',
        bio: 'Specialist in non-invasive skin rejuvenation, dermal barrier correction, and non-inflammatory extraction techniques.',
        skills: ['Dermal Diagnostics', 'Ultrasonic Infusion', 'Lymphatic Sculpting'],
        portrait: {
          file: 'portraits/facial-artist-1.jpg',
          alt: 'Dr. Celine Laurent',
          src: 'https://images.unsplash.com/photo-1594824813512-87009405d45d?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'facial-artist-2',
        placeholder: true,
        name: 'Meera Nambiar',
        specialisation: 'Holistic Skin Therapist & Buccal Sculptor',
        experience: '7+ Years Skin Therapy',
        bio: 'Expert in myofascial facial release, natural collagen stimulation, and sensitive skin restoration.',
        skills: ['Buccal Massage', 'Skin Hydration', 'LED Therapy'],
        portrait: {
          file: 'portraits/facial-artist-2.jpg',
          alt: 'Meera Nambiar',
          src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'spa',
        name: 'Spa',
        desc: 'Deep pressure massage and holistic sensory relaxation.',
        hero: {
          file: 'spa/hero.jpg',
          alt: 'Spa sanctuary',
          src: '/images/services/spa-wellness.jpg',
        },
      },
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Precision cuts, dimensional colour, and scalp therapies shaped around your lifestyle.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair couture',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'waxing',
        name: 'Waxing',
        desc: 'Low-temperature hypoallergenic Italian hard wax for smooth, comfortable results.',
        hero: {
          file: 'waxing/hero.jpg',
          alt: 'Waxing suite',
          src: '/images/services/skin-waxing.jpg',
        },
      },
    ],
  },

  waxing: {
    slug: 'waxing',
    name: 'Waxing',
    category: 'Waxing Studio',
    tagline: 'Low-temperature hypoallergenic Italian hard wax for ultra-smooth, comfortable and calming results.',
    intro: [
      'Precision depilation should be gentle, hygienic, and virtually pain-free. We exclusively employ imported low-temperature polymer hard wax that shrink-wraps the hair without adhering to live skin cells.',
      'Completed in tranquil private suites with single-use sterile consumables, pre-wax barrier oils, and soothing argan chamomile mists, every session leaves skin velvety soft without redness or follicle stress.',
    ],
    includes: [
      'Pre-depilation antiseptic skin balance',
      'Botanical pre-wax barrier oil application',
      'Low-temperature polymer hard wax removal',
      'Cooling chamomile astringent & post-wax calming balm',
    ],
    benefits: [
      'Up to 85% less discomfort compared to traditional strip waxing',
      'Zero skin lifting or post-treatment redness',
      'Smoother regrowth with visibly finer hair over repeated visits',
    ],
    suitableFor: [
      'Clients with sensitive, reactive, or eczema-prone skin',
      'Full body, bikini, and facial waxing without skin pulling',
      'Holiday preparations and athletic performance grooming',
    ],
    preparation: [
      'Ensure hair growth is approximately 1/4 inch (grain of rice) for ideal grip',
      'Gently exfoliate the target zone 24 to 48 hours prior to appointment',
      'Avoid sunbathing or spray tanning for 24 hours beforehand',
    ],
    aftercare: [
      'Avoid hot showers, steam baths, pools, and workouts for 24 hours',
      'Wear loose-fitting cotton clothing immediately following the appointment',
      'Begin gentle body exfoliation 3 days post-treatment to prevent ingrowns',
    ],
    duration: 'Typically 30 to 75 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Skin sanitation',
        text: 'The area is purified with an antibacterial tea tree cleanser to maintain optimal sterility.',
      },
      {
        title: 'Barrier protection',
        text: 'A micro-thin layer of chamomile oil ensures the wax adheres solely to the hair shafts.',
      },
      {
        title: 'Low-temp hard wax',
        text: 'Pliable polymer wax is applied in small sections and removed smoothly with minimal sensation.',
      },
      {
        title: 'Soothing hydration',
        text: 'Calming argan and aloe extracts are massaged into the skin, cooling the follicles instantly.',
      },
    ],
    media: {
      hero: {
        file: 'waxing/hero.jpg',
        alt: 'Waxing suite: calm ambient aesthetic',
        src: '/images/services/skin-waxing.jpg',
      },
      supporting: {
        file: 'waxing/detail.jpg',
        alt: 'Botanical pre-wax oils and smooth skin finish',
        src: '/images/services/skin-waxing.jpg',
      },
      reel: {
        file: 'waxing/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'waxing/gallery-1.jpg',
          alt: 'Silkening treatment suite',
          caption: 'Silkening treatment suite',
          src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'waxing/gallery-2.jpg',
          alt: 'Polymer hard wax application',
          caption: 'Polymer hard wax application',
          src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'waxing/gallery-3.jpg',
          alt: 'Argan post-treatment calming mist',
          caption: 'Argan post-treatment calming mist',
          src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'waxing/gallery-4.jpg',
          alt: 'Hygiene and sterilized workstation',
          caption: 'Hygiene and sterilized workstation',
          src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'waxing/gallery-5.jpg',
          alt: 'Smooth skin finish detail',
          caption: 'Smooth skin finish detail',
          src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'waxing-artist-1',
        placeholder: true,
        name: 'Sofia Rossi',
        specialisation: 'Master Depilation Specialist',
        experience: '10+ Years Depilatory Arts',
        bio: 'Specialist in low-temperature speed waxing and virtually painless intimate depilation techniques.',
        skills: ['Polymer Hard Wax', 'Speed Depilation', 'Skin Calming Rituals'],
        portrait: {
          file: 'portraits/waxing-artist-1.jpg',
          alt: 'Sofia Rossi',
          src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'waxing-artist-2',
        placeholder: true,
        name: 'Ananya Kurup',
        specialisation: 'Sensitive Skin Waxing & Post-Care',
        experience: '6+ Years Skin Care',
        bio: 'Expert in hypoallergenic waxing and natural barrier restoration for reactive skin.',
        skills: ['Sensitive Waxing', 'Ingrown Prevention', 'Botanical Soothing'],
        portrait: {
          file: 'portraits/waxing-artist-2.jpg',
          alt: 'Ananya Kurup',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Diagnostic skin analysis and customized barrier hydration for radiant glow.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial therapy',
          src: '/images/services/skin-waxing.jpg',
        },
      },
      {
        slug: 'spa',
        name: 'Spa',
        desc: 'Balinese deep pressure massage and holistic sensory relaxation.',
        hero: {
          file: 'spa/hero.jpg',
          alt: 'Spa sanctuary',
          src: '/images/services/spa-wellness.jpg',
        },
      },
      {
        slug: 'nail',
        name: 'Nail',
        desc: 'Considered manicures and pedicures, from clean shaping to lasting colour.',
        hero: {
          file: 'nail/hero.jpg',
          alt: 'Nail salon',
          src: '/images/services/nail-detailing.jpg',
        },
      },
    ],
  },

  bridal: {
    slug: 'bridal',
    name: 'Bridal',
    category: 'Bridal Studio',
    tagline: 'HD airbrush couture, timeless drapery and royal wedding makeovers crafted for your grand celebration.',
    intro: [
      'Bridal beauty is couture art under high-definition cameras, emotional tears, and bright lights. We orchestrate comprehensive bridal journeys that blend preview trials, skincare preparation, and ceremony execution.',
      'From feather-light HD silicone airbrush makeovers and royal South Indian Kanchipuram or North Indian lehenga drapery to bespoke architectural hairstyles with fresh flowers and heirloom jewellery placement.',
    ],
    includes: [
      'Detailed bridal trial & lighting consultation',
      'HD airbrush water-resistant makeup application',
      'Architectural bridal hair chignon or braid sculpture',
      'Precision saree/lehenga draping & jewellery setting',
    ],
    benefits: [
      '24-hour humidity and tear-resistant radiant finish',
      'Flawless transition between natural daylight and event flash photography',
      'A serene, stress-free private suite on your wedding morning',
    ],
    suitableFor: [
      'Brides desiring personalized modern royalty or heritage glamour',
      'Bridal parties and close family members',
      'Reception, Muhurtham, Sangeet, and Christian bridal events',
    ],
    preparation: [
      'Schedule a bridal consultation and preview trial 4 to 8 weeks in advance',
      'Bring your wedding outfits, jewellery pieces, and veil/dupatta to the trial',
      'Complete facials and hair coloring 7 to 10 days before the wedding day',
    ],
    aftercare: [
      'Use provided touch-up blotting sheets and lipstick kit throughout the day',
      'Cleanse with a dual-phase oil makeup remover followed by gentle foaming cleanser',
      'Store bridal hair accessories in their protective silk pouch',
    ],
    duration: 'Typically 180 to 240 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Couture trial',
        text: 'We test skin prep, match exact skin tones, and build hairstyle prototypes with your jewelry.',
      },
      {
        title: 'Skin priming',
        text: 'Cold jade rollers and botanical serum ampoules prep your skin for seamless makeup fusion.',
      },
      {
        title: 'Airbrush artistry',
        text: 'Micro-fine pigment misting sculpts natural bone structure with zero cakey weight.',
      },
      {
        title: 'Drape & jewelry',
        text: 'Master drapers pin pleats with millimetre precision and anchor tiaras or matha pattis.',
      },
    ],
    media: {
      hero: {
        file: 'bridal/hero.jpg',
        alt: 'Bridal service: regal bridal couture in wedding suite',
        src: '/images/services/bridal-masterpiece.jpg',
      },
      supporting: {
        file: 'bridal/detail.jpg',
        alt: 'Close detail of bridal makeup and jewellery placement',
        src: '/images/experience/exp-bridal.jpg',
      },
      reel: {
        file: 'bridal/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'bridal/gallery-1.jpg',
          alt: 'Regal bridal couture portrait',
          caption: 'Regal bridal couture portrait',
          src: '/images/gallery/regal-bridal-couture.webp',
        },
        {
          file: 'bridal/gallery-2.jpg',
          alt: 'Bridal updo profile and flower placement',
          caption: 'Bridal updo profile and flower placement',
          src: '/images/gallery/bridal-updo-profile.webp',
        },
        {
          file: 'bridal/gallery-3.jpg',
          alt: 'Glamour makeup portrait with soft radiance',
          caption: 'Glamour makeup portrait with soft radiance',
          src: '/images/gallery/glamour-makeup-portrait.webp',
        },
        {
          file: 'bridal/gallery-4.jpg',
          alt: 'Saree draping and pleat perfection',
          caption: 'Saree draping and pleat perfection',
          src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'bridal/gallery-5.jpg',
          alt: 'Heirloom jewellery anchoring',
          caption: 'Heirloom jewellery anchoring',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'bridal-artist-1',
        placeholder: true,
        name: 'Amina Farooq',
        specialisation: 'Creative Bridal Director & Airbrush Artisan',
        experience: '15+ Years Bridal Couture',
        bio: 'Award-winning bridal artist renowned across India for royal destination weddings, timeless chignons, and skin-like airbrush finishes.',
        skills: ['HD Airbrush', 'Royal Lehenga Draping', 'Jewellery Anchoring', 'High-Glam Eyes'],
        portrait: {
          file: 'portraits/bridal-artist-1.jpg',
          alt: 'Amina Farooq',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'bridal-artist-2',
        placeholder: true,
        name: 'Kavita Menon',
        specialisation: 'Master Saree Draper & Traditional Bridal Stylist',
        experience: '12+ Years Traditional Bridal',
        bio: 'Specialist in South Indian silk saree pleating, traditional temple jewellery styling, and floral hair weaving.',
        skills: ['Kanchipuram Draping', 'Mogra Floral Weave', 'Temple Styling'],
        portrait: {
          file: 'portraits/bridal-artist-2.jpg',
          alt: 'Kavita Menon',
          src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Precision cuts, dimensional colour, and restorative hair rituals.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair styling',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Facials built on skin diagnostics for deep cellular luminosity before the big day.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial treatments',
          src: '/images/services/skin-waxing.jpg',
        },
      },
      {
        slug: 'nail',
        name: 'Nail',
        desc: 'Russian dry apex manicures and delicate bridal nail art.',
        hero: {
          file: 'nail/hero.jpg',
          alt: 'Nail services',
          src: '/images/services/nail-detailing.jpg',
        },
      },
    ],
  },

  spa: {
    slug: 'spa',
    name: 'Spa',
    category: 'Spa Studio',
    tagline: 'Balinese deep pressure massage, heated volcanic stones and holistic sensory relaxation.',
    intro: [
      'In a hurried world, true wellness is found in silence, rhythmic pressure, and botanical warmth. Our spa sanctuary is soundproofed and infused with wild lemongrass, sandalwood, and neroli essences.',
      'From traditional Balinese palm-kneading and heated basalt stone therapies to revitalizing body polish wraps and herbal steam immersions, tension dissolves and energy flows balance naturally.',
    ],
    includes: [
      'Foot cleansing ritual with warm sea salt & essential oils',
      'Full-body custom pressure therapy (medium to deep)',
      'Warm volcanic basalt stone muscle release',
      'Herbal relaxation infusion tea in private recovery lounge',
    ],
    benefits: [
      'Complete muscular tension relief across neck, shoulders, and lower back',
      'Stimulated lymphatic circulation and systemic toxin flush',
      'Calming of the central nervous system and restoration of restful sleep',
    ],
    suitableFor: [
      'Chronic muscular stiffness, fatigue, or postural strain',
      'High-stress individuals seeking profound neurological decompression',
      'Couples and wellness retreat sessions',
    ],
    preparation: [
      'Arrive 15 minutes before your session to unwind with herbal tea',
      'Avoid heavy meals within 90 minutes of your massage',
      'Notify your therapist of any physical injuries, high blood pressure, or pregnancy',
    ],
    aftercare: [
      'Drink plenty of warm water throughout the day to support lymphatic detox',
      'Allow the nourishing therapeutic oils to remain on your skin for 2 hours',
      'Avoid strenuous exercise or heavy alcohol consumption for the evening',
    ],
    duration: 'Typically 60 to 120 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Sensory orientation',
        text: 'Choose your signature aromatherapy oil blend and set your preferred massage pressure.',
      },
      {
        title: 'Foot cleansing',
        text: 'A warm foot soak with peppermint, eucalyptus, and Himalayan salts grounds your breathing.',
      },
      {
        title: 'Deep pressure flow',
        text: 'Long rhythmic strokes, thumb-kneading, and gentle joint stretches unbind stubborn knots.',
      },
      {
        title: 'Stone restoration',
        text: 'Heated volcanic stones glide over spinal lines, delivering deep heat to tight muscles.',
      },
    ],
    media: {
      hero: {
        file: 'spa/hero.jpg',
        alt: 'Spa sanctuary: ambient tranquil treatment suite',
        src: '/images/services/spa-wellness.jpg',
      },
      supporting: {
        file: 'spa/detail.jpg',
        alt: 'Hot volcanic stones and essential oils',
        src: '/images/experience/exp-spa.jpg',
      },
      reel: {
        file: 'spa/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'spa/gallery-1.jpg',
          alt: 'Volcanic stone placement ritual',
          caption: 'Volcanic stone placement ritual',
          src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'spa/gallery-2.jpg',
          alt: 'Aromatherapy botanical oil blending',
          caption: 'Aromatherapy botanical oil blending',
          src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'spa/gallery-3.jpg',
          alt: 'Private relaxation lounge',
          caption: 'Private relaxation lounge',
          src: '/images/about/spa-lounge.jpg',
        },
        {
          file: 'spa/gallery-4.jpg',
          alt: 'Balinese rhythmic body massage',
          caption: 'Balinese rhythmic body massage',
          src: '/images/about/massage-suite.jpg',
        },
        {
          file: 'spa/gallery-5.jpg',
          alt: 'Herbal steam and shower suite',
          caption: 'Herbal steam and shower suite',
          src: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'spa-artist-1',
        placeholder: true,
        name: 'Kadek Suryani',
        specialisation: 'Master Balayage & Balinese Bodywork Therapist',
        experience: '14+ Years International Wellness',
        bio: 'Born and trained in Bali, Kadek combines ancient palm pressure, acupressure meridians, and rhythmic percussion for transformative stress relief.',
        skills: ['Traditional Balinese', 'Volcanic Hot Stone', 'Lomi Lomi', 'Aromatherapy'],
        portrait: {
          file: 'portraits/spa-artist-1.jpg',
          alt: 'Kadek Suryani',
          src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'spa-artist-2',
        placeholder: true,
        name: 'Rahul Varma',
        specialisation: 'Deep Tissue & Sports Recovery Specialist',
        experience: '8+ Years Physical Therapy',
        bio: 'Expert in myofascial trigger point release, chronic shoulder tightness, and post-workout muscle restoration.',
        skills: ['Deep Tissue', 'Trigger Point Therapy', 'Spinal Alignment'],
        portrait: {
          file: 'portraits/spa-artist-2.jpg',
          alt: 'Rahul Varma',
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'facial',
        name: 'Facial',
        desc: 'Facials built on skin diagnostics for deep cellular radiance and hydration.',
        hero: {
          file: 'facial/hero.jpg',
          alt: 'Facial treatments',
          src: '/images/services/skin-waxing.jpg',
        },
      },
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Cut, colour and care shaped around your face, texture and routine.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair salon cut',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'waxing',
        name: 'Waxing',
        desc: 'Low-temperature hypoallergenic Italian hard wax for smooth, comfortable results.',
        hero: {
          file: 'waxing/hero.jpg',
          alt: 'Waxing suite',
          src: '/images/services/skin-waxing.jpg',
        },
      },
    ],
  },

  tattoo: {
    slug: 'tattoo',
    name: 'Tattoo',
    category: 'Tattoo Studio',
    tagline: 'Single-needle fine-line delicacy, sacred geometry and bespoke custom talisman ink.',
    intro: [
      'Body art is permanent personal iconography. We reject rushed catalog stencils in favor of intimate custom design, where every curve, line weight, and shade gradient responds directly to your body’s anatomy.',
      'Conducted in an ultra-hygienic private suite adhering to hospital-grade sterilization, single-use titanium cartridges, and vegan carbon-black pigments that age gracefully into your skin.',
    ],
    includes: [
      'One-on-one custom design & anatomy consultation',
      'Digital sizing & sterile stencil placement check',
      'Single-needle fine-line or illustrative tattoo session',
      'Medical-grade second-skin protective dressing & aftercare kit',
    ],
    benefits: [
      'Feather-light fine-line detailing with crisp ink retention',
      'Minimal dermal trauma and rapid, clean healing process',
      'Completely original bespoke artwork created exclusively for you',
    ],
    suitableFor: [
      'First-timers wanting subtle, discreet fine-line or script tattoos',
      'Collectors seeking intricate micro-realism or sacred geometry',
      'Artistic cover-ups and memorial talisman pieces',
    ],
    preparation: [
      'Get a full night of rest and eat a substantial meal 1 hour prior to appointment',
      'Stay thoroughly hydrated and do not consume alcohol for 24 hours beforehand',
      'Wear comfortable clothing allowing easy, non-restrictive access to the tattoo site',
    ],
    aftercare: [
      'Keep medical protective second-skin bandage intact for 3 to 5 days as directed',
      'Wash gently with warm water and fragrance-free antibacterial liquid soap',
      'Apply a rice-grain amount of vegan tattoo balm twice daily; avoid sun and soaking',
    ],
    duration: 'Typically 90 to 240 minutes. Confirmed at consultation.',
    process: [
      {
        title: 'Design consultation',
        text: 'We review reference ideas, sketch concepts, and measure the exact anatomical canvas.',
      },
      {
        title: 'Stencil placement',
        text: 'Precision transfer stencils are placed and checked from multiple body angles in natural posture.',
      },
      {
        title: 'Sterile ink craft',
        text: 'Using rotary machines and micro-fine needles, ink is implanted with gentle, steady pressure.',
      },
      {
        title: 'Second-skin seal',
        text: 'The finished piece is sanitized and sealed with a breathable waterproof medical membrane.',
      },
    ],
    media: {
      hero: {
        file: 'tattoo/hero.jpg',
        alt: 'Tattoo studio: single-needle precision tattoo art',
        src: '/images/services/custom-tattoo.jpg',
      },
      supporting: {
        file: 'tattoo/detail.jpg',
        alt: 'Close up of single needle line work on skin',
        src: '/images/services/custom-tattoo.jpg',
      },
      reel: {
        file: 'tattoo/reel.mp4',
        src: null,
      },
      gallery: [
        {
          file: 'tattoo/gallery-1.jpg',
          alt: 'Single needle botanical fine-line tattoo',
          caption: 'Single needle botanical fine-line tattoo',
          src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'tattoo/gallery-2.jpg',
          alt: 'Sacred geometry mandala precision work',
          caption: 'Sacred geometry mandala precision work',
          src: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'tattoo/gallery-3.jpg',
          alt: 'Micro realism portrait finish',
          caption: 'Micro realism portrait finish',
          src: 'https://images.unsplash.com/photo-1590246814883-57c669145946?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'tattoo/gallery-4.jpg',
          alt: 'Sterile workstation and titanium cartridges',
          caption: 'Sterile workstation and titanium cartridges',
          src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=85',
        },
        {
          file: 'tattoo/gallery-5.jpg',
          alt: 'Delicate script wrist placement',
          caption: 'Delicate script wrist placement',
          src: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1200&q=85',
        },
      ],
    },
    artists: [
      {
        id: 'tattoo-artist-1',
        placeholder: true,
        name: 'Vikram Seth',
        specialisation: 'Master Fine-Line & Micro-Realism Tattoo Artist',
        experience: '10+ Years Tattoo Artistry',
        bio: 'Specialist in single-needle botanical illustration, intricate sacred geometry, and soft-whip shading.',
        skills: ['Single Needle', 'Micro-Realism', 'Botanical Ink', 'Sacred Geometry'],
        portrait: {
          file: 'portraits/tattoo-artist-1.jpg',
          alt: 'Vikram Seth',
          src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        },
      },
      {
        id: 'tattoo-artist-2',
        placeholder: true,
        name: 'Zoya Khan',
        specialisation: 'Minimalist Talisman & Script Specialist',
        experience: '6+ Years Fine-Line Art',
        bio: 'Celebrated for delicate typography, celestial iconography, and minimalist anatomical placement.',
        skills: ['Delicate Script', 'Fine Line Florals', 'Minimalist Iconography'],
        portrait: {
          file: 'portraits/tattoo-artist-2.jpg',
          alt: 'Zoya Khan',
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
      },
    ],
    related: [
      {
        slug: 'beard-grooming',
        name: 'Beard & Grooming',
        desc: 'Precision beard sculpting and classic grooming, finished with the calm of a proper barber chair.',
        hero: {
          file: 'beard-grooming/hero.jpg',
          alt: 'Barber grooming',
          src: '/images/services/beard-grooming.jpg',
        },
      },
      {
        slug: 'hair',
        name: 'Hair',
        desc: 'Precision cuts, dimensional colour, and scalp therapies shaped around your lifestyle.',
        hero: {
          file: 'hair/hero.jpg',
          alt: 'Hair couture',
          src: '/images/services/hair-couture.jpg',
        },
      },
      {
        slug: 'spa',
        name: 'Spa',
        desc: 'Balinese deep pressure massage and holistic sensory relaxation.',
        hero: {
          file: 'spa/hero.jpg',
          alt: 'Spa sanctuary',
          src: '/images/services/spa-wellness.jpg',
        },
      },
    ],
  },
};

// Aliases
SERVICES_DETAIL_MAP['face'] = SERVICES_DETAIL_MAP['facial'];

export const ALL_SERVICE_DETAIL_SLUGS = [
  'hair',
  'beard-grooming',
  'nail',
  'facial',
  'waxing',
  'bridal',
  'spa',
  'tattoo',
  'face', // alias
];

export function getServiceDetailData(slug: string): ServiceDetailData | null {
  return SERVICES_DETAIL_MAP[slug] || null;
}

