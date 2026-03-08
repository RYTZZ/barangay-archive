# Barangay Zone 2 — Ordinance Archive

Official full-stack web application for the Ordinance Archive of Barangay Zone 2.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Tailwind CSS (Vite) |
| Backend | Node.js + Express |
| Database | MySQL 8.0 |
| File Storage | Google Cloud Storage |

---

## Project Structure

```
camille/
├── frontend/               # React + Tailwind (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, OrdinanceCard
│   │   ├── pages/          # HomePage, LibraryPage, UploadPage, OfficialsPage
│   │   └── services/       # Axios API helpers
│   └── package.json
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── config/         # MySQL pool, GCS client
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/      # Multer file upload
│   │   └── routes/         # Express routers
│   └── package.json
├── database/
│   └── schema.sql          # Tables + seed data
└── README.md
```

---

## Prerequisites

- Node.js v18+
- MySQL 8.0+
- Google Cloud account with a Cloud Storage bucket
- npm

---

## 1 — Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `barangay_archive` database, all tables, indexes, and sample data.

---

## 2 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your credentials (see below)
npm run dev
# Server runs at http://localhost:5000
```

### Backend Environment Variables (`.env`)

```env
PORT=5000

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=barangay_archive

# Google Cloud Storage
GCS_BUCKET_NAME=your-gcs-bucket-name
GCS_PROJECT_ID=your-gcp-project-id
GCS_KEY_FILE=./gcs-keyfile.json

# Frontend origin (CORS)
FRONTEND_URL=http://localhost:5173

NODE_ENV=development
```

---

## 3 — Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
# App runs at http://localhost:5173
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 4 — Google Cloud Storage Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → Cloud Storage → Create Bucket.
2. Name: `your-gcs-bucket-name` (must match `GCS_BUCKET_NAME` in `.env`).
3. Set **Access control** to **Uniform** and make the bucket **publicly readable**:
   ```bash
   gcloud storage buckets add-iam-policy-binding gs://your-bucket \
     --member=allUsers --role=roles/storage.objectViewer
   ```
4. Create a **Service Account**:
   - IAM & Admin → Service Accounts → Create
   - Role: `Storage Object Admin`
   - Create JSON key → download → rename to `gcs-keyfile.json`
   - Place in `backend/gcs-keyfile.json`
5. Set `GCS_KEY_FILE=./gcs-keyfile.json` in `backend/.env`.

> **Note:** `gcs-keyfile.json` is in `.gitignore`. Never commit it.

---

## API Reference

### Ordinances

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ordinances` | List all (supports `?search=`, `?category=`, `?year=`, `?page=`, `?limit=`) |
| GET | `/api/ordinances/categories` | Distinct category list |
| GET | `/api/ordinances/:id` | Single ordinance |
| POST | `/api/ordinances` | Create (multipart/form-data) |
| PUT | `/api/ordinances/:id` | Update (multipart/form-data) |
| DELETE | `/api/ordinances/:id` | Delete |

### Officials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/officials` | List all active officials |
| GET | `/api/officials/:id` | Single official |
| POST | `/api/officials` | Create (multipart/form-data) |
| PUT | `/api/officials/:id` | Update |
| DELETE | `/api/officials/:id` | Delete |

---

## Running Both Servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## Deployment Notes

- **Frontend:** `cd frontend && npm run build` → deploy `dist/` to any static host (Vercel, Netlify, Firebase Hosting).
- **Backend:** Deploy to Cloud Run, Railway, or any Node.js host. Set environment variables in your host's dashboard.
- **Database:** Use Cloud SQL (MySQL) on GCP for production.
- Set `FRONTEND_URL` in backend env to your production frontend domain for CORS.
