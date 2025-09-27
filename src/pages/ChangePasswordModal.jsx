import { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import adminApi from '../utils/adminAuth';
import { API_ENDPOINTS } from '../config/api';

function ChangePasswordModal({ show, onHide, onPasswordChanged }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApi.post(API_ENDPOINTS.ADMIN_CHANGE_PASSWORD, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully!');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Notify parent component
      if (onPasswordChanged) {
        onPasswordChanged();
      }

      // Auto-close modal after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Password change error:', err);
      
      if (err.response?.status === 400) {
        setError('Invalid current password');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setFormErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🔐 Change Password</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-3">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              isInvalid={!!formErrors.currentPassword}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.currentPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              isInvalid={!!formErrors.newPassword}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.newPassword}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Password must be at least 6 characters long
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              isInvalid={!!formErrors.confirmPassword}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Changing...
                </>
              ) : (
                '🔄 Change Password'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChangePasswordModal;