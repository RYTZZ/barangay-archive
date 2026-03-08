import { useState, useRef } from 'react';
import { ordinanceAPI } from '../services/api';

const CATEGORIES = [
  'General',
  'Environment',
  'Health & Sanitation',
  'Education',
  'Peace & Order',
  'Infrastructure',
  'Social Services',
  'Finance',
];

const INITIAL_FORM = {
  ordinance_number: '',
  title: '',
  date_passed: '',
  category: 'General',
  description: '',
  full_text: '',
};

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  const isSuccess = type === 'success';
  return (
    <div
      className={[
        'fixed top-24 right-4 z-50 max-w-sm w-full rounded-xl shadow-xl px-5 py-4',
        'flex items-start gap-3 animate-slideDown',
        isSuccess ? 'bg-emerald-600' : 'bg-red-600',
      ].join(' ')}
      role="alert"
    >
      <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isSuccess ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      <div className="flex-1 text-white text-sm font-medium leading-snug">{message}</div>
      <button onClick={onClose} className="text-white/70 hover:text-white flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Drag-and-drop file zone ───────────────────────────────────────────────────
function FileDropZone({ file, onFile, error }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const ALLOWED = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const MAX_MB  = 20;

  const handleFile = (f) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      onFile(null, 'Invalid file type. Only PDF, JPG, and PNG are accepted.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      onFile(null, `File must be smaller than ${MAX_MB} MB.`);
      return;
    }
    onFile(f, null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          dragging
            ? 'border-gov-gold bg-gov-gold/5 scale-[1.01]'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-gov-navy bg-gray-50 hover:bg-white',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gov-navy/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gov-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold text-gov-navy text-sm">{file.name}</p>
            <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFile(null, null); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors mt-1"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div>
              <p className="font-semibold text-gray-600 text-sm">Drag & drop file here, or click to browse</p>
              <p className="text-xs mt-0.5">Accepted: PDF, JPG, PNG — Max 20 MB</p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
        {error}
      </p>}
    </div>
  );
}

// ── Field error message ───────────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {msg}
    </p>
  );
}

export default function UploadPage() {
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [file,      setFile]      = useState(null);
  const [fileError, setFileError] = useState(null);
  const [errors,    setErrors]    = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast,     setToast]     = useState(null); // { type, message }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.ordinance_number.trim()) errs.ordinance_number = 'Ordinance number is required.';
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.date_passed) errs.date_passed = 'Date passed is required.';
    return errs;
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (fileError) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (file) fd.append('file', file);

      await ordinanceAPI.create(fd);
      showToast('success', `Ordinance "${form.ordinance_number}" uploaded successfully!`);
      setForm(INITIAL_FORM);
      setFile(null);
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload. Please try again.';
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-gov-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Document Management
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Upload Ordinance
          </h1>
          <p className="text-blue-100 mt-2 text-sm">
            Submit a new barangay ordinance to the official archive
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Form header */}
          <div className="bg-gov-navy/5 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gov-navy rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gov-navy text-sm">New Ordinance Form</h2>
              <p className="text-gray-400 text-xs">Fields marked with * are required</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Row 1: Ordinance Number + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label" htmlFor="ordinance_number">
                  Ordinance Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="ordinance_number"
                  name="ordinance_number"
                  type="text"
                  placeholder="e.g. ORD-2024-001"
                  value={form.ordinance_number}
                  onChange={handleChange}
                  className={`form-input ${errors.ordinance_number ? 'border-red-400 focus:ring-red-400/30' : ''}`}
                />
                <FieldError msg={errors.ordinance_number} />
              </div>

              <div>
                <label className="form-label" htmlFor="date_passed">
                  Date Passed <span className="text-red-500">*</span>
                </label>
                <input
                  id="date_passed"
                  name="date_passed"
                  type="date"
                  value={form.date_passed}
                  onChange={handleChange}
                  className={`form-input ${errors.date_passed ? 'border-red-400 focus:ring-red-400/30' : ''}`}
                />
                <FieldError msg={errors.date_passed} />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="form-label" htmlFor="title">
                Ordinance Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. An Ordinance Establishing…"
                value={form.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'border-red-400 focus:ring-red-400/30' : ''}`}
              />
              <FieldError msg={errors.title} />
            </div>

            {/* Category */}
            <div>
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="form-label" htmlFor="description">Short Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief summary of the ordinance (displayed in preview cards)…"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="form-textarea"
              />
            </div>

            {/* Full text */}
            <div>
              <label className="form-label" htmlFor="full_text">Full Text</label>
              <textarea
                id="full_text"
                name="full_text"
                placeholder="Paste the complete ordinance text here (optional — used for full-text search)…"
                value={form.full_text}
                onChange={handleChange}
                rows={6}
                className="form-textarea"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="form-label">Attach Document (PDF / JPG / PNG)</label>
              <FileDropZone
                file={file}
                onFile={(f, err) => { setFile(f); setFileError(err); }}
                error={fileError}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setForm(INITIAL_FORM); setFile(null); setErrors({}); setFileError(null); }}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Submit Ordinance
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Help note */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-blue-700 text-xs leading-relaxed">
            <p className="font-semibold mb-1">Submission Guidelines</p>
            <ul className="space-y-0.5 list-disc list-inside text-blue-600">
              <li>Use the format <strong>ORD-YYYY-NNN</strong> for ordinance numbers.</li>
              <li>Attach the scanned signed copy in PDF format when available.</li>
              <li>Uploaded files are stored securely in Google Cloud Storage.</li>
              <li>Duplicate ordinance numbers will be rejected.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
