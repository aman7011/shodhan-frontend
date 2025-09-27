import React, { useState } from 'react';
import { Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import adminApi from '../utils/adminAuth';
import { API_ENDPOINTS } from '../config/api';
import { sanitizeBlogs, debugDataTypes } from '../utils/blogUtils';
import { validateAgainstBackendModel, generateValidTestData } from '../utils/backendModel';

function AdminBlogTester() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testBlogCreation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testData = {
      title: "Test Blog Post",
      slug: "test-blog-post", 
      content: "This is a comprehensive test blog content to verify the API integration works correctly.",
      summary: "A test blog post to verify API functionality",
      author: "Test Author",
      imageUrl: null, // Explicitly null instead of empty string
      tags: "test, debugging, api-fix",
      published: false,
      featured: false
    };

    try {
      const sanitizedData = sanitizeBlogs(testData);
      debugDataTypes(testData, 'Original test data');
      debugDataTypes(sanitizedData, 'Sanitized test data');
      
      // Validate against backend model
      const validation = validateAgainstBackendModel(sanitizedData);
      console.log('=== BACKEND MODEL VALIDATION ===');
      console.log('Is Valid:', validation.isValid);
      if (validation.errors.length > 0) {
        console.log('Errors:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.log('Warnings:', validation.warnings);
      }
      
      console.log('=== API TEST REQUEST ===');
      console.log('URL:', API_ENDPOINTS.BLOGS_ADMIN);
      console.log('Method: POST');
      console.log('Headers: Content-Type: application/json');
      console.log('Data:', JSON.stringify(sanitizedData, null, 2));
      console.log('========================');
      
      const response = await adminApi.post(API_ENDPOINTS.BLOGS_ADMIN, sanitizedData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setResult({
        success: true,
        data: response.data,
        status: response.status
      });
    } catch (err) {
      console.error('Test error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testMinimalBlog = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Test with only required fields based on database schema
    const minimalData = generateValidTestData();

    try {
      console.log('=== MINIMAL API TEST ===');
      console.log('Testing with minimal required fields only');
      console.log('Data:', JSON.stringify(minimalData, null, 2));
      
      const response = await adminApi.post(API_ENDPOINTS.BLOGS_ADMIN, minimalData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setResult({
        success: true,
        data: response.data,
        status: response.status,
        operation: 'minimal-create'
      });
    } catch (err) {
      console.error('Minimal test error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        operation: 'minimal-create'
      });
    } finally {
      setLoading(false);
    }
  };

  const testBlogFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await adminApi.get(API_ENDPOINTS.BLOGS_ADMIN);
      setResult({
        success: true,
        data: response.data,
        status: response.status,
        operation: 'fetch'
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        operation: 'fetch'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">🧪 Blog API Tester</h5>
      </Card.Header>
      <Card.Body>
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Button 
            variant="primary" 
            onClick={testBlogCreation} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Full Blog'}
          </Button>
          <Button 
            variant="warning" 
            onClick={testMinimalBlog} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Minimal Blog'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={testBlogFetch} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Fetch'}
          </Button>
        </div>

        {error && (
          <Alert variant="danger">
            <h6>❌ Error Details:</h6>
            <p><strong>Message:</strong> {error.message}</p>
            {error.status && <p><strong>Status:</strong> {error.status}</p>}
            {error.data && (
              <div>
                <strong>Response Data:</strong>
                <pre className="mt-2 p-2 bg-light rounded">
                  {JSON.stringify(error.data, null, 2)}
                </pre>
              </div>
            )}
            {error.config && (
              <div>
                <strong>Request Details:</strong>
                <pre className="mt-2 p-2 bg-light rounded">
                  URL: {error.config.url}
                  Method: {error.config.method}
                  Data: {error.config.data}
                </pre>
              </div>
            )}
          </Alert>
        )}

        {result && (
          <Alert variant="success">
            <h6>✅ Success!</h6>
            <p><strong>Status:</strong> <Badge bg="success">{result.status}</Badge></p>
            <p><strong>Operation:</strong> {result.operation || 'create'}</p>
            <div>
              <strong>Response Data:</strong>
              <pre className="mt-2 p-2 bg-light rounded">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </Alert>
        )}

        <div className="mt-3">
          <small className="text-muted">
            This tester helps debug JSON serialization issues between frontend and backend.
            Check the browser console for detailed type information.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AdminBlogTester;