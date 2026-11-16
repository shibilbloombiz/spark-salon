import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_STUDIO_SLUGS } from '@/lib/data/studios';
import { getServiceDetailData, SITE_DATA } from '@/lib/data/serviceDetailData';
import StudioPageClient from './StudioPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_STUDIO_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetailData(slug);

  if (!service) {
    return {
      title: 'Studio Not Found | Byju Spark Saloon',
    };
  }

  return {
    title: `${service.name} Studio | ${SITE_DATA.name}`,
    description: service.tagline,
    openGraph: {
      title: `${service.name} Studio | ${SITE_DATA.name}`,
      description: service.tagline,
      images: service.media.hero.src
        ? [
            {
              url: service.media.hero.src,
              width: 1200,
              height: 630,
              alt: service.media.hero.alt || service.name,
            },
          ]
        : [],
    },
  };
}

export default async function StudioPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceDetailData(slug);

  if (!service) {
    notFound();
  }

  return <StudioPageClient service={service} site={SITE_DATA} />;
}
