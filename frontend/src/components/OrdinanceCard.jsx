// ── Category colour map ───────────────────────────────────────────────────────
import { buildDownloadUrl } from '../utils/cloudinaryUtils';

const CATEGORY_STYLES = {
  'Environment':       'bg-emerald-100 text-emerald-800',
  'Health & Sanitation': 'bg-sky-100 text-sky-800',
  'Education':         'bg-purple-100 text-purple-800',
  'Peace & Order':     'bg-red-100 text-red-800',
  'Infrastructure':    'bg-orange-100 text-orange-800',
  'Social Services':   'bg-pink-100 text-pink-800',
  'Finance':           'bg-yellow-100 text-yellow-800',
  'General':           'bg-gray-100 text-gray-700',
};

function formatDate(dateStr) {
  if (!dateStr) return 'Date not set';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrdinanceCard({ ordinance }) {
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

  const catStyle = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['General'];
  const isPdf    = file_type === 'application/pdf';
  const downloadUrl = buildDownloadUrl(file_url, file_name ?? `${ordinance_number}.${isPdf ? 'pdf' : 'file'}`);

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 group animate-fadeIn">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-gov-navy to-gov-navy-light flex-shrink-0" />

      <div className="p-5 flex flex-col flex-grow">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="bg-gov-navy/10 text-gov-navy text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
            {ordinance_number}
          </span>
          <span className={`badge text-xs ${catStyle}`}>{category}</span>
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

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
          {file_url ? (
            <>
              <a
                href={file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-gov-navy text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gov-navy-dark transition-colors"
              >
                {isPdf ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
                {isPdf ? 'View PDF' : 'View'}
              </a>
              <a
                href={downloadUrl}
                download={file_name ?? `${ordinance_number}.${isPdf ? 'pdf' : 'file'}`}
                className="flex items-center justify-center gap-1.5 border border-gov-navy text-gov-navy text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gov-navy/5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </>
          ) : (
            <span className="text-gray-400 text-xs italic">No document attached</span>
          )}
        </div>
      </div>
    </article>
  );
}
