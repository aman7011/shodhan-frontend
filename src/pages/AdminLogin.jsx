import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/admin.css";

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create base64 encoded credentials for basic auth
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      
      // Test authentication with backend by trying to fetch admin blogs
      const response = await axios.get(API_ENDPOINTS.BLOGS_ADMIN, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Store credentials for subsequent requests
        localStorage.setItem('adminAuth', basicAuth);
        localStorage.setItem('adminUser', JSON.stringify({
          username: credentials.username,
          role: 'admin'
        }));
        onLogin(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="admin-login-card shadow-lg" style={{ width: '400px' }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-success fw-bold mb-2">🔐 Admin Access</h3>
              <p className="text-muted">Enter your credentials to manage blogs</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={loading}
                />
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Signing in...
                  </>
                ) : (
                  '🔓 Sign In'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Enter your backend admin credentials
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminLogin;