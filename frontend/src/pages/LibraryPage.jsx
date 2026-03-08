import { useState, useEffect, useCallback } from 'react';
import { ordinanceAPI } from '../services/api';
import OrdinanceCard from '../components/OrdinanceCard';
import { buildDownloadUrl } from '../utils/cloudinaryUtils';

const CATEGORIES = [
  'Environment',
  'Health & Sanitation',
  'Education',
  'Peace & Order',
  'Infrastructure',
  'Social Services',
  'Finance',
  'General',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-gov-navy/20 border-t-gov-navy rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ search }) {
  return (
    <div className="text-center py-20">
      <svg className="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-gray-500 font-semibold text-lg mb-1">No ordinances found</p>
      {search && (
        <p className="text-gray-400 text-sm">
          No results for "<span className="font-medium">{search}</span>"
        </p>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left  = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  if (left > 1) pages.push(1, '…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages) pages.push('…', totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gov-navy hover:text-white hover:border-gov-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              'w-9 h-9 text-sm rounded-lg border transition-colors',
              p === page
                ? 'bg-gov-navy text-white border-gov-navy font-semibold'
                : 'border-gray-200 text-gray-600 hover:bg-gov-navy/5',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gov-navy hover:text-white hover:border-gov-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

export default function LibraryPage() {
  const [ordinances, setOrdinances] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [year,     setYear]     = useState('');
  const [page,     setPage]     = useState(1);
  const [view,     setView]     = useState('grid'); // 'grid' | 'list'

  const fetchOrdinances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordinanceAPI.getAll({ search, category, year, page, limit: 9 });
      setOrdinances(res.data.data ?? []);
      setPagination(res.data.pagination ?? { total: 0, page: 1, totalPages: 1 });
    } catch {
      setError('Unable to load ordinances. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, year, page]);

  useEffect(() => {
    fetchOrdinances();
  }, [fetchOrdinances]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setYear('');
    setPage(1);
  };

  const hasFilters = search || category || year;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gov-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Official Records
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Ordinance Library
          </h1>
          <p className="text-blue-100 mt-2 text-sm">
            Browse, search, and download all barangay ordinances
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Search & Filters ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search ordinances by number, title, or keyword…"
                value={search}
                onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
                className="form-input pl-9"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={(e) => handleFilterChange(setYear)(e.target.value)}
              className="form-input"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Active filters / clear */}
          {hasFilters && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Active filters:</span>
              {search   && <FilterChip label={`"${search}"`}    onRemove={() => handleFilterChange(setSearch)('')} />}
              {category && <FilterChip label={category}         onRemove={() => handleFilterChange(setCategory)('')} />}
              {year     && <FilterChip label={`Year: ${year}`}  onRemove={() => handleFilterChange(setYear)('')} />}
              <button onClick={clearFilters} className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Results header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? (
              'Loading…'
            ) : (
              <>
                Showing <span className="font-semibold text-gov-navy">{ordinances.length}</span>
                {' '}of <span className="font-semibold text-gov-navy">{pagination.total}</span> ordinances
              </>
            )}
          </p>
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-gov-navy' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-gov-navy' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : ordinances.length === 0 ? (
          <EmptyState search={search} />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordinances.map((ord) => (
              <OrdinanceCard key={ord.id} ordinance={ord} />
            ))}
          </div>
        ) : (
          <ListTable ordinances={ordinances} />
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gov-navy/10 text-gov-navy text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-gov-navy-dark" aria-label="Remove filter">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

// ── List/table view ───────────────────────────────────────────────────────────
function ListTable({ ordinances }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gov-navy text-white text-xs uppercase tracking-wide">
            <th className="text-left px-5 py-3 font-semibold">Ord. No.</th>
            <th className="text-left px-5 py-3 font-semibold">Title</th>
            <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Category</th>
            <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Date Passed</th>
            <th className="text-center px-5 py-3 font-semibold">Document</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ordinances.map((ord) => (
            <tr key={ord.id} className="hover:bg-gov-navy/3 transition-colors">
              <td className="px-5 py-3.5 font-bold text-gov-navy whitespace-nowrap">
                {ord.ordinance_number}
              </td>
              <td className="px-5 py-3.5 text-gray-700 max-w-xs">
                <span className="line-clamp-2">{ord.title}</span>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell">
                <span className="badge bg-gray-100 text-gray-700">{ord.category}</span>
              </td>
              <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden sm:table-cell">
                {ord.date_passed
                  ? new Date(ord.date_passed).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })
                  : '—'}
              </td>
              <td className="px-5 py-3.5 text-center">
                {ord.file_url ? (
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={ord.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gov-navy text-xs font-semibold hover:text-gov-gold transition-colors flex items-center gap-1"
                    >
                      View
                    </a>
                    <span className="text-gray-200">|</span>
                    <a
                      href={buildDownloadUrl(ord.file_url, ord.file_name || ord.ordinance_number)}
                      download={ord.file_name || ord.ordinance_number}
                      className="text-gov-navy text-xs font-semibold hover:text-gov-gold transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
