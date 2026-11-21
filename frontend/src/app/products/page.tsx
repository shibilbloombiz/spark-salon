'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import ProductEnquiryDialog from '@/components/products/ProductEnquiryDialog';

interface Product {
  id: string;
  brand: string;
  name: string;
  category: 'hair' | 'skin' | 'bond' | 'tools';
  categoryLabel: string;
  size: string;
  priceNum: number;
  image: string;
  stockQuantity?: number | null;
  stockStatus?: string;
}

const PRODUCT_BANNERS = [
  {
    id: 'hair-couture-banner',
    image: '/images/products/products banner.webp',
    eyebrow: 'OFFICIAL SALON RETAIL STORE · 100% GENUINE',
    title: 'Curated Salon Haircare, Bond Repair & Styling Icons',
    subtitle:
      'Shop authentic Kérastase, Olaplex, Moroccanoil & Dyson professional tools with guaranteed batch authenticity, stylist advice, and fast doorstep delivery.',
    tag: 'Haircare & Styling',
    ctaText: 'Shop Haircare & Tools',
    category: 'hair',
  },
  {
    id: 'clinical-derma-banner',
    image: '/images/products/product banner 2.webp',
    eyebrow: 'CLINICAL DERMA BOUTIQUE & PRO APOTHECARY',
    title: 'Clinical Skincare, Serums & Radiance Formulations',
    subtitle:
      'Dermatologist-prescribed vitamin C complexes, hydra-infusion resurfacing cleansers, and bespoke radiant cosmetics from globally trusted beauty brands.',
    tag: 'Skincare & Cosmetics',
    ctaText: 'Shop Skincare & Glow',
    category: 'skin',
  },
];

const PRODUCTS_DATA: Product[] = [
  {
    id: 'sunday-riley-good-genes',
    brand: 'SUNDAY RILEY',
    name: 'Good Genes All-In-One Lactic Acid Treatment',
    category: 'skin',
    categoryLabel: 'Clinical Skincare',
    size: '30 ml',
    priceNum: 7800,
    image: '/images/products/sunday-riley-good-genes.webp',
    stockQuantity: 28,
    stockStatus: 'In stock',
  },
  {
    id: 'cover-fx-enhancer-drops',
    brand: 'COVER | FX',
    name: 'Custom Enhancer Liquid Glow Drops',
    category: 'skin',
    categoryLabel: 'Glow Elixir',
    size: '15 ml',
    priceNum: 3950,
    image: '/images/products/cover-fx-enhancer-drops.webp',
    stockQuantity: 14,
    stockStatus: 'In stock',
  },
  {
    id: 'vichy-purete-thermale',
    brand: 'VICHY LABORATOIRES',
    name: 'Pureté Thermale 3-in-1 Sensitive Skin Cleanser',
    category: 'skin',
    categoryLabel: 'Therapeutic Cleanser',
    size: '200 ml',
    priceNum: 2850,
    image: '/images/products/vichy-purete-thermale-cleanser.webp',
    stockQuantity: 9,
    stockStatus: 'In stock',
  },
  {
    id: 'aqualogica-glow-dewy',
    brand: 'AQUALOGICA',
    name: 'Glow+ Dewy Gel Sunscreen SPF 50+ PA++++',
    category: 'skin',
    categoryLabel: 'Hydra Sun Shield',
    size: '50 g',
    priceNum: 1290,
    image: '/images/products/aqualogica-glow-dewy-sunscreen.webp',
    stockQuantity: 35,
    stockStatus: 'In stock',
  },
  {
    id: 'brand-body-lotion',
    brand: 'SPARK ATELIER',
    name: 'Velvet Botanical Body Hydration Emulsion',
    category: 'skin',
    categoryLabel: 'Body Ritual',
    size: '100 ml',
    priceNum: 2450,
    image: '/images/products/brand-body-lotion.webp',
    stockQuantity: 18,
    stockStatus: 'In stock',
  },
  {
    id: 'caviar-hair-masque',
    brand: 'KÉRASTASE PARIS',
    name: 'Chronologiste Caviar Rejuvenating Hair Masque',
    category: 'hair',
    categoryLabel: 'Caviar Haircare',
    size: '200 ml',
    priceNum: 4200,
    image: '/images/products/caviar-hair-masque.webp',
    stockQuantity: 8,
    stockStatus: 'In stock',
  },
  {
    id: 'luxe-hair-elixir',
    brand: 'KÉRASTASE PARIS',
    name: 'Elixir Ultime L’Huile Golden Hair Oil',
    category: 'hair',
    categoryLabel: 'Golden Elixir',
    size: '100 ml',
    priceNum: 3950,
    image: '/images/products/luxe-hair-elixir.webp',
    stockQuantity: 12,
    stockStatus: 'In stock',
  },
  {
    id: 'bond-repair-treatment',
    brand: 'OLAPLEX',
    name: 'N° 3 Bond Repair Structural Treatment',
    category: 'bond',
    categoryLabel: 'Bond Architecture',
    size: '200 ml',
    priceNum: 3150,
    image: '/images/products/bond-repair-treatment.webp',
    stockQuantity: 15,
    stockStatus: 'In stock',
  },
  {
    id: 'pro-salon-dryer',
    brand: 'VELOCITY PROFESSIONAL',
    name: 'Elite 2100 Ceramic Ionic Salon Hair Dryer',
    category: 'tools',
    categoryLabel: 'Precision Tools',
    size: 'Atelier Edition',
    priceNum: 28900,
    image: '/images/products/pro-salon-dryer.webp',
    stockQuantity: 3,
    stockStatus: 'In stock',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'hair', label: 'Haircare' },
  { id: 'skin', label: 'Skincare' },
  { id: 'bond', label: 'Bond Repair' },
  { id: 'tools', label: 'Tools' },
];

