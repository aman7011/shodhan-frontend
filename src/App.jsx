import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Clinics from "./pages/Clinics";
import NavbarMain from "./pages/Navbar";
import Diseases from "./pages/Diseases";
import DiseaseDetail from "./pages/DiseaseDetail";
import ServiceDetail from "./pages/ServiceDetail"; // new service detail page
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import BlogsByAuthor from "./pages/BlogsByAuthor";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Footer from "./pages/Footer";
import PromoModal from "./pages/PromoModal";
import "./styles/app-custom.css";
import "./styles/promo-modal.css";
import "./styles/admin.css";

function App() {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show promo modal on home page, but only once per day
    if (location.pathname === '/') {
      const lastShown = localStorage.getItem('promoModalLastShown');
      const today = new Date().toDateString();
      
      // Show modal if it hasn't been shown today
      if (lastShown !== today) {
        const timer = setTimeout(() => {
          setShowPromoModal(true);
        }, 3000); // Show after 3 seconds

        return () => clearTimeout(timer);
      }
    } else {
      // Hide modal when navigating away from home page
      setShowPromoModal(false);
    }
  }, [location.pathname]);

  const handleClosePromoModal = () => {
    setShowPromoModal(false);
    // Store today's date so modal won't show again today
    localStorage.setItem('promoModalLastShown', new Date().toDateString());
  };



  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <NavbarMain />

      {/* Promo Modal */}
      <PromoModal 
        show={showPromoModal} 
        onHide={handleClosePromoModal} 
      />

      {/* Routes */}
      <Routes>
        {/* Clinics */}
        <Route path="/clinics" element={<Clinics />} />

        {/* Diseases */}
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/diseases/:id" element={<DiseaseDetail />} />

        {/* Services */}
        <Route path="/services/:id" element={<ServiceDetail />} />

        {/* Blogs */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/blogs/author/:author" element={<BlogsByAuthor />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Home */}
        <Route
          path="/"
          element={
            <div className="welcome-section py-mobile-lg">
              <div className="container-mobile">
                <h1 className="welcome-title text-mobile-xl text-center">Welcome to Shodhan Ayurveda</h1>
                <div className="welcome-divider text-center">
                  <span>🌿</span>
                </div>
                <p className="welcome-tagline text-center text-mobile-lg">Healing India, Healing World</p>
                
                {/* Additional home page content */}
                <div className="home-content mt-5">
                  <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                      <h3 className="text-success mb-4 text-mobile-lg">Begin Your Healing Journey</h3>
                      <p className="lead text-muted mb-4">
                        Experience authentic Ayurvedic healing with personalized consultations 
                        and transformative therapies designed for your unique constitution.
                      </p>
                      <div className="d-flex justify-content-center gap-3 flex-wrap flex-column flex-md-row">
                        <button 
                          className="btn btn-success btn-mobile"
                          onClick={() => setShowPromoModal(true)}
                        >
                          🌿 Start Your Journey
                        </button>
                        <button 
                          className="btn btn-outline-success btn-mobile"
                          onClick={() => window.location.href = '/diseases'}
                        >
                          📚 Explore Treatments
                        </button>
                        <button 
                          className="btn btn-outline-success btn-mobile"
                          onClick={() => window.location.href = '/blogs'}
                        >
                          📖 Read Our Blogs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Help Button */}
                <button 
                  className="floating-help-btn"
                  onClick={() => setShowPromoModal(true)}
                  title="Get Help - Consultation & Therapy Options"
                >
                  💬
                </button>
              </div>
            </div>
          }
        />
        
        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
