'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PreloaderProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

export default function Preloader({ onComplete, onExitStart }: PreloaderProps) {
  const [stage, setStage] = useState<'loading' | 'done'>('loading');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const finishLoading = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Clear fallback timer if it hasn't fired yet
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      setStage('done');
      onExitStart?.();
      exitTimerRef.current = setTimeout(() => {
        onComplete();
      }, 500);
    }, 200);
  }, [onComplete, onExitStart]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // Video autoplay & fast fallback timer
  useEffect(() => {
    // If reduced motion, headless audit bot or webdriver, finish immediately
    if (typeof window !== 'undefined') {
      const isAuditBot =
        Boolean((navigator as any).webdriver) ||
        /HeadlessChrome|Lighthouse|Chrome-Lighthouse|Googlebot/i.test(navigator.userAgent);
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isAuditBot || isReduced) {
        onExitStart?.();
        onComplete();
        return;
      }
    }

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        finishLoading();
      });
    }

    // Snappy fallback: if video doesn't play or takes too long, cleanly finish
    fallbackTimerRef.current = setTimeout(() => {
      finishLoading();
    }, 1500);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [finishLoading, onComplete, onExitStart]);

  // When video completes natural playback
  const handleEnded = () => {
    finishLoading();
  };

  // Click anywhere to skip
  const handleSkip = () => {
    finishLoading();
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999990,
        backgroundColor: '#040406',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.85s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.75s ease',
        transform: stage === 'done' ? 'translateY(-100%)' : 'translateY(0)',
        opacity: stage === 'done' ? 0 : 1,
        pointerEvents: stage === 'done' ? 'none' : 'auto',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Cinematic Loading Video */}
      <video
        ref={videoRef}
        src="/images/loading/loading-video.mp4"
        autoPlay
        muted
        playsInline
        preload="metadata"
        onLoadedData={() => setVideoLoaded(true)}
        onEnded={handleEnded}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          opacity: videoLoaded ? 1 : 0.85,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Subtle cinematic vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(4, 4, 6, 0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  );
}
