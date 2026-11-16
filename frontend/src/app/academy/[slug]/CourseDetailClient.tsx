'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Award, Calendar, CheckCircle2, Package, Sparkles } from 'lucide-react';
import FaqSection from '@/components/faq/FaqSection';
import { Course } from '@/lib/data/academyCourses';
import { getCourseFaqs } from '@/lib/data/academyFaqs';
import './CourseDetail.css';

interface CourseDetailClientProps {
  course: Course;
  whatsappNumber?: string;
}

export default function CourseDetailClient({
  course,
  whatsappNumber = '919946899990',
}: CourseDetailClientProps) {
  const courseFaqs = getCourseFaqs(course);

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to enquire about the ${course.name} course at Spark International Academy.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="course-page-root">
      {/* 1. Header / Breadcrumbs Bar */}
      <nav className="course-nav-bar" aria-label="Course Navigation">
        <div className="wrap nav-inner">
          <Link href="/academy" className="back-link">
            <ArrowLeft size={16} />
            <span>All Academy Programmes</span>
          </Link>
          <div className="nav-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cta"
            >
              Enquire Now
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="course-hero-section">
        <div className="wrap">
          <div className="course-hero-grid">
            {/* Left Hero Content */}
            <div className="course-hero-text">
              <div className="course-badge-row">
                <span className="course-studio-pill">{course.studio || 'Haute Academy'} Studio</span>
                <span className="course-intake-pill">{course.schedule || 'Monthly Intake'}</span>
              </div>

              <h1 className="course-title">{course.name}</h1>

              {course.description && (
                <p className="course-lead">{course.description}</p>
              )}

              <div className="course-hero-cta-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn cta hero-btn"
                >
                  Enquire Now
                </a>
                <a href="#curriculum" className="btn btn-ghost hero-btn">
                  View Syllabus
                </a>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="course-hero-visual-wrap">
              <div className="course-hero-card">
                {course.bannerImage ? (
                  <img
                    src={course.bannerImage}
                    alt={course.name}
                    className="course-hero-img"
                  />
                ) : (
                  <div className="course-hero-fallback">
                    <Sparkles size={48} color="var(--red, #c8102e)" />
                  </div>
                )}
                <div className="course-hero-card-overlay">
                  <span className="card-studio-tag">{course.studio || 'Academy'}</span>
                  <span className="card-cert-tag">{course.level || 'Master Certification'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Key Facts Bar */}
      <section className="course-facts-section" aria-label="Course Overview Facts">
        <div className="wrap">
          <div className="facts-card">
            <div className="fact-item">
              <span className="fact-icon"><Clock size={20} /></span>
              <div className="fact-info">
                <span className="fact-label">Duration</span>
                <span className="fact-value">{course.duration || 'Flexible'}</span>
              </div>
            </div>

            <div className="fact-item">
              <span className="fact-icon"><Award size={20} /></span>
              <div className="fact-info">
                <span className="fact-label">Credential</span>
                <span className="fact-value">{course.level || 'Master Diploma'}</span>
              </div>
            </div>

            <div className="fact-item">
              <span className="fact-icon"><Calendar size={20} /></span>
              <div className="fact-info">
                <span className="fact-label">Intake</span>
                <span className="fact-value">{course.schedule || 'Quarterly'}</span>
              </div>
            </div>

            <div className="fact-item">
              <span className="fact-icon"><Package size={20} /></span>
              <div className="fact-info">
                <span className="fact-label">Student Kit</span>
                <span className="fact-value">Included</span>
              </div>
            </div>

            <div className="fact-item cta-fact">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cta"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curriculum & Learning Outcomes */}
      {course.learn && course.learn.length > 0 && (
        <section className="section course-learn-section" id="curriculum">
          <div className="wrap">
            <div className="section-header">
              <p className="eyebrow">Curriculum</p>
              <h2 className="h-section">What you will master</h2>
              <p className="section-sub">
                Engineered to elevate your technique from foundational anatomy to runway and editorial precision.
              </p>
            </div>

            <div className="curriculum-grid">
              {course.learn.map((item, idx) => (
                <div key={idx} className="curriculum-card">
                  <span className="curriculum-num">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="curriculum-content">
                    <CheckCircle2 size={18} className="curriculum-check" />
                    <p className="curriculum-text">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Included Student Kit & Mentorship */}
      {course.includes && course.includes.length > 0 && (
        <section className="section course-kit-section">
          <div className="wrap">
            <div className="kit-shell">
              <div className="kit-intro">
                <p className="eyebrow">Equipment & Materials</p>
                <h2 className="h-section">Student kit & privileges</h2>
                <p className="kit-desc">
                  Every student receives an exclusive professional gear kit and complete access to Spark backbar products, live models, and master director mentorship.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn cta"
                >
                  Enquire Now
                </a>
              </div>

              <div className="kit-items-list">
                {course.includes.map((item, idx) => (
                  <div key={idx} className="kit-item">
                    <span className="kit-bullet" />
                    <p className="kit-text">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Course-Specific FAQ Section (Exact Contact Page FAQ Model) */}
      <FaqSection
        id="course-faq"
        eyebrow="Course FAQs"
        title="Frequently asked about this course"
        description={`Clear details regarding live model practical hours, equipment kits, cohort schedules, and placement support for the ${course.name} programme.`}
        ctaText="Enquire Now"
        ctaHref={whatsappUrl}
        items={courseFaqs}
      />

      {/* 7. Bottom Action Banner */}
      <section className="section course-enroll-banner">
        <div className="wrap">
          <div className="enroll-banner-card">
            <div className="enroll-banner-copy">
              <p className="eyebrow" style={{ color: 'var(--red, #c8102e)' }}>Admissions Open</p>
              <h2 className="h-section" style={{ color: '#ffffff' }}>
                Begin your journey in {course.name}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.72)', maxWidth: '580px', margin: '0 0 28px 0', fontSize: '15px', lineHeight: '1.65' }}>
                Cohorts are strictly capped at 8 students to guarantee dedicated one-on-one master supervision. Speak with our admissions director today.
              </p>
            </div>
            <div className="enroll-banner-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cta"
                style={{ padding: '0 36px', height: '48px', fontSize: '12px' }}
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

