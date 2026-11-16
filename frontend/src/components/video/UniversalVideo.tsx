'use client';

import React, { useEffect, useRef, useState, useId, useMemo } from 'react';
import { Volume2, VolumeX, ExternalLink } from 'lucide-react';
import {
  parseVideoUrl,
  extractYouTubeId,
  extractInstagramInfo,
  isDirectVideoUrl,
  resolveVideoPosterUrl,
} from '@/lib/videoUtils';
import './UniversalVideo.css';

export interface UniversalVideoProps {
  /** The video source URL: Direct MP4/WebM, YouTube, YouTube Shorts, or Instagram Reel */
  videoUrl: string;
  /** Optional direct MP4 URL fallback for Instagram Reels or external links */
  fallbackDirectUrl?: string;
  /** Optional custom poster / thumbnail image URL */
  poster?: string;
  /** Aspect ratio: e.g. "16/9", "9/16", "4/5", "1/1", or number */
  aspectRatio?: string | number;
  /** Sizing mode: 'cover' (cinematic fill, default) or 'contain' (full video visible) */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Start playing automatically when visible (default: true) */
  autoplay?: boolean;
  /** Loop continuously in an infinite loop (default: true) */
  loop?: boolean;
  /** Start muted by default to support browser autoplay policy (default: true) */
  muted?: boolean;
  /** Display native browser playback controls (default: false — clean cinematic mode) */
  controls?: boolean;
  /** Show the minimal sound toggle button in the bottom-right corner (default: true) */
  showMuteToggle?: boolean;
  /** Additional container CSS class names */
  className?: string;
  /** Inline container styles */
  style?: React.CSSProperties;
  /** Video title for accessibility */
  title?: string;
  /** Callback when sound state changes */
  onMuteChange?: (muted: boolean) => void;
  /** Callback when video natural playback ends */
  onEnded?: () => void;
  /** Callback when video begins playing */
  onPlay?: () => void;
}

// Global YouTube IFrame Player API Singleton Loader
let ytApiReady = false;
let ytApiLoading = false;
const ytCallbacks: (() => void)[] = [];

function loadYouTubeIFrameAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).YT && (window as any).YT.Player) {
    ytApiReady = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    ytCallbacks.push(resolve);
    if (ytApiLoading) return;
    ytApiLoading = true;

    const prevReady = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      ytApiLoading = false;
      if (typeof prevReady === 'function') prevReady();
      while (ytCallbacks.length > 0) {
        ytCallbacks.shift()?.();
      }
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  });
}

