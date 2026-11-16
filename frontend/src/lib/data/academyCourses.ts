export interface Course {
  _id: string;
  name: string;
  slug: string;
  studio: string;
  description?: string;
  duration?: string;
  level?: string;
  schedule?: string;
  fee?: string;
  learn: string[];
  includes: string[];
  bannerImage?: string;
  tone?: 'black' | 'red';
  displayOrder?: number;
  isPublished: boolean;
}

export const INITIAL_COURSES: Course[] = [
  {
    _id: 'seed-1',
    name: 'Hair Couture & Balayage',
    slug: 'hair-couture-balayage',
    studio: 'Hair',
    tone: 'black',
    duration: '6 months',
    level: 'Advanced Diploma',
    schedule: 'Quarterly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/hair-couture.jpg',
    description:
      'Master haute precision cutting geometry, bespoke French balayage painting, and dimensional colour formulation under Spark master stylists.',
    learn: [
      'Anatomical sectioning & French balayage feathering',
      'Precision architectural graduation & texturising',
      'Complex colour correction & tone chemistry',
      'Luxury client consultation & salon floor leadership',
    ],
    includes: [
      'Professional shears & Japanese carbon comb kit',
      'Mannequin heads & Kérastase backbar product suite',
      'Certified Haute Hair Director Diploma',
    ],
    displayOrder: 1,
    isPublished: true,
  },
  {
    _id: 'seed-2',
    name: 'HD Bridal & Makeover',
    slug: 'hd-bridal-makeover',
    studio: 'Bridal',
    tone: 'red',
    duration: '3 months',
    level: 'Professional Masterclass',
    schedule: 'Monthly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/bridal-masterpiece.jpg',
    description:
      'Complete bridal artistry covering high-definition silicon airbrush makeup, couture hair sculpting, dupatta draping, and luxury wedding backstage management.',
    learn: [
      'High-definition silicone airbrush & micro-pigment blending',
      'Royal architectural updos, French braids & floral weaving',
      'Traditional & contemporary saree/lehenga draping architecture',
      'Jewellery setting, client lighting prep & camera-ready longevity',
    ],
    includes: [
      'HD professional makeup kit & airbrush compressor',
      'Bridal portfolio photoshoots with professional models',
      'Master Bridal Artisan Certification',
    ],
    displayOrder: 2,
    isPublished: true,
  },
  {
    _id: 'seed-3',
    name: 'Russian E-File Manicure',
    slug: 'russian-manicure',
    studio: 'Nail',
    tone: 'black',
    duration: '6 weeks',
    level: 'Specialist Certification',
    schedule: 'Bi-weekly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/nail-detailing.jpg',
    description:
      'Elite dry electric file cuticle work, flawless apex architecture, combined manicure protocols, and long-lasting gel extensions.',
    learn: [
      'Diamond bit selection & safe mechanical e-file cuticle detailing',
      'Flawless rubber base apex alignment & self-levelling balance',
      'Under-cuticle deep gel pigment coating technique',
      'Polygel extension sculpting & architectural pinch shaping',
    ],
    includes: [
      'Professional 35,000 RPM e-file unit & diamond bit suite',
      'Russian technique certification of mastery',
    ],
    displayOrder: 3,
    isPublished: true,
  },
  {
    _id: 'seed-4',
    name: 'Clinical Aesthetic Skin',
    slug: 'clinical-aesthetic-skin',
    studio: 'Face',
    tone: 'red',
    duration: '8 weeks',
    level: 'Clinical Certification',
    schedule: 'Monthly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/skin-waxing.jpg',
    description:
      'Clinical dermal science, ultrasonic hydra-dermabrasion, superficial medical peels, LED phototherapy, and bespoke barrier restoration protocols.',
    learn: [
      'Dermal anatomy & Fitzpatrick skin typing diagnostic analysis',
      'Hydra-dermabrasion infusion & ultrasonic deep extraction',
      'AHA/BHA chemical resurfacing & post-peel neutralizing',
      'LED phototherapy wavelengths & active serum electro-mesotherapy',
    ],
    includes: [
      'Clinical dermal diagnostic kit & aesthetic manual',
      'Certified Clinical Aesthetic Practitioner credential',
    ],
    displayOrder: 4,
    isPublished: true,
  },
];

export const ALL_COURSE_SLUGS = INITIAL_COURSES.map((c) => c.slug);

export function getCourseBySlug(slug: string): Course | undefined {
  return INITIAL_COURSES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