export default function ProductsPage() {
  const settings = useSiteSettings();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeBanner, setActiveBanner] = useState(0);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_DATA);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const handleOpenEnquiry = (product: Product) => {
    setEnquiryProduct(product);
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  // Fetch live products from backend MongoDB API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0 && isMounted) {
          const mapped: Product[] = data.data.map((item: any) => ({
            id: item.slug || item._id,
            brand: (item.category ? item.category.toUpperCase() : 'SPARK ATELIER'),
            name: item.name,
            category: (item.category?.toLowerCase() || 'hair') as any,
            categoryLabel: item.category || 'Atelier Selection',
            size:
              item.stockStatus === 'Out of stock'
                ? 'Out of Stock'
                : item.stockQuantity
                ? `${item.stockQuantity} in stock`
                : item.stockStatus || 'In stock',
            priceNum: Number(item.price) || 0,
            image:
              item.images && item.images.length > 0
                ? item.images[0]
                : '/images/products/brand-body-lotion.png',
            stockQuantity: typeof item.stockQuantity === 'number' ? item.stockQuantity : undefined,
            stockStatus: item.stockStatus || 'In stock',
          }));
          setProductsList(mapped);
        }
      })
      .catch((err) => console.warn('Could not load live products:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-play product hero banner carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % PRODUCT_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'all') return productsList;
    return productsList.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, productsList]);

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', color: 'var(--ink)' }} data-cursor-theme="light">
      {/* Page Header & Luxury Product Hero Banners */}
      <header className="page-head" style={{ paddingBottom: '32px' }}>
        <div className="wrap">
          <p className="eyebrow">The Mall</p>
          <h1 className="h-display">Shop the edit</h1>
          <p className="lead">
            Prescribed formulations and salon-exclusive therapies used in our salon, chosen for daily care and salon-finish results.
          </p>

          {/* Luxury Product Hero Banners Carousel */}
          <div
            className="p-hero-banner"
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(280px, 30vw, 400px)',
              borderRadius: '8px 36px 8px 36px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(12, 12, 12, 0.06), 0 24px 48px -20px rgba(12, 12, 12, 0.35)',
              border: '1px solid var(--rule)',
              backgroundColor: 'var(--black)',
              marginTop: '36px',
            }}
          >
            {PRODUCT_BANNERS.map((banner, index) => {
              const isActive = index === activeBanner;
              return (
                <div
                  key={banner.id}
                  aria-hidden={!isActive}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(1.03)',
                    transition: 'opacity 0.75s var(--ease-liquid), transform 0.85s var(--ease-liquid)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(90deg, rgba(12, 12, 12, 0.94) 0%, rgba(12, 12, 12, 0.75) 48%, rgba(12, 12, 12, 0.2) 82%, transparent 100%)',
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: 'clamp(24px, 4vw, 56px)',
                      maxWidth: '680px',
                      color: 'var(--white)',
                    }}
                  >
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        padding: '5px 14px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(200, 16, 46, 0.9)',
                        color: '#ffffff',
                        font: '500 10px/1 var(--font-sans)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                      }}
                    >
                      {banner.tag}
                    </span>
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        font: '500 10.5px/1 var(--font-sans)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.65)',
                      }}
                    >
                      {banner.eyebrow}
                    </p>
                    <h2
                      style={{
                        margin: '0 0 12px 0',
                        font: '600 clamp(22px, 2.5vw, 36px)/1.1 var(--font-serif)',
                        color: '#ffffff',
                      }}
                    >
                      {banner.title}
                    </h2>
                    <p
                      style={{
                        margin: '0 0 20px 0',
                        font: '400 clamp(13px, 1.1vw, 15px)/1.5 var(--font-sans)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        maxWidth: '520px',
                      }}
                    >
                      {banner.subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(banner.category)}
                      style={{
                        alignSelf: 'flex-start',
                        height: '38px',
                        padding: '0 22px',
                        borderRadius: '999px',
                        background: '#CE092C',
                        color: '#ffffff',
                        border: 'none',
                        font: '600 11px/1 var(--font-sans)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(206, 9, 44, 0.4)',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                      }}
                    >
                      {banner.ctaText} →
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Dots Indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                right: '24px',
                zIndex: 10,
                display: 'flex',
                gap: '8px',
              }}
            >
              {PRODUCT_BANNERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveBanner(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  style={{
                    width: activeBanner === i ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: activeBanner === i ? 'var(--red)' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Shop Model Trust & Delivery Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              marginTop: '28px',
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(12, 12, 12, 0.08)',
              boxShadow: '0 4px 20px -8px rgba(12, 12, 12, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CE092C', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#171717' }}>
                  100% Genuine Brands
                </p>
                <p style={{ margin: 0, font: '400 11px/1.3 var(--font-sans)', color: '#666666' }}>
                  Authorized batch verification
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CE092C', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#171717' }}>
                  Stylist Prescribed
                </p>
                <p style={{ margin: 0, font: '400 11px/1.3 var(--font-sans)', color: '#666666' }}>
                  Professional salon formulations
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CE092C', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#171717' }}>
                  Direct Salon Pickup
                </p>
                <p style={{ margin: 0, font: '400 11px/1.3 var(--font-sans)', color: '#666666' }}>
                  Or prompt doorstep delivery
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CE092C', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#171717' }}>
                  WhatsApp Ordering
                </p>
                <p style={{ margin: 0, font: '400 11px/1.3 var(--font-sans)', color: '#666666' }}>
                  Instant advisory &amp; quick checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Area */}
      <main className="section" style={{ paddingTop: '32px' }}>
        <div className="wrap">
          {/* Category Filter Pills */}
          <div className="filters" role="group" aria-label="Filter products">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="filter"
                type="button"
                aria-pressed={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Liquid Product Cards Grid (3 columns on desktop, 2 on mobile) */}
          <div className="grid-3 products-grid">
            {displayedProducts.map((p) => {
              const whatsappText = `Hello Spark International Salon!
I would like to enquire about:
• ${p.brand} — ${p.name}
• Size: ${p.size}
• Price: ₹${p.priceNum.toLocaleString('en-IN')}`;

              return (
                <div
                  key={p.id}
                  className="lq-card p-card"
                  data-cursor-theme="light"
                >
                  {/* Rising Black Liquid Fill with Wave */}
                  <span className="lq-fill" aria-hidden="true">
                    <span className="lq-wave">
                      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
                        <path d="M0 14 C180 0 360 28 540 14 S900 0 1080 14 S1350 28 1440 14 V28 H0Z" />
                      </svg>
                      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
                        <path d="M0 14 C180 0 360 28 540 14 S900 0 1080 14 S1350 28 1440 14 V28 H0Z" />
                      </svg>
                    </span>
                  </span>

                  {/* Product Art Frame (Decreased height, pristine packshot) */}
                  <div className="p-art">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                    />
                    <span className="tag-cat">{p.categoryLabel}</span>
                  </div>

                  {/* Brand & Name */}
                  <div>
                    <p className="p-brand">
                      {p.brand} • {p.size}
                    </p>
                    <h3 className="p-name">
                      {p.name}
                    </h3>
                  </div>

                  {/* Clean Price Pill + WhatsApp Enquiry Pill */}
                  <div className="p-meta" style={{ marginTop: 'auto' }}>
                    <span className="p-price">₹{p.priceNum.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(p)}
                      className="p-add"
                      style={{ border: 'none', cursor: 'pointer' }}
                      aria-label={`Enquire about ${p.name}`}
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Product Enquiry Modal Dialog matching Appointment Request Dialog Design */}
      <ProductEnquiryDialog
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        selectedProduct={enquiryProduct}
        allProducts={productsList}
        whatsappNumber={settings?.whatsappNumber}
      />
    </div>
  );
}
