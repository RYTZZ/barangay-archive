import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ordinanceAPI } from '../services/api';
import './HomePage.css';

// â”€â”€ Placeholder data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PLACEHOLDER_ORDINANCES = [
  {
    id: 1,
    ordinance_number: 'ORD-2024-001',
    title: 'An Ordinance Establishing the Barangay Zone 2 Solid Waste Management Program',
    description: 'Establishing a comprehensive solid waste management program for Barangay Zone 2, promoting environmental sustainability.',
    date_passed: '2024-01-15',
    category: 'Environmental Protection',
  },
  {
    id: 2,
    ordinance_number: 'ORD-2024-002',
    title: 'An Ordinance Regulating the Operation of Food Establishments within Barangay Zone 2',
    description: 'Setting the standards and regulations for food establishments to ensure food safety and public health.',
    date_passed: '2024-02-20',
    category: 'Health and Sanitation',
  },
  {
    id: 3,
    ordinance_number: 'ORD-2024-003',
    title: 'An Ordinance Establishing a Barangay Scholarship Program for Deserving Students',
    description: 'Supporting academically deserving students from low-income families with financial assistance.',
    date_passed: '2024-03-10',
    category: 'Social Welfare and Community Development',
  },
];

// â”€â”€ Category data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORIES = [
  {
    title: 'Public Order and Safety',
    description: 'Curfews, traffic management, anti-nuisance regulations, and community security measures.',
    bg: '#2563eb',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Health and Sanitation',
    description: 'Waste management, community cleanliness, control of public health nuisances, and food establishment regulations.',
    bg: '#10b981',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Economic Development and Livelihood',
    description: 'Local business operations, barangay clearances, and support programs for entrepreneurs.',
    bg: '#f59e0b',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Environmental Protection',
    description: 'Anti-littering measures, tree planting initiatives, and maintenance of clean and green spaces.',
    bg: '#16a34a',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Social Welfare and Community Development',
    description: 'Programs for youth, senior citizens, vulnerable sectors, and community-building activities.',
    bg: '#7c3aed',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Infrastructure and Public Works',
    description: 'Use and maintenance of barangay properties, minor construction, and repair guidelines.',
    bg: '#64748b',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

// â”€â”€ Features data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FEATURES = [
  {
    title: 'User-Friendly Search',
    description: 'Quickly find ordinances by keyword, number, or category using our intuitive search interface.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Downloadable Copies',
    description: 'Access and download official PDF versions of all ordinances directly from the archive.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: 'Ordinance Summaries',
    description: 'Brief, easy-to-understand summaries of key provisions help residents grasp the essentials quickly.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Regular Updates',
    description: 'The repository is continuously updated with the latest ordinances and any subsequent amendments.',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

// â”€â”€ Accordion panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AccordionPanel({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="hp-accordion-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hp-accordion-trigger"
        aria-expanded={open}
      >
        <div>
          <p className="hp-accordion-title">{title}</p>
          {subtitle && <p className="hp-accordion-sub">{subtitle}</p>}
        </div>
        <span className={`hp-accordion-chevron${open ? ' open' : ''}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`hp-accordion-body${open ? ' open' : ''}`}>
        <div className="hp-accordion-body-inner">{children}</div>
      </div>
    </div>
  );
}

// â”€â”€ Inline ordinance card (no Tailwind dependency) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OrdCard({ ordinance }) {
  const { ordinance_number, title, description, date_passed, category } = ordinance;
  const formatted = date_passed
    ? new Date(date_passed).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="hp-ord-card">
      <div className="hp-ord-card-accent" />
      <div className="hp-ord-card-body">
        {category && <span className="hp-ord-cat">{category}</span>}
        <p className="hp-ord-num">{ordinance_number}</p>
        <p className="hp-ord-title">{title}</p>
        {description && <p className="hp-ord-desc">{description}</p>}
        {formatted && <p className="hp-ord-date">Passed: {formatted}</p>}
      </div>
    </div>
  );
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HomePage() {
  const [featured, setFeatured]   = useState(PLACEHOLDER_ORDINANCES);
  const [totalOrds, setTotalOrds] = useState(8);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ordinanceAPI
      .getAll({ limit: 3 })
      .then((res) => {
        if (cancelled) return;
        const { data, pagination } = res.data;
        if (data?.length) setFeatured(data);
        if (pagination?.total) setTotalOrds(pagination.total);
      })
      .catch(() => { /* keep placeholder data */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="hp-root">

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-hero">
        <div className="hp-hero-grid" />
        <div className="hp-hero-inner">
          <div className="hp-seal">
            <img src="/logo.png" alt="Barangay Zone 2 Seal" className="hp-hero-logo" />
          </div>
          <div className="hp-hero-copy">
            <span className="hp-hero-eyebrow">
              Republic of the Philippines â€” Official Digital Repository
            </span>
            <h1 className="hp-hero-title">
              Welcome to the <span>Zone 2 Barangay</span>
              <br />Ordinance Repository
            </h1>
            <p className="hp-hero-desc">
              Your comprehensive resource for understanding the local laws and regulations that shape
              our community. This online portal provides residents, business owners, and all
              stakeholders with accessible and up-to-date information on the ordinances enacted by
              the Sangguniang Barangay of Zone 2.
            </p>
            <p className="hp-hero-mission">
              Our mission is to foster a well-informed and engaged community by ensuring transparency
              and ease of access to the local legislation that affects our daily lives. Whether
              you&rsquo;re looking for information on public safety, environmental regulations, local
              business requirements, or community welfare programs, this repository is your one-stop
              destination.
            </p>
            <div className="hp-hero-actions">
              <Link to="/library" className="hp-btn-primary">
                Browse Ordinances
              </Link>
              <Link to="/officials" className="hp-btn-outline">
                Meet Our Officials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ STATS BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-stats">
        <div className="hp-stats-inner">
          {[
            { value: totalOrds, label: 'Total Ordinances' },
            { value: 8,         label: 'Barangay Officials' },
            { value: 6,         label: 'Categories' },
            { value: 2018,      label: 'Term Started' },
          ].map(({ value, label }) => (
            <div key={label} className="hp-stat-cell">
              <span className="hp-stat-value">{value}</span>
              <span className="hp-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ BANNER PLACEHOLDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-banner">
        <div className="hp-banner-inner">
          <div className="hp-banner-photos">
            <img src="/banner1.jpg" alt="Barangay Zone 2 Beach Cottages" className="hp-banner-img" />
            <img src="/banner2.jpg" alt="Barangay Hall of Zone 2, Bulan Sorsogon" className="hp-banner-img" />
          </div>
        </div>
      </section>

      {/* â”€â”€ ACCORDION SECTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-accordion-section">
        <div className="hp-accordion-section-inner">

          <AccordionPanel
            title="What You'll Find Inside"
            subtitle="This digital archive contains the full text of all approved ordinances in Zone 2. Each ordinance is categorized for your convenience."
            defaultOpen={true}
          >
            <div className="hp-category-grid">
              {CATEGORIES.map((cat) => (
                <div key={cat.title} className="hp-category-card">
                  <div className="hp-category-icon" style={{ backgroundColor: cat.bg }}>
                    {cat.icon}
                  </div>
                  <h4>{cat.title}</h4>
                  <p>{cat.description}</p>
                </div>
              ))}
            </div>
          </AccordionPanel>

          <AccordionPanel
            title="Features of the Repository"
            subtitle="Designed to make local legislation accessible to every resident of Zone 2."
            defaultOpen={false}
          >
            <div className="hp-features-grid">
              {FEATURES.map((feat) => (
                <div key={feat.title} className="hp-feature-card">
                  <div className="hp-feature-icon">{feat.icon}</div>
                  <div>
                    <h4>{feat.title}</h4>
                    <p>{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionPanel>

        </div>
      </section>

      {/* â”€â”€ FEATURED ORDINANCES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-featured">
        <div className="hp-featured-inner">
          <div className="hp-section-head">
            <div>
              <span className="hp-section-eyebrow">Latest Legislation</span>
              <h2 className="hp-section-title">Featured Ordinances</h2>
            </div>
            <Link to="/library" className="hp-view-all">
              View All Ordinances
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="hp-ordinance-grid">
              {[1, 2, 3].map((i) => <div key={i} className="hp-skeleton" />)}
            </div>
          ) : (
            <div className="hp-ordinance-grid">
              {featured.map((ord) => (
                <OrdCard key={ord.id} ordinance={ord} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <h2 className="hp-cta-title">Need to Submit an Ordinance?</h2>
          <p className="hp-cta-desc">
            Authorized barangay officials can upload new ordinances directly to the archive system.
          </p>
          <div className="hp-cta-actions">
            <Link to="/upload" className="hp-btn-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload an Ordinance
            </Link>
            <Link to="/library" className="hp-btn-outline">
              Browse the Library
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
