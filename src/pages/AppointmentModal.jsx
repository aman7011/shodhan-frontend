// src/pages/AppointmentModal.jsx
import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { validateName, validatePhone, validateDescription, validateDate, sanitizeInput } from "../utils/validation";

function AppointmentModal({ show, handleClose, service }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    date: "",
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
      setFormData({ name: "", phone: "", description: "", date: "" });
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
    
    const descriptionError = validateDescription(formData.description, false); // Not required
    if (descriptionError) errors.description = descriptionError;
    
    const dateError = validateDate(formData.date);
    if (dateError) errors.date = dateError;
    
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
      await axios.post(API_ENDPOINTS.APPOINTMENTS, {
        ...formData,
        serviceName: service.name,
      });

      setSuccess("Your appointment has been booked successfully!");
      setFormData({ name: "", phone: "", description: "", date: "" });
      
      // Auto-close after success
      timeoutRef.current = setTimeout(() => {
        handleModalClose();
      }, 3000);
    } catch (err) {
      setError("Failed to submit appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Decide fields based on service
  const isClinic = service.name === "Clinic Appointment";
  const isPanchakarma = service.name === "Panchakarma";
  const isCall = service.name === "Call Consultation";

  return (
    <Modal show={show} onHide={handleModalClose} centered className="modal-mobile">
      <Modal.Header closeButton>
        <Modal.Title>
          {service.name === "Panchakarma" && "Book Slot"}
          {service.name === "Clinic Appointment" && "Book Appointment"}
          {service.name === "Call Consultation" && "Request a Call"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Common fields */}
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!validationErrors.name}
              placeholder="Enter your full name"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={!!validationErrors.phone}
              placeholder="Enter 10-digit mobile number"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Clinic appointment needs description + date */}
          {isClinic && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Description / Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.description}
                  placeholder="Optional: Describe your symptoms or concerns"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Preferred Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.date}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.date}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : isClinic ? (
              "Book Appointment"
            ) : isPanchakarma ? (
              "Book Slot"
            ) : isCall ? (
              "Request a Call"
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AppointmentModal;
