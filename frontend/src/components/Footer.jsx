import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/library',   label: 'Ordinance Library' },
  { to: '/upload',    label: 'Upload Ordinance' },
  { to: '/officials', label: 'Barangay Officials' },
];

export default function Footer() {
  return (
    <footer className="bg-gov-navy-dark text-white">
      {/* ── Gold top accent ───────────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-gov-gold via-gov-gold-light to-gov-gold" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-gov-gold font-serif font-bold text-lg mb-3">
              Barangay Zone 2
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Official ordinance repository of Barangay Zone 2. Promoting
              transparency, accountability, and accessible governance for all
              residents.
            </p>
            <p className="text-gray-400 text-xs">
              Republic of the Philippines
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-300 text-sm hover:text-gov-gold transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-gov-gold/60">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gov-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Barangay Zone 2 Hall,<br />Your City, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gov-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(0XX) XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gov-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>info@zone2.gov.ph</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ─────────────────────────────────────────────── */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>
            © {new Date().getFullYear()} Barangay Zone 2. All rights reserved.
          </span>
          <span>Developed for the Ordinance Archive System</span>
        </div>
      </div>
    </footer>
  );
}
