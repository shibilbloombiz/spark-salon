'use client';

import React, { useState } from 'react';
import UniversalVideo from '@/components/video/UniversalVideo';

export default function TestVideoPage() {
  const [activeTab, setActiveTab] = useState<'mp4' | 'youtube' | 'shorts' | 'instagram'>('mp4');

  return (
    <main style={{ minHeight: '100vh', background: '#0c0a12', color: '#ffffff', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#d4af37' }}>
          Universal Video System Showcase
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
          Clean, borderless, autoplaying, looping video with minimal sound toggle button.
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {(['mp4', 'youtube', 'shorts', 'instagram'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeTab === tab ? '#d4af37' : 'rgba(255,255,255,0.15)',
                background: activeTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: activeTab === tab ? '#d4af37' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
              }}
            >
              {tab === 'mp4' && 'Direct MP4'}
              {tab === 'youtube' && 'YouTube (Landscape)'}
              {tab === 'shorts' && 'YouTube Shorts (9:16)'}
              {tab === 'instagram' && 'Instagram Reel'}
            </button>
          ))}
        </div>

        {/* Video Card Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Card 1: Main Selected Video */}
          <div
            id="test-video-card"
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#161420',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              aspectRatio: activeTab === 'shorts' || activeTab === 'instagram' ? '9 / 16' : '16 / 9',
              maxHeight: activeTab === 'shorts' || activeTab === 'instagram' ? '600px' : 'none',
              margin: '0 auto',
              width: '100%',
              maxWidth: activeTab === 'shorts' || activeTab === 'instagram' ? '340px' : '100%',
            }}
          >
            {activeTab === 'mp4' && (
              <UniversalVideo
                videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                poster="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                objectFit="cover"
                title="Direct MP4 Test"
              />
            )}

            {activeTab === 'youtube' && (
              <UniversalVideo
                videoUrl="https://www.youtube.com/watch?v=ScMzIvxBSi4"
                objectFit="cover"
                title="YouTube Video Test"
              />
            )}

            {activeTab === 'shorts' && (
              <UniversalVideo
                videoUrl="https://www.youtube.com/shorts/3i_JmE9jYqQ"
                aspectRatio="9/16"
                objectFit="cover"
                title="YouTube Shorts Test"
              />
            )}

            {activeTab === 'instagram' && (
              <UniversalVideo
                videoUrl="https://www.instagram.com/reel/C3Xxxxxxx/"
                fallbackDirectUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                poster="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
                aspectRatio="9/16"
                objectFit="cover"
                title="Instagram Reel Test"
              />
            )}
          </div>

          {/* Details / Specs Card */}
          <div
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: '#161420',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#ffffff' }}>Active System Properties</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <li>✓ <strong>Clean Interface:</strong> Zero player controls, play/pause buttons, progress bars, or platform branding</li>
              <li>✓ <strong>Sound Toggle:</strong> Only one visible control (bottom-right floating glass speaker button)</li>
              <li>✓ <strong>Autoplay:</strong> Automatically plays muted on viewport entry via IntersectionObserver</li>
              <li>✓ <strong>Infinite Loop:</strong> Seamlessly resets and loops continuously without ending</li>
              <li>✓ <strong>Platform Engine:</strong> {activeTab.toUpperCase()} stream engine with hardware acceleration</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