export default function UniversalVideo({
  videoUrl,
  fallbackDirectUrl,
  poster,
  aspectRatio,
  objectFit = 'cover',
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  showMuteToggle = true,
  className = '',
  style = {},
  title = 'Video playback',
  onMuteChange,
  onEnded,
  onPlay,
}: UniversalVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerId = `univ-yt-${useId().replace(/[:]/g, '_')}`;

  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Platform Analysis
  const parsed = useMemo(() => {
    // If a fallback direct URL is provided and valid, prioritize direct playback
    if (fallbackDirectUrl && isDirectVideoUrl(fallbackDirectUrl)) {
      return {
        platform: 'direct' as const,
        isDirect: true,
        url: fallbackDirectUrl,
        platformLabel: 'Direct Video',
      };
    }
    return parseVideoUrl(videoUrl);
  }, [videoUrl, fallbackDirectUrl]);

  const ytId = useMemo(() => {
    if (parsed.platform === 'youtube') {
      return extractYouTubeId(parsed.url);
    }
    return null;
  }, [parsed]);

  const igInfo = useMemo(() => {
    if (parsed.platform === 'instagram') {
      return extractInstagramInfo(parsed.url);
    }
    return null;
  }, [parsed]);

  const resolvedPoster = useMemo(() => {
    return resolveVideoPosterUrl(videoUrl, poster, parsed.autoThumbnailUrl || '');
  }, [videoUrl, poster, parsed]);

  // Keep isMuted state synced with prop if prop changes
  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  // 1. Intersection Observer: Viewport-based playback & resource saving
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
          setIsVisible(visible);

          // Handle direct HTML5 video playback according to viewport visibility
          if (parsed.platform === 'direct' && videoRef.current) {
            if (visible && autoplay) {
              videoRef.current.play().catch(() => {});
            } else if (!visible) {
              videoRef.current.pause();
            }
          }

          // Handle YouTube IFrame API playback according to viewport visibility
          if (parsed.platform === 'youtube' && ytPlayerRef.current) {
            try {
              if (visible && autoplay) {
                ytPlayerRef.current.playVideo?.();
              } else if (!visible) {
                ytPlayerRef.current.pauseVideo?.();
              }
            } catch {}
          }
        });
      },
      { threshold: [0, 0.1, 0.25] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed.platform, autoplay]);

  // 2. Direct HTML5 Video Lifecycle & Infinite Loop
  useEffect(() => {
    if (parsed.platform !== 'direct') return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = isMuted;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsReady(true);
      onPlay?.();
    };

    const handleEnded = () => {
      onEnded?.();
      if (loop) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    };

    v.addEventListener('playing', handlePlaying);
    v.addEventListener('ended', handleEnded);

    if (isVisible && autoplay) {
      v.play().catch(() => {});
    }

    return () => {
      v.removeEventListener('playing', handlePlaying);
      v.removeEventListener('ended', handleEnded);
    };
  }, [parsed.platform, isVisible, autoplay, loop, isMuted, onPlay, onEnded]);

  // 3. YouTube IFrame Player API Lifecycle & Borderless Infinite Loop
  useEffect(() => {
    if (parsed.platform !== 'youtube' || !ytId) return;

    let isDestroyed = false;

    loadYouTubeIFrameAPI().then(() => {
      if (isDestroyed || !containerRef.current) return;

      try {
        const YT = (window as any).YT;
        if (!YT || !YT.Player) return;

        // Destroy existing player instance if re-initializing
        if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
          try {
            ytPlayerRef.current.destroy();
          } catch {}
          ytPlayerRef.current = null;
        }

        ytPlayerRef.current = new YT.Player(ytContainerId, {
          videoId: ytId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            mute: isMuted ? 1 : 0,
            controls: controls ? 1 : 0,
            loop: loop ? 1 : 0,
            playlist: ytId, // Required by YouTube IFrame API to loop single video continuously
            playsinline: 1, // Inline playback on iOS/Android
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              if (isDestroyed) return;
              if (isMuted) event.target.mute();
              else {
                event.target.unMute();
                event.target.setVolume(100);
              }
              if (isVisible && autoplay) {
                event.target.playVideo();
              }
              setIsReady(true);
            },
            onStateChange: (event: any) => {
              if (isDestroyed) return;
              // 0 = YT.PlayerState.ENDED -> force infinite seamless restart
              if (event.data === 0) {
                onEnded?.();
                if (loop) {
                  event.target.seekTo(0);
                  event.target.playVideo();
                }
              }
              // 1 = YT.PlayerState.PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                setIsReady(true);
                onPlay?.();
              }
            },
          },
        });
      } catch (err) {
        // Fallback
      }
    });

    return () => {
      isDestroyed = true;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [parsed.platform, ytId, autoplay, loop, controls, isMuted, isVisible, ytContainerId, onPlay, onEnded]);

  // Sound Toggle Handler (The Only Visible Control)
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setHasInteracted(true);

    if (parsed.platform === 'direct' && videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      onMuteChange?.(nextMuted);
    } else if (parsed.platform === 'youtube' && ytPlayerRef.current) {
      try {
        if (isMuted) {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          setIsMuted(false);
          onMuteChange?.(false);
        } else {
          ytPlayerRef.current.mute();
          setIsMuted(true);
          onMuteChange?.(true);
        }
      } catch {}
    }
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(aspectRatio ? { aspectRatio: typeof aspectRatio === 'number' ? `${aspectRatio}` : aspectRatio } : {}),
  };

  return (
    <div
      ref={containerRef}
      className={`univ-video-container ${className}`}
      style={containerStyle}
      role="region"
      aria-label={title}
    >
      {/* 1. DIRECT HTML5 VIDEO (MP4, WebM, MOV, Blob) */}
      {parsed.platform === 'direct' && parsed.url && (
        <video
          ref={videoRef}
          src={parsed.url}
          poster={resolvedPoster || undefined}
          autoPlay={autoplay}
          muted={isMuted}
          loop={loop}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="univ-video-element"
          style={{ objectFit }}
          controls={controls}
        />
      )}

      {/* 2. YOUTUBE & YOUTUBE SHORTS (IFrame API Borderless Cinematic Embed) */}
      {parsed.platform === 'youtube' && ytId && (
        <div className="univ-video-yt-wrap">
          <div
            id={ytContainerId}
            className={`univ-video-yt-frame ${objectFit === 'contain' ? 'is-contain' : ''}`}
          />
        </div>
      )}

      {/* 3. INSTAGRAM REEL / POST GRACEFUL COMPLIANT PRESENTATION */}
      {parsed.platform === 'instagram' && !fallbackDirectUrl && (
        <div className="univ-video-ig-fallback">
          {resolvedPoster && (
            <img src={resolvedPoster} alt={title} loading="lazy" />
          )}
          <div className="univ-video-ig-overlay">
            <span className="univ-video-ig-badge">
              {igInfo?.kind === 'p' ? 'Instagram Post' : 'Instagram Reel'}
            </span>
            <a
              href={parsed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="univ-video-ig-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <span>View on Instagram</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* 4. SMOOTH POSTER FADE (Eliminates layout shifts & black flashes before playback) */}
      {resolvedPoster && !isPlaying && (
        <img
          src={resolvedPoster}
          alt={title}
          className={`univ-video-poster ${isReady && isPlaying ? 'is-hidden' : ''}`}
          style={{ objectFit }}
          loading="eager"
        />
      )}

      {/* 5. ONLY ONE VISIBLE CONTROL: Minimal Circular Sound Toggle Button (Bottom-Right) */}
      {showMuteToggle && (parsed.platform === 'direct' || parsed.platform === 'youtube') && (
        <button
          type="button"
          className="univ-video-mute-btn"
          onClick={toggleSound}
          aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX aria-hidden="true" />
          ) : (
            <Volume2 aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

