import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import UploadPage from './pages/UploadPage';
import OfficialsPage from './pages/OfficialsPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/"          element={<HomePage />}    />
            <Route path="/library"   element={<LibraryPage />} />
            <Route path="/upload"    element={<UploadPage />}  />
            <Route path="/officials" element={<OfficialsPage />} />
            <Route path="*"          element={<NotFound />}    />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-7xl font-serif font-bold text-gov-navy/20 mb-4">404</div>
      <h1 className="text-2xl font-serif font-bold text-gov-navy mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go to Homepage</a>
    </div>
  );
}
