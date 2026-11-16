export interface FaqItem {
  question: string;
  answer: string;
}

export const ACADEMY_GENERAL_FAQS: FaqItem[] = [
  {
    question: 'What qualifications or certifications do I earn at Spark Academy?',
    answer:
      'Graduates receive the officially accredited Spark International Academy Diploma or Specialist Certification credential, recognized by luxury salons, editorial studios, and international beauty franchises. Select programs conducted in partnership with leading global haircare and cosmetic houses also include official brand co-certifications.',
  },
  {
    question: 'Do I need prior beauty or salon experience to enroll?',
    answer:
      'No previous experience is required for our foundational and comprehensive diploma programs. We teach anatomical principles, tool ergonomics, sectioning geometry, and safety from the ground up. For experienced stylists, our advanced masterclasses provide precision upgrades and creative leadership skills.',
  },
  {
    question: 'Are professional student kits, mannequins, and live models provided?',
    answer:
      'Yes. Every enrolled student receives an extensive professional kit tailored to their course (including Japanese steel shears, 35,000 RPM e-files, or HD airbrush compressors). All practice mannequin heads, vetted live models, backbar product suites, and disposable consumables are fully provided by the academy.',
  },
  {
    question: 'Does Spark Academy offer salon internships and job placement assistance?',
    answer:
      'Yes. All diploma students complete supervised live salon floor internships at Byju Spark luxury salons. High-performing graduates are offered priority placement across our atelier network, and our placement cell connects students with top salons and clinics across South India and the UAE.',
  },
  {
    question: 'What are the batch sizes and mentor-to-student ratios?',
    answer:
      'To ensure individual attention and precision craftsmanship, each cohort is strictly capped at 6 to 10 students. This intimate setting allows master educators to provide continuous one-on-one feedback on hand positioning, pressure, chemical formulation, and client consultation.',
  },
  {
    question: 'How do I apply, and are flexible fee payment installments available?',
    answer:
      'You can enquire directly through WhatsApp or book an in-person campus tour and consultation. Admissions operate on a first-come, first-served basis with monthly and quarterly intakes. Flexible, interest-free installment plans are available for all multi-month diploma programs.',
  },
];

