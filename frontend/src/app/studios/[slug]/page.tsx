import { redirect } from 'next/navigation';
import { ALL_STUDIO_SLUGS } from '@/lib/data/studios';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_STUDIO_SLUGS.map((slug) => ({
    slug,
  }));
}

export default async function StudiosRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/studio/${slug}`);
}

