import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// ── Barangay Logo ─────────────────────────────────────────────────────────────
function BarangaySeal({ size = 48 }) {
  return (
    <img
      src="/logo.png"
      alt="Barangay Zone 2 Seal"
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: '50%' }}
    />
  );
}

// ── Nav links config ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/upload',    label: 'Upload Ordinance' },
  { to: '/library',   label: 'Ordinance Library' },
  { to: '/officials', label: 'Barangay Officials' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Government top bar ─────────────────────────────────────────── */}
      <div className="bg-gov-navy-dark text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {/* PH flag accent */}
            <span className="inline-block w-4 h-2.5 bg-gradient-to-b from-blue-700 via-white to-red-600 rounded-sm border border-white/20" />
            Republic of the Philippines
          </span>
          <span className="hidden sm:block text-white/70">
            Barangay Zone 2 — Official Website
          </span>
        </div>
      </div>

      {/* ── Main nav ───────────────────────────────────────────────────── */}
      <nav className="bg-gov-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 flex-shrink-0 group"
              aria-label="Barangay Zone 2 Home"
            >
              <BarangaySeal size={46} />
              <div className="leading-tight">
                <div className="text-white font-bold text-sm md:text-base">
                  Barangay Zone 2
                </div>
                <div className="text-gov-gold text-xs font-medium">
                  Ordinance Archive
                </div>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    [
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-gov-gold bg-white/10'
                        : 'text-gray-200 hover:text-white hover:bg-white/10',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="md:hidden border-t border-white/10 py-3 space-y-1 animate-slideDown">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-gov-gold bg-white/10'
                        : 'text-gray-200 hover:bg-white/10',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
