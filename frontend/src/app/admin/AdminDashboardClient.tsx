'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SingleImageUpload, MultiImageUpload, copyToClipboard } from './ImageUploadField';
import { parseVideoUrl } from '@/lib/videoUtils';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface DashboardStats {
  studios: { total: number; published: number; draft: number };
  services: { total: number; published: number; draft: number };
  artists: { total: number; published: number; draft: number };
  products: { total: number; published: number; draft: number };
  academy: { total: number; published: number; draft: number };
  media: { total: number; published: number; draft: number };
  pages: { total: number; published: number; draft: number };
}

interface AttentionItem {
  text: string;
  route: string;
}

interface ActivityItem {
  id: string;
  text: string;
  at: string;
  user: string;
}

interface ToastMessage {
  id: string;
  text: string;
  kind?: 'ok' | 'error';
}

const STOCK_STATUSES = ['In stock', 'Low stock', 'Out of stock'];
const REL_TYPES = [
  { v: 'studios', l: 'Studio Gallery' },
  { v: 'gallery', l: 'Landing Page — Latest Works' },
  { v: 'services', l: 'Service' },
  { v: 'artists', l: 'Artist' },
  { v: 'products', l: 'Product' },
  { v: 'academy', l: 'Academy' },
];

const ROUTES: Record<string, string> = {
  dashboard: 'Dashboard',
  studios: 'Studios',
  services: 'Services',
  artists: 'Artists',
  academy: 'Academy',
  products: 'Products',
  media: 'Media',
  pages: 'Pages',
  settings: 'Website settings',
};

const COLLECTIONS = ['studios', 'services', 'artists', 'products', 'academy', 'media', 'pages'];

const SINGULAR_LABELS: Record<string, string> = {
  studios: 'studio',
  services: 'service',
  artists: 'artist',
  products: 'product',
  academy: 'course',
  media: 'media item',
  pages: 'page',
};

function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return iso;
  }
}

