import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectDB } from '../config/db.js';
import {
  Studio,
  Service,
  Artist,
  Product,
  Academy,
  Media,
  Page,
  Settings,
  AuditLog,
} from '../models/index.js';

dotenv.config();

// Existing data definitions from live files
const STUDIOS_DATA_RAW = [
  {
    slug: 'hair',
    name: 'Hair Couture & Balayage Atelier',
    eyebrow: 'STUDIO 01 — HAUTE COIFFURE',
    shortDescription: 'Precision architectural haircuts, bespoke French balayage, and caviar scalp rituals.',
    description: 'Immerse yourself in precision architectural haircuts, bespoke French balayage, diamond-shine keratin silk infusions, and revitalizing caviar scalp rituals performed by master hair directors.',
    coverImage: '/images/services/hair-couture.jpg',
    bannerImage: '/images/experience/exp-hair.jpg',
    displayOrder: 1,
    isPublished: true,
    services: [
      {
        name: 'Bespoke French Balayage & Gloss',
        slug: 'french-balayage-gloss',
        description: 'Multi-dimensional hand-painted sun-kissed illumination tailored to facial bone structure with custom acidic gloss glaze.',
        duration: '180 mins',
        price: 8500,
        images: ['/images/gallery/signature-brunette.webp'],
        benefits: ['Zero demarcation grow-out', 'Plex bond fortifier infused', 'UV & mineral shield'],
        displayOrder: 1,
      },
      {
        name: 'Precision Editorial Hair Sculpting',
        slug: 'precision-editorial-sculpting',
        description: 'Dry and wet precision shear architecture crafted for hair texture, density, and natural directional movement.',
        duration: '60 mins',
        price: 2500,
        images: ['/images/gallery/precision-shears-cutting.webp'],
        benefits: ['Weightless fluid volume', 'Effortless home styling', 'Dual mirror consultation'],
        displayOrder: 2,
      },
      {
        name: 'Chronologiste Caviar Scalp Ritual',
        slug: 'chronologiste-caviar-ritual',
        description: 'Deep cellular restorative spa ritual with biomimetic caviar pearls and hyaluronic acid scalp massage.',
        duration: '90 mins',
        price: 5200,
        images: ['/images/experience/exp-hair.jpg'],
        benefits: ['Revitalizes scalp microbiome', 'Restores youth fibre elasticity', 'Steam mist absorption'],
        displayOrder: 3,
      },
    ],
    artists: [
      {
        name: 'Byju Spark',
        slug: 'byju-spark',
        designation: 'Founder & Artistic Director',
        experience: '28+ Years Master Craft',
        profileImage: '/images/artists/byju-portrait.jpg',
        bio: 'Pioneering haute coiffure and visionary salon education across South India for three decades.',
        specialities: ['Architectural Haircuts', 'Master French Balayage', 'Celebrity Transformations'],
      },
      {
        name: 'Marcus Vance',
        slug: 'marcus-vance',
        designation: 'Principal Color Director',
        experience: '14 Years Paris / Dubai',
        profileImage: '/images/artists/marcus-color.jpg',
        bio: 'Specialist in dimensional brunette contouring, Scandinavian blonde lifts, and corrective color architecture.',
        specialities: ['Micro-foil Balayage', 'Corrective Bleach', 'Gloss Formulations'],
      },
    ],
  },
  {
    slug: 'beard-grooming',
    name: 'Royal Grooming & Shave Parlour',
    eyebrow: 'STUDIO 02 — BESPOKE MEN',
    shortDescription: 'Straight-razor hot lather shaving, beard sculpting, and executive skin detox.',
    description: 'A sanctuary of gentlemanly refinement offering hot-towel straight razor shaves, anatomical beard fading, charcoal skin clarifying treatments, and scalp stimulation.',
    coverImage: '/images/services/beard-grooming.jpg',
    bannerImage: '/images/services/beard-grooming.jpg',
    displayOrder: 2,
    isPublished: true,
    services: [
      {
        name: 'Royal Hot Towel Straight Razor Shave',
        slug: 'royal-hot-towel-shave',
        description: 'Traditional Turkish double hot-towel infusion with badger brush badger lathering, Japanese feather blade pass, and cold stone tonic splash.',
        duration: '45 mins',
        price: 1800,
        images: ['/images/services/beard-grooming.jpg'],
        benefits: ['Micro-exfoliation', 'Ingrown prevention', 'Sandalwood balm finish'],
        displayOrder: 1,
      },
      {
        name: 'Architectural Beard Sculpt & Fade',
        slug: 'architectural-beard-sculpt',
        description: 'Precision clipper and scissor sculpting aligned to jawline symmetry with razor sharp edge-up.',
        duration: '40 mins',
        price: 1400,
        images: ['/images/services/beard-grooming.jpg'],
        benefits: ['Custom beard oil finish', 'High-definition neckline', 'Cheek symmetry balance'],
        displayOrder: 2,
      },
    ],
    artists: [
      {
        name: 'Tariq Al-Mansoor',
        slug: 'tariq-al-mansoor',
        designation: 'Master Barber & Grooming Specialist',
        experience: '12 Years Royal Grooming',
        profileImage: '/images/artists/tariq-barber.jpg',
        bio: 'Trained in traditional Ottoman straight-razor technique and modern precision fade architecture.',
        specialities: ['Straight-Razor Mastery', 'Beard Anatomy Sculpting', 'Hot Stone Face Revival'],
      },
    ],
  },
  {
    slug: 'nail',
    name: 'Nail Couture & Russian Apex Atelier',
    eyebrow: 'STUDIO 03 — NAIL ATELIER',
    shortDescription: 'Russian dry manicures, BIAB structure overlays, and hand-painted miniature nail art.',
    description: 'Pristine e-file Russian hardware cuticle detailing, architectural apex rubber base reinforcement, and high-fashion artisan gel sculpting.',
    coverImage: '/images/services/nail-detailing.jpg',
    bannerImage: '/images/gallery/luxury-marble-manicure.webp',
    displayOrder: 3,
    isPublished: true,
    services: [
      {
        name: 'Russian Dry Apex Gel Overlay',
        slug: 'russian-dry-apex-overlay',
        description: 'Diamond bit cuticle exfoliation with structural C-curve builder gel apex balancing and under-cuticle color coat.',
        duration: '90 mins',
        price: 3200,
        images: ['/images/gallery/luxury-marble-manicure.webp'],
        benefits: ['4+ week wear', 'Cuticle health protection', 'No clipping micro-detailing'],
        displayOrder: 1,
      },
      {
        name: 'Hand-Painted Marble Art Manicure',
        slug: 'hand-painted-marble-art',
        description: 'Artisanal mineral vein marbling, gold leaf inclusion, and chrome reflection layered over gel extensions.',
        duration: '110 mins',
        price: 4500,
        images: ['/images/services/nail-detailing.jpg'],
        benefits: ['Bespoke luxury motifs', 'Reinforced diamond topcoat', 'Cuticle oil massage'],
        displayOrder: 2,
      },
    ],
    artists: [
      {
        name: 'Anastasia Petrova',
        slug: 'anastasia-petrova',
        designation: 'Senior Russian Manicurist & Nail Artist',
        experience: '10 Years Moscow / Dubai',
        profileImage: '/images/artists/anastasia-nails.jpg',
        bio: 'Pioneer of waterless Russian e-file hardware manicure detailing and structural apex alignment.',
        specialities: ['Russian Hardware Detailing', 'BIAB Apex Engineering', 'Fine Marble Detailing'],
      },
    ],
  },
  {
    slug: 'face',
    name: 'Clinical Derma & Facial Sanctuary',
    eyebrow: 'STUDIO 04 — SKIN ATELIER',
    shortDescription: 'Hydra-infusion resurfacing, cellular oxygen therapy, and buccal lymphatic sculpting.',
    description: 'Medical-grade aesthetic dermatological treatments combining ultrasonic infusion, clinical lactic acid exfoliation, and deep facial muscle contouring.',
    coverImage: '/images/services/skin-wellness.jpg',
    bannerImage: '/images/gallery/cellular-facial-mask.webp',
    displayOrder: 4,
    isPublished: true,
    services: [
      {
        name: 'Cellular Oxygen Radiance Infusion',
        slug: 'cellular-oxygen-infusion',
        description: 'Pressurised pure hyperbaric oxygen delivery with low molecular hyaluronic acid, peptides, and botanical antioxidants.',
        duration: '75 mins',
        price: 4800,
        images: ['/images/gallery/cellular-facial-mask.webp'],
        benefits: ['Instant red-carpet glow', 'Pore detox & decongestion', 'Barrier replenishment'],
        displayOrder: 1,
      },
      {
        name: 'Sculptural Buccal Facial Massage',
        slug: 'sculptural-buccal-facial',
        description: 'Internal oral and external muscle release lifting cheekbones, tightening jaw contour, and relieving myofascial tension.',
        duration: '60 mins',
        price: 3800,
        images: ['/images/gallery/dewy-skin-radiance.webp'],
        benefits: ['Natural cheekbone lift', 'Lymphatic fluid drainage', 'TMJ tension relief'],
        displayOrder: 2,
      },
    ],
    artists: [
      {
        name: 'Dr. Evelyn Reed',
        slug: 'dr-evelyn-reed',
        designation: 'Lead Aesthetic Dermatologist',
        experience: '15 Years Clinical Skincare',
        profileImage: '/images/artists/evelyn-skin.jpg',
        bio: 'Specialist in non-invasive skin rejuvenation, barrier restoration, and advanced cellular mesotherapy.',
        specialities: ['Cellular Oxygen Infusion', 'Dermalogica Resurfacing', 'Myofascial Buccal Lifting'],
      },
    ],
  },
  {
    slug: 'waxing',
    name: 'Gentle Waxing & Silk Skin Suite',
    eyebrow: 'STUDIO 05 — SILK FINISH',
    shortDescription: 'Hypoallergenic peelable hot wax and velvet post-depilatory soothing rituals.',
    description: 'Hygienic, nearly painless depilatory services using low-temperature Australian peel waxes infused with chamomile and lavender.',
    coverImage: '/images/services/skin-waxing.jpg',
    bannerImage: '/images/services/skin-waxing.jpg',
    displayOrder: 5,
    isPublished: true,
    services: [
      {
        name: 'Australian Velvet Botanical Waxing',
        slug: 'australian-velvet-waxing',
        description: 'Low-heat polymer wax that adheres only to hair, completely avoiding skin traction for sensitive body zones.',
        duration: '45 mins',
        price: 1950,
        images: ['/images/services/skin-waxing.jpg'],
        benefits: ['Virtually painless pull', 'No skin redness', 'Calming tea tree finish'],
        displayOrder: 1,
      },
    ],
    artists: [
      {
        name: 'Fatima Zahra',
        slug: 'fatima-zahra',
        designation: 'Waxing & Depilatory Specialist',
        experience: '8 Years Luxury Spa',
        profileImage: '/images/artists/fatima-waxing.jpg',
        bio: 'Expert in rapid, painless hot-wax hair removal and ingrown-free skin preparation protocols.',
        specialities: ['Painless Hard Wax', 'Full Body Silk Mapping', 'Post-Depilatory Calming'],
      },
    ],
  },
  {
    slug: 'bridal',
    name: 'Regal Bridal Couture & Muhurtham Atelier',
    eyebrow: 'STUDIO 06 — BRIDAL ATELIER',
    shortDescription: 'Signature South Indian and contemporary bridal makeovers with heirloom veil styling.',
    description: 'Private VIP bridal suite styling including HD airbrush makeup, temple jewellery draping, architectural bridal up-dos, and 12-hour sweatproof setting.',
    coverImage: '/images/services/bridal-masterpiece.jpg',
    bannerImage: '/images/experience/exp-bridal.jpg',
    displayOrder: 6,
    isPublished: true,
    services: [
      {
        name: 'Grand Muhurtham Royal Bridal Makeover',
        slug: 'grand-muhurtham-makeover',
        description: 'Complete high-definition waterproof bridal makeover, traditional hair ornamentation with jasmine garlands, and saree pleating.',
        duration: '210 mins',
        price: 25000,
        images: ['/images/gallery/regal-bridal-couture.webp'],
        benefits: ['Private bridal dressing suite', 'HD airbrush finish', 'Touch-up emergency kit included'],
        displayOrder: 1,
      },
      {
        name: 'Reception Glamour & Architectural Updo',
        slug: 'reception-glamour-updo',
        description: 'Sculpted romantic bridal waves or classic chignon paired with radiant soft-glam makeup and veil fixation.',
        duration: '150 mins',
        price: 18000,
        images: ['/images/gallery/bridal-updo-profile.webp'],
        benefits: ['16-hour sweatproof durability', 'Custom mink lash styling', 'Contour lighting test'],
        displayOrder: 2,
      },
    ],
    artists: [
      {
        name: 'Meera Nair',
        slug: 'meera-nair',
        designation: 'Principal Bridal Makeup Artist',
        experience: '16 Years Heritage Bridal',
        profileImage: '/images/artists/meera-bridal.jpg',
        bio: 'Renowned for timeless Kerala Muhurtham transformations and contemporary North Indian reception aesthetics.',
        specialities: ['HD Bridal Airbrush', 'Traditional Temple Jewelry Draping', 'Regal Veil Placement'],
      },
    ],
  },
  {
    slug: 'spa',
    name: 'Balinese Spa & Holistic Wellness Sanctuary',
    eyebrow: 'STUDIO 07 — WELLNESS',
    shortDescription: 'Heated volcanic basalt stone therapy, herbal steam immersion, and aromatherapy.',
    description: 'Immerse in holistic restorative wellness rituals with warmed basalt stones, organic botanical compresses, and therapeutic acupressure.',
    coverImage: '/images/services/spa-wellness.jpg',
    bannerImage: '/images/about/massage-suite.jpg',
    displayOrder: 7,
    isPublished: true,
    services: [
      {
        name: 'Volcanic Basalt Hot Stone Massage',
        slug: 'volcanic-basalt-stone-massage',
        description: 'Smooth river-polished volcanic stones heated with organic lavender oil glided along meridians to dissolve deep muscular tension.',
        duration: '90 mins',
        price: 4500,
        images: ['/images/about/massage-suite.jpg'],
        benefits: ['Deep myofascial release', 'Enhanced vascular flow', 'Herbal steam immersion'],
        displayOrder: 1,
      },
      {
        name: 'Balinese Herbal Compress Ritual',
        slug: 'balinese-herbal-compress',
        description: 'Steamed muslin compresses packed with lemongrass, ginger, turmeric, and kaffir lime pressed into stress zones.',
        duration: '75 mins',
        price: 3900,
        images: ['/images/experience/exp-spa.jpg'],
        benefits: ['Cellular detox', 'Anti-inflammatory warmth', 'Ginger tea conclusion'],
        displayOrder: 2,
      },
    ],
    artists: [
      {
        name: 'Ketut Suardana',
        slug: 'ketut-suardana',
        designation: 'Senior Balinese Spa Master',
        experience: '18 Years Bali / Thailand',
        profileImage: '/images/artists/ketut-spa.jpg',
        bio: 'Trained in Ubud traditional holistic wellness therapies and therapeutic deep tissue acupressure.',
        specialities: ['Volcanic Hot Stone', 'Authentic Balinese Massage', 'Ayurvedic Herbal Steams'],
      },
    ],
  },
  {
    slug: 'tattoo',
    name: 'Fine-Line Tattoo & Micro-Realism Studio',
    eyebrow: 'STUDIO 08 — FINE ART',
    shortDescription: 'Custom fine-line botanicals, single-needle typography, and sacred geometry.',
    description: 'Medical-grade sterile tattoo studio specializing in ultra-fine single-needle artwork, delicate botanical illustrations, and bespoke memorial scripts.',
    coverImage: '/images/services/custom-tattoo.jpg',
    bannerImage: '/images/services/custom-tattoo.jpg',
    displayOrder: 8,
    isPublished: true,
    services: [
      {
        name: 'Fine-Line Single Needle Botanical Tattoo',
        slug: 'fine-line-botanical-tattoo',
        description: 'Ultra-delicate single-needle botanical foliage and floral line art executed with 100% vegan carbon black ink.',
        duration: '120 mins',
        price: 6000,
        images: ['/images/services/custom-tattoo.jpg'],
        benefits: ['Hospital grade sterilization', 'Minimal trauma fast healing', 'SecondSkin bandage wrap'],
        displayOrder: 1,
      },
    ],
    artists: [
      {
        name: 'Rohan Sen',
        slug: 'rohan-sen',
        designation: 'Resident Tattoo Artist & Illustrator',
        experience: '9 Years Fine-Line Tattooing',
        profileImage: '/images/artists/rohan-tattoo.jpg',
        bio: 'Fine artist specialized in microscopic botanical details, delicate geometric lines, and illustrative realism.',
        specialities: ['Single-Needle Fine-Line', 'Micro-Realism Flora', 'Geometric Mandala Work'],
      },
    ],
  },
];

