/**
 * Byju Spark Saloon International — Studios Domain Data
 * Comprehensive data architecture for all eight luxury studio categories.
 */

export interface StudioServiceSubType {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  price?: string;
  image?: string;
}

export interface StudioService {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  price: string;
  image: string;
  popular?: boolean;
  category?: string;
  subTypes?: StudioServiceSubType[];
}

export interface StudioGalleryMedia {
  id: string;
  title: string;
  category: 'Studio' | 'Treatments' | 'Results' | 'Behind the Scenes';
  mediaType: 'image' | 'video';
  url: string;
  thumbnail: string;
  caption: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface StudioArtist {
  id: string;
  name: string;
  designation: string;
  speciality: string;
  experience: string;
  biography: string;
  skills: string[];
  profileImage: string;
  portfolio: string[];
}

export interface StudioData {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  heroMedia: {
    type: 'image' | 'video';
    url: string;
    poster?: string;
    alt: string;
  };
  introduction: {
    title: string;
    philosophy: string;
    speciality: string;
    image: string;
    stats: { label: string; value: string }[];
  };
  services: StudioService[];
  gallery: StudioGalleryMedia[];
  artists: StudioArtist[];
  seoTitle: string;
  seoDescription: string;
  accentColor: string;
  themeHue: string;
}

export const STUDIOS_DATA: Record<string, StudioData> = {
  // 01 — HAIR STUDIO
  hair: {
    id: 'hair',
    slug: 'hair',
    name: 'Hair Couture & Balayage Atelier',
    eyebrow: 'STUDIO 01 — HAUTE COIFFURE',
    tagline: 'Sculptural Precision & Color Alchemy Tailored to Your Facial Architecture',
    description:
      'Immerse yourself in precision architectural haircuts, bespoke French balayage, diamond-shine keratin silk infusions, and revitalizing caviar scalp rituals performed by master hair directors.',
    heroMedia: {
      type: 'image',
      url: '/images/services/hair-couture.jpg',
      alt: 'Byju Spark Hair Couture Atelier',
    },
    introduction: {
      title: 'Architectural Haircraft Engineered for Impact',
      philosophy:
        'Hair is sculptural art in living motion. We reject cookie-cutter formulas in favor of anatomical bone-structure analysis, custom hair-weight redistribution, and French multidimensional pigment weaving that grows out seamlessly.',
      speciality: 'Official Kérastase & Olaplex Professional Partner Atelier',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Master Stylists', value: '8+' },
        { label: 'Bespoke Balayages', value: '3,200+' },
        { label: 'Couture Protocols', value: '14' },
      ],
    },
    services: [
      {
        id: 'hair-precision-cut',
        name: 'Haute Precision Architectural Haircut',
        description: 'Bespoke bone-structure consultation, precision scissors detailing, diamond-shine blowout, and structural finishing.',
        benefits: ['Facial silhouette balancing', 'Weightless movement', 'Long-lasting structural shape'],
        duration: '60 mins',
        price: '₹1,800',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'hair-french-balayage',
        name: 'French Balayage & Dimensional Melt',
        description: 'Freehand hand-painted dimensional contouring with luminous light reflection and custom dual-tone gloss toning.',
        benefits: ['Soft natural regrowth line', 'Custom metallic tones', 'Zero harsh foil striping'],
        duration: '180 mins',
        price: '₹7,500',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'hair-liquid-silk-keratin',
        name: 'Liquid Silk Keratin Restructuring',
        description: 'Advanced molecular smoothing therapy eliminating up to 95% frizz while sealing mirror-finish cuticle shine.',
        benefits: ['Humidity-proof finish for 4+ months', 'Halves morning blow-dry time', 'Infused with botanical amino acids'],
        duration: '150 mins',
        price: '₹6,800',
        image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'hair-chronologiste-caviar',
        name: 'Chronologiste Caviar Scalp & Fiber Ritual',
        description: 'Sublime scalp revitalization using mimetic caviar pearls, Abyssine extract, and therapeutic shiatsu acupressure head massage.',
        benefits: ['Scalp cellular regeneration', 'Deep fiber plumping', 'Therapeutic tension release'],
        duration: '75 mins',
        price: '₹3,200',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'hair-organic-cysteine',
        name: 'Cysteine Organic Protein Treatment',
        description: 'Formaldehyde-free organic amino acid restructuring engineered specifically for sensitized and color-compromised hair fibers.',
        benefits: ['Gentle natural straightening', 'Restores elasticity', 'Safe for all hair densities'],
        duration: '120 mins',
        price: '₹5,500',
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'hair-olaplex-molecular',
        name: 'Olaplex Molecular Bond Reconstruction',
        description: 'Deep bis-aminopropyl diglycol dimaleate patented therapy rebuilding broken disulfide bonds caused by heat and chemical stress.',
        benefits: ['Immediate tensile strength recovery', 'Prevents split-end breakage', 'Pre-color shield'],
        duration: '45 mins',
        price: '₹2,600',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'hair-g1',
        title: 'Runway Backstage Color Chemistry',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=480&q=75',
        caption: 'Master colorists formulating custom tone formulas in our private color dispensary.',
      },
      {
        id: 'hair-g2',
        title: 'Architectural Obsidian Takara Stations',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=480&q=75',
        caption: 'Ergonomic Japanese Takara Belmont chairs bathed in 5000K daylight-accurate salon optics.',
      },
      {
        id: 'hair-g3',
        title: 'Precision Shears Geometric Cutting',
        category: 'Treatments',
        mediaType: 'image',
        url: '/images/gallery/precision-shears-cutting.webp',
        thumbnail: '/images/gallery/precision-shears-cutting.webp',
        caption: 'High-tension shear architecture cutting tailored precisely to bone structure.',
      },
      {
        id: 'hair-g4',
        title: 'Caviar Scalp Treatment Ritual',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=480&q=75',
        caption: 'Therapeutic steam mist infusion with freshly crushed caviar pearl microspheres.',
      },
      {
        id: 'hair-g5',
        title: 'Dimensional Honey Balayage',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=480&q=75',
        caption: 'Seamless micro-weaving blended with warm cinnamon gloss for dynamic volumetric luster.',
      },
      {
        id: 'hair-g6',
        title: 'Master Stylist Atelier Sculpting',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/experience/exp-hair.jpg',
        thumbnail: '/images/experience/exp-hair.jpg',
        caption: 'Artisan styling with customized temperature-controlled titanium tools.',
      },
      {
        id: 'hair-g7',
        title: 'Bespoke Blowout Architecture',
        category: 'Treatments',
        mediaType: 'image',
        url: '/images/services/hair-couture.jpg',
        thumbnail: '/images/services/hair-couture.jpg',
        caption: 'Multi-barrel blowout technique providing weightless volume and mirror gloss.',
      },
      {
        id: 'hair-g8',
        title: 'Signature Brunette Editorial Masterpiece',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/signature-brunette.webp',
        thumbnail: '/images/gallery/signature-brunette.webp',
        caption: 'Signature brunette dimensional color with undulating couture silk wave movement.',
      },
    ],
    artists: [
      {
        id: 'artist-adrian-ross',
        name: 'Adrian Ross',
        designation: 'Creative Art Director',
        speciality: 'Precision Geometric Cutting & Editorial Finishes',
        experience: '16+ Years International Experience (London & Milan)',
        biography:
          'Trained at the Vidal Sassoon Academy in London, Adrian specializes in architectural lines and effortless movement tailored to every face shape.',
        skills: ['Geometric Shears', 'Editorial Blowouts', 'Dry Hair Carving', 'Texture Architect'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        id: 'artist-elena-vance',
        name: 'Elena Vance',
        designation: 'Master Balayage & Color Alchemist',
        speciality: 'Seamless French Balayage, Lived-In Blondes & Gloss',
        experience: '12+ Years Color Architecture',
        biography:
          'Elena is renowned across South India for sun-kissed hand-painted balayage transitions that preserve structural cuticle integrity.',
        skills: ['French Balayage', 'Corrective Color', 'Gloss Glazing', 'Shadow Rooting'],
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Luxury Hair Salon & Balayage Atelier | Byju Spark Saloon Kozhikode',
    seoDescription:
      'Experience bespoke architectural haircuts, French balayage, keratin silk treatments, and Kérastase caviar rituals at Byju Spark Hair Atelier, Kozhikode.',
    accentColor: '#d4af37',
    themeHue: '#C99757',
  },

  // 02 — BEARD & GROOMING
  'beard-grooming': {
    id: 'beard-grooming',
    slug: 'beard-grooming',
    name: 'Bespoke Beard & Grooming Atelier',
    eyebrow: 'STUDIO 02 — BARBER ARTISANS',
    tagline: 'Old-World Hot-Towel Craft Meets Architectural Razor Geometry',
    description:
      'A private gentleman’s sanctuary dedicated to precision beard architecture, straight-razor hot lather shaves, luxury scalp tonics, and sculpted skin rituals.',
    heroMedia: {
      type: 'image',
      url: '/images/services/beard-grooming.jpg',
      alt: 'Byju Spark Gentleman Grooming Atelier',
    },
    introduction: {
      title: 'The Art of the Modern Gentleman',
      philosophy:
        'A sharp beard is not sculpted by chance; it is engineered by line, angle, and razor discipline. We combine traditional hot-towel steam therapy with micro-precision fades and organic botanical beard elixirs.',
      speciality: 'Artisan Cut-Throat Shaves & Cedarwood Hot-Towel Therapy',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Master Barbers', value: '5' },
        { label: 'Razor Sculptures', value: '4,500+' },
        { label: 'Botanical Oils', value: '100% Organic' },
      ],
    },
    services: [
      {
        id: 'groom-royal-shave',
        name: 'The Spark Royal Hot-Towel Shave',
        description: 'Pre-shave eucalyptus oil, warm badger-hair badger lather, straight-edge razor glide, cold towel astringent, and soothing balm.',
        benefits: ['Baby-smooth closeness', 'Prevents razor bumps', 'Deep pore steam cleansing'],
        duration: '45 mins',
        price: '₹1,200',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'groom-beard-sculpt',
        name: 'Architectural Beard Sculpt & Razor Lineup',
        description: 'Detailed beard scissor contouring, foil fade on neck, straight razor cheek definition, and warm argan oil press.',
        benefits: ['Accentuates jawline geometry', 'Tames unruly facial hair', 'Includes beard blow-dry & balm'],
        duration: '45 mins',
        price: '₹1,400',
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'groom-executive-cut',
        name: 'Executive Fade & Head Massage Ritual',
        description: 'Skin-taper or low fade cut, hot towel scalp wash, cooling tea tree tonic, and 15-minute invigorating cranial massage.',
        benefits: ['Flawless gradient transition', 'Relieves mental fatigue', 'Day-long styling hold'],
        duration: '60 mins',
        price: '₹1,600',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'groom-charcoal-facial',
        name: 'Gentleman’s Volcanic Charcoal Detox Facial',
        description: 'Ultrasonic pore cleansing, activated bamboo charcoal peel, beard conditioning mask, and matte hydration serum.',
        benefits: ['Clears deep congestion', 'Controls excess oil', 'Brightens tired skin'],
        duration: '60 mins',
        price: '₹2,400',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'groom-g1',
        title: 'Traditional Straight-Edge Razor Shave',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=480&q=75',
        caption: 'Heated lather straight-edge razor glide with artisanal eucalyptus balm.',
      },
      {
        id: 'groom-g2',
        title: 'Obsidian Leather Barber Chairs & Parlour',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=480&q=75',
        caption: 'Handcrafted tufted leather Belmont chairs with heated towel steamers and whiskey trolley.',
      },
      {
        id: 'groom-g3',
        title: 'Sharp Razor Lineup & Fade Contour',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=480&q=75',
        caption: 'Crisp geometrical jaw contouring with smooth skin-fade gradation.',
      },
      {
        id: 'groom-g4',
        title: 'Cedarwood Beard Conditioning Ritual',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=480&q=75',
        caption: 'Organic cedarwood and argan beard butter massaged with wild boar bristles.',
      },
      {
        id: 'groom-g5',
        title: 'Herbal Hot Towel Steam Application',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=480&q=75',
        caption: 'Pressurized lavender steam unlocking pores prior to sculptural razor lining.',
      },
      {
        id: 'groom-g6',
        title: 'Signature Executive Fade Gradation',
        category: 'Results',
        mediaType: 'image',
        url: '/images/testimonials/client-zameel.jpg',
        thumbnail: '/images/testimonials/client-zameel.jpg',
        caption: 'Flawless mid-taper fade harmonized with structured beard lines.',
      },
      {
        id: 'groom-g7',
        title: 'Master Barber Shear Detailing',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=480&q=75',
        caption: 'Japanese steel scissors detailing mustache geometry and cheek contours.',
      },
      {
        id: 'groom-g8',
        title: 'The Sculptural Beard Architecture Session',
        category: 'Results',
        mediaType: 'image',
        url: '/images/services/beard-grooming.jpg',
        thumbnail: '/images/services/beard-grooming.jpg',
        caption: 'Complete sculptural beard tailoring and grooming ritual by Master Marcus.',
      },
    ],
    artists: [
      {
        id: 'artist-marcus-kane',
        name: 'Marcus Kane',
        designation: 'Head Master Barber',
        speciality: 'Cut-Throat Straight Razor Shaves & Jawline Geometry',
        experience: '14+ Years Barbering Mastery',
        biography:
          'Marcus is a veteran traditional barber celebrated for his calm hand, razor precision, and bespoke aromatic steam rituals.',
        skills: ['Straight-Edge Shaving', 'Skin Taper Fades', 'Beard Shaping', 'Scalp Tonics'],
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Gentlemen Barber & Beard Studio | Byju Spark Saloon Kozhikode',
    seoDescription:
      'Premium beard architecture, hot towel straight-razor shaves, and executive haircuts at Byju Spark Barber Atelier.',
    accentColor: '#aa8210',
    themeHue: '#936a28',
  },

  // 03 — NAIL STUDIO
  nail: {
    id: 'nail',
    slug: 'nail',
    name: 'Nail Architecture & Detailing Lounge',
    eyebrow: 'STUDIO 03 — HAUTE MANICURE',
    tagline: 'Russian Dry Apex Detailing, Sculpted Gel Architecture & Liquid Chrome Fine-Line Art',
    description:
      'Experience zero-water e-file Russian manicures, Japanese structural soft-gel extensions, obsidian volcanic pedicure rituals, and bespoke metallic chrome designs.',
    heroMedia: {
      type: 'image',
      url: '/images/services/nail-detailing.jpg',
      alt: 'Byju Spark Nail Detailing Studio',
    },
    introduction: {
      title: 'Precision Structural Nail Sculpture',
      philosophy:
        'A manicure is not just a coat of polish—it is micro-architectural refinement. Our clean dry apparatus techniques ensure pristine eponychium detailing and flawless apex curves that resist lifting for over four weeks.',
      speciality: 'Medical-Grade Autoclave Sterilization & Non-Toxic Japanese Gels',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Color Shades', value: '450+' },
        { label: 'Retention Days', value: '28+' },
        { label: 'Sterility Guarantee', value: '100%' },
      ],
    },
    services: [
      {
        id: 'nail-russian-diamond',
        name: 'Signature Russian Diamond Apex Manicure',
        description: 'Micro-precision electric file cuticle detailing, deep hydration bath, structural strengthening overlay, and high-gloss gel enamel.',
        benefits: ['Pristine cuticle line', 'Zero lifting for 4 weeks', 'Natural nail strengthening'],
        duration: '75 mins',
        price: '₹2,200',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'nail-soft-gel-extensions',
        name: 'Haute Sculpted Soft-Gel Extensions',
        description: 'Seamless lightweight extension architecture with bespoke length, shape consultation, and reinforced c-curve apex contouring.',
        benefits: ['Feels as light as natural nails', 'No heavy acrylic odor', 'Flawless stiletto, almond or coffin shapes'],
        duration: '120 mins',
        price: '₹3,800',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'nail-liquid-chrome-art',
        name: 'Liquid Chrome & Fine-Line Metallic Nail Art',
        description: 'Hand-crafted liquid gold leaf, mirror-finish silver chrome burnishing, and minimal geometric fine lines.',
        benefits: ['Reflective runway finish', 'Custom artisan designs', 'Scratch-resistant seal'],
        duration: '45 mins',
        price: '₹1,500',
        image: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'nail-obsidian-pedicure',
        name: 'Obsidian Volcanic Stone Pedicure',
        description: 'Dead sea mineral foot soak, callus peel resurfacing, hot volcanic river stone foot and calf massage, and luminous glaze.',
        benefits: ['Silken baby-soft soles', 'Stimulates lower leg circulation', 'Long-lasting toe enamel'],
        duration: '75 mins',
        price: '₹2,600',
        image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'nail-g1',
        title: 'Luxury Marble Manicure Detail',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/luxury-marble-manicure.webp',
        thumbnail: '/images/gallery/luxury-marble-manicure.webp',
        caption: 'Bespoke marble veining infused with real gold foil leaf.',
      },
      {
        id: 'nail-g2',
        title: 'Nail Lounge Marble Suites & Gold Fixtures',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=480&q=75',
        caption: 'Private manicure bays equipped with medical-grade aerated dust vacuums.',
      },
      {
        id: 'nail-g3',
        title: 'Minimalist Metallic Mirror Chrome Sets',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=480&q=75',
        caption: 'High-gloss chrome burnished over structural apex overlays.',
      },
      {
        id: 'nail-g4',
        title: 'Russian E-File Precision Cuticle Sculpting',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=480&q=75',
        caption: 'Zero-water e-file diamond bit cuticle clean and contouring.',
      },
      {
        id: 'nail-g5',
        title: 'Organic Botanical Rose Hand Bath',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=480&q=75',
        caption: 'Damask rose petal hand soak with nourishing jojoba and argan essences.',
      },
      {
        id: 'nail-g6',
        title: 'High-Gloss Sheer Apex Overlay',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=480&q=75',
        caption: 'Flawless glass reflection across curved almond nail architecture.',
      },
      {
        id: 'nail-g7',
        title: 'French BIAB Structure Gel Detailing',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=480&q=75',
        caption: 'Micro-sculpted French tip lines with reinforced strength apex curve.',
      },
      {
        id: 'nail-g8',
        title: 'Master Nail Detailing in Luxury Beige Suite',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/services/nail-detailing.jpg',
        thumbnail: '/images/services/nail-detailing.jpg',
        caption: 'Bespoke manicure and gel nail architecture session by Master Chloe Lin.',
      },
    ],
    artists: [
      {
        id: 'artist-chloe-lin',
        name: 'Chloe Lin',
        designation: 'Master Nail Artist & Educator',
        speciality: 'Russian Dry Manicures & 3D Chrome Geometry',
        experience: '9+ Years Specialized Gel Artistry',
        biography:
          'Chloe trained in Seoul and Tokyo, bringing clean architectural apex sculpting and runway nail art to Spark Salon.',
        skills: ['Russian Dry E-File', 'Japanese Gels', 'Chrome Finishes', 'Apex Alignment'],
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Luxury Nail Studio & Russian Manicures | Byju Spark Saloon',
    seoDescription:
      'Russian dry manicures, gel extensions, and metallic chrome nail art at Byju Spark Nail Detailing Lounge, Kozhikode.',
    accentColor: '#d4af37',
    themeHue: '#b89445',
  },

  // 04 — FACE & CLINICAL DERMA
  face: {
    id: 'face',
    slug: 'face',
    name: 'Face & Clinical Derma Studio',
    eyebrow: 'STUDIO 04 — CLINICAL AESTHETICS',
    tagline: '24K Liquid Gold Cellular Facials, Hydra-Oxygen Dermabrasion & Peptide Infusions',
    description:
      'Dermatological science meets couture relaxation. Transformative medical-grade facials, botanical peels, and deep lymphatic sculpting designed to restore radiant skin.',
    heroMedia: {
      type: 'image',
      url: '/images/services/skin-waxing.jpg',
      alt: 'Byju Spark Face & Derma Studio',
    },
    introduction: {
      title: 'Cellular Luminosity Rooted in Science',
      philosophy:
        'We approach skincare with clinical precision and therapeutic touch. Our treatments combine multi-wavelength LED phototherapy, diamond-tip micro-resurfacing, and bio-fermented peptides that penetrate the dermal matrix.',
      speciality: 'Authorized Dermalogica & Clinical Grade Peptide Infusions',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Clinical Protocols', value: '18' },
        { label: 'Skin Therapies', value: '5,000+' },
        { label: 'Glow Satisfaction', value: '99.4%' },
      ],
    },
    services: [
      {
        id: 'face-24k-gold',
        name: '24K Liquid Gold Rejuvenation Facial',
        description: 'Pure 24K gold foil infusion, ultrasonic peptide delivery, and lymphatic drainage for unmatched glow.',
        benefits: ['Instant red-carpet glow', 'Stimulates collagen synthesis', 'Reduces oxidative stress'],
        duration: '90 mins',
        price: '₹4,800',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'face-hydra-derm',
        name: 'Hydra-Oxygen Diamond Dermabrasion',
        description: 'Triple-action vortex suction, salicylic purification, and hyaluronic hyperbaric oxygen mist.',
        benefits: ['Painless blackhead extraction', 'Deep cellular hydration', 'Smooths uneven skin texture'],
        duration: '75 mins',
        price: '₹3,900',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'face-botanical-peel',
        name: 'Botanical Resurfacing & Luminescent Peel',
        description: 'Enzymatic fruit acid peeling infused with alpine botanical stem cells to accelerate cell renewal and balance skin tone.',
        benefits: ['Fades dark spots', 'Gentle with zero downtime', 'Refines enlarged pores'],
        duration: '60 mins',
        price: '₹3,400',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'face-brow-lamination',
        name: 'Architectural Brow Sculpt & Lamination',
        description: 'Golden ratio facial mapping, keratin brow lamination, custom hybrid tint, and precision tweezing.',
        benefits: ['Full feathered look', 'Shapes unruly brow hairs', 'Lasts up to 6 weeks'],
        duration: '50 mins',
        price: '₹1,900',
        image: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'face-g1',
        title: 'Cellular Facial Hydrogel Mask Ritual',
        category: 'Treatments',
        mediaType: 'image',
        url: '/images/gallery/cellular-facial-mask.webp',
        thumbnail: '/images/gallery/cellular-facial-mask.webp',
        caption: 'Bio-cellulose cooling sheet mask soaked in oligopeptide essence.',
      },
      {
        id: 'face-g2',
        title: 'Hyperbaric Oxygen Infusion Chamber',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=480&q=75',
        caption: 'Pure pressurized oxygen infusing bio-active hyaluronic serum into dermal layers.',
      },
      {
        id: 'face-g3',
        title: '24K Liquid Gold Rejuvenation Facial',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=480&q=75',
        caption: 'Pure 24K gold leaf sheets burnished gently over collagen-stimulating serums.',
      },
      {
        id: 'face-g4',
        title: 'Gua Sha Lymphatic Facial Contouring',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=480&q=75',
        caption: 'Rose quartz gua sha stone sculpting cheekbones and draining lymphatic pathways.',
      },
      {
        id: 'face-g5',
        title: 'Clinical Dermalogica Resurfacing Infusion',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/experience/exp-skin.jpg',
        thumbnail: '/images/experience/exp-skin.jpg',
        caption: 'Targeted peptide and AHA exfoliating cocktail tailored to cellular turnover.',
      },
      {
        id: 'face-g6',
        title: 'LED Phototherapy Cellular Healing',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=480&q=75',
        caption: 'Red and near-infrared multi-wave LED dome promoting ATP fibroblast regeneration.',
      },
      {
        id: 'face-g7',
        title: 'Glass Skin Peptide Hydration Finish',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=480&q=75',
        caption: 'Luminous, glass-like complexion achieved with zero downtime or redness.',
      },
      {
        id: 'face-g8',
        title: 'Luminous Dewy Skin Radiance Portrait',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/dewy-skin-radiance.webp',
        thumbnail: '/images/gallery/dewy-skin-radiance.webp',
        caption: 'Flawless porcelain skin glow captured in natural high-fashion atelier lighting.',
      },
    ],
    artists: [
      {
        id: 'artist-dr-ananya',
        name: 'Dr. Ananya Nair',
        designation: 'Lead Aesthetician & Dermal Specialist',
        speciality: 'Clinical Hydradermabrasion & Anti-Aging Peptides',
        experience: '11+ Years Aesthetic Dermatology',
        biography:
          'Dr. Ananya combines clinical skin science with holistic botanical formulas to create custom treatment plans for every client.',
        skills: ['Cellular Peeling', 'Hydra-Oxygen Delivery', 'LED Phototherapy', 'Facial Lymphatic Drainage'],
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Clinical Facial & Skin Clinic | Byju Spark Saloon Kozhikode',
    seoDescription:
      '24K Gold facials, Hydra-Oxygen therapy, and botanical chemical peels at Byju Spark Face Studio, Calicut.',
    accentColor: '#d4af37',
    themeHue: '#C99757',
  },

  // 05 — WAXING & SILKENING
  waxing: {
    id: 'waxing',
    slug: 'waxing',
    name: 'Waxing & Silkening Suite',
    eyebrow: 'STUDIO 05 — SILK THERAPY',
    tagline: 'Low-Temperature Italian Hard Wax & Soothing Botanical Restorations',
    description:
      'Pain-minimized waxing in ultra-hygienic private suites. Utilizing hypoallergenic chamomile and titanium hard waxes that adhere only to hair, never pulling sensitive skin.',
    heroMedia: {
      type: 'image',
      url: '/images/services/skin-waxing.jpg',
      alt: 'Byju Spark Waxing & Silkening Suite',
    },
    introduction: {
      title: 'Effortless Silken Smoothness Without Compromise',
      philosophy:
        'We elevated waxing into a comfortable ritual. With strictly no double-dipping, single-use spatulas, pre-wax barrier oils, and post-wax tea tree soothing compresses, your skin stays calm and smooth.',
      speciality: 'Italian Low-Heat Hypoallergenic Hard Wax Formulations',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Sterility Protocols', value: '100% Single-Use' },
        { label: 'Sensitivity Rating', value: 'Pain-Minimized' },
        { label: 'Smoothness Days', value: '25+' },
      ],
    },
    services: [
      {
        id: 'wax-full-body-silk',
        name: 'The Full Body Silken Symphony',
        description: 'Complete full body hair removal using temperature-controlled titanium wax followed by an argan recovery soothing mist.',
        benefits: ['Silky touch for weeks', 'Removes even stubborn short hairs', 'Minimizes ingrown growth'],
        duration: '90 mins',
        price: '₹4,500',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'wax-brazilian-intimate',
        name: 'Bespoke Brazilian & Intimate Care',
        description: 'Private discreet suite treatment with hypoallergenic lavender hard wax and cooling aloe-vera compress.',
        benefits: ['Maximum comfort technique', 'Quick 30-min turnaround', 'Zero skin peeling'],
        duration: '35 mins',
        price: '₹2,200',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'wax-legs-arms',
        name: 'Full Arms & Legs Satin Treatment',
        description: 'Rapid honey-resin strip waxing, ingrown hair exfoliation buff, and calming chamomile oil finish.',
        benefits: ['Smooth flawless skin tone', 'Gentle on sun-exposed skin', 'Hydrating finish'],
        duration: '50 mins',
        price: '₹2,600',
        image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'wax-g1',
        title: 'Heated Treatment Bed & Hygienic Suite',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=480&q=75',
        caption: 'Heated beds with fresh hygienic disposable linens and soothing ambient lighting.',
      },
      {
        id: 'wax-g2',
        title: 'Private Botanical Depilatory Chamber',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/about/massage-suite.jpg',
        thumbnail: '/images/about/massage-suite.jpg',
        caption: 'Strictly sanitized private suite with medical-grade air filtration.',
      },
      {
        id: 'wax-g3',
        title: 'Organic Golden Chamomile Wax Beads Melting',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=480&q=75',
        caption: 'Hypoallergenic Italian wax formulations warmed in copper thermostatic vessels.',
      },
      {
        id: 'wax-g4',
        title: 'Soothing Calendula & Tea Tree Elixir',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=480&q=75',
        caption: 'Pure organic botanicals applied immediately post-treatment to quench epidermal heat.',
      },
      {
        id: 'wax-g5',
        title: 'Post-Waxing Cellular Calming Balm',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=480&q=75',
        caption: 'Cooling cryo-roller infused with hyaluronic barrier restoration gel.',
      },
      {
        id: 'wax-g6',
        title: 'Silken Skin Texture & Feather Glow',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=480&q=75',
        caption: 'Exquisite ultra-smooth finish with zero ingrown hairs or redness.',
      },
      {
        id: 'wax-g7',
        title: 'Precision Golden Eyebrow Architecture',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=480&q=75',
        caption: 'Micro-precision hard wax application defining clean facial arches.',
      },
      {
        id: 'wax-g8',
        title: 'Botanical Smooth Derma Care & Silken Radiance',
        category: 'Results',
        mediaType: 'image',
        url: '/images/services/skin-waxing.jpg',
        thumbnail: '/images/services/skin-waxing.jpg',
        caption: 'Velvety smooth, radiant finish delivered through signature botanical protocols.',
      },
    ],
    artists: [
      {
        id: 'artist-meera-krishna',
        name: 'Meera Krishna',
        designation: 'Senior Silkening Specialist',
        speciality: 'Rapid Low-Pain Waxing & Post-Epilation Skin Therapy',
        experience: '8+ Years Luxury Waxing Practice',
        biography:
          'Meera is beloved by regular clients for her fast, gentle technique and meticulous hygienic standards.',
        skills: ['Hard Wax Precision', 'Ingrown Prevention', 'Sensitive Skin Care'],
        profileImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Hygienic Waxing & Silkening Lounge | Byju Spark Saloon',
    seoDescription:
      'Low-temperature painless hard wax treatments in private sanitized suites at Byju Spark Saloon, Kozhikode.',
    accentColor: '#aa8210',
    themeHue: '#c49a45',
  },

  // 06 — BRIDAL STUDIO
  bridal: {
    id: 'bridal',
    slug: 'bridal',
    name: 'Regal Haute Bridal Atelier',
    eyebrow: 'STUDIO 06 — ROYAL COUTURE',
    tagline: 'HD Airbrush Radiance, Bespoke Royal Draping & Timeless Bridal Hair Sculpting',
    description:
      'The crown jewel of Kerala bridal transformations. From royal Kerala Muhurtham ceremonies to opulent North Indian receptions, we craft radiant, tear-proof looks that last all day.',
    heroMedia: {
      type: 'image',
      url: '/images/services/bridal-masterpiece.jpg',
      alt: 'Byju Spark Regal Bridal Atelier',
    },
    introduction: {
      title: 'Your Royal Wedding Day Symphony',
      philosophy:
        'A bride is poetry in motion. Our atelier curates every element in harmony—skin undertone matching, high-definition airbrush coverage that never looks cakey under 4K lenses, couture dupatta draping, and heirloom jewelry placement.',
      speciality: 'Waterproof 24-Hour HD Airbrush & Master Draping Artisans',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Royal Brides', value: '1,800+' },
        { label: 'Airbrush Longevity', value: '24 Hours' },
        { label: 'Bridal Artisans', value: '10' },
      ],
    },
    services: [
      {
        id: 'bridal-royal-signature',
        name: 'The Spark Royal Bridal Symphony',
        description: 'HD Airbrush makeup, couture hair sculpting, dupatta & jewelry draping, and pre-ceremony touchup kit.',
        benefits: ['4K camera flawless coverage', '100% tear and sweat proof', 'Includes premium lashes & hair extensions'],
        duration: '240 mins',
        price: '₹22,000',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'bridal-muhurtham',
        name: 'Traditional Kerala Muhurtham Elegance',
        description: 'Gold-accented classic bridal makeup, jasmine floral hair ornamentation, and traditional kasavu saree pleat draping.',
        benefits: ['Authentic temple bridal aesthetics', 'Lightweight skin finish', 'Pristine traditional styling'],
        duration: '180 mins',
        price: '₹16,500',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'bridal-pre-radiance',
        name: '7-Day Pre-Bridal Cellular Bootcamp',
        description: 'Complete head-to-toe skin polishing, full-body exfoliation, hair stem-cell therapy, and relaxation massages.',
        benefits: ['Glow from within', 'Silky hydrated complexion', 'Pre-wedding stress relief'],
        duration: '7 sessions',
        price: '₹28,000',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'bridal-groom-regal',
        name: 'Haute Groom Styling & Skin Perfection',
        description: 'Pre-wedding facial, beard sculpting, scalp rejuvenation, and discreet complexion evening.',
        benefits: ['Natural matte groom finish', 'Camera-ready confidence', 'Coordinated couple aesthetics'],
        duration: '120 mins',
        price: '₹7,500',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'bridal-g1',
        title: 'Couture Chignon Updo with Pearl Hairpins',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/bridal-updo-profile.webp',
        thumbnail: '/images/gallery/bridal-updo-profile.webp',
        caption: 'Handcrafted floral hair adornment pinned into architectural bridal updo.',
      },
      {
        id: 'bridal-g2',
        title: 'Royal Bridal Suite & Ornate Dressing Mirrors',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=480&q=75',
        caption: 'Private VIP bridal salon with panoramic dressing mirrors, lounge, and dress steamer.',
      },
      {
        id: 'bridal-g3',
        title: 'Traditional Muhurtham Silk Saree Pleats',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=480&q=75',
        caption: 'Traditional kasavu pleats and temple gold jewelry styled with dewy airbrush makeup.',
      },
      {
        id: 'bridal-g4',
        title: 'Master MUA Airbrush HD Radiance Session',
        category: 'Treatments',
        mediaType: 'image',
        url: '/images/experience/exp-bridal.jpg',
        thumbnail: '/images/experience/exp-bridal.jpg',
        caption: 'Precision airbrush contouring and fine eye artistry by senior bridal masters.',
      },
      {
        id: 'bridal-g5',
        title: 'Kundan & Temple Gold Jewelry Adornment',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=75',
        caption: 'Bespoke heirloom jewelry placement and veil pinning prior to muhurtham entrance.',
      },
      {
        id: 'bridal-g6',
        title: 'Regal Bridal Couture in Crimson Silk',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/regal-bridal-couture.webp',
        thumbnail: '/images/gallery/regal-bridal-couture.webp',
        caption: 'Rich crimson velvet lehenga with zardozi embroidery and royal glow.',
      },
      {
        id: 'bridal-g7',
        title: 'Haute Bridal Dressing in Golden Atelier',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/services/bridal-masterpiece.jpg',
        thumbnail: '/images/services/bridal-masterpiece.jpg',
        caption: 'Royal bridal couture preparation in private suite with dedicated concierge.',
      },
      {
        id: 'bridal-g8',
        title: 'Royal Indian Bride Glamour Portrait',
        category: 'Results',
        mediaType: 'image',
        url: '/images/gallery/glamour-makeup-portrait.webp',
        thumbnail: '/images/gallery/glamour-makeup-portrait.webp',
        caption: 'The signature Byju Spark bridal face: airbrush perfection, kohl eye drama, and gold chandelier earrings.',
      },
    ],
    artists: [
      {
        id: 'artist-farzana-khan',
        name: 'Farzana Khan',
        designation: 'Celebrity Bridal Creative Director',
        speciality: 'HD Airbrush Couture & South Indian Saree Draping',
        experience: '15+ Years Bridal Transformations',
        biography:
          'Farzana has transformed over 1,500 brides across the UAE and India, celebrated for her calm presence and timeless eye.',
        skills: ['HD Airbrushing', 'Saree Pleat Architecture', 'Bridal Chignons', 'Jewelry Styling'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Best Bridal Makeup & Makeover Studio | Byju Spark Saloon Kozhikode',
    seoDescription:
      'HD Airbrush bridal makeup, traditional Kerala Muhurtham styling, and pre-bridal packages at Byju Spark Bridal Atelier.',
    accentColor: '#d4af37',
    themeHue: '#C41230',
  },

  // 07 — SPA & WELLNESS
  spa: {
    id: 'spa',
    slug: 'spa',
    name: 'Holistic Spa & Wellness Sanctuary',
    eyebrow: 'STUDIO 07 — SENSORY WELLNESS',
    tagline: 'Ancient Balinese Acupressure Fused with Heated Nordic Volcanic Stone Therapies',
    description:
      'Step out of the city and into quiet serenity. Fragrant cedarwood steam, authentic Balinese deep-tissue massage, and warm volcanic basalt stone therapies to renew body and spirit.',
    heroMedia: {
      type: 'image',
      url: '/images/services/spa-wellness.jpg',
      alt: 'Byju Spark Spa Sanctuary',
    },
    introduction: {
      title: 'A Sacred Oasis of Deep Equilibrium',
      philosophy:
        'True beauty flows from an unhurried, restored nervous system. Our sanctuary pairs ancient Eastern energy meridian pressure with cold-pressed botanical oils of sandalwood, bergamot, and warm amber.',
      speciality: 'Nero Basalt Volcanic Stones & Custom Cold-Pressed Herbal Elixirs',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Private Suites', value: '6' },
        { label: 'Herbal Infusions', value: '100% Pure' },
        { label: 'Therapeutic Hours', value: '12,000+' },
      ],
    },
    services: [
      {
        id: 'spa-balinese-awakening',
        name: 'Balinese Deep Awakening Massage',
        description: 'Rhythmic acupressure, palm pressure, and essential oils of sandalwood & warm amber for total renewal.',
        benefits: ['Deep muscle knot release', 'Stimulates lymphatic drainage', 'Restores mental clarity'],
        duration: '90 mins',
        price: '₹3,600',
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'spa-nero-hot-stone',
        name: 'Nero Basalt Warm Stone Therapy',
        description: 'Heated obsidian river stones gliding along meridians with cedarwood & bergamot infusions.',
        benefits: ['Melts deep-seated chronic tension', 'Improves sleep quality', 'Deep warmth and soothing relaxation'],
        duration: '90 mins',
        price: '₹4,200',
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'spa-myofascial-deep-tissue',
        name: 'Therapeutic Myofascial Deep Tissue',
        description: 'Targeted deep-layer muscle release engineered to alleviate chronic postural strain, neck stiffness, and fatigue.',
        benefits: ['Postural realignment', 'Breaks fascia adhesions', 'Athletic recovery'],
        duration: '75 mins',
        price: '₹3,400',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'spa-moroccan-argan-scrub',
        name: 'Moroccan Gold Argan & Coffee Scrub',
        description: 'Exfoliating crushed roasted beans, gold shimmer elixir, and rich argan butter body wrap.',
        benefits: ['Velvety soft skin texture', 'Cellulite smoothing circulation', 'Aromatic awakening'],
        duration: '60 mins',
        price: '₹2,800',
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'spa-g1',
        title: 'Heated Volcanic Stone Alignment Therapy',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=480&q=75',
        caption: 'Warm volcanic stones aligned along spinal energy chakras.',
      },
      {
        id: 'spa-g2',
        title: 'Copper Soaking Tubs with Rose Petals & Sea Salts',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=480&q=75',
        caption: 'Handcrafted copper soaking tubs sprinkled with rose petals and sea salts.',
      },
      {
        id: 'spa-g3',
        title: 'Sanctuary Relaxation Lounge with Herbal Bar',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/about/spa-lounge.jpg',
        thumbnail: '/images/about/spa-lounge.jpg',
        caption: 'Quiet lounge sanctuary with warm herbal tea infusions and ambient dim lighting.',
      },
      {
        id: 'spa-g4',
        title: 'Balinese Acupressure Deep Tissue Massage',
        category: 'Treatments',
        mediaType: 'image',
        url: '/images/experience/exp-spa.jpg',
        thumbnail: '/images/experience/exp-spa.jpg',
        caption: 'Deep meridian tissue release with warm sweet almond and jasmine essential oils.',
      },
      {
        id: 'spa-g5',
        title: 'Herbal Botanical Essential Oils & Tonics',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1512290900672-1f02e64f0288?auto=format&fit=crop&w=480&q=75',
        caption: 'Pure organic essential oils blended fresh before every therapeutic session.',
      },
      {
        id: 'spa-g6',
        title: 'Private Steam & Detox Suite',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/about/massage-suite.jpg',
        thumbnail: '/images/about/massage-suite.jpg',
        caption: 'Private relaxation sanctuary suite with eucalyptus aromatherapy shower.',
      },
      {
        id: 'spa-g7',
        title: 'Warm Herbal Compress Restorative Therapy',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=480&q=75',
        caption: 'Steamed lemongrass and ginger herbal bundles relieving deep myofascial tension.',
      },
      {
        id: 'spa-g8',
        title: 'Cellular Spa Sanctuary Experience',
        category: 'Results',
        mediaType: 'image',
        url: '/images/services/spa-wellness.jpg',
        thumbnail: '/images/services/spa-wellness.jpg',
        caption: 'The pinnacle of luxury restorative wellness at Byju Spark Saloon.',
      },
    ],
    artists: [
      {
        id: 'artist-wayan-sutrisna',
        name: 'Wayan Sutrisna',
        designation: 'Master Balayage & Wellness Therapist',
        speciality: 'Balinese Traditional Acupressure & Volcanic Stone Therapy',
        experience: '13+ Years Holistic Wellness Practice',
        biography:
          'Born in Bali, Wayan studied traditional Indonesian massage healing before bringing his restorative touch to Spark Spa.',
        skills: ['Balinese Deep Tissue', 'Hot Stone Alignment', 'Acupressure', 'Aroma Blending'],
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Luxury Balinese Spa & Wellness Center | Byju Spark Saloon',
    seoDescription:
      'Balinese massages, volcanic hot stone therapies, and body scrubs at Byju Spark Spa Sanctuary, Kozhikode.',
    accentColor: '#d4af37',
    themeHue: '#8B6A28',
  },

  // 08 — CUSTOM TATTOO
  tattoo: {
    id: 'tattoo',
    slug: 'tattoo',
    name: 'Custom Tattoo & Fine Art Ink Atelier',
    eyebrow: 'STUDIO 08 — INK ARCHITECTURE',
    tagline: 'Single-Needle Fine-Line Delicacy, Sacred Geometry & Custom Talisman Art',
    description:
      'Permanent personal fine art created with medical-grade sterile protocols. From single-needle botanical lines and micro-portraits to architectural sleeve compositions.',
    heroMedia: {
      type: 'image',
      url: '/images/services/custom-tattoo.jpg',
      alt: 'Byju Spark Custom Tattoo Atelier',
    },
    introduction: {
      title: 'Permanent Artistry on Living Skin',
      philosophy:
        'A tattoo is an intimate personal narrative. We reject generic flash sheets in favor of deep 1-on-1 collaborative consultations, anatomical flow alignment, and single-needle precision that stays sharp over time.',
      speciality: 'Hospital-Grade Autoclave Sterilization & 100% Vegan Carbon Pigments',
      image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85',
      stats: [
        { label: 'Fine-Line Artworks', value: '2,400+' },
        { label: 'Sterile Rating', value: 'Hospital-Grade' },
        { label: 'Custom Designs', value: '100% Unique' },
      ],
    },
    services: [
      {
        id: 'tattoo-single-needle-fine',
        name: 'Single-Needle Fine-Line Artistry',
        description: 'Micro-precision botanicals, micro-script, and delicate architectural linework with medical-grade pigments.',
        benefits: ['Microscopic crisp detailing', 'Fast gentle healing curve', 'Zero blowout lines'],
        duration: '90 mins',
        price: '₹4,000+',
        image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'tattoo-custom-concept',
        name: 'Bespoke Concept & Tattoo Architecture',
        description: 'Collaborative custom design consultation, anatomical flow placement, and master execution.',
        benefits: ['One-of-a-kind original art', 'Anatomically aligned with body contours', 'Includes sterile touch-up session'],
        duration: '180 mins',
        price: '₹7,500+',
        image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
        popular: true,
      },
      {
        id: 'tattoo-restoration-cover',
        name: 'Tattoo Cover-Up & Re-Enhancement',
        description: 'Transformative reimagining and pigment revitalization for faded or outdated ink designs.',
        benefits: ['Clever negative-space camouflage', 'Restores vibrant saturation', 'Artistic reimagining'],
        duration: '150 mins',
        price: '₹6,000+',
        image: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gallery: [
      {
        id: 'tattoo-g1',
        title: 'Healed Single-Needle Botanical Art',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=480&q=75',
        caption: 'Healed single-needle botanical branch on forearm with ultra-fine line clarity.',
      },
      {
        id: 'tattoo-g2',
        title: 'Sterile Studio Arena & Autoclave Station',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=480&q=75',
        caption: 'Autoclave-monitored sterile private booth with surgical grade equipment barriers.',
      },
      {
        id: 'tattoo-g3',
        title: 'Freehand Illustration & Skin Stenciling',
        category: 'Behind the Scenes',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1590246814883-57c669145946?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1590246814883-57c669145946?auto=format&fit=crop&w=480&q=75',
        caption: 'Custom carbon anatomical stencil transfer calibrated to natural joint movement.',
      },
      {
        id: 'tattoo-g4',
        title: 'Rotary Machine & Vegan Mineral Pigments',
        category: 'Treatments',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=480&q=75',
        caption: 'Low-vibration Swiss rotary tattoo machine ensuring microscopic skin comfort.',
      },
      {
        id: 'tattoo-g5',
        title: 'Fine-Line Floral Forearm Art',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=480&q=75',
        caption: 'Micro-sculpted wild peony with subtle pepper shading gradients.',
      },
      {
        id: 'tattoo-g6',
        title: 'Sacred Geometry & Micro-Realism Shading',
        category: 'Results',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=480&q=75',
        caption: 'Geometric mandala forearm sleeve with concentric alignment.',
      },
      {
        id: 'tattoo-g7',
        title: 'Artistic Consultation & Design Prep',
        category: 'Studio',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=480&q=75',
        caption: 'Dedicated 1-on-1 concept sketching session in private client gallery.',
      },
      {
        id: 'tattoo-g8',
        title: 'Master Tattoo Artistry in Private Sterile Suite',
        category: 'Studio',
        mediaType: 'image',
        url: '/images/services/custom-tattoo.jpg',
        thumbnail: '/images/services/custom-tattoo.jpg',
        caption: 'Senior artist Vikram Sen executing custom single-needle tattoo in medical arena.',
      },
    ],
    artists: [
      {
        id: 'artist-vikram-sen',
        name: 'Vikram Sen',
        designation: 'Senior Tattoo Artist & Illustrator',
        speciality: 'Single-Needle Botanicals, Micro-Realism & Geometric Mandalas',
        experience: '10+ Years Professional Tattooing',
        biography:
          'A fine arts graduate turned tattoo master, Vikram is celebrated for his soft shading and needle control.',
        skills: ['Single Needle', 'Fine Line Script', 'Sacred Geometry', 'Cover-Up Design'],
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        portfolio: [
          'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
    seoTitle: 'Custom Tattoo & Fine Line Ink Studio | Byju Spark Saloon',
    seoDescription:
      'Single-needle fine-line tattoos, custom designs, and sterile body art at Byju Spark Tattoo Atelier, Kozhikode.',
    accentColor: '#d4af37',
    themeHue: '#a37c35',
  },
};

export const ALL_STUDIO_SLUGS = [
  'hair',
  'beard-grooming',
  'nail',
  'face',
  'waxing',
  'bridal',
  'spa',
  'tattoo',
] as const;

export type StudioSlug = (typeof ALL_STUDIO_SLUGS)[number];