export default function AdminDashboardClient() {
  // Auth state
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Shell & Route state
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attention, setAttention] = useState<AttentionItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [records, setRecords] = useState<Record<string, any[]>>({
    studios: [],
    services: [],
    artists: [],
    products: [],
    academy: [],
    media: [],
    pages: [],
  });
  const [settings, setSettings] = useState<any>(null);
  const [settingsErrors, setSettingsErrors] = useState<Record<string, string>>({});
  const [settingsStatus, setSettingsStatus] = useState<string>('');

  // Filters state per collection: { q, status, rel }
  const [filters, setFilters] = useState<Record<string, { q: string; status: string; rel: string }>>({
    studios: { q: '', status: 'all', rel: 'all' },
    services: { q: '', status: 'all', rel: 'all' },
    artists: { q: '', status: 'all', rel: 'all' },
    products: { q: '', status: 'all', rel: 'all' },
    academy: { q: '', status: 'all', rel: 'all' },
    media: { q: '', status: 'all', rel: 'all' },
    pages: { q: '', status: 'all', rel: 'all' },
  });

  // Pagination state per collection
  const [pageNum, setPageNum] = useState<Record<string, number>>({
    studios: 1, services: 1, artists: 1, products: 1, academy: 1, media: 1, pages: 1,
  });
  const [pageSize, setPageSize] = useState<Record<string, number>>({
    studios: 20, services: 20, artists: 20, products: 20, academy: 20, media: 20, pages: 20,
  });

  // Modal dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; text: string; action: () => void } | null>(null);

  const formDlgRef = useRef<HTMLDialogElement>(null);
  const confirmDlgRef = useRef<HTMLDialogElement>(null);

  // Synchronize modal dialogs with native <dialog> methods
  useEffect(() => {
    const dlg = formDlgRef.current;
    if (!dlg) return;
    if (formOpen) {
      if (!dlg.open) {
        try { dlg.showModal(); } catch (_) { dlg.setAttribute('open', ''); }
      }
      requestAnimationFrame(() => {
        const first = dlg.querySelector<HTMLElement>('#formBody input, #formBody select, #formBody textarea');
        first?.focus();
      });
    } else {
      if (dlg.open) {
        try { dlg.close(); } catch (_) { dlg.removeAttribute('open'); }
      }
    }
  }, [formOpen]);

  useEffect(() => {
    const dlg = confirmDlgRef.current;
    if (!dlg) return;
    if (confirmDelete) {
      if (!dlg.open) {
        try { dlg.showModal(); } catch (_) { dlg.setAttribute('open', ''); }
      }
    } else {
      if (dlg.open) {
        try { dlg.close(); } catch (_) { dlg.removeAttribute('open'); }
      }
    }
  }, [confirmDelete]);

  // Toast Helper
  const showToast = useCallback((text: string, kind: 'ok' | 'error' = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  const handleCopyMediaUrl = useCallback((item: any) => {
    const raw = (item?.mediaUrl || '').trim();
    if (!raw) return;
    copyToClipboard(raw, () => {
      setCopiedMediaId(item._id);
      setToastMsg('URL copied to clipboard');
      setTimeout(() => setToastMsg((cur) => (cur === 'URL copied to clipboard' ? null : cur)), 2000);
      setTimeout(() => setCopiedMediaId((cur) => (cur === item._id ? null : cur)), 2000);
    });
  }, []);

  // Navigation Helper
  const navigateTo = useCallback((route: string) => {
    if (!ROUTES[route]) return;
    setCurrentRoute(route);
    setMenuOpen(false);
    if (window.location.hash !== `#${route}`) {
      window.location.hash = `#${route}`;
    }
    // Reset page number when navigating to a new section
    if (COLLECTIONS.includes(route)) {
      setPageNum((prev) => ({ ...prev, [route]: 1 }));
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  // Sync document.title and body.nav-open class
  useEffect(() => {
    const label = ROUTES[currentRoute] || 'Dashboard';
    document.title = admin ? `${label} · Spark Admin` : 'Spark Admin Dashboard';
  }, [admin, currentRoute]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [menuOpen]);

  // Hash-based navigation
  useEffect(() => {
    const handleHash = () => {
      const h = (window.location.hash || '#dashboard').slice(1);
      if (ROUTES[h]) {
        setCurrentRoute(h);
      } else {
        setCurrentRoute('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Check initial authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          if (data.admin) {
            setAdmin(data.admin);
            if (data.csrfToken) setCsrfToken(data.csrfToken);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  // Load Dashboard Data
  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setAttention(data.attention || []);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  }, []);

  // Load Collection Data
  const loadCollection = useCallback(async (col: string) => {
    try {
      const res = await fetch(`/api/admin/${col}`);
      if (res.ok) {
        const data = await res.json();
        setRecords((prev) => ({ ...prev, [col]: data.data || [] }));
      }
    } catch (err) {
      console.error(`Error loading ${col}:`, err);
    }
  }, []);

  // Load Settings
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  }, []);

  // Fetch data whenever user is authenticated or route changes
  useEffect(() => {
    if (!admin) return;
    if (currentRoute === 'dashboard') {
      loadDashboard();
      COLLECTIONS.forEach(loadCollection);
    } else if (currentRoute === 'settings') {
      loadSettings();
    } else if (COLLECTIONS.includes(currentRoute)) {
      loadCollection(currentRoute);
      if (currentRoute === 'services' || currentRoute === 'artists') {
        loadCollection('studios');
      } else if (currentRoute === 'media') {
        loadCollection('studios');
        loadCollection('services');
        loadCollection('artists');
        loadCollection('products');
        loadCollection('academy');
      }
    }
  }, [admin, currentRoute, loadCollection, loadDashboard, loadSettings]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim());
    const passOk = loginPassword.length >= 8;

    const errs: Record<string, string> = {};
    if (!emailOk) errs.email = 'Enter a valid email address.';
    if (!passOk) errs.password = 'Use at least 8 characters.';

    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      return;
    }

    setLoginSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmin(data.admin);
        if (data.csrfToken) setCsrfToken(data.csrfToken);
        setLoginPassword('');
        showToast('Signed in successfully');
        loadDashboard();
      } else {
        setLoginErrors(data.errors || { _general: data.error || 'Invalid credentials' });
      }
    } catch (err: any) {
      setLoginErrors({ _general: 'Network error during sign in.' });
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (_) {}
    setMenuOpen(false);
    setAdmin(null);
    setCsrfToken('');
    window.location.hash = '#dashboard';
    showToast('Signed out');
  };

  // Publish / Unpublish Toggle
  const togglePublish = async (collection: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/${collection}/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.isPublished ? 'Published on the website' : 'Hidden from the website');
        loadCollection(collection);
        loadDashboard();
      } else {
        showToast(data.error || 'Failed to update publish state', 'error');
      }
    } catch (err: any) {
      showToast('Network error while toggling publish state', 'error');
    }
  };

  // Delete Action with Studio Guard
  const askDelete = (collection: string, item: any) => {
    const label = item.name || item.title || item.slug || 'record';

    // Studio delete guard: check services under studio
    if (collection === 'studios') {
      const studioServices = records.services.filter(
        (s) => s.studioId?._id === item._id || s.studioId === item._id
      );
      if (studioServices.length > 0) {
        showToast(
          `Move or delete the ${studioServices.length} service${studioServices.length > 1 ? 's' : ''} under ${label} first.`,
          'error'
        );
        return;
      }
    }

    setConfirmDelete({
      open: true,
      text: `Delete "${label}"? This cannot be undone.`,
      action: async () => {
        try {
          const res = await fetch(`/api/admin/${collection}/${item._id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-csrf-token': csrfToken,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast('Deleted');
            loadCollection(collection);
            loadDashboard();
          } else {
            showToast(data.error || 'Failed to delete record', 'error');
          }
        } catch (err: any) {
          showToast('Network error during deletion', 'error');
        } finally {
          setConfirmDelete(null);
        }
      },
    });
  };

  // Open Form Modal (Add or Edit)
  const openForm = (collection: string, item?: any, preset?: Record<string, any>) => {
    setEditingId(item?._id || null);
    setFormErrors({});

    const nextOrder =
      Math.max(0, ...(records[collection] || []).map((r) => r.displayOrder || 0)) + 1;

    const defaults: any = {
      displayOrder: nextOrder,
      isPublished: false,
      stockStatus: 'In stock',
      mediaType: 'image',
      images: [],
      videoUrl: '',
      servicesImage: '',
      servicesVideo: '',
      specialities: [],
      facilities: [],
      highlights: [],
      subTypes: [],
      category: '',
      studioIds: [],
      studioId: records.studios[0]?._id || '',
      studio: 'Hair',
      duration: '4 weeks',
      level: 'Beginner',
      schedule: 'Monthly intake',
      fee: 'On enquiry',
      tone: 'black',
      learn: [],
      includes: [],
    };

    if (!item && collection === 'media') {
      const relFilter = filters.media?.rel || 'all';
      if (relFilter === 'gallery') {
        defaults.relatedType = 'gallery';
        defaults.relatedId = null;
        defaults.isPublished = true;
      } else if (relFilter.startsWith('studio:')) {
        defaults.relatedType = 'studios';
        defaults.relatedId = relFilter.slice(7);
        defaults.isPublished = true;
      } else if (relFilter === 'studios') {
        defaults.relatedType = 'studios';
        defaults.relatedId = records.studios[0]?._id || null;
      } else if (['services', 'artists', 'products', 'academy'].includes(relFilter)) {
        defaults.relatedType = relFilter;
      }
    }

    if (item) {
      // Normalize relations for form and preserve existing slug on edit
      const cloned = { ...item, slugManual: Boolean(item._id || item.slug) };
      if (cloned.studioId?._id) cloned.studioId = cloned.studioId._id;
      if (cloned.relatedId?._id) cloned.relatedId = cloned.relatedId._id;
      if (Array.isArray(cloned.studioIds)) {
        cloned.studioIds = cloned.studioIds.map((s: any) => (s._id ? s._id : s));
      }
      setFormValues(cloned);
    } else {
      setFormValues(preset ? { ...defaults, ...preset } : defaults);
    }

    setFormOpen(true);
  };

  const openStudioGallery = (studio: any) => {
    setFormOpen(false);
    setFilters((prev) => ({
      ...prev,
      media: { ...(prev.media || { q: '', status: 'all', rel: 'all' }), rel: `studio:${studio._id}` },
    }));
    navigateTo('media');
  };

  const openStudioServices = (studio: any) => {
    setFormOpen(false);
    setFilters((prev) => ({
      ...prev,
      services: { ...(prev.services || { q: '', status: 'all', studio: 'all' }), studio: studio._id },
    }));
    navigateTo('services');
  };

  const openMediaWithPreset = (preset: Record<string, any>) => {
    setFormOpen(false);
    if (preset.relatedType === 'studios' && preset.relatedId) {
      setFilters((prev) => ({
        ...prev,
        media: { ...(prev.media || { q: '', status: 'all', rel: 'all' }), rel: `studio:${preset.relatedId}` },
      }));
    } else if (preset.relatedType === 'gallery') {
      setFilters((prev) => ({
        ...prev,
        media: { ...(prev.media || { q: '', status: 'all', rel: 'all' }), rel: 'gallery' },
      }));
    }
    navigateTo('media');
    openForm('media', undefined, preset);
  };

  // Save Record
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const col = currentRoute;
    const clientErrs = validateForm(col, formValues);
    if (Object.keys(clientErrs).length > 0) {
      setFormErrors({ ...clientErrs, _general: 'Fix the highlighted fields to save.' });
      setTimeout(() => {
        const first = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
        if (first) first.focus();
      }, 50);
      return;
    }

    const url = editingId ? `/api/admin/${col}/${editingId}` : `/api/admin/${col}`;
    const method = editingId ? 'PATCH' : 'POST';

    const payload = { ...formValues };
    if (col === 'media') {
      if (!payload.relatedType || payload.relatedType === 'gallery') {
        payload.relatedId = null;
      }
      if (typeof payload.mediaUrl === 'string' && /^www\./i.test(payload.mediaUrl.trim())) {
        payload.mediaUrl = `https://${payload.mediaUrl.trim()}`;
      }
    }
    if (col === 'artists') {
      if (typeof payload.specialities === 'string') {
        payload.specialities = payload.specialities
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
    if (col === 'services' && Array.isArray(payload.subTypes)) {
      payload.subTypes = payload.subTypes
        .filter((st: any) => st && String(st.name || '').trim())
        .map((st: any) => ({
          name: String(st.name || '').trim(),
          description: String(st.description || '').trim(),
          duration: String(st.duration || '').trim(),
          price: st.price === '' || st.price === undefined ? null : st.price,
          image: String(st.image || '').trim(),
        }));
    }
    if (col === 'academy') {
      if (typeof payload.learn === 'string') {
        payload.learn = payload.learn
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      if (typeof payload.includes === 'string') {
        payload.includes = payload.includes
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Saved');
        setFormOpen(false);
        loadCollection(col);
        loadDashboard();
      } else {
        if (data.errors) {
          setFormErrors(data.errors);
          // Focus first invalid field
          setTimeout(() => {
            const first = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
            if (first) first.focus();
          }, 100);
        } else {
          setFormErrors({ _general: data.error || 'Failed to save record' });
        }
      }
    } catch (err: any) {
      setFormErrors({ _general: 'Network error while saving' });
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsErrors({});
    setSettingsStatus('');

    const clientErrs = validateSettings(settings);
    if (Object.keys(clientErrs).length > 0) {
      setSettingsErrors(clientErrs);
      setTimeout(() => {
        const first = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
        if (first) first.focus();
      }, 50);
      return;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.data);
        showToast('Settings saved');
        setSettingsStatus('Settings saved successfully.');
        setTimeout(() => setSettingsStatus(''), 4000);
      } else {
        if (data.errors) {
          setSettingsErrors(data.errors);
        } else {
          showToast(data.error || 'Failed to save settings', 'error');
        }
      }
    } catch (err: any) {
      showToast('Network error while saving settings', 'error');
    }
  };

  // Keyboard shortcut: Escape closes dialogs or mobile menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDelete) setConfirmDelete(null);
        else if (formOpen) setFormOpen(false);
        else if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmDelete, formOpen, menuOpen]);

  // Filtered rows for current list
  const currentListRows = useMemo(() => {
    if (!COLLECTIONS.includes(currentRoute)) return [];
    const list = records[currentRoute] || [];
    const f = filters[currentRoute] || { q: '', status: 'all', rel: 'all' };
    const q = f.q.trim().toLowerCase();

    return list.filter((r) => {
      if (q) {
        const str = (r.name || r.title || r.slug || r.designation || r.category || r.notes || '').toLowerCase();
        if (!str.includes(q)) return false;
      }
      if (f.status === 'published' && !r.isPublished) return false;
      if (f.status === 'draft' && r.isPublished) return false;

      // Studio / category / placement filters
      if (f.rel !== 'all') {
        if (currentRoute === 'services') {
          const sId = r.studioId?._id || r.studioId;
          if (sId !== f.rel) return false;
        } else if (currentRoute === 'artists') {
          const sIds = (r.studioIds || []).map((s: any) => (s._id ? s._id : s));
          if (!sIds.includes(f.rel)) return false;
        } else if (currentRoute === 'products') {
          if (r.stockStatus !== f.rel) return false;
        } else if (currentRoute === 'academy') {
          // Academy studio filter: filter by studio name
          if ((r.studio || '').toLowerCase() !== f.rel.toLowerCase()) return false;
        } else if (currentRoute === 'media') {
          const rId = typeof r.relatedId === 'object' && r.relatedId ? r.relatedId._id : r.relatedId;
          if (f.rel === 'gallery') {
            if (r.relatedType !== 'gallery') return false;
          } else if (f.rel === 'unlinked') {
            if (r.relatedType === 'gallery' || (r.relatedType && rId)) return false;
          } else if (f.rel.startsWith('studio:')) {
            const targetStudioId = f.rel.slice(7);
            if (r.relatedType !== 'studios' || rId !== targetStudioId) return false;
          } else if (f.rel === 'video-direct') {
            if (r.mediaType !== 'video' || !parseVideoUrl(r.mediaUrl).isDirect) return false;
          } else if (f.rel === 'video-link') {
            if (r.mediaType !== 'video' || parseVideoUrl(r.mediaUrl).isDirect) return false;
          } else if (r.relatedType !== f.rel) {
            return false;
          }
        }
      }
      return true;
    });
  }, [currentRoute, filters, records]);

  // Paginated rows (slice of filtered)
  const paginatedRows = useMemo(() => {
    const route = currentRoute;
    const size = pageSize[route] || 20;
    const page = pageNum[route] || 1;
    const start = (page - 1) * size;
    return currentListRows.slice(start, start + size);
  }, [currentListRows, currentRoute, pageNum, pageSize]);

  const totalPages = useMemo(() => {
    const route = currentRoute;
    const size = pageSize[route] || 20;
    return Math.max(1, Math.ceil(currentListRows.length / size));
  }, [currentListRows, currentRoute, pageSize]);

  // Keep page number within bounds if records are deleted or filtered
  useEffect(() => {
    const cur = pageNum[currentRoute] || 1;
    if (cur > totalPages) {
      setPageNum((prev) => ({ ...prev, [currentRoute]: totalPages }));
    }
  }, [currentRoute, pageNum, totalPages]);

  // Helper to format linked item for media table
  const getMediaLinkLabel = useCallback(
    (r: any) => {
      if (!r.relatedType) return '—';
      if (r.relatedType === 'gallery') return 'Landing Page — Latest Works';
      const typeObj = REL_TYPES.find((t) => t.v === r.relatedType);
      const typeLabel = typeObj ? typeObj.l : r.relatedType;
      const targetId = typeof r.relatedId === 'object' && r.relatedId ? r.relatedId._id : r.relatedId;
      if (!targetId) return `${typeLabel}: Not set`;
      const list = records[r.relatedType] || [];
      const item = list.find((x: any) => x._id === targetId || x.slug === targetId);
      const name = item ? item.name || item.title || item.slug : 'Linked';
      return `${typeLabel}: ${name}`;
    },
    [records]
  );

  // Client-side form validation
  const validateForm = (col: string, vals: any): Record<string, string> => {
    const errs: Record<string, string> = {};
    const slugRe = col === 'pages' ? /^(\/|[a-z0-9]+(-[a-z0-9]+)*)$/ : /^[a-z0-9]+(-[a-z0-9]+)*$/;

    if (col === 'media') {
      if (!vals.title || !String(vals.title).trim()) errs.title = 'Required.';
      if (!vals.mediaUrl || !String(vals.mediaUrl).trim()) errs.mediaUrl = 'Required.';
      if (vals.relatedType && vals.relatedType !== 'gallery' && !vals.relatedId) {
        errs.relatedId = 'Select the specific item to link this media to.';
      }
    } else if (col === 'pages') {
      if (!vals.title || !String(vals.title).trim()) errs.title = 'Required.';
      if (!vals.slug || !String(vals.slug).trim()) errs.slug = 'Required.';
      else if (!slugRe.test(String(vals.slug).trim())) errs.slug = 'Lowercase letters, numbers and hyphens. Use / for the home page.';
    } else {
      if (!vals.name || !String(vals.name).trim()) errs.name = 'Required.';
      if (!vals.slug || !String(vals.slug).trim()) errs.slug = 'Required.';
      else if (!slugRe.test(String(vals.slug).trim())) errs.slug = 'Lowercase letters, numbers and hyphens only.';
    }

    if (col === 'services') {
      if (!vals.studioId) errs.studioId = 'Choose a studio.';
    }
    if (col === 'artists') {
      if (!vals.studioIds || vals.studioIds.length === 0) errs.studioIds = 'Assign at least one studio.';
    }
    if (col === 'products') {
      if (vals.price == null || vals.price === '' || Number.isNaN(Number(vals.price)) || Number(vals.price) < 0) {
        errs.price = 'Enter a valid price.';
      }
      if (!vals.stockStatus) errs.stockStatus = 'Select stock status.';
      if (vals.stockStatus === 'Out of stock' && Number(vals.stockQuantity) > 0) {
        errs.stockStatus = 'Set quantity to 0 when out of stock, or change status.';
      }
    }

    return errs;
  };

  const validateSettings = (vals: any): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!vals?.siteName || !String(vals.siteName).trim()) errs.siteName = 'Required.';
    if (!vals?.phone || !String(vals.phone).trim()) errs.phone = 'Required.';
    if (!vals?.whatsappNumber || !String(vals.whatsappNumber).trim()) {
      errs.whatsappNumber = 'Required.';
    } else if (!/^\d{8,15}$/.test(String(vals.whatsappNumber).trim())) {
      errs.whatsappNumber = 'Digits only, including country code (8 to 15 digits).';
    }
    if (!vals?.email || !String(vals.email).trim()) {
      errs.email = 'Required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(vals.email).trim())) {
      errs.email = 'Enter a valid email address.';
    }
    if (!vals?.address || !String(vals.address).trim()) errs.address = 'Required.';
    return errs;
  };

  // Loading indicator on initial session check
  if (!authChecked) {
    return (
      <section className="login" aria-busy="true">
        <div className="login-card">
          <p className="eyebrow">Spark admin</p>
          <h1>Sign in</h1>
          <p className="hint">Connecting to Spark Admin...</p>
        </div>
      </section>
    );
  }

  // 1. UNPROTECTED / LOGIN SCREEN
  if (!admin) {
    return (
      <>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
          <defs>
            <filter id="marble-static" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.008" numOctaves={3} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={340} xChannelSelector="R" yChannelSelector="G" result="disp" />
              <feGaussianBlur in="disp" stdDeviation={8} />
            </filter>
          </defs>
        </svg>

        <section className="login" id="login">
          <form className="login-card" id="loginForm" onSubmit={handleLogin} noValidate>
            <p className="eyebrow">Spark admin</p>
            <h1>Sign in</h1>
            <div className="field">
              <label htmlFor="lEmail">Email</label>
              <input
                id="lEmail"
                type="email"
                autoComplete="username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                aria-invalid={!!loginErrors.email}
                aria-describedby={loginErrors.email ? 'lEmailErr' : undefined}
              />
              {loginErrors.email && <p className="err" role="alert" id="lEmailErr">{loginErrors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="lPass">Password</label>
              <input
                id="lPass"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                aria-invalid={!!loginErrors.password}
                aria-describedby={loginErrors.password ? 'lPassErr' : undefined}
              />
              {loginErrors.password && <p className="err" role="alert" id="lPassErr">{loginErrors.password}</p>}
            </div>
            {loginErrors._general && <p className="err" role="alert">{loginErrors._general}</p>}
            <button className="btn" type="submit" disabled={loginSubmitting}>
              {loginSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="hint">
              Administrator console authenticated via HTTP-only secure cookies and CSRF protection.
            </p>
          </form>

          {/* Toasts */}
          <div className="toast-wrap" id="toasts" aria-live="polite">
            {toasts.map((t) => (
              <div key={t.id} className={`toast ${t.kind === 'error' ? 'error' : ''}`} role="status">
                {t.text}
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  // 2. AUTHENTICATED SHELL & VIEWS
  return (
    <div className={`shell ${menuOpen ? 'nav-open' : ''}`} id="shell">
      {/* Sidebar */}
      <aside className="side" id="side" aria-label="Admin navigation">
        <div className="brand">SPARK<small>Admin</small></div>
        <nav className="nav" aria-label="Sections">
          <div>
            <h4>Overview</h4>
            <ul>
              <li>
                <a
                  href="#dashboard"
                  aria-current={currentRoute === 'dashboard' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('dashboard');
                  }}
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Content</h4>
            <ul>
              <li>
                <a
                  href="#studios"
                  aria-current={currentRoute === 'studios' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('studios');
                  }}
                >
                  Studios
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  aria-current={currentRoute === 'services' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('services');
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#artists"
                  aria-current={currentRoute === 'artists' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('artists');
                  }}
                >
                  Artists
                </a>
              </li>
              <li>
                <a
                  href="#academy"
                  aria-current={currentRoute === 'academy' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('academy');
                  }}
                >
                  Academy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Store</h4>
            <ul>
              <li>
                <a
                  href="#products"
                  aria-current={currentRoute === 'products' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('products');
                  }}
                >
                  Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Library</h4>
            <ul>
              <li>
                <a
                  href="#media"
                  aria-current={currentRoute === 'media' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('media');
                  }}
                >
                  Media
                </a>
              </li>
              <li>
                <a
                  href="#pages"
                  aria-current={currentRoute === 'pages' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('pages');
                  }}
                >
                  Pages
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Website</h4>
            <ul>
              <li>
                <a
                  href="#settings"
                  aria-current={currentRoute === 'settings' ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('settings');
                  }}
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <p className="side-foot">
          Logged in as {admin.email}. Production database synchronized.
        </p>
      </aside>
      <div className="scrim" id="scrim" onClick={() => setMenuOpen(false)} />

      {/* Main Container */}
      <div className="main">
        {/* Top Bar */}
        <header className="top">
          <button
            className="menu-btn"
            id="menuBtn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="side"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
          <div className="top-title">
            <p className="eyebrow">Spark admin</p>
            <h1 id="pageTitle">{ROUTES[currentRoute] || 'Dashboard'}</h1>
          </div>
          <p className="top-note">
            Records marked Example are placeholders from the specification. Replace or delete them before launch.
          </p>
          <div className="top-user">
            <span id="who" title={admin.email}>{admin.email}</span>
            <button className="btn ghost sm" id="signOut" type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        {/* View Body */}
        <main className="view" id="view" aria-live="polite">
          {/* VIEW: DASHBOARD */}
          {currentRoute === 'dashboard' && !stats && (
            <div className="dash-loading" aria-busy="true" aria-label="Loading dashboard">
              <div className="stats">
                {COLLECTIONS.map((colKey) => (
                  <div key={colKey} className="skel" />
                ))}
              </div>
              <div className="two">
                <div className="skel" style={{ minHeight: 220 }} />
                <div className="skel" style={{ minHeight: 220 }} />
              </div>
            </div>
          )}
          {currentRoute === 'dashboard' && stats && (
            <>
              <div className="stats">
                {COLLECTIONS.map((colKey) => {
                  const s = (stats as any)[colKey] || { total: 0, published: 0, draft: 0 };
                  const title = ROUTES[colKey] || colKey;
                  return (
                    <a
                      key={colKey}
                      className="stat"
                      href={`#${colKey}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(colKey);
                      }}
                    >
                      <span className="stat-label">{title}</span>
                      <span className="num">{s.total}</span>
                      <span className="hint">{s.published} published · {s.draft} draft</span>
                    </a>
                  );
                })}
              </div>

              <div className="two">
                {/* Needs Attention */}
                <section className="panel">
                  <h2>Needs attention</h2>
                  {attention.length > 0 ? (
                    <ul className="list">
                      {attention.map((att, idx) => (
                        <li key={idx}>
                          <a
                            href={`#${att.route}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(att.route);
                            }}
                          >
                            {att.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="hint">Everything is in order.</p>
                  )}
                </section>

                {/* Recent Activity */}
                <section className="panel">
                  <h2>Recent activity</h2>
                  {recentActivity.length > 0 ? (
                    <ul className="list">
                      {recentActivity.map((act) => (
                        <li key={act.id}>
                          {act.text} <span className="hint">{formatDate(act.at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="hint">No activity logged yet.</p>
                  )}
                </section>
              </div>
            </>
          )}

          {/* VIEW: WEBSITE SETTINGS */}
          {currentRoute === 'settings' && !settings && (
            <section className="panel">
              <p className="hint">Loading website settings...</p>
            </section>
          )}
          {currentRoute === 'settings' && settings && (
            <section className="panel">
              <p className="hint" style={{ marginBottom: 20 }}>
                These details appear across the website. WhatsApp enquiries are sent to the WhatsApp number below.
              </p>
              <form id="settingsForm" className="form-grid" onSubmit={handleSaveSettings} noValidate>
                <div className="field">
                  <label htmlFor="sSiteName">Site name <span aria-hidden="true">*</span></label>
                  <input
                    id="sSiteName"
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    aria-invalid={!!settingsErrors.siteName}
                  />
                  {settingsErrors.siteName && <p className="err" role="alert">{settingsErrors.siteName}</p>}
                </div>

                <div className="field">
                  <label htmlFor="sPhone">Phone <span aria-hidden="true">*</span></label>
                  <input
                    id="sPhone"
                    type="tel"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    aria-invalid={!!settingsErrors.phone}
                  />
                  {settingsErrors.phone && <p className="err" role="alert">{settingsErrors.phone}</p>}
                </div>

                <div className="field">
                  <label htmlFor="sWhatsapp">WhatsApp number <span aria-hidden="true">*</span></label>
                  <input
                    id="sWhatsapp"
                    type="text"
                    value={settings.whatsappNumber || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    aria-invalid={!!settingsErrors.whatsappNumber}
                  />
                  <p className="hint">Country code and number, digits only. Example: 918543097899.</p>
                  {settingsErrors.whatsappNumber && <p className="err" role="alert">{settingsErrors.whatsappNumber}</p>}
                </div>

                <div className="field">
                  <label htmlFor="sEmail">Email <span aria-hidden="true">*</span></label>
                  <input
                    id="sEmail"
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    aria-invalid={!!settingsErrors.email}
                  />
                  {settingsErrors.email && <p className="err" role="alert">{settingsErrors.email}</p>}
                </div>

                {/* Logo with SingleImageUpload */}
                <SingleImageUpload
                  label="Logo"
                  value={settings.logoUrl || ''}
                  onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                  category="pages"
                  csrfToken={csrfToken}
                  hint="Brand logo used across headers and footer."
                />

                <div className="field wide">
                  <label htmlFor="sAddress">Address <span aria-hidden="true">*</span></label>
                  <textarea
                    id="sAddress"
                    rows={3}
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    aria-invalid={!!settingsErrors.address}
                  />
                  {settingsErrors.address && <p className="err" role="alert">{settingsErrors.address}</p>}
                </div>

                <div className="field wide">
                  <label htmlFor="sHours">Opening hours</label>
                  <textarea
                    id="sHours"
                    rows={2}
                    value={settings.openingHours || ''}
                    onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sInsta">Instagram URL</label>
                  <input
                    id="sInsta"
                    type="url"
                    value={settings.instagram || ''}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sFb">Facebook URL</label>
                  <input
                    id="sFb"
                    type="url"
                    value={settings.facebook || ''}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sYt">YouTube URL</label>
                  <input
                    id="sYt"
                    type="url"
                    value={settings.youtube || ''}
                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  />
                </div>
              </form>
              <div className="form-foot">
                <p className="status" id="settingsStatus" role="status">
                  {settingsStatus}
                </p>
                <button className="btn" type="submit" form="settingsForm">
                  Save settings
                </button>
              </div>
            </section>
          )}

          {/* VIEW: COLLECTIONS (Studios, Services, Artists, Products, Academy, Media, Pages) */}
          {COLLECTIONS.includes(currentRoute) && (
            <>
              {/* Page Head */}
              <div className="page-head">
                <p className="hint">
                  {records[currentRoute]?.length || 0} {ROUTES[currentRoute].toLowerCase()} ·{' '}
                  {(records[currentRoute] || []).filter((r) => r.isPublished).length} published
                </p>
                <button className="btn" type="button" onClick={() => openForm(currentRoute)}>
                  Add {SINGULAR_LABELS[currentRoute] || 'record'}
                </button>
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                <input
                  className="search"
                  id="qFilter"
                  type="search"
                  placeholder={`Search ${ROUTES[currentRoute].toLowerCase()}`}
                  aria-label={`Search ${ROUTES[currentRoute].toLowerCase()}`}
                  value={filters[currentRoute]?.q || ''}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      [currentRoute]: { ...filters[currentRoute], q: e.target.value },
                    });
                    setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                  }}
                />

                <select
                  id="statusFilter"
                  aria-label="Filter by status"
                  value={filters[currentRoute]?.status || 'all'}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      [currentRoute]: { ...filters[currentRoute], status: e.target.value },
                    });
                    setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                  }}
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                {/* Studio Filter for Services and Artists */}
                {(currentRoute === 'services' || currentRoute === 'artists') && (
                  <select
                    id="relFilter"
                    aria-label="Filter by studio"
                    value={filters[currentRoute]?.rel || 'all'}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        [currentRoute]: { ...filters[currentRoute], rel: e.target.value },
                      });
                      setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                    }}
                  >
                    <option value="all">All studios</option>
                    {(records.studios || []).map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Stock Filter for Products */}
                {currentRoute === 'products' && (
                  <select
                    id="relFilter"
                    aria-label="Filter by stock"
                    value={filters[currentRoute]?.rel || 'all'}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        [currentRoute]: { ...filters[currentRoute], rel: e.target.value },
                      });
                      setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                    }}
                  >
                    <option value="all">All stock levels</option>
                    {STOCK_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                )}

                {/* Academy Studio Filter */}
                {currentRoute === 'academy' && (
                  <select
                    id="relFilter"
                    aria-label="Filter by studio"
                    value={filters[currentRoute]?.rel || 'all'}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        [currentRoute]: { ...filters[currentRoute], rel: e.target.value },
                      });
                      setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                    }}
                  >
                    <option value="all">All studios</option>
                    {['Hair', 'Beard & Grooming', 'Nail', 'Face', 'Waxing', 'Bridal', 'Spa', 'Tattoo'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}

                {/* Media Placement & Video Source Filter */}
                {currentRoute === 'media' && (
                  <select
                    id="relFilter"
                    aria-label="Filter by placement or studio"
                    value={filters.media?.rel || 'all'}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        media: { ...filters.media, rel: e.target.value },
                      });
                      setPageNum((prev) => ({ ...prev, media: 1 }));
                    }}
                  >
                    <option value="all">All placements</option>
                    <option value="gallery">Landing Page — Latest Works</option>
                    <option value="studios">All Studio Galleries</option>
                    {(records.studios || []).length > 0 && (
                      <optgroup label="Individual Studio Galleries">
                        {(records.studios || []).map((st) => (
                          <option key={st._id} value={`studio:${st._id}`}>
                            Studio: {st.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Video Types">
                      <option value="video-direct">Direct Uploaded Videos</option>
                      <option value="video-link">Platform Video Links (YouTube / IG)</option>
                    </optgroup>
                    <optgroup label="Other Sections">
                      <option value="services">Services</option>
                      <option value="artists">Artists</option>
                      <option value="products">Products</option>
                      <option value="academy">Academy</option>
                      <option value="unlinked">Unlinked</option>
                    </optgroup>
                  </select>
                )}

                {/* Page size selector */}
                <select
                  className="pg-size-select"
                  aria-label="Rows per page"
                  value={pageSize[currentRoute] || 20}
                  onChange={(e) => {
                    const sz = Number(e.target.value);
                    setPageSize((prev) => ({ ...prev, [currentRoute]: sz }));
                    setPageNum((prev) => ({ ...prev, [currentRoute]: 1 }));
                  }}
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>{n} per page</option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {currentRoute === 'studios' && (
                        <>
                          <th scope="col">Name</th>
                          <th scope="col">Slug</th>
                          <th scope="col">Order</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'services' && (
                        <>
                          <th scope="col">Name</th>
                          <th scope="col">Studio</th>
                          <th scope="col">Order</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'artists' && (
                        <>
                          <th scope="col">Name</th>
                          <th scope="col">Designation</th>
                          <th scope="col">Studios</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'products' && (
                        <>
                          <th scope="col">Name</th>
                          <th scope="col">Category</th>
                          <th scope="col">Price</th>
                          <th scope="col">Stock</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'academy' && (
                        <>
                          <th scope="col">Course Name</th>
                          <th scope="col">Studio</th>
                          <th scope="col">Duration</th>
                          <th scope="col">Level</th>
                          <th scope="col">Order</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'media' && (
                        <>
                          <th scope="col">Title</th>
                          <th scope="col">Type</th>
                          <th scope="col">Linked to</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      {currentRoute === 'pages' && (
                        <>
                          <th scope="col">Title</th>
                          <th scope="col">Slug</th>
                          <th scope="col">Status</th>
                        </>
                      )}
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="rows">
                    {currentListRows.length > 0 ? (
                      paginatedRows.map((r) => (
                        <tr
                          key={r._id}
                          className={currentRoute === 'media' ? 'media-row' : undefined}
                          title={currentRoute === 'media' && r.mediaUrl ? `Click to copy URL: ${r.mediaUrl}` : undefined}
                          onClick={currentRoute === 'media' && r.mediaUrl ? () => handleCopyMediaUrl(r) : undefined}
                        >
                          {/* Studios */}
                          {currentRoute === 'studios' && (
                            <>
                              <td data-label="Name">
                                <strong>{r.name}</strong>
                                {r.example && <span className="pill muted">Example</span>}
                              </td>
                              <td data-label="Slug">{r.slug || '—'}</td>
                              <td data-label="Order">{r.displayOrder ?? '—'}</td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Services */}
                          {currentRoute === 'services' && (
                            <>
                              <td data-label="Name">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  {r.videoUrl ? (
                                    <span
                                      className="pill muted"
                                      title={`Video: ${r.videoUrl}`}
                                      style={{ fontSize: 10, padding: '2px 7px', fontWeight: 600, letterSpacing: '0.06em' }}
                                    >
                                      VIDEO
                                    </span>
                                  ) : r.images && r.images[0] ? (
                                    <img
                                      src={r.images[0]}
                                      alt=""
                                      style={{ width: 30, height: 30, borderRadius: 4, objectFit: 'cover', flex: '0 0 auto' }}
                                      loading="lazy"
                                    />
                                  ) : null}
                                  <div>
                                    <strong>{r.name}</strong>
                                    {r.example && <span className="pill muted" style={{ marginLeft: 6 }}>Example</span>}
                                  </div>
                                </div>
                              </td>
                              <td data-label="Studio">{r.studioId?.name || '—'}</td>
                              <td data-label="Order">{r.displayOrder ?? '—'}</td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Artists */}
                          {currentRoute === 'artists' && (
                            <>
                              <td data-label="Name">
                                <strong>{r.name}</strong>
                                {r.example && <span className="pill muted">Example</span>}
                              </td>
                              <td data-label="Designation">{r.designation || '—'}</td>
                              <td data-label="Studios">
                                {(r.studioIds || []).map((s: any) => s.name || s).join(', ') || '—'}
                              </td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Products */}
                          {currentRoute === 'products' && (
                            <>
                              <td data-label="Name">
                                <strong>{r.name}</strong>
                                {r.example && <span className="pill muted">Example</span>}
                              </td>
                              <td data-label="Category">{r.category || '—'}</td>
                              <td data-label="Price">₹{Number(r.price).toLocaleString()}</td>
                              <td data-label="Stock">
                                <span
                                  className={`pill ${
                                    r.stockStatus === 'Out of stock'
                                      ? 'warn'
                                      : r.stockStatus === 'Low stock'
                                      ? 'muted'
                                      : 'ok'
                                  }`}
                                >
                                  {r.stockStatus}
                                </span>
                              </td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Academy */}
                          {currentRoute === 'academy' && (
                            <>
                              <td data-label="Course Name">
                                <strong>{r.name}</strong>
                                {r.example && <span className="pill muted">Example</span>}
                                {r.slug ? <span className="cell-sub">{r.slug}</span> : null}
                              </td>
                              <td data-label="Studio">{r.studio || 'Hair'}</td>
                              <td data-label="Duration">{r.duration || '—'}</td>
                              <td data-label="Level">{r.level || '—'}</td>
                              <td data-label="Order">{r.displayOrder ?? 0}</td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Media */}
                          {currentRoute === 'media' && (
                            <>
                              <td data-label="Title">
                                <span className="media-title-wrap">
                                  <strong>{r.title}</strong>
                                  {r.example && <span className="pill muted">Example</span>}
                                  {r.mediaUrl && (
                                    <span
                                      className={`media-copy-pill ${copiedMediaId === r._id ? 'is-copied' : ''}`}
                                    >
                                      {copiedMediaId === r._id ? 'Copied!' : 'Copy URL'}
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td data-label="Type">
                                {r.mediaType === 'video' ? (
                                  <>
                                    video{' '}
                                    <span className="pill muted">
                                      {parseVideoUrl(r.mediaUrl).platformLabel}
                                    </span>
                                  </>
                                ) : (
                                  r.mediaType
                                )}
                              </td>
                              <td data-label="Linked to">{getMediaLinkLabel(r)}</td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Pages */}
                          {currentRoute === 'pages' && (
                            <>
                              <td data-label="Title">
                                <strong>{r.title}</strong>
                                {r.example && <span className="pill muted">Example</span>}
                              </td>
                              <td data-label="Slug">{r.slug || '—'}</td>
                              <td data-label="Status">
                                <span className={`pill ${r.isPublished ? 'ok' : 'muted'}`}>
                                  {r.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Actions */}
                          <td data-label="Actions">
                            <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                              {currentRoute === 'studios' && (
                                <>
                                  <button type="button" onClick={() => openStudioServices(r)}>
                                    Services ({(records.services || []).filter((s) => (s.studioId?._id || s.studioId) === r._id).length})
                                  </button>
                                  <button type="button" onClick={() => openStudioGallery(r)}>
                                    Gallery ({(records.media || []).filter((m) => m.relatedType === 'studios' && (m.relatedId?._id || m.relatedId) === r._id).length})
                                  </button>
                                </>
                              )}
                              {currentRoute === 'media' && r.mediaUrl && (
                                <button
                                  type="button"
                                  className={copiedMediaId === r._id ? 'copied-btn' : undefined}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyMediaUrl(r);
                                  }}
                                >
                                  {copiedMediaId === r._id ? 'Copied!' : 'Copy URL'}
                                </button>
                              )}
                              <button type="button" onClick={() => openForm(currentRoute, r)}>
                                Edit
                              </button>
                              <button type="button" onClick={() => togglePublish(currentRoute, r._id)}>
                                {r.isPublished ? 'Unpublish' : 'Publish'}
                              </button>
                              <button
                                type="button"
                                className="danger"
                                onClick={() => askDelete(currentRoute, r)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <div className="empty">
                            {records[currentRoute]?.length
                              ? 'No matches. Clear the search or filters.'
                              : `Nothing here yet. Add the first ${SINGULAR_LABELS[currentRoute] || 'record'}.`}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Count + Pagination */}
              <div className="pagination">
                <span className="pagination-info count">
                  {currentListRows.length === 0
                    ? 'No records'
                    : `${Math.min((pageNum[currentRoute] - 1) * (pageSize[currentRoute] || 20) + 1, currentListRows.length)}–${Math.min(pageNum[currentRoute] * (pageSize[currentRoute] || 20), currentListRows.length)} of ${currentListRows.length} shown ${currentListRows.length !== (records[currentRoute]?.length || 0) ? `(filtered from ${records[currentRoute]?.length || 0})` : ''}`}
                </span>
                {totalPages > 1 && (
                  <div className="pagination-btns">
                    <button
                      type="button"
                      className="pg-btn"
                      disabled={pageNum[currentRoute] <= 1}
                      onClick={() => setPageNum((prev) => ({ ...prev, [currentRoute]: prev[currentRoute] - 1 }))}
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        const cur = pageNum[currentRoute] || 1;
                        return p === 1 || p === totalPages || Math.abs(p - cur) <= 1;
                      })
                      .reduce((acc: (number | 'ellipsis')[], p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis' as const);
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === 'ellipsis' ? (
                          <span key={`el-${idx}`} className="hint">…</span>
                        ) : (
                          <button
                            key={p}
                            type="button"
                            className={`pg-btn ${(pageNum[currentRoute] || 1) === p ? 'active' : ''}`}
                            onClick={() => setPageNum((prev) => ({ ...prev, [currentRoute]: p as number }))}
                            aria-current={(pageNum[currentRoute] || 1) === p ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      type="button"
                      className="pg-btn"
                      disabled={(pageNum[currentRoute] || 1) >= totalPages}
                      onClick={() => setPageNum((prev) => ({ ...prev, [currentRoute]: prev[currentRoute] + 1 }))}
                      aria-label="Next page"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* 3. MODAL DIALOG: ADD / EDIT RECORD */}
      <dialog
        ref={formDlgRef}
        id="formDlg"
        aria-labelledby="formTitle"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const inBox =
            rect.top <= e.clientY &&
            e.clientY <= rect.bottom &&
            rect.left <= e.clientX &&
            e.clientX <= rect.right;
          if (!inBox) setFormOpen(false);
        }}
        onClose={() => setFormOpen(false)}
      >
        <form className="dlg" id="recForm" onSubmit={handleSaveRecord} noValidate>
          <div className="dlg-head">
            <h2 id="formTitle">
              {editingId ? 'Edit ' : 'Add '}
              {SINGULAR_LABELS[currentRoute] || 'record'}
            </h2>
            <button
              className="btn ghost sm"
              id="formClose"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="dlg-body">
            <div className="form-grid" id="formBody">
              {/* STUDIOS FORM */}
              {currentRoute === 'studios' && (
                <>
                  <div className="field">
                    <label htmlFor="stName">Studio name <span aria-hidden="true">*</span></label>
                    <input
                      id="stName"
                      type="text"
                      maxLength={60}
                      value={formValues.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          name: val,
                          slug: prev.slugManual ? prev.slug : slugify(val),
                        }));
                      }}
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && <p className="err" role="alert">{formErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="stSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="stSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => {
                        setFormValues({ ...formValues, slug: e.target.value.toLowerCase(), slugManual: true });
                      }}
                      aria-invalid={!!formErrors.slug}
                    />
                    <p className="hint">Used in the page address, for example /studios/hair.</p>
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field wide">
                    <label htmlFor="stShortDesc">Short description</label>
                    <input
                      id="stShortDesc"
                      type="text"
                      maxLength={120}
                      value={formValues.shortDescription || ''}
                      onChange={(e) => setFormValues({ ...formValues, shortDescription: e.target.value })}
                    />
                  </div>

                  <div className="field wide">
                    <label htmlFor="stDesc">Description</label>
                    <textarea
                      id="stDesc"
                      rows={4}
                      maxLength={1500}
                      value={formValues.description || ''}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    />
                  </div>

                  {/* Image Upload Fields: Cover & Banner */}
                  <SingleImageUpload
                    label="Cover image"
                    value={formValues.coverImage || ''}
                    onChange={(url) => setFormValues({ ...formValues, coverImage: url })}
                    category="studios"
                    csrfToken={csrfToken}
                    hint="Primary portrait card artwork."
                  />

                  <SingleImageUpload
                    label="Banner image"
                    value={formValues.bannerImage || ''}
                    onChange={(url) => setFormValues({ ...formValues, bannerImage: url })}
                    category="studios"
                    csrfToken={csrfToken}
                    hint="Wide panoramic hero header artwork."
                  />

                  {/* Studio Services Section Media: Image & Video */}
                  <SingleImageUpload
                    label="Services section default image (optional)"
                    value={formValues.servicesImage || ''}
                    onChange={(url) => setFormValues({ ...formValues, servicesImage: url })}
                    category="services"
                    csrfToken={csrfToken}
                    hint="Default visual shown in this studio page's services section."
                  />

                  <SingleImageUpload
                    label="Services section default video (optional)"
                    value={formValues.servicesVideo || ''}
                    onChange={(url) => setFormValues({ ...formValues, servicesVideo: url })}
                    category="services"
                    csrfToken={csrfToken}
                    acceptVideo={true}
                    videoOnly={true}
                    hint="Default video (MP4/WebM direct or YouTube/Instagram link) playing in this studio page's services section."
                  />

                  <div className="field">
                    <label htmlFor="stOrder">Display order</label>
                    <input
                      id="stOrder"
                      type="number"
                      min={0}
                      value={formValues.displayOrder ?? 0}
                      onChange={(e) => setFormValues({ ...formValues, displayOrder: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="stPub">
                      <input
                        id="stPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>

                  {editingId && (
                    <div className="field wide studio-gallery-admin-box">
                      <label>Studio Gallery (Images, Direct Videos & Video Links)</label>
                      <p className="hint" style={{ marginBottom: 10 }}>
                        {(records.media || []).filter((m) => m.relatedType === 'studios' && (m.relatedId?._id || m.relatedId) === editingId).length}{' '}
                        gallery item(s) linked to this studio. Upload photos, direct MP4/WebM videos, or YouTube/Instagram links.
                      </p>
                      <div className="studio-gallery-admin-actions">
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => openStudioServices({ _id: editingId, name: formValues.name })}
                        >
                          Manage Services ({((records.services || []).filter((s) => (s.studioId?._id || s.studioId) === editingId)).length}) &rarr;
                        </button>
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => openStudioGallery({ _id: editingId, name: formValues.name })}
                        >
                          View Studio Gallery
                        </button>
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() =>
                            openMediaWithPreset({
                              relatedType: 'studios',
                              relatedId: editingId,
                              mediaType: 'image',
                              isPublished: true,
                            })
                          }
                        >
                          + Add Gallery Image
                        </button>
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() =>
                            openMediaWithPreset({
                              relatedType: 'studios',
                              relatedId: editingId,
                              mediaType: 'video',
                              isPublished: true,
                            })
                          }
                        >
                          + Add Video (Direct / Link)
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SERVICES FORM */}
              {currentRoute === 'services' && (
                <>
                  <div className="field">
                    <label htmlFor="svName">Service name <span aria-hidden="true">*</span></label>
                    <input
                      id="svName"
                      type="text"
                      maxLength={80}
                      value={formValues.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          name: val,
                          slug: prev.slugManual ? prev.slug : slugify(val),
                        }));
                      }}
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && <p className="err" role="alert">{formErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="svSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="svSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => setFormValues({ ...formValues, slug: e.target.value.toLowerCase(), slugManual: true })}
                      aria-invalid={!!formErrors.slug}
                    />
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="svStudio">Studio <span aria-hidden="true">*</span></label>
                    <select
                      id="svStudio"
                      value={formValues.studioId || ''}
                      onChange={(e) => setFormValues({ ...formValues, studioId: e.target.value })}
                      aria-invalid={!!formErrors.studioId}
                    >
                      <option value="">Select studio</option>
                      {records.studios.map((st) => (
                        <option key={st._id} value={st._id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                    <p className="hint">Services are always created under a studio.</p>
                    {formErrors.studioId && <p className="err" role="alert">{formErrors.studioId}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="svDuration">Duration</label>
                    <input
                      id="svDuration"
                      type="text"
                      placeholder="e.g. 60 mins"
                      value={formValues.duration || ''}
                      onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="svPrice">Price (₹)</label>
                    <input
                      id="svPrice"
                      type="number"
                      min={0}
                      value={formValues.price ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, price: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="svOrder">Display order</label>
                    <input
                      id="svOrder"
                      type="number"
                      min={0}
                      value={formValues.displayOrder ?? 0}
                      onChange={(e) => setFormValues({ ...formValues, displayOrder: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="svCat">Category / group label (optional)</label>
                    <input
                      id="svCat"
                      type="text"
                      maxLength={80}
                      placeholder="e.g. Colour & Balayage"
                      value={formValues.category || ''}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    />
                  </div>

                  <div className="field wide">
                    <label htmlFor="svDesc">Description</label>
                    <textarea
                      id="svDesc"
                      rows={3}
                      maxLength={1000}
                      value={formValues.description || ''}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    />
                  </div>

                  {/* Service Sub-types / Variants */}
                  <div className="field wide">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label style={{ margin: 0 }}>Service types / sub-treatments</label>
                      <button
                        type="button"
                        className="btn ghost sm"
                        onClick={() =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            subTypes: [
                              ...(Array.isArray(prev.subTypes) ? prev.subTypes : []),
                              { name: '', duration: '', price: '', description: '', image: '' },
                            ],
                          }))
                        }
                      >
                        + Add type
                      </button>
                    </div>
                    <p className="hint" style={{ marginBottom: 10 }}>
                      Add multiple types under this service (each studio displays Services on the right with their selectable sub-types).
                    </p>
                    {(Array.isArray(formValues.subTypes) ? formValues.subTypes : []).map((st: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--rule, rgba(12,12,12,0.14))',
                          padding: 12,
                          borderRadius: 6,
                          marginBottom: 10,
                          background: '#faf9f8',
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Type name (e.g. French Balayage)"
                            value={st.name || ''}
                            onChange={(e) => {
                              const next = [...(formValues.subTypes || [])];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={st.duration || ''}
                            onChange={(e) => {
                              const next = [...(formValues.subTypes || [])];
                              next[idx] = { ...next[idx], duration: e.target.value };
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Price (e.g. 4500)"
                            value={st.price ?? ''}
                            onChange={(e) => {
                              const next = [...(formValues.subTypes || [])];
                              next[idx] = { ...next[idx], price: e.target.value };
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          />
                          <button
                            type="button"
                            className="btn ghost sm"
                            onClick={() => {
                              const next = (formValues.subTypes || []).filter((_: any, i: number) => i !== idx);
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Optional short description"
                            value={st.description || ''}
                            onChange={(e) => {
                              const next = [...(formValues.subTypes || [])];
                              next[idx] = { ...next[idx], description: e.target.value };
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Optional image URL (uses service image if blank)"
                            value={st.image || ''}
                            onChange={(e) => {
                              const next = [...(formValues.subTypes || [])];
                              next[idx] = { ...next[idx], image: e.target.value };
                              setFormValues({ ...formValues, subTypes: next });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Multi-Image Upload for Services */}
                  <MultiImageUpload
                    label="Service Images (Studio Services Section)"
                    values={formValues.images || []}
                    onChange={(imgs) => setFormValues({ ...formValues, images: imgs })}
                    category="services"
                    csrfToken={csrfToken}
                    hint="The first image displays in the Studio Services section. Upload files or paste a URL copied from Media."
                  />

                  {/* Optional Video override for Studio Services Section */}
                  <SingleImageUpload
                    label="Service Section Video (optional)"
                    value={formValues.videoUrl || ''}
                    onChange={(url) => setFormValues({ ...formValues, videoUrl: url })}
                    category="services"
                    csrfToken={csrfToken}
                    acceptVideo={true}
                    videoOnly={true}
                    hint="Upload MP4/WebM/MOV or paste a video link (YouTube, Instagram, Vimeo, or copied from Media) to play video instead of the image in the Studio Services section."
                  />

                  <div className="field">
                    <label className="toggle" htmlFor="svPub">
                      <input
                        id="svPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}

              {/* ARTISTS FORM */}
              {currentRoute === 'artists' && (
                <>
                  <div className="field">
                    <label htmlFor="arName">Artist name <span aria-hidden="true">*</span></label>
                    <input
                      id="arName"
                      type="text"
                      maxLength={80}
                      value={formValues.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          name: val,
                          slug: prev.slugManual ? prev.slug : slugify(val),
                        }));
                      }}
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && <p className="err" role="alert">{formErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="arSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="arSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => setFormValues({ ...formValues, slug: e.target.value.toLowerCase(), slugManual: true })}
                      aria-invalid={!!formErrors.slug}
                    />
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="arDesig">Designation</label>
                    <input
                      id="arDesig"
                      type="text"
                      maxLength={80}
                      value={formValues.designation || ''}
                      onChange={(e) => setFormValues({ ...formValues, designation: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="arExp">Experience</label>
                    <input
                      id="arExp"
                      type="text"
                      maxLength={120}
                      placeholder="e.g. 10+ Years Master Craft"
                      value={formValues.experience || ''}
                      onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
                    />
                  </div>

                  {/* Multi-studio assignment */}
                  <fieldset className="field wide" aria-invalid={!!formErrors.studioIds}>
                    <legend>Studios <span aria-hidden="true">*</span></legend>
                    <div className="checks">
                      {records.studios.length > 0 ? (
                        records.studios.map((st) => {
                          const checked = (formValues.studioIds || []).includes(st._id);
                          return (
                            <label className="check" key={st._id}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const next = e.target.checked
                                    ? [...(formValues.studioIds || []), st._id]
                                    : (formValues.studioIds || []).filter((id: string) => id !== st._id);
                                  setFormValues({ ...formValues, studioIds: next });
                                }}
                              />
                              <span>{st.name}</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="hint">Add a studio first.</p>
                      )}
                    </div>
                    <p className="hint">An artist can work in more than one studio.</p>
                    {formErrors.studioIds && <p className="err" role="alert">{formErrors.studioIds}</p>}
                  </fieldset>

                  <div className="field wide">
                    <label htmlFor="arSpecialities">Specialities</label>
                    <input
                      id="arSpecialities"
                      type="text"
                      placeholder="e.g. Balayage, Precision Cut, Colour Correction"
                      value={
                        Array.isArray(formValues.specialities)
                          ? formValues.specialities.join(', ')
                          : formValues.specialities || ''
                      }
                      onChange={(e) => setFormValues({ ...formValues, specialities: e.target.value })}
                    />
                    <p className="hint">Separate with commas.</p>
                  </div>

                  {/* Artist Profile Image Upload */}
                  <SingleImageUpload
                    label="Profile Image"
                    value={formValues.profileImage || ''}
                    onChange={(url) => setFormValues({ ...formValues, profileImage: url })}
                    category="artists"
                    csrfToken={csrfToken}
                  />

                  <div className="field wide">
                    <label htmlFor="arBio">Bio</label>
                    <textarea
                      id="arBio"
                      rows={3}
                      maxLength={1200}
                      value={formValues.bio || ''}
                      onChange={(e) => setFormValues({ ...formValues, bio: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="arPub">
                      <input
                        id="arPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}

              {/* PRODUCTS FORM */}
              {currentRoute === 'products' && (
                <>
                  <div className="field">
                    <label htmlFor="prName">Product name <span aria-hidden="true">*</span></label>
                    <input
                      id="prName"
                      type="text"
                      maxLength={100}
                      value={formValues.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          name: val,
                          slug: prev.slugManual ? prev.slug : slugify(val),
                        }));
                      }}
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && <p className="err" role="alert">{formErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="prSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="prSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => setFormValues({ ...formValues, slug: e.target.value.toLowerCase(), slugManual: true })}
                      aria-invalid={!!formErrors.slug}
                    />
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="prCategory">Category</label>
                    <input
                      id="prCategory"
                      type="text"
                      maxLength={60}
                      placeholder="e.g. Skincare, Haircare"
                      value={formValues.category || ''}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="prPrice">Price (₹) <span aria-hidden="true">*</span></label>
                    <input
                      id="prPrice"
                      type="number"
                      min={0}
                      step="any"
                      value={formValues.price ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, price: e.target.value ? Number(e.target.value) : '' })}
                      aria-invalid={!!formErrors.price}
                    />
                    <p className="hint">Enter the displayed price. Prices and stock are managed manually.</p>
                    {formErrors.price && <p className="err" role="alert">{formErrors.price}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="prStockStatus">Stock status <span aria-hidden="true">*</span></label>
                    <select
                      id="prStockStatus"
                      value={formValues.stockStatus || 'In stock'}
                      onChange={(e) => setFormValues({ ...formValues, stockStatus: e.target.value })}
                      aria-invalid={!!formErrors.stockStatus}
                    >
                      {STOCK_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {formErrors.stockStatus && <p className="err" role="alert">{formErrors.stockStatus}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="prStockQty">Stock quantity (optional)</label>
                    <input
                      id="prStockQty"
                      type="number"
                      min={0}
                      value={formValues.stockQuantity ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, stockQuantity: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>

                  {/* Product Images (Multiple) */}
                  <MultiImageUpload
                    label="Product images"
                    values={formValues.images || []}
                    onChange={(imgs) => setFormValues({ ...formValues, images: imgs })}
                    category="products"
                    csrfToken={csrfToken}
                  />

                  <div className="field wide">
                    <label htmlFor="prDesc">Description</label>
                    <textarea
                      id="prDesc"
                      rows={3}
                      maxLength={1200}
                      value={formValues.description || ''}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="prFeatured">
                      <input
                        id="prFeatured"
                        type="checkbox"
                        checked={!!formValues.isFeatured}
                        onChange={(e) => setFormValues({ ...formValues, isFeatured: e.target.checked })}
                      />
                      <span>Featured on home page</span>
                    </label>
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="prPub">
                      <input
                        id="prPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}

              {/* ACADEMY FORM */}
              {currentRoute === 'academy' && (
                <>
                  <div className="field">
                    <label htmlFor="acName">Course name <span aria-hidden="true">*</span></label>
                    <input
                      id="acName"
                      type="text"
                      maxLength={120}
                      value={formValues.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          name: val,
                          slug: prev.slugManual ? prev.slug : slugify(val),
                        }));
                      }}
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && <p className="err" role="alert">{formErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="acSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="acSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => setFormValues({ ...formValues, slug: e.target.value.toLowerCase(), slugManual: true })}
                      aria-invalid={!!formErrors.slug}
                    />
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="acStudio">Studio / Category <span aria-hidden="true">*</span></label>
                    <select
                      id="acStudio"
                      value={formValues.studio || 'Hair'}
                      onChange={(e) => setFormValues({ ...formValues, studio: e.target.value })}
                    >
                      <option value="Hair">Hair</option>
                      <option value="Beard & Grooming">Beard &amp; Grooming</option>
                      <option value="Nail">Nail</option>
                      <option value="Face">Face</option>
                      <option value="Waxing">Waxing</option>
                      <option value="Bridal">Bridal</option>
                      <option value="Spa">Spa</option>
                      <option value="Tattoo">Tattoo</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="acDuration">Duration</label>
                    <input
                      id="acDuration"
                      type="text"
                      placeholder="e.g. 6 weeks"
                      value={formValues.duration || ''}
                      onChange={(e) => setFormValues({ ...formValues, duration: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="acLevel">Level</label>
                    <input
                      id="acLevel"
                      type="text"
                      placeholder="e.g. Beginner, Intermediate, Advanced"
                      value={formValues.level || ''}
                      onChange={(e) => setFormValues({ ...formValues, level: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="acSchedule">Schedule / Intake</label>
                    <input
                      id="acSchedule"
                      type="text"
                      placeholder="e.g. Monthly intake, By arrangement"
                      value={formValues.schedule || ''}
                      onChange={(e) => setFormValues({ ...formValues, schedule: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="acFee">Course fee</label>
                    <input
                      id="acFee"
                      type="text"
                      placeholder="e.g. On enquiry"
                      value={formValues.fee || ''}
                      onChange={(e) => setFormValues({ ...formValues, fee: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="acTone">Card hover wave tone</label>
                    <select
                      id="acTone"
                      value={formValues.tone || 'black'}
                      onChange={(e) => setFormValues({ ...formValues, tone: e.target.value })}
                    >
                      <option value="black">Black liquid wave</option>
                      <option value="red">Red liquid wave</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="acOrder">Display order</label>
                    <input
                      id="acOrder"
                      type="number"
                      min={0}
                      value={formValues.displayOrder ?? 0}
                      onChange={(e) => setFormValues({ ...formValues, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  <SingleImageUpload
                    label="Course artwork / banner image"
                    value={formValues.bannerImage || ''}
                    onChange={(url) => setFormValues({ ...formValues, bannerImage: url })}
                    category="academy"
                    csrfToken={csrfToken}
                    hint="Optional custom artwork. If empty, the dynamic marble SVG will render."
                  />

                  <div className="field wide">
                    <label htmlFor="acDesc">About this course (Summary)</label>
                    <textarea
                      id="acDesc"
                      rows={3}
                      maxLength={3000}
                      value={formValues.description || ''}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    />
                  </div>

                  <div className="field wide">
                    <label htmlFor="acLearn">What you will learn (one bullet per line)</label>
                    <textarea
                      id="acLearn"
                      rows={4}
                      placeholder="Sectioning and partings for consistent cuts&#10;Scissor and clipper techniques&#10;Layering and graduation basics"
                      value={
                        Array.isArray(formValues.learn)
                          ? formValues.learn.join('\n')
                          : formValues.learn || ''
                      }
                      onChange={(e) => setFormValues({ ...formValues, learn: e.target.value })}
                    />
                  </div>

                  <div className="field wide">
                    <label htmlFor="acIncludes">Included benefits (one bullet per line)</label>
                    <textarea
                      id="acIncludes"
                      rows={3}
                      placeholder="Practice mannequins and kit list&#10;Session notes and a completion certificate"
                      value={
                        Array.isArray(formValues.includes)
                          ? formValues.includes.join('\n')
                          : formValues.includes || ''
                      }
                      onChange={(e) => setFormValues({ ...formValues, includes: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="acPub">
                      <input
                        id="acPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}

              {/* MEDIA FORM */}
              {currentRoute === 'media' && (
                <>
                  <div className="field">
                    <label htmlFor="mdTitle">Title <span aria-hidden="true">*</span></label>
                    <input
                      id="mdTitle"
                      type="text"
                      maxLength={120}
                      value={formValues.title || ''}
                      onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                      aria-invalid={!!formErrors.title}
                    />
                    {formErrors.title && <p className="err" role="alert">{formErrors.title}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="mdType">Media type <span aria-hidden="true">*</span></label>
                    <select
                      id="mdType"
                      value={formValues.mediaType || 'image'}
                      onChange={(e) => setFormValues({ ...formValues, mediaType: e.target.value })}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video (Direct Upload or Platform Link)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="mdRelType">Placement / Linked to</label>
                    <select
                      id="mdRelType"
                      value={formValues.relatedType || ''}
                      onChange={(e) => {
                        const val = e.target.value || null;
                        setFormValues({
                          ...formValues,
                          relatedType: val,
                          relatedId: val === 'studios' ? (records.studios[0]?._id || null) : null,
                        });
                      }}
                    >
                      <option value="">Not linked</option>
                      {REL_TYPES.map((rt) => (
                        <option key={rt.v} value={rt.v}>
                          {rt.l}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formValues.relatedType === 'gallery' ? (
                    <div className="field wide">
                      <p className="hint">
                        <strong>Landing Page Placement:</strong> This item will appear inside the{' '}
                        <strong>Latest works</strong> 3D spiral gallery on the home page (<code>#gallery</code>).
                      </p>
                    </div>
                  ) : formValues.relatedType ? (
                    <div className="field">
                      <label htmlFor="mdRelId">
                        {formValues.relatedType === 'studios' ? 'Select studio' : 'Linked item'}{' '}
                        <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="mdRelId"
                        value={formValues.relatedId || ''}
                        onChange={(e) => setFormValues({ ...formValues, relatedId: e.target.value || null })}
                        aria-invalid={!!formErrors.relatedId}
                      >
                        <option value="">Select…</option>
                        {(records[formValues.relatedType] || []).map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name || item.title || item.slug}
                          </option>
                        ))}
                      </select>
                      {formErrors.relatedId && <p className="err" role="alert">{formErrors.relatedId}</p>}
                    </div>
                  ) : null}

                  {/* Single upload for Image OR 2-option Video (Direct Upload / Platform Link) */}
                  <SingleImageUpload
                    label={formValues.mediaType === 'video' ? 'Video source *' : 'Image file or URL *'}
                    value={formValues.mediaUrl || ''}
                    onChange={(url) => setFormValues({ ...formValues, mediaUrl: url })}
                    category="gallery"
                    csrfToken={csrfToken}
                    acceptVideo={formValues.mediaType === 'video'}
                    videoOnly={formValues.mediaType === 'video'}
                    thumbnailUrl={formValues.thumbnailUrl || ''}
                    error={formErrors.mediaUrl}
                    hint={
                      formValues.mediaType === 'video'
                        ? 'Choose Option 1 to upload a direct video file (MP4, WebM, MOV), or Option 2 to paste a YouTube, Instagram Reel/Post, or Vimeo link.'
                        : 'Upload a high-resolution photo or paste an image URL.'
                    }
                  />

                  {formValues.mediaType === 'video' && (
                    <SingleImageUpload
                      label="Thumbnail / Cover Image (Optional)"
                      value={formValues.thumbnailUrl || ''}
                      onChange={(url) => setFormValues({ ...formValues, thumbnailUrl: url })}
                      category="gallery"
                      csrfToken={csrfToken}
                      hint="Poster image displayed before playback. Recommended for Instagram Reels/Posts; YouTube auto-uses its video thumbnail if left empty."
                    />
                  )}

                  <div className="field wide">
                    <label htmlFor="mdNotes">Caption / Description (Optional)</label>
                    <input
                      id="mdNotes"
                      type="text"
                      maxLength={180}
                      placeholder="Short caption shown on gallery hover and lightbox..."
                      value={formValues.notes || ''}
                      onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="mdOrder">Display order</label>
                    <input
                      id="mdOrder"
                      type="number"
                      min={0}
                      value={formValues.displayOrder ?? 0}
                      onChange={(e) => setFormValues({ ...formValues, displayOrder: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="mdPub">
                      <input
                        id="mdPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}

              {/* PAGES FORM */}
              {currentRoute === 'pages' && (
                <>
                  <div className="field">
                    <label htmlFor="pgTitle">Page title <span aria-hidden="true">*</span></label>
                    <input
                      id="pgTitle"
                      type="text"
                      maxLength={100}
                      value={formValues.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormValues((prev: any) => ({
                          ...prev,
                          title: val,
                          slug: prev.slugManual ? prev.slug : (val.toLowerCase() === 'home' ? '/' : slugify(val)),
                        }));
                      }}
                      aria-invalid={!!formErrors.title}
                    />
                    {formErrors.title && <p className="err" role="alert">{formErrors.title}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="pgSlug">Slug <span aria-hidden="true">*</span></label>
                    <input
                      id="pgSlug"
                      type="text"
                      value={formValues.slug || ''}
                      onChange={(e) => setFormValues({ ...formValues, slug: e.target.value, slugManual: true })}
                      aria-invalid={!!formErrors.slug}
                    />
                    <p className="hint">Use / for the home page.</p>
                    {formErrors.slug && <p className="err" role="alert">{formErrors.slug}</p>}
                  </div>

                  <div className="field wide">
                    <label htmlFor="pgSections">Page content</label>
                    <textarea
                      id="pgSections"
                      rows={4}
                      value={formValues.sections || ''}
                      onChange={(e) => setFormValues({ ...formValues, sections: e.target.value })}
                    />
                    <p className="hint">Copy in the order it appears on the page.</p>
                  </div>

                  <div className="field">
                    <label htmlFor="pgSeoTitle">SEO title</label>
                    <input
                      id="pgSeoTitle"
                      type="text"
                      maxLength={80}
                      value={formValues.seoTitle || ''}
                      onChange={(e) => setFormValues({ ...formValues, seoTitle: e.target.value })}
                    />
                  </div>

                  <div className="field wide">
                    <label htmlFor="pgSeoDesc">SEO description</label>
                    <textarea
                      id="pgSeoDesc"
                      rows={2}
                      maxLength={200}
                      value={formValues.seoDescription || ''}
                      onChange={(e) => setFormValues({ ...formValues, seoDescription: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label className="toggle" htmlFor="pgPub">
                      <input
                        id="pgPub"
                        type="checkbox"
                        checked={!!formValues.isPublished}
                        onChange={(e) => setFormValues({ ...formValues, isPublished: e.target.checked })}
                      />
                      <span>Published on website</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dlg-foot">
            {formErrors._general && <p className="err" id="formErr" role="alert">{formErrors._general}</p>}
            <button
              className="btn ghost"
              id="formCancel"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button className="btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </dialog>

      {/* 4. MODAL DIALOG: DELETE CONFIRMATION */}
      <dialog
        ref={confirmDlgRef}
        id="confirmDlg"
        className="confirm"
        aria-labelledby="confirmTitle"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const inBox =
            rect.top <= e.clientY &&
            e.clientY <= rect.bottom &&
            rect.left <= e.clientX &&
            e.clientX <= rect.right;
          if (!inBox) setConfirmDelete(null);
        }}
        onClose={() => setConfirmDelete(null)}
      >
        {confirmDelete && (
          <div className="dlg">
            <div className="dlg-head">
              <h2 id="confirmTitle">Confirm</h2>
            </div>
            <div className="dlg-body">
              <p id="confirmText">{confirmDelete.text}</p>
            </div>
            <div className="dlg-foot">
              <button
                className="btn ghost"
                id="confirmNo"
                type="button"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                id="confirmYes"
                type="button"
                onClick={confirmDelete.action}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* 5. TOAST NOTIFICATIONS */}
      <div className="toast-wrap" id="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === 'error' ? 'error' : ''}`} role="status">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

