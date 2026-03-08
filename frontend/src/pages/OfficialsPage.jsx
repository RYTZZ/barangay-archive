import { useState } from 'react';

// â”€â”€ Official roster â€” Zone II Poblacion, Bgy. 2 West Ilawod â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const OFFICIALS = [
  {
    id: 1,
    positionCode: 'PB',
    positionLabel: 'Punong Barangay',
    firstName: 'Josias',
    middleName: 'Lipata',
    lastName: 'Geraldino',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 2,
    positionCode: 'SBM 1',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Joel',
    middleName: 'Gipanao',
    lastName: 'Guañizo',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 3,
    positionCode: 'SBM 2',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Allan',
    middleName: 'Pura',
    lastName: 'Dellomas',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 4,
    positionCode: 'SBM 3',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Arman',
    middleName: 'Despabiladeras',
    lastName: 'Guelas',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 5,
    positionCode: 'SBM 4',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Oscar',
    middleName: 'Pura',
    lastName: 'Estopa',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 6,
    positionCode: 'SBM 5',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Rizalino',
    middleName: 'Gernale',
    lastName: 'Cañada',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 7,
    positionCode: 'SBM 6',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Jocelyn',
    middleName: 'Mohametano',
    lastName: 'Guda',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
  {
    id: 8,
    positionCode: 'SBM 7',
    positionLabel: 'Sangguniang Barangay Member',
    firstName: 'Sandy',
    middleName: 'Perida',
    lastName: 'Doringo',
    zone: 'Zone II Poblacion',
    barangay: 'Bgy. 2 – West Ilawod',
    termStart: 'May 14, 2018',
    termEnd: '2021',
    photo: null,
  },
];

// â”€â”€ Avatar gradient colours (one per official) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AVATAR_GRADIENTS = [
  'from-[#0f2d52] to-[#1a4a7c]',   // PB    â€” gov navy
  'from-teal-600   to-teal-800',    // SBM 1
  'from-indigo-600 to-indigo-800',  // SBM 2
  'from-emerald-600 to-emerald-800',// SBM 3
  'from-violet-600 to-violet-800',  // SBM 4
  'from-sky-600    to-sky-800',     // SBM 5
  'from-rose-600   to-rose-800',    // SBM 6
  'from-amber-600  to-amber-800',   // SBM 7
];

/** Returns "FirstInitial LastInitial" e.g. "JG" for Josias ... Geraldino */
function getInitials({ firstName, lastName }) {
  return [firstName, lastName]
    .map((s) => (s ? s[0].toUpperCase() : ''))
    .join('');
}

/** Full display name: "Firstname M. Lastname" */
function fullName({ firstName, middleName, lastName }) {
  const mi = middleName ? `${middleName[0].toUpperCase()}.` : '';
  return [firstName, mi, lastName].filter(Boolean).join(' ');
}

// â”€â”€ Official card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OfficialCard({ official, index }) {
  const isPB     = official.positionCode === 'PB';
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const name     = fullName(official);
  const abbrev   = getInitials(official);

  return (
    <article
      className={[
        'group relative bg-white rounded-2xl overflow-hidden flex flex-col',
        'border transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-2xl',
        isPB
          ? 'border-gov-gold shadow-lg ring-2 ring-gov-gold/30'
          : 'border-gray-100 shadow-sm hover:border-gov-navy/20',
      ].join(' ')}
    >
      {/* Coloured top bar */}
      <div
        className={`h-2 w-full ${
          isPB
            ? 'bg-gradient-to-r from-gov-gold to-gov-gold-light'
            : 'bg-gradient-to-r from-gov-navy to-gov-navy-light'
        }`}
      />

      {/* Card body */}
      <div className="p-6 flex flex-col items-center text-center flex-grow gap-3">

        {/* â”€â”€ Avatar â”€â”€ */}
        <div className="relative">
          {official.photo ? (
            <img
              src={official.photo}
              alt={name}
              className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white ring-2 ring-gray-100"
            />
          ) : (
            <div
              className={[
                'w-24 h-24 rounded-full flex items-center justify-center',
                'text-white text-2xl font-extrabold tracking-wide select-none',
                'shadow-md border-4 border-white bg-gradient-to-br',
                gradient,
                'group-hover:scale-105 transition-transform duration-300',
              ].join(' ')}
              aria-hidden="true"
            >
              {abbrev}
            </div>
          )}

          {/* PB star badge */}
          {isPB && (
            <span
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-gov-gold rounded-full
                         flex items-center justify-center shadow-md border-2 border-white"
              title="Punong Barangay"
            >
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
          )}
        </div>

        {/* â”€â”€ Position badge â”€â”€ */}
        <div className="flex flex-col items-center gap-1">
          <span
            className={[
              'inline-block text-xs font-bold px-3 py-1 rounded-full tracking-wide',
              isPB
                ? 'bg-gov-gold/15 text-gov-gold-dark ring-1 ring-gov-gold/30'
                : 'bg-gov-navy/10 text-gov-navy',
            ].join(' ')}
          >
            {official.positionCode}
          </span>
          {!isPB && (
            <span className="text-gray-400 text-[10px] font-medium">
              {official.positionLabel}
            </span>
          )}
        </div>

        {/* â”€â”€ Name â”€â”€ */}
        <div>
          <h3
            className={[
              'font-bold text-gov-navy leading-snug',
              isPB ? 'text-base md:text-lg' : 'text-sm md:text-[15px]',
            ].join(' ')}
          >
            {name}
          </h3>
          {/* Middle name spelled out in lighter text */}
          <p className="text-gray-400 text-[11px] mt-0.5">
            {official.middleName}
          </p>
        </div>

        {/* â”€â”€ Info rows â”€â”€ */}
        <div className="w-full border-t border-gray-100 pt-3 space-y-1.5 mt-auto">
          <InfoRow icon="map">
            {official.zone} · {official.barangay}
          </InfoRow>
          <InfoRow icon="calendar">
            Term: {official.termStart} – {official.termEnd}
          </InfoRow>
        </div>
      </div>
    </article>
  );
}

