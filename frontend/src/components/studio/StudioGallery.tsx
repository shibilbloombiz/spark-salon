'use client';

import React from 'react';
import { StudioData } from '@/lib/data/studios';
import ServiceGallery from './ServiceGallery';

export interface StudioGalleryProps {
  studio: StudioData;
  onOpenLightbox: (index: number) => void;
}

export default function StudioGallery({ studio, onOpenLightbox }: StudioGalleryProps) {
  return (
    <ServiceGallery
      items={studio.gallery}
      onOpenLightbox={onOpenLightbox}
      accentColor={studio.accentColor}
    />
  );
}

export { ServiceGallery };