const PRODUCTS_DATA_RAW = [
  {
    name: 'Good Genes All-In-One Lactic Acid Treatment',
    slug: 'sunday-riley-good-genes',
    category: 'Skincare',
    price: 7800,
    stockStatus: 'In stock',
    stockQuantity: 28,
    images: ['/images/products/sunday-riley-good-genes.png'],
    description: 'High-potency clinical lactic acid treatment clarifying dull surface dead cells, smoothing fine lines, and restoring luminous glow.',
    isFeatured: true,
    isPublished: true,
  },
  {
    name: 'Custom Enhancer Liquid Glow Drops',
    slug: 'cover-fx-enhancer-drops',
    category: 'Skincare',
    price: 3950,
    stockStatus: 'In stock',
    stockQuantity: 42,
    images: ['/images/products/cover-fx-enhancer-drops.png'],
    description: 'Ultra-concentrated liquid illuminator drops formulated with pearl micro-particles for buildable glass-skin radiance.',
    isFeatured: true,
    isPublished: true,
  },
  {
    name: 'Pureté Thermale 3-in-1 Sensitive Skin Cleanser',
    slug: 'vichy-purete-thermale',
    category: 'Skincare',
    price: 2850,
    stockStatus: 'In stock',
    stockQuantity: 18,
    images: ['/images/products/vichy-purete-thermale-cleanser.png'],
    description: 'Thermal spring water cleansing milk combining milk cleanser, clarifying toner, and gentle eye makeup remover.',
    isFeatured: false,
    isPublished: true,
  },
  {
    name: 'Glow+ Dewy Gel Sunscreen SPF 50+ PA++++',
    slug: 'aqualogica-glow-dewy-sunscreen',
    category: 'Skincare',
    price: 1290,
    stockStatus: 'In stock',
    stockQuantity: 85,
    images: ['/images/products/aqualogica-glow-dewy-sunscreen.png'],
    description: 'Lightweight hyaluronic acid and vitamin C water-gel sunscreen offering broad spectrum UVA/UVB defence with zero white cast.',
    isFeatured: false,
    isPublished: true,
  },
  {
    name: 'Velvet Botanical Body Hydration Emulsion',
    slug: 'brand-body-lotion',
    category: 'Skincare',
    price: 2450,
    stockStatus: 'In stock',
    stockQuantity: 34,
    images: ['/images/products/brand-body-lotion.png'],
    description: 'Deeply nourishing botanical body emulsion with shea butter, lavender essence, and golden marula oil.',
    isFeatured: false,
    isPublished: true,
  },
  {
    name: 'Chronologiste Caviar Rejuvenating Hair Masque',
    slug: 'caviar-hair-masque',
    category: 'Haircare',
    price: 4200,
    stockStatus: 'In stock',
    stockQuantity: 22,
    images: ['/images/products/caviar-hair-masque.png'],
    description: 'Kérastase Paris caviar youth revitalising hair masque transforming fragile fibres with intense moisture and bounce.',
    isFeatured: true,
    isPublished: true,
  },
  {
    name: 'Elixir Ultime L’Huile Golden Hair Oil',
    slug: 'luxe-hair-elixir',
    category: 'Haircare',
    price: 3950,
    stockStatus: 'In stock',
    stockQuantity: 16,
    images: ['/images/products/luxe-hair-elixir.png'],
    description: 'Iconic salon hair elixir infused with sacred camellia oil delivering 48-hour shine and thermal protection up to 230°C.',
    isFeatured: true,
    isPublished: true,
  },
  {
    name: 'N° 3 Bond Repair Structural Treatment',
    slug: 'bond-repair-treatment',
    category: 'Bond Repair',
    price: 3150,
    stockStatus: 'In stock',
    stockQuantity: 50,
    images: ['/images/products/bond-repair-treatment.png'],
    description: 'Olaplex molecular bond builder repairing broken disulphide bonds within chemically processed hair.',
    isFeatured: true,
    isPublished: true,
  },
  {
    name: 'Elite 2100 Ceramic Ionic Salon Hair Dryer',
    slug: 'pro-salon-dryer',
    category: 'Tools',
    price: 28900,
    stockStatus: 'Low stock',
    stockQuantity: 3,
    images: ['/images/products/pro-salon-dryer.png'],
    description: 'Professional brushless digital motor salon dryer with intelligent heat sensing and ultra-fast airstream.',
    isFeatured: false,
    isPublished: true,
  },
];

