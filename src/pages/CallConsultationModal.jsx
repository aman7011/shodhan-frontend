import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { validateName, validatePhone, validateDescription, sanitizeInput } from "../utils/validation";

export default function CallConsultationModal({ show, handleClose, service = { name: "Call Consultation" } }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!show) {
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Reset all state when modal closes
      setFormData({ name: "", phone: "", description: "" });
      setValidationErrors({});
      setLoading(false);
      setSuccess(null);
      setError(null);
    }
  }, [show]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Custom close handler with cleanup
  const handleModalClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const descriptionError = validateDescription(formData.description, true); // Required for call consultation
    if (descriptionError) errors.description = descriptionError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestData = {
        ...formData,
        serviceName: service.name,
        date: new Date().toISOString().split('T')[0], // Today's date as default
      };
      
      const response = await axios.post(API_ENDPOINTS.APPOINTMENTS, requestData);
      
      setSuccess("Your call consultation request has been submitted successfully! We will contact you soon.");
      setFormData({ name: "", phone: "", description: "" });
      
      // Auto-close after success with proper cleanup
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error("Error submitting call consultation:", err);
      
      if (err.response?.status === 404) {
        setError("Service temporarily unavailable. Please try again later or call us directly.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again in a few minutes.");
      } else {
        setError(`Failed to submit your request: ${err.response?.data?.message || err.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🌿 Request a Call Consultation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="mb-3 text-center">
          <small className="text-muted">
            📞 Our Ayurvedic experts will call you within 24 hours
          </small>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!validationErrors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Phone Number *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number (e.g., +91 9876543210)"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={!!validationErrors.phone}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Brief Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Briefly describe your health concerns or questions..."
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!validationErrors.description}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.description}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              This helps our doctors prepare for your consultation
            </Form.Text>
          </Form.Group>
          
          <Button 
            variant="success" 
            type="submit" 
            className="w-100" 
            disabled={loading}
            style={{ borderRadius: '25px', fontWeight: '600' }}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Submitting Request...
              </>
            ) : (
              "📞 Request Call Back"
            )}
          </Button>
        </Form>
        
        <div className="mt-3 text-center">
          <small className="text-success">
            ✅ Free consultation • 🔒 Your privacy is protected
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
}