// â”€â”€ Small info row inside card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InfoRow({ icon, children }) {
  return (
    <div className="flex items-start gap-1.5 text-left">
      <span className="flex-shrink-0 mt-0.5 text-gov-gold">
        {icon === 'map' ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </span>
      <span className="text-gray-500 text-[11px] leading-snug">{children}</span>
    </div>
  );
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function OfficialsPage() {
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState('All'); // 'All' | 'PB' | 'SBM'

  // Derived filtered list
  const visible = OFFICIALS.filter((o) => {
    const q   = query.toLowerCase();
    const name = fullName(o).toLowerCase();
    const matchesQuery =
      !q ||
      name.includes(q) ||
      o.positionCode.toLowerCase().includes(q) ||
      o.positionLabel.toLowerCase().includes(q);

    const matchesFilter =
      filter === 'All' ||
      (filter === 'PB'  && o.positionCode === 'PB') ||
      (filter === 'SBM' && o.positionCode.startsWith('SBM'));

    return matchesQuery && matchesFilter;
  });

  const punong = visible.find((o) => o.positionCode === 'PB');
  const sbms   = visible.filter((o) => o.positionCode.startsWith('SBM'));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gov-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Republic of the Philippines â€” Elected & Appointed Officials
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
            Barangay Officials
          </h1>
          {/* Administration banner */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                          rounded-full px-4 py-1.5 mt-3 border border-white/20">
            <svg className="w-4 h-4 text-gov-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium">
              Zone II Poblacion — Bgy. 2, West Ilawod
              <span className="mx-2 text-white/40">|</span>
              Term: May 14, 2018 – 2021
            </span>
          </div>
        </div>
      </div>

      {/* â”€â”€ Search & filter bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center">

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or positionâ€¦"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input pl-9 py-2 text-sm"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2">
            {['All', 'PB', 'SBM'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-colors',
                  filter === f
                    ? 'bg-gov-navy text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {f === 'All' ? 'All Officials' : f === 'PB' ? 'Punong Barangay' : 'SB Members'}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="sm:ml-auto text-xs text-gray-400 whitespace-nowrap">
            {visible.length} of {OFFICIALS.length} officials
          </span>
        </div>
      </div>

      {/* â”€â”€ Main content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {visible.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-400 font-semibold">No officials match your search.</p>
          </div>
        ) : (
          <>
            {/* â”€â”€ Punong Barangay (featured, centred) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {punong && (
              <section className="mb-12">
                <SectionDivider label="Punong Barangay" />
                <div className="flex justify-center">
                  <div className="w-full max-w-[260px]">
                    <OfficialCard
                      official={punong}
                      index={OFFICIALS.findIndex((o) => o.id === punong.id)}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* â”€â”€ SB Members grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {sbms.length > 0 && (
              <section>
                <SectionDivider label="Sangguniang Barangay Members" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sbms.map((o) => (
                    <OfficialCard
                      key={o.id}
                      official={o}
                      index={OFFICIALS.findIndex((x) => x.id === o.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* â”€â”€ Administration info footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="mt-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Gold header */}
          <div className="bg-gov-gold px-6 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">
              Administration Details
            </h3>
          </div>
          {/* Details row */}
          <div className="bg-white grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <DetailCell label="Barangay" value="Zone II Poblacion (Bgy. 2)" />
            <DetailCell label="Area" value="West Ilawod" />
            <DetailCell label="Elective Term" value="May 14, 2018 – 2021" />
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Section divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
      <span className="text-gov-navy font-serif font-bold text-lg px-2 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
    </div>
  );
}

// â”€â”€ Detail cell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DetailCell({ label, value }) {
  return (
    <div className="px-6 py-5">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-gov-navy font-bold text-sm">{value}</p>
    </div>
  );
}

