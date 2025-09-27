// src/pages/ServiceDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Spinner, Card, Button, Alert } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import AppointmentModal from "./AppointmentModal";
import CallConsultationModal from "./CallConsultationModal";
import PanchakarmaModal from "./PanchakarmaModal";
import "../styles/services.css";

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Function to preprocess description for better formatting
  const preprocessDescription = (description) => {
    if (!description) return "";
    
    return description
      // Add proper line breaks and headers for main sections
      .replace(/🌿\s*(.*?)✨/g, "## 🌿 $1 ✨\n\n")
      .replace(/🌸\s*(.*?):/g, "### 🌸 $1:\n\n")
      .replace(/🌺\s*(.*?):/g, "### 🌺 $1:\n\n")
      .replace(/🧘‍♀️\s*(.*?):/g, "### 🧘‍♀️ $1:\n\n")
      .replace(/⚖️\s*(.*?):/g, "### ⚖️ $1:\n\n")
      .replace(/🕐\s*(.*?):/g, "### 🕐 $1:\n\n")
      .replace(/🏥\s*(.*?):/g, "### 🏥 $1:\n\n")
      .replace(/👩‍⚕️\s*(.*?):/g, "### 👩‍⚕️ $1:\n\n")
      // Convert numbered items to proper list items
      .replace(/([1-5]️⃣)\s*\*\*(.*?)\*\*/g, "\n- **$1 $2**")
      // Convert checkmarks to list items
      .replace(/✅\s*(.*?)(?=\n|$)/g, "- ✅ $1")
      // Convert bullet points
      .replace(/•\s*(.*?)(?=\n|$)/g, "- $1")
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")
      // Ensure proper paragraph separation
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .join('\n\n');
  };

  useEffect(() => {
    // Reset states when ID changes
    setLoading(true);
    setError(null);
    setService(null);
    
    axios
      .get(API_ENDPOINTS.SERVICE_BY_ID(id))
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          // Server responded with an error status
          if (err.response.status === 404) {
            setError(`Service with ID '${id}' was not found. Please check the URL or browse our available services.`);
          } else if (err.response.status >= 500) {
            setError('Server error occurred. Please try again later or contact support if the problem persists.');
          } else {
            setError(`Unable to load service details. Error: ${err.response.status}`);
          }
        } else if (err.request) {
          // Network error - no response received
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          // Something else happened
          setError('An unexpected error occurred while loading service details.');
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading service details..." />;
  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Alert variant="danger" className="p-4">
            <h5 className="mb-3">
              {error.includes('not found') ? '🔍 Service Not Found' : '⚠️ Error Loading Service'}
            </h5>
            <p className="mb-4">{error}</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-success"
                onClick={() => window.history.back()}
              >
                ← Go Back
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => window.location.href = '/services'}
              >
                Browse All Services
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  // Determine if the service should show a booking/request button
  const showAppointmentButton = ["Panchakarma", "Clinic Appointment", "Call Consultation"].includes(service.name);

  // Determine button text dynamically
  let buttonText = "";
  if (service.name === "Panchakarma") buttonText = "Book Slot";
  else if (service.name === "Call Consultation") buttonText = "Request a Call";
  else if (service.name === "Clinic Appointment") buttonText = "Book Appointment";

  return (
    <div className="service-detail-bg">
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="service-detail-card shadow-lg rounded-4 border-0">
              {service.imageUrl && (
                <div className="service-detail-img-wrapper">
                  <Card.Img variant="top" src={service.imageUrl} className="service-detail-img" alt={service.name} />
                </div>
              )}
              <Card.Body>
                <h2 className="text-center text-success mb-3 fw-bold service-detail-title">{service.name}</h2>
                <div className="service-detail-desc service-markdown-content">
                  <ReactMarkdown 
                    components={{
                      // Custom component renderers for better formatting
                      p: ({children}) => <p className="service-paragraph">{children}</p>,
                      h1: ({children}) => <h3 className="service-heading text-success">{children}</h3>,
                      h2: ({children}) => <h4 className="service-subheading text-success">{children}</h4>,
                      h3: ({children}) => <h5 className="service-subheading text-success">{children}</h5>,
                      ul: ({children}) => <ul className="service-list">{children}</ul>,
                      ol: ({children}) => <ol className="service-ordered-list">{children}</ol>,
                      li: ({children}) => <li className="service-list-item">{children}</li>,
                      strong: ({children}) => <strong className="service-bold text-success">{children}</strong>,
                      em: ({children}) => <em className="service-italic">{children}</em>
                    }}
                  >
                    {preprocessDescription(service.description)}
                  </ReactMarkdown>
                </div>

                {showAppointmentButton && (
                  <>
                    <Button
                      variant="success"
                      className="w-100 mb-3 service-detail-btn"
                      onClick={() => setShowModal(true)}
                      aria-label={buttonText}
                    >
                      {buttonText}
                    </Button>
                    
                    {/* Render appropriate modal based on service type */}
                    {service.name === "Call Consultation" && (
                      <CallConsultationModal 
                        show={showModal} 
                        handleClose={() => setShowModal(false)} 
                        service={service} 
                      />
                    )}
                    {service.name === "Panchakarma" && (
                      <PanchakarmaModal 
                        show={showModal} 
                        handleClose={() => setShowModal(false)} 
                      />
                    )}
                    {service.name === "Clinic Appointment" && (
                      <AppointmentModal 
                        show={showModal} 
                        handleClose={() => setShowModal(false)} 
                        service={service} 
                      />
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ServiceDetail;
