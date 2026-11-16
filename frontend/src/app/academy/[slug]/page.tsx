import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_COURSE_SLUGS, getCourseBySlug, INITIAL_COURSES } from '@/lib/data/academyCourses';
import CourseDetailClient from './CourseDetailClient';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COURSE_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {
      title: 'Course Not Found | Spark International Academy',
    };
  }

  return {
    title: `${course.name} | Spark International Academy`,
    description: course.description || `Master ${course.name} at Byju Spark International Academy.`,
    openGraph: {
      title: `${course.name} | Spark International Academy`,
      description: course.description || `Master ${course.name} at Byju Spark International Academy.`,
      images: course.bannerImage
        ? [
            {
              url: course.bannerImage,
              width: 1200,
              height: 630,
              alt: course.name,
            },
          ]
        : [],
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  let course = getCourseBySlug(slug);

  // If not found in static list, attempt backend fetch
  if (!course) {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.BACKEND_URL ||
        'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/academy/${slug}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          course = json.data;
        }
      }
    } catch {
      // Ignore network errors and continue to notFound check
    }
  }

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}

