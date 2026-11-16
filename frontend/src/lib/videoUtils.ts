/**
 * Video URL parser & platform detector for Spark Salon galleries (Admin, Studios, Latest Works).
 * Handles direct video files (.mp4, .webm, .mov, /uploads/...) and external platform links
 * (YouTube, YouTube Shorts, Instagram Reels/Posts, Vimeo, etc.).
 */

export type VideoPlatform = 'direct' | 'youtube' | 'instagram' | 'vimeo' | 'external';

export interface ParsedVideoInfo {
  platform: VideoPlatform;
  isDirect: boolean;
  url: string;
  embedUrl?: string;
  autoThumbnailUrl?: string;
  platformLabel: string;
}

const DIRECT_VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|ogv|ogg)(?:[?#].*)?$/i;

export function isDirectVideoUrl(rawUrl?: string | null): boolean {
  const url = (rawUrl || '').trim();
  if (!url) return false;
  if (url.startsWith('data:video/') || url.startsWith('blob:')) return true;
  if (DIRECT_VIDEO_EXT_RE.test(url)) return true;
  // Local uploaded/static paths inside /uploads/ or /spiral/reels/ that aren't external URLs
  if (!/^https?:\/\//i.test(url) && !/^www\./i.test(url)) {
    return url.startsWith('/') && !url.includes('youtube.com') && !url.includes('instagram.com');
  }
  return false;
}

export function extractYouTubeId(rawUrl: string): string | null {
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const u = new URL(normalized);
    const host = u.hostname.replace(/^www\./i, '').toLowerCase();

    if (host === 'youtu.be') {
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg && /^[A-Za-z0-9_-]{6,20}$/.test(seg) ? seg : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = u.searchParams.get('v');
      if (vParam && /^[A-Za-z0-9_-]{6,20}$/.test(vParam)) return vParam;

      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && ['shorts', 'embed', 'live', 'v'].includes(parts[0])) {
        const id = parts[1];
        return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
      }
    }
  } catch {
    // Fallback regex
  }

  const m = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/i);
  return m ? m[1] : null;
}

export function extractInstagramInfo(rawUrl: string): { kind: 'reel' | 'p'; shortcode: string } | null {
  const m = rawUrl.match(/instagram\.com\/(?:[^/]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!m) return null;
  const rawKind = m[1].toLowerCase();
  return {
    kind: rawKind === 'p' ? 'p' : 'reel',
    shortcode: m[2],
  };
}

export function extractVimeoId(rawUrl: string): string | null {
  const m = rawUrl.match(/vimeo\.com\/(?:.*\/)?(\d{5,15})(?:[?#]|$)/i);
  return m ? m[1] : null;
}

export function normalizeVideoUrl(rawUrl?: string | null): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function parseVideoUrl(rawUrl?: string | null): ParsedVideoInfo {
  const url = normalizeVideoUrl(rawUrl);
  if (!url) {
    return {
      platform: 'direct',
      isDirect: true,
      url: '',
      platformLabel: 'Direct Video',
    };
  }

  if (isDirectVideoUrl(url)) {
    return {
      platform: 'direct',
      isDirect: true,
      url,
      platformLabel: 'Direct Video',
    };
  }

  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      platform: 'youtube',
      isDirect: false,
      url,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      autoThumbnailUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      platformLabel: 'YouTube',
    };
  }

  const ig = extractInstagramInfo(url);
  if (ig) {
    return {
      platform: 'instagram',
      isDirect: false,
      url,
      embedUrl: `https://www.instagram.com/${ig.kind}/${ig.shortcode}/embed/`,
      platformLabel: ig.kind === 'p' ? 'Instagram Post' : 'Instagram Reel',
    };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      platform: 'vimeo',
      isDirect: false,
      url,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      platformLabel: 'Vimeo',
    };
  }

  return {
    platform: 'external',
    isDirect: false,
    url,
    platformLabel: 'Video Link',
  };
}

export function resolveVideoPosterUrl(
  videoUrl?: string | null,
  thumbnailUrl?: string | null,
  fallbackUrl = ''
): string {
  const customThumb = (thumbnailUrl || '').trim();
  if (customThumb) return customThumb;
  const parsed = parseVideoUrl(videoUrl);
  if (parsed.autoThumbnailUrl) return parsed.autoThumbnailUrl;
  return fallbackUrl;
}

