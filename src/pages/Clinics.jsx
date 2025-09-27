import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Alert, Container } from "react-bootstrap";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/clinics.css"; // custom styles
import AppointmentModal from "./AppointmentModal";

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.CLINICS)
      .then((res) => {
        setClinics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          // Server responded with an error status
          if (err.response.status >= 500) {
            setError('Server error occurred. Please try again later or contact support if the problem persists.');
          } else {
            setError(`Unable to load clinics. Error: ${err.response.status}`);
          }
        } else if (err.request) {
          // Network error - no response received
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          // Something else happened
          setError('An unexpected error occurred while loading clinics.');
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading clinics..." />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Alert variant="danger" className="p-4">
            <h5 className="mb-3">⚠️ Error Loading Clinics</h5>
            <p className="mb-4">{error}</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-success"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <div className="clinics-section py-5">
      <div className="container text-center">
        <h2 className="section-title mb-4">Our Clinics</h2>
        <div className="d-flex justify-content-center flex-wrap gap-4">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="card clinic-card shadow-lg h-100">
              <div className="badge-top">Open Now</div>
              {clinic.imageUrls && clinic.imageUrls.length > 0 ? (
                <Carousel 
                  className="clinic-carousel" 
                  interval={4000}
                  indicators={clinic.imageUrls.length > 1}
                  controls={clinic.imageUrls.length > 1}
                >
                  {clinic.imageUrls.map((imageUrl, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={imageUrl}
                        className="d-block w-100 clinic-carousel-image"
                        alt={`${clinic.name} - Image ${index + 1}`}
                        onError={(e) => {
                          e.target.src = "/images/clinic-placeholder.jpg";
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <img
                  src="/images/clinic-placeholder.jpg"
                  className="card-img-top"
                  alt={clinic.name}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{clinic.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {clinic.address} <br />
                  <strong>City:</strong> {clinic.city} <br />
                  <strong>Phone:</strong> {clinic.phone}
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setShowModal(true);
                  }}
                >
                  Visit
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Clinic Appointment Modal */}
        <AppointmentModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          service={{ name: "Clinic Appointment" }}
        />
      </div>
    </div>
  );
}

export default Clinics;
