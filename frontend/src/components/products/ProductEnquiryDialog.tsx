'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import './ProductEnquiryDialog.css';

export interface ProductItem {
  id: string;
  brand: string;
  name: string;
  category?: string;
  categoryLabel?: string;
  size: string;
  priceNum: number;
  image: string;
  stockQuantity?: number | null;
  stockStatus?: string;
}

interface ProductEnquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: ProductItem | null;
  allProducts?: ProductItem[];
  whatsappNumber?: string;
}

export function getProductStock(product: ProductItem | null | undefined): number {
  if (!product) return 999;
  if (typeof product.stockQuantity === 'number' && !isNaN(product.stockQuantity)) {
    return product.stockQuantity;
  }
  if (product.stockStatus === 'Out of stock') {
    return 0;
  }
  if (product.size) {
    const match = product.size.match(/(\d+)\s*in\s*stock/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    if (/out of stock/i.test(product.size)) {
      return 0;
    }
  }
  return 10;
}

export default function ProductEnquiryDialog({
  isOpen,
  onClose,
  selectedProduct,
  allProducts = [],
  whatsappNumber,
}: ProductEnquiryDialogProps) {
  const settings = useSiteSettings();
  const dlgRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const readyLinkRef = useRef<HTMLAnchorElement>(null);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummaryError, setShowSummaryError] = useState(false);
  const [requestReady, setRequestReady] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  // Active product calculation
  const activeProduct = useMemo(() => {
    if (selectedProductId) {
      const match = allProducts.find((p) => p.id === selectedProductId);
      if (match) return match;
    }
    return selectedProduct;
  }, [selectedProductId, allProducts, selectedProduct]);

  // Available stock count for active product
  const maxStock = useMemo(() => getProductStock(activeProduct), [activeProduct]);

  // Numeric quantity parsed safely
  const parsedQuantity = parseInt(quantityInput, 10);
  const quantityNum = isNaN(parsedQuantity) ? 0 : parsedQuantity;
  const isOverStock = maxStock > 0 && quantityNum > maxStock;
  const isOutOfStock = maxStock === 0;

  // Quantity stepper handler (using functional updates for fast consecutive clicks)
  const handleQtyStep = (delta: number) => {
    setQuantityInput((prevStr) => {
      const prevNum = parseInt(prevStr, 10);
      const cur = isNaN(prevNum) ? 1 : prevNum;
      const next = Math.max(1, cur + delta);

      if (maxStock > 0 && next > maxStock) {
        setErrors((prevErr) => ({
          ...prevErr,
          quantity: `Only ${maxStock} unit${maxStock === 1 ? '' : 's'} available in stock.`,
        }));
      } else {
        setErrors((prevErr) => {
          const copy = { ...prevErr };
          delete copy.quantity;
          return copy;
        });
      }

      return String(next);
    });
  };

  // Direct numeric input handler
  const handleQtyInput = (rawVal: string) => {
    setQuantityInput(rawVal);
    const parsed = parseInt(rawVal, 10);

    if (rawVal.trim() === '' || isNaN(parsed) || parsed < 1) {
      setErrors((prevErr) => ({
        ...prevErr,
        quantity: 'Enter a valid quantity (minimum 1 unit).',
      }));
      return;
    }

    if (maxStock > 0 && parsed > maxStock) {
      setErrors((prevErr) => ({
        ...prevErr,
        quantity: `Quantity exceeds stock count (${maxStock} unit${maxStock === 1 ? '' : 's'} available).`,
      }));
    } else {
      setErrors((prevErr) => {
        const copy = { ...prevErr };
        delete copy.quantity;
        return copy;
      });
    }
  };

  // Product change handler
  const handleProductChange = (newId: string) => {
    setSelectedProductId(newId);
    const nextProd = allProducts.find((p) => p.id === newId) || selectedProduct;
    const nextMax = getProductStock(nextProd);

    if (nextMax > 0 && quantityNum > nextMax) {
      setErrors((prev) => ({
        ...prev,
        quantity: `Quantity exceeds stock count (${nextMax} unit${nextMax === 1 ? '' : 's'} available for this item).`,
      }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.quantity;
        return copy;
      });
    }
  };

  // Sync state whenever selectedProduct changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (selectedProduct) {
        setSelectedProductId(selectedProduct.id);
      }
      setFullName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setQuantityInput('1');
      setNotes('');
      setErrors({});
      setShowSummaryError(false);
      setRequestReady(false);
      setWhatsAppUrl('');

      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.stop?.();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const dlg = dlgRef.current;
      if (dlg && !dlg.open) {
        dlg.showModal();
      }

      requestAnimationFrame(() => {
        nameRef.current?.focus();
      });
    } else {
      const dlg = dlgRef.current;
      if (dlg && dlg.open) {
        dlg.close();
      }
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.start?.();
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.start?.();
    };
  }, [isOpen, selectedProduct]);

  const handleClose = useCallback(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    lenis?.start?.();
    const dlg = dlgRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    }
    onClose();
  }, [onClose]);

  // Handle escape key or native close
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;

    const onNativeClose = () => {
      handleClose();
    };

    dlg.addEventListener('close', onNativeClose);
    return () => {
      dlg.removeEventListener('close', onNativeClose);
    };
  }, [handleClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.start?.();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanAddress = address.trim();
    const cleanNotes = notes.trim();

    const digits = cleanPhone.replace(/\D/g, '');
    const phoneCharsOk = /^[+\d\s()-]+$/.test(cleanPhone);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    const nextErrors: Record<string, string> = {};
    if (!cleanName) {
      nextErrors.name = 'Enter your full name.';
    }
    if (!cleanPhone || digits.length < 8 || !phoneCharsOk) {
      nextErrors.phone = 'Enter a valid phone number with at least 8 digits.';
    }
    if (!cleanEmail || !emailValid) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!cleanAddress || cleanAddress.length < 5) {
      nextErrors.address = 'Enter your complete delivery address.';
    }
    if (!activeProduct) {
      nextErrors.product = 'Select a product to enquire about.';
    }

    // Strict quantity & stock validation
    if (isNaN(quantityNum) || quantityNum < 1) {
      nextErrors.quantity = 'Enter a valid quantity (at least 1 unit).';
    } else if (maxStock > 0 && quantityNum > maxStock) {
      nextErrors.quantity = `Quantity exceeds stock count (${maxStock} unit${maxStock === 1 ? '' : 's'} available).`;
    } else if (isOutOfStock) {
      nextErrors.quantity = 'This product is currently out of stock.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setShowSummaryError(true);
      setRequestReady(false);
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector(
          '[aria-invalid="true"]'
        ) as HTMLElement | null;
        firstInvalid?.focus();
      });
      return;
    }

    setErrors({});
    setShowSummaryError(false);

    // Format WhatsApp Enquiry Text with stock & total quantity
    const totalEst = (activeProduct?.priceNum || 0) * quantityNum;
    const lines = [
      '🛍️ *SPARK ATELIER — PRODUCT ENQUIRY*',
      '',
      '*Product Details:*',
      `• *Product:* ${activeProduct?.name || 'Selected Atelier Product'}`,
      `• *Brand:* ${activeProduct?.brand || 'Spark Atelier'}`,
      `• *Size / Volume:* ${activeProduct?.size || 'Standard'}`,
      `• *Unit Price:* ₹${(activeProduct?.priceNum || 0).toLocaleString('en-IN')}`,
      `• *Quantity:* ${quantityNum} unit${quantityNum > 1 ? 's' : ''}`,
      `• *Estimated Total:* ₹${totalEst.toLocaleString('en-IN')}`,
      '',
      '*Customer Details:*',
      `• *Name:* ${cleanName}`,
      `• *Phone:* ${cleanPhone}`,
      `• *Email:* ${cleanEmail}`,
      `• *Delivery Address:* ${cleanAddress}`,
    ];

    if (cleanNotes) {
      lines.push(`• *Notes:* ${cleanNotes}`);
    }

    lines.push('');
    lines.push('Hello Spark International Salon, I would like to enquire about this product. Please confirm availability and delivery.');

    const targetWa = String(
      whatsappNumber || settings?.whatsappNumber || SITE_CONFIG.contact.whatsapp || '918543097899'
    );
    const waDigits = targetWa.replace(/\D/g, '');
    const url = `https://wa.me/${waDigits}?text=${encodeURIComponent(lines.join('\n'))}`;

    setWhatsAppUrl(url);
    setRequestReady(true);

    // Open WhatsApp directly in new window/tab
    try {
      window.open(url, '_blank');
    } catch {
      // Fallback handled by the ready button
    }

    requestAnimationFrame(() => {
      readyLinkRef.current?.focus();
    });
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dlgRef}
      id="productEnquiryDlg"
      aria-labelledby="productDlgTitle"
      data-lenis-prevent
      data-open-state={isOpen ? 'open' : 'closed'}
      onClick={(e) => {
        if (e.target === dlgRef.current) {
          handleClose();
        }
      }}
    >
      <div className="dlg-head">
        <div>
          <p className="dlg-eyebrow">Atelier Boutique</p>
          <h2 id="productDlgTitle">Product enquiry</h2>
        </div>
        <button className="close" type="button" onClick={handleClose}>
          Close
        </button>
      </div>

      <div className="dlg-body" data-lenis-prevent>
        {/* Selected Product Preview Card */}
        {activeProduct && (
          <div className="product-selected-badge">
            <div className="badge-thumb">
              <img
                src={activeProduct.image || '/images/products/brand-body-lotion.png'}
                alt={activeProduct.name}
              />
            </div>
            <div className="badge-info">
              <p className="badge-brand">{activeProduct.brand}</p>
              <h3 className="badge-title">{activeProduct.name}</h3>
              <div className="badge-meta">
                <span>{activeProduct.size}</span>
                <span>•</span>
                <span className="badge-price">₹{activeProduct.priceNum.toLocaleString('en-IN')}</span>
                <span>•</span>
                <span style={{ color: maxStock <= 3 ? '#c8102e' : 'inherit', fontWeight: 500 }}>
                  {maxStock === 0 ? 'Out of stock' : `${maxStock} in stock`}
                </span>
              </div>
            </div>
          </div>
        )}

        <form
          ref={formRef}
          id="productEnquiryForm"
          className="appt-form"
          noValidate
          onSubmit={handleSubmit}
        >
          {/* Product Selector Field (Pre-filled automatically, switchable if needed) */}
          <div className="field wide">
            <label htmlFor="pProductSelect">Product *</label>
            <select
              id="pProductSelect"
              name="product"
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              aria-invalid={errors.product ? 'true' : undefined}
            >
              {activeProduct && !allProducts.some((p) => p.id === activeProduct.id) && (
                <option value={activeProduct.id}>
                  {activeProduct.brand} — {activeProduct.name} ({activeProduct.size} • ₹{activeProduct.priceNum.toLocaleString('en-IN')})
                </option>
              )}
              {allProducts.map((p) => {
                const stock = getProductStock(p);
                return (
                  <option key={p.id} value={p.id}>
                    {p.brand} — {p.name} ({p.size} • ₹{p.priceNum.toLocaleString('en-IN')} • {stock} in stock)
                  </option>
                );
              })}
            </select>
            {errors.product && <p className="err">{errors.product}</p>}
          </div>

          {/* Full Name */}
          <div className="field">
            <label htmlFor="pFullName">Full name *</label>
            <input
              ref={nameRef}
              id="pFullName"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Eleanor Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={errors.name ? 'true' : undefined}
            />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>

          {/* Phone or WhatsApp */}
          <div className="field">
            <label htmlFor="pPhone">Phone or WhatsApp *</label>
            <input
              id="pPhone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone ? 'true' : undefined}
            />
            {errors.phone && <p className="err">{errors.phone}</p>}
          </div>

          {/* Email Address */}
          <div className="field">
            <label htmlFor="pEmail">Email address *</label>
            <input
              id="pEmail"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="eleanor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? 'true' : undefined}
            />
            {errors.email && <p className="err">{errors.email}</p>}
          </div>

          {/* Quantity (Numeric Stepper, No Dropdown) */}
          <div className="field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label htmlFor="pQuantity">Quantity *</label>
              <span
                className={`stock-pill ${isOverStock || isOutOfStock ? 'warning' : ''}`}
                id="pStockBadge"
              >
                {maxStock === 0 ? 'Out of stock' : `${maxStock} in stock`}
              </span>
            </div>

            <div
              className="qty-control-wrapper"
              data-invalid={errors.quantity || isOverStock ? 'true' : undefined}
            >
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQtyStep(-1)}
                disabled={quantityNum <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="pQuantity"
                name="quantity"
                type="number"
                min={1}
                value={quantityInput}
                onChange={(e) => handleQtyInput(e.target.value)}
                aria-invalid={errors.quantity || isOverStock ? 'true' : undefined}
                className="qty-number-input"
              />
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQtyStep(1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Error or Warning text when quantity exceeds stock */}
            {errors.quantity && (
              <p className="err" id="qtyError">
                {errors.quantity}
              </p>
            )}
            {!errors.quantity && isOverStock && (
              <p className="err" id="qtyWarning">
                ⚠️ Only {maxStock} unit{maxStock === 1 ? '' : 's'} available in stock. Please enter {maxStock} or less.
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="field wide">
            <label htmlFor="pAddress">Delivery / Street address *</label>
            <textarea
              id="pAddress"
              name="address"
              maxLength={300}
              placeholder="Apartment / Villa, Street Name, Landmark, City, PIN Code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              aria-invalid={errors.address ? 'true' : undefined}
            />
            {errors.address && <p className="err">{errors.address}</p>}
          </div>

          {/* Additional Notes */}
          <div className="field wide">
            <label htmlFor="pNotes">Special instructions or questions (optional)</label>
            <input
              id="pNotes"
              name="notes"
              maxLength={200}
              placeholder="e.g. Scalp sensitivity, preferred delivery timing, or formulation advice"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="field wide">
            <p className="hint">
              Enquiries are formatted and sent directly through WhatsApp to our salon concierge. Stock availability and doorstep dispatch details will be confirmed by message. There is no online payment required at this step.
            </p>
          </div>

          <div className="field wide appt-foot">
            <p className="err" id="productDlgErr" hidden={!showSummaryError}>
              Fix the highlighted fields to continue.
            </p>
            <button className="appt-pill-btn" type="submit">
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </form>

        <div className="ready" id="readyEnquiry" hidden={!requestReady}>
          <strong>Your product enquiry is ready</strong>
          <p>
            WhatsApp has been prepared with your delivery details and product selection. Press Send in WhatsApp to deliver the request to Spark International Salon.
          </p>
          <a
            ref={readyLinkRef}
            className="appt-pill-btn"
            id="readyEnquiryLink"
            href={whatsAppUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Open WhatsApp</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