export async function migrate() {
  await connectDB();
  console.log('🔄 [Migration] Starting data migration from live sources...');

  const report = {
    studiosCount: 0,
    servicesCount: 0,
    artistsCount: 0,
    productsCount: 0,
    academyCount: 0,
    mediaCount: 0,
    pagesCount: 0,
    settingsUpdated: false,
    skipped: [] as string[],
    blankFields: [] as { collection: string; record: string; field: string; note: string }[],
  };

  // 1. Settings Migration
  let settings = await Settings.findOne();
  const settingsData = {
    siteName: 'Byju Spark Saloon International',
    logoUrl: '/images/logo-emblem-crop.png',
    phone: '+91 8543097899',
    whatsappNumber: '918543097899',
    email: 'byjuspark@gmail.com',
    address: 'Mavoor Rd, Kottooli, Kozhikode, Kerala 673016',
    openingHours: 'Mon - Sun, 09am - 09 pm',
    instagram: 'https://instagram.com/byjuspark',
    facebook: 'https://facebook.com/byjuspark',
    youtube: 'https://youtube.com/@byjuspark',
  };
  if (!settings) {
    settings = await Settings.create(settingsData);
  } else {
    Object.assign(settings, settingsData);
    await settings.save();
  }
  report.settingsUpdated = true;

  // 2. Studios Migration
  const studioDocMap: Record<string, any> = {};
  for (const st of STUDIOS_DATA_RAW) {
    let studioDoc = await Studio.findOne({ slug: st.slug });
    if (!studioDoc) {
      studioDoc = await Studio.create({
        name: st.name,
        slug: st.slug,
        shortDescription: st.shortDescription,
        description: st.description,
        coverImage: st.coverImage,
        bannerImage: st.bannerImage,
        displayOrder: st.displayOrder,
        isPublished: st.isPublished,
      });
    } else {
      studioDoc.name = st.name;
      studioDoc.shortDescription = st.shortDescription;
      studioDoc.description = st.description;
      studioDoc.coverImage = st.coverImage;
      studioDoc.bannerImage = st.bannerImage;
      studioDoc.displayOrder = st.displayOrder;
      studioDoc.isPublished = st.isPublished;
      await studioDoc.save();
    }
    studioDocMap[st.slug] = studioDoc;
    report.studiosCount++;

    // Track blank fields for client input
    if (!st.shortDescription) {
      report.blankFields.push({ collection: 'studios', record: st.name, field: 'shortDescription', note: 'To be confirmed by client' });
    }
  }

  // 3. Services Migration
  for (const st of STUDIOS_DATA_RAW) {
    const parentStudio = studioDocMap[st.slug];
    for (const sv of st.services) {
      let serviceDoc = await Service.findOne({ slug: sv.slug });
      if (!serviceDoc) {
        serviceDoc = await Service.create({
          studioId: parentStudio._id,
          name: sv.name,
          slug: sv.slug,
          description: sv.description,
          duration: sv.duration,
          price: sv.price,
          images: sv.images,
          benefits: sv.benefits,
          displayOrder: sv.displayOrder,
          isPublished: true,
        });
      } else {
        serviceDoc.studioId = parentStudio._id;
        serviceDoc.name = sv.name;
        serviceDoc.description = sv.description;
        serviceDoc.duration = sv.duration;
        serviceDoc.price = sv.price;
        serviceDoc.images = sv.images;
        serviceDoc.benefits = sv.benefits;
        serviceDoc.displayOrder = sv.displayOrder;
        serviceDoc.isPublished = true;
        await serviceDoc.save();
      }
      report.servicesCount++;
    }
  }

  // 4. Artists Migration
  const artistDocMap: Record<string, any> = {};
  for (const st of STUDIOS_DATA_RAW) {
    const parentStudio = studioDocMap[st.slug];
    for (const ar of st.artists) {
      let artistDoc = artistDocMap[ar.slug] || (await Artist.findOne({ slug: ar.slug }));
      if (!artistDoc) {
        artistDoc = await Artist.create({
          name: ar.name,
          slug: ar.slug,
          designation: ar.designation,
          studioIds: [parentStudio._id],
          specialities: ar.specialities,
          experience: ar.experience,
          profileImage: ar.profileImage,
          bio: ar.bio,
          displayOrder: 1,
          isPublished: true,
        });
        artistDocMap[ar.slug] = artistDoc;
        report.artistsCount++;
      } else {
        // Multi-studio assignment
        if (!artistDoc.studioIds.some((id: any) => id.toString() === parentStudio._id.toString())) {
          artistDoc.studioIds.push(parentStudio._id);
        }
        artistDoc.name = ar.name;
        artistDoc.designation = ar.designation;
        artistDoc.specialities = ar.specialities;
        artistDoc.experience = ar.experience;
        artistDoc.profileImage = ar.profileImage;
        artistDoc.bio = ar.bio;
        artistDoc.isPublished = true;
        await artistDoc.save();
      }
    }
  }

  // 5. Products Migration
  for (const pr of PRODUCTS_DATA_RAW) {
    let productDoc = await Product.findOne({ slug: pr.slug });
    if (!productDoc) {
      productDoc = await Product.create(pr);
    } else {
      Object.assign(productDoc, pr);
      await productDoc.save();
    }
    report.productsCount++;
  }

  // 6. Academy Migration
  const academyData = {
    name: 'Spark International Academy of Cosmetology & Aesthetic Sciences',
    slug: 'academy-cosmetology',
    description:
      'A prestigious beauty training academy in Calicut providing CIDESCO-aligned master certifications in advanced hair styling, clinical derma aesthetic therapy, master bridal couture, and modern salon business management. Hands-on practice under celebrity artists with international placement support.',
    bannerImage: '/images/experience/exp-hair.jpg',
    facilities: [
      'Advanced Simulation Hair Styling Laboratories',
      'Clinical Dermaceutical Practice Suite',
      'State-of-the-Art E-File Nail Studio',
      'HD Airbrush Bridal Makeup Atelier',
    ],
    highlights: [
      'International CIDESCO & Pivot Point syllabus alignment',
      'Guaranteed studio internship at Byju Spark branches',
      'Live masterclasses by visiting European color directors',
      'Complete tool kit and product inventory provided',
    ],
    address: 'Mavoor Road, Kottooli, Kozhikode, Kerala 673016',
    contact: '+91 8543097899 / academy@sparksalon.com',
    isPublished: true,
  };
  let academyDoc = await Academy.findOne({ slug: academyData.slug });
  if (!academyDoc) {
    academyDoc = await Academy.create(academyData);
  } else {
    Object.assign(academyDoc, academyData);
    await academyDoc.save();
  }
  report.academyCount = 1;

  // 7. Pages Migration
  const PAGES_RAW = [
    {
      title: 'Home',
      slug: '/',
      sections: 'Animated Hero, Brand Statement, 8 Studios Showcase, Why Spark, Spark Experience, Testimonials, Final CTA',
      seoTitle: 'Byju Spark International Salon & Beauty Mall | Kozhikode',
      seoDescription: 'Premier luxury salon and beauty mall in Kozhikode, Kerala.',
      isPublished: true,
    },
    {
      title: 'About Us',
      slug: 'about',
      sections: 'Heritage Story, Master Stylist Philosophy, Salon Architecture, Craftsmanship Standards',
      seoTitle: 'Our Heritage & Artistic Philosophy · Spark Salon',
      seoDescription: 'Discover the three-decade legacy of Byju Spark Salon.',
      isPublished: true,
    },
    {
      title: 'Academy',
      slug: 'academy',
      sections: 'Courses, Curriculum Highlights, Facilities, Faculty, Enrolment Process',
      seoTitle: 'Spark International Academy of Cosmetology',
      seoDescription: 'Professional beauty certifications in hair, makeup, skin, and salon management.',
      isPublished: true,
    },
    {
      title: 'Products Store',
      slug: 'products',
      sections: 'Couture Haircare, Clinical Skincare, Bond Architecture, Precision Tools',
      seoTitle: 'Curated Salon Formulations & Atelier Products',
      seoDescription: 'Shop official Kerastase, Olaplex, Sunday Riley, and Dyson tools.',
      isPublished: true,
    },
    {
      title: 'Contact & Concierge',
      slug: 'contact',
      sections: 'Location Map, Opening Hours, VIP Concierge, WhatsApp Enquiry Desk',
      seoTitle: 'Plan Your Visit · Spark Salon Kozhikode',
      seoDescription: 'Contact information, direct WhatsApp appointment desk, and salon coordinates.',
      isPublished: true,
    },
    {
      title: 'FAQ',
      slug: 'faq',
      sections: 'Consultations, Booking Terms, Patch Testing, Bridal Timelines, Salon Etiquette',
      seoTitle: 'Frequently Asked Questions · Spark Salon',
      seoDescription: 'Answers to common questions regarding visits, appointments, and services.',
      isPublished: false, // Draft for client confirmation
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      sections: 'Privacy commitments, cookie usage, customer data handling.',
      seoTitle: 'Privacy Policy · Spark Salon',
      seoDescription: 'How Byju Spark Salon handles and protects your personal data.',
      isPublished: false, // Draft for client confirmation
    },
    {
      title: 'Terms & Conditions',
      slug: 'terms-and-conditions',
      sections: 'Salon policies, appointment cancellations, intellectual property.',
      seoTitle: 'Terms & Conditions · Spark Salon',
      seoDescription: 'Terms of service and salon booking guidelines.',
      isPublished: false, // Draft for client confirmation
    },
  ];

  for (const pg of PAGES_RAW) {
    let pageDoc = await Page.findOne({ slug: pg.slug });
    if (!pageDoc) {
      pageDoc = await Page.create(pg);
    } else {
      Object.assign(pageDoc, pg);
      await pageDoc.save();
    }
    report.pagesCount++;
    if (!pg.isPublished) {
      report.blankFields.push({ collection: 'pages', record: pg.title, field: 'sections', note: 'Draft page awaiting final client legal text' });
    }
  }

  // 8. Media Migration (Sample polymorphically linked real assets)
  const MEDIA_RAW = [
    { title: 'French Balayage Model Portrait', mediaType: 'image', mediaUrl: '/images/gallery/signature-brunette.webp', relatedType: 'services', studioSlug: 'hair', displayOrder: 1 },
    { title: 'Precision Shears Craft', mediaType: 'image', mediaUrl: '/images/gallery/precision-shears-cutting.webp', relatedType: 'services', studioSlug: 'hair', displayOrder: 2 },
    { title: 'Cellular Facial Radiance', mediaType: 'image', mediaUrl: '/images/gallery/cellular-facial-mask.webp', relatedType: 'services', studioSlug: 'face', displayOrder: 3 },
    { title: 'Russian Marble Gel Manicure', mediaType: 'image', mediaUrl: '/images/gallery/luxury-marble-manicure.webp', relatedType: 'services', studioSlug: 'nail', displayOrder: 4 },
    { title: 'Royal Muhurtham Bridal Couture', mediaType: 'image', mediaUrl: '/images/gallery/regal-bridal-couture.webp', relatedType: 'services', studioSlug: 'bridal', displayOrder: 5 },
    { title: 'Basalt Hot Stone Suite', mediaType: 'image', mediaUrl: '/images/about/massage-suite.jpg', relatedType: 'studios', studioSlug: 'spa', displayOrder: 6 },
    { title: 'Fine-Line Tattoo Artwork', mediaType: 'image', mediaUrl: '/images/services/custom-tattoo.jpg', relatedType: 'studios', studioSlug: 'tattoo', displayOrder: 7 },
  ];

  for (const m of MEDIA_RAW) {
    const parent = studioDocMap[m.studioSlug];
    const existing = await Media.findOne({ mediaUrl: m.mediaUrl });
    if (!existing) {
      await Media.create({
        title: m.title,
        mediaType: m.mediaType,
        mediaUrl: m.mediaUrl,
        relatedType: m.relatedType,
        relatedId: parent ? parent._id : null,
        displayOrder: m.displayOrder,
        isPublished: true,
      });
      report.mediaCount++;
    }
  }

  // Audit log entry for migration
  await AuditLog.create({
    action: 'Initial Website Data Migration Completed',
    collectionName: 'system',
    recordLabel: 'All 8 Studios, Services, Artists, Products & Media',
    userEmail: 'migration-script@sparksalon.com',
  });

  // Write migration report file
  const reportPath = path.resolve(process.cwd(), '../MIGRATION_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('✅ [Migration] Migration completed successfully!');
  console.log(JSON.stringify(report, null, 2));
}

if (process.argv[1]?.endsWith('migrate.ts')) {
  migrate().then(() => process.exit(0)).catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

