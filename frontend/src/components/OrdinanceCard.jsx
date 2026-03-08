import { useState } from 'react';
import { buildDownloadUrl } from '../utils/cloudinaryUtils';

// ── Category colour map ───────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  'Environment':         'bg-emerald-100 text-emerald-800',
  'Health & Sanitation': 'bg-sky-100 text-sky-800',
  'Education':           'bg-purple-100 text-purple-800',
  'Peace & Order':       'bg-red-100 text-red-800',
  'Infrastructure':      'bg-orange-100 text-orange-800',
  'Social Services':     'bg-pink-100 text-pink-800',
  'Finance':             'bg-yellow-100 text-yellow-800',
  'General':             'bg-gray-100 text-gray-700',
};

// ── Category icons ────────────────────────────────────────────────────────────
function CategoryIcon({ category, className = 'w-3.5 h-3.5' }) {
  switch (category) {
    case 'Environment':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'Health & Sanitation':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'Education':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    case 'Peace & Order':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'Infrastructure':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'Social Services':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'Finance':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'Date not set';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function parseDetails(fullText) {
  if (!fullText) return null;
  try {
    return JSON.parse(fullText);
  } catch {
    return { purpose: fullText };
  }
}

// ── Modal detail section ──────────────────────────────────────────────────────
function DetailSection({ icon, title, content }) {
  if (!content) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-gov-gold flex-shrink-0">{icon}</span>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gov-navy">{title}</h4>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed pl-6">{content}</p>
    </div>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function OrdinanceModal({ ordinance, onClose }) {
  const {
    ordinance_number,
    title,
    date_passed,
    description,
    full_text,
    category = 'General',
    file_url,
    file_name,
    file_type,
  } = ordinance;

  const details     = parseDetails(full_text);
  const catStyle    = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['General'];
  const isPdf       = file_type === 'application/pdf';
  const downloadUrl = file_url
    ? buildDownloadUrl(file_url, file_name ?? `${ordinance_number}.${isPdf ? 'pdf' : 'file'}`)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ord-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-gov-navy to-gov-navy-light px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {ordinance_number}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${catStyle}`}>
                  <CategoryIcon category={category} />
                  {category}
                </span>
              </div>
              <h2 id="ord-modal-title" className="text-white font-bold text-base leading-snug">
                {title}
              </h2>
              <p className="text-blue-200 text-xs mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date Passed: {formatDate(date_passed)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {description && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
            </div>
          )}

          {details ? (
            <div className="space-y-5">
              <DetailSection
                title="Purpose"
                content={details.purpose}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <hr className="border-gray-100" />
              <DetailSection
                title="Implementation"
                content={details.implementation}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
              />
              <hr className="border-gray-100" />
              <DetailSection
                title="Penalties for Violation"
                content={details.penalties}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              />
            </div>
          ) : (
            !description && (
              <p className="text-gray-400 text-sm text-center py-8">No additional details available.</p>
            )
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0 bg-gray-50/80">
          {file_url && downloadUrl ? (
            <a
              href={downloadUrl}
              download={file_name ?? ordinance_number}
              className="flex items-center gap-2 bg-gov-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gov-navy-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </a>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1.5 italic">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              No document attached
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export default function OrdinanceCard({ ordinance }) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    ordinance_number,
    title,
    date_passed,
    description,
    file_url,
    file_name,
    file_type,
    category = 'General',
  } = ordinance;

  const catStyle    = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['General'];
  const isPdf       = file_type === 'application/pdf';
  const downloadUrl = file_url
    ? buildDownloadUrl(file_url, file_name ?? `${ordinance_number}.${isPdf ? 'pdf' : 'file'}`)
    : null;

  return (
    <>
      <article className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 group animate-fadeIn">
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-gov-navy to-gov-navy-light flex-shrink-0" />

        <div className="p-5 flex flex-col flex-grow">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="bg-gov-navy/10 text-gov-navy text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
              {ordinance_number}
            </span>
            <span className={`badge text-xs flex items-center gap-1 ${catStyle}`}>
              <CategoryIcon category={category} />
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gov-navy text-sm leading-snug mb-2 line-clamp-3 group-hover:text-gov-gold transition-colors duration-200 flex-grow">
            {title}
          </h3>

          {/* Date */}
          <p className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(date_passed)}
          </p>

          {/* Description preview */}
          {description && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gov-navy text-gov-navy text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gov-navy hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Read More
            </button>

            {file_url && downloadUrl ? (
              <a
                href={downloadUrl}
                download={file_name ?? `${ordinance_number}.${isPdf ? 'pdf' : 'file'}`}
                className="flex items-center justify-center gap-1.5 bg-gov-navy text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gov-navy-dark transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            ) : (
              <span className="flex items-center gap-1.5 bg-gray-100 text-gray-400 text-xs font-semibold py-2 px-3 rounded-lg cursor-not-allowed">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF Pending
              </span>
            )}
          </div>
        </div>
      </article>

      {modalOpen && (
        <OrdinanceModal ordinance={ordinance} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