export const COURSE_SPECIFIC_FAQS: Record<string, FaqItem[]> = {
  'hair-couture-balayage': [
    {
      question: 'Will I gain practical hands-on experience on live models for French Balayage?',
      answer:
        'Yes. After mastering sectioning tension and feathering gradients on high-density mannequin heads, every student performs extensive supervised balayage, foilayage, root melts, and gloss toning on live models in our dedicated color laboratory.',
    },
    {
      question: 'What haircutting geometry and styling philosophies are covered?',
      answer:
        'The curriculum covers Vidal Sassoon architectural cutting lines, graduation, and layering, bone-structure face mapping, weight redistribution, wet and dry shear detailing, and luxury French textured blowouts.',
    },
    {
      question: 'Is the professional shears and carbon styling kit included in the tuition fee?',
      answer:
        'Yes. Your enrolment includes a personalized precision haircutting kit featuring Japanese cobalt steel cutting shears, texturizing shears, antistatic carbon sectioning combs, hair clips, and an apprentice tool roll.',
    },
    {
      question: 'Can practicing salon stylists attend on flexible or modular schedules?',
      answer:
        'Yes. We offer both full-time weekday cohorts and structured weekend tracks designed specifically for working salon stylists looking to upgrade their color chemistry and architectural cut expertise.',
    },
    {
      question: 'What career opportunities can I pursue after completing this diploma?',
      answer:
        'Graduates are qualified for senior salon positions including Senior Hair Director, Creative Balayage Specialist, Salon Floor Manager, Editorial Session Stylist, and Brand Educator for international haircare brands.',
    },
  ],

  'hd-bridal-makeover': [
    {
      question: 'Which cosmetic formulations and airbrush systems are taught in this course?',
      answer:
        'You will master professional silicone-based airbrush systems, high-definition cream foundations, sweat-proof baking, micro-pigment color matching, and long-wear transfer-resistant finishing techniques engineered for 18+ hour wedding durability.',
    },
    {
      question: 'Are professional bridal photoshoots included to build my portfolio?',
      answer:
        'Yes. Each student designs complete bridal looks across Hindu, Christian, and Muslim bridal traditions, culminating in high-fashion editorial studio photoshoots with professional models and photographers to launch your portfolio.',
    },
    {
      question: 'Does this course include bridal hair updo sculpting and saree draping?',
      answer:
        'Yes. In addition to makeup, this masterclass provides intensive training in architectural hair updos, Russian volume braiding, floral setting, jewellery placement, and 12+ traditional and modern saree, dupatta, and lehenga draping styles.',
    },
    {
      question: 'What equipment and tools are included in the student bridal kit?',
      answer:
        'You receive a complete professional bridal kit including a dual-action airbrush compressor, a professional 32-piece makeup brush suite, stainless steel palettes, precision beauty sponges, and specialized bridal styling tools.',
    },
  ],

  'russian-manicure': [
    {
      question: 'How does the Russian dry e-file technique differ from traditional manicures?',
      answer:
        'Russian manicure is an advanced dry mechanical protocol using microscopic diamond bits to precisely exfoliate the cuticle and pterygium without soaking, followed by structural apex builder gel architecture that lasts 4+ weeks with zero chipping.',
    },
    {
      question: 'Do students receive their own electric nail file machine as part of the course?',
      answer:
        'Yes. Enrolled students receive a medical-grade, vibration-free 35,000 RPM micromotor electric nail file unit along with a complete set of diamond Russian bits (flame, ball, drop, safety mandrels) and carbide removal bits.',
    },
    {
      question: 'How do you teach safe nail plate preservation without risk of ring of fire?',
      answer:
        'Safety is our foremost priority. Instruction begins with nail plate histology, pressure gauge drills on artificial substrates, bit angle calibration, and gentle cuticle pocket separation drills before touching live nails.',
    },
    {
      question: 'How quickly can salon owners and nail artists monetize this certification?',
      answer:
        'Russian dry manicures command 2x to 3x higher service tickets than standard gel manicures. Students can immediately integrate dry e-file protocols and deep cuticle coatings into their salon menus upon graduation.',
    },
  ],

  'clinical-aesthetic-skin': [
    {
      question: 'What aesthetic machines and clinical therapies will I learn to operate?',
      answer:
        'Students receive extensive hands-on operational training with multi-stage hydra-dermabrasion machines, ultrasonic skin scrubbers, bipolar radio-frequency firming handles, high-frequency germicidal wands, and medical-grade LED phototherapy hoods.',
    },
    {
      question: 'Does this course cover chemical peel application and peel safety?',
      answer:
        'Yes. You will study Fitzpatrick skin typing, acid percentage concentrations (Glycolic, Salicylic, Lactic, and Mandelic), pH balance, frost recognition, neutralizer application, and homecare barrier repair regimens.',
    },
    {
      question: 'What clinical hygiene and sterilization protocols are enforced?',
      answer:
        'Training strictly adheres to hospital-grade sterilization, autoclave decontamination, disposable single-use consumables, barrier film wrapping, and cross-contamination prevention standards.',
    },
    {
      question: 'What certifications and clinic job titles can I achieve upon graduation?',
      answer:
        'You will graduate with the Spark Certified Aesthetic Practitioner credential, qualifying you for positions at luxury medi-spas, dermatology clinics, skin aesthetic centers, and wellness retreats.',
    },
  ],
};

/**
 * Returns course-specific FAQs. If the course is known, returns bespoke FAQs.
 * Otherwise, generates tailored course FAQs from the course metadata.
 */
export function getCourseFaqs(course: {
  name: string;
  slug: string;
  studio?: string;
  duration?: string;
  level?: string;
}): FaqItem[] {
  if (COURSE_SPECIFIC_FAQS[course.slug]) {
    return COURSE_SPECIFIC_FAQS[course.slug];
  }

  const studioName = course.studio || 'Studio';
  const duration = course.duration || 'Flexible';
  const level = course.level || 'All Levels';

  return [
    {
      question: `What practical hands-on experience is included in the ${course.name} course?`,
      answer: `Students in the ${course.name} program complete intensive practical training in our state-of-the-art ${studioName} atelier, working with industry-grade tools, specialized mannequin substrates, and live models under direct master mentor supervision.`,
    },
    {
      question: `What tools and materials are provided for the ${duration} duration?`,
      answer: `Every enrolled student receives a dedicated professional kit with all necessary tools, implements, and backbar products required for the course. All consumables and clinical hygiene supplies are fully covered by Spark Academy.`,
    },
    {
      question: `Is this course suitable for beginners or practicing professionals?`,
      answer: `This program is rated for "${level}". Our structured curriculum starts with foundational anatomy and ergonomics before progressing into advanced signature techniques, making it ideal for both passionate newcomers and working professionals.`,
    },
    {
      question: `What certification and career opportunities follow completing this course?`,
      answer: `Graduates receive the official Spark Academy ${course.name} Certification, qualifying them for premium salon roles, specialized studio practice, and client consultation across luxury beauty establishments.`,
    },
  ];
}

