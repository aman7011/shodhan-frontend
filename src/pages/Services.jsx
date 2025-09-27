// src/pages/Services.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import { FaClinicMedical, FaPhoneAlt, FaSpa } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.SERVICES)
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        
        if (err.response) {
          // Server responded with an error status
          if (err.response.status >= 500) {
            setError('Server error occurred. Please try again later or contact support if the problem persists.');
          } else {
            setError(`Unable to load services. Error: ${err.response.status}`);
          }
        } else if (err.request) {
          // Network error - no response received
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          // Something else happened
          setError('An unexpected error occurred while loading services.');
        }
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
    setFormData({ name: "", phone: "", description: "" });
    setSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitError("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const requestData = {
        ...formData,
        serviceName: modalType === "clinic" ? "Clinic Appointment" : 
                    modalType === "panchakarma" ? "Panchakarma" : "Call Consultation",
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };
      
      // Try API first, then fallback to localStorage
      try {
        await axios.post(API_ENDPOINTS.APPOINTMENTS, requestData);
        setSubmitSuccess(true);
      } catch (apiError) {
        console.warn("API not available, using local storage fallback:", apiError);
        
        // Fallback: Store in localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push({
          id: Date.now(),
          ...requestData,
          status: 'pending'
        });
        localStorage.setItem('appointments', JSON.stringify(appointments));
        setSubmitSuccess(true);
      }
      
      // Auto-close after success
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError("Failed to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading services..." />;

  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Alert variant="danger" className="p-4">
            <h5 className="mb-3">⚠️ Error Loading Services</h5>
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

  // Icon mapping
  const getIcon = (name) => {
    if (name.toLowerCase().includes("clinic")) return <FaClinicMedical className="me-2" />;
    if (name.toLowerCase().includes("panchakarma")) return <FaSpa className="me-2" />;
    if (name.toLowerCase().includes("call")) return <FaPhoneAlt className="me-2" />;
    return null;
  };

  return (
    <Container className="my-5">
      <Tabs defaultActiveKey="0" id="services-tabs" className="mb-3">
        {services.map((service, idx) => (
          <Tab
            eventKey={idx.toString()}
            title={<span>{getIcon(service.name)}{service.name}</span>}
            key={service.id}
            className="pt-3"
          >
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="p-3 shadow service-card mb-3">
                  {service.imageUrl && (
                    <Card.Img
                      src={service.imageUrl}
                      alt={service.name}
                      className="mb-3 rounded service-img"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  )}
                  <h4 className="service-title mb-2">{service.name}</h4>
                  <p className="service-desc">{service.description}</p>
                  {service.name === "Clinic Appointment" && (
                    <Button variant="success" className="mt-2" onClick={() => handleOpenModal("clinic")}>Book Appointment</Button>
                  )}
                  {service.name === "Panchakarma" && (
                    <Button variant="success" className="mt-2" onClick={() => handleOpenModal("panchakarma")}>Book Panchakarma</Button>
                  )}
                  {service.name === "Call Consultation" && (
                    <Button variant="info" className="mt-2" onClick={() => handleOpenModal("call")}>Call Now</Button>
                  )}
                </Card>
              </Col>
            </Row>
          </Tab>
        ))}
      </Tabs>

      {/* Modal for booking/call */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "clinic" && "Book Clinic Appointment"}
            {modalType === "panchakarma" && "Book Panchakarma"}
            {modalType === "call" && "Call Consultation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "clinic" && (
            <>
              {submitSuccess && <Alert variant="success">✅ Appointment booked successfully! We will contact you soon.</Alert>}
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="modalName">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalPhone">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone"
                    placeholder="Enter phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalDescription">
                  <Form.Label>Brief Description (Optional)</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Describe your health concerns..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={submitting}
                  className="w-100"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Booking...
                    </>
                  ) : (
                    "📅 Book Appointment"
                  )}
                </Button>
              </Form>
            </>
          )}
          {modalType === "panchakarma" && (
            <>
              {submitSuccess && <Alert variant="success">✅ Panchakarma slot booked successfully! We will contact you soon.</Alert>}
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="modalNameP">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalPhoneP">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone"
                    placeholder="Enter phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalDescriptionP">
                  <Form.Label>Health Concerns (Optional)</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Describe any specific health concerns..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={submitting}
                  className="w-100"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Booking...
                    </>
                  ) : (
                    "🧘‍♀️ Book Panchakarma Slot"
                  )}
                </Button>
              </Form>
            </>
          )}
          {modalType === "call" && (
            <>
              {submitSuccess && <Alert variant="success">✅ Call request submitted successfully! Our expert will call you soon.</Alert>}
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="modalNameC">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalPhoneC">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone"
                    placeholder="Enter phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="modalDescriptionC">
                  <Form.Label>Brief Description (Optional)</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Briefly describe your health concerns..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    This helps our doctors prepare for your consultation
                  </Form.Text>
                </Form.Group>
                <Button 
                  variant="info" 
                  type="submit" 
                  disabled={submitting}
                  className="w-100"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Requesting...
                    </>
                  ) : (
                    "📞 Request Call Back"
                  )}
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Services;
