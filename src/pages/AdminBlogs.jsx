import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from "react-bootstrap";
import adminApi from "../utils/adminAuth";
import { API_ENDPOINTS } from "../config/api";
import { sanitizeBlogs, prepareBlogForEdit, debugDataTypes, validateBlogLengths, getCharacterStatus } from "../utils/blogUtils";
import AdminBlogTester from "./AdminBlogTester";
import "../styles/admin.css";

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingBlog, setEditingBlog] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    author: '',
    imageUrl: '',
    tags: '',
    published: false,
    featured: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get(API_ENDPOINTS.BLOGS_ADMIN);
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching admin blogs:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to load blogs. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (mode, blog = null) => {
    setModalMode(mode);
    setEditingBlog(blog);
    
    if (mode === 'edit' && blog) {
      const preparedData = prepareBlogForEdit(blog);
      setFormData(preparedData);
      debugDataTypes(blog, 'Original blog data');
      debugDataTypes(preparedData, 'Prepared form data');
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '',
        summary: '',
        author: '',
        imageUrl: '',
        tags: '',
        published: false,
        featured: false
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      summary: '',
      author: '',
      imageUrl: '',
      tags: '',
      published: false,
      featured: false
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Auto-generate slug when title changes
    if (name === 'title' && newValue && modalMode === 'create') {
      generateSlug(newValue);
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateSlug = async (title) => {
    try {
      const response = await axios.get(API_ENDPOINTS.BLOG_GENERATE_SLUG(title));
      setFormData(prev => ({
        ...prev,
        slug: response.data.slug
      }));
    } catch (err) {
      console.error("Error generating slug:", err);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required field validation
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.slug.trim()) errors.slug = "Slug is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    if (!formData.author.trim()) errors.author = "Author is required";
    
    // Validate slug format
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Database field length validation
    const lengthValidation = validateBlogLengths(formData);
    if (!lengthValidation.isValid) {
      Object.assign(errors, lengthValidation.errors);
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const blogData = sanitizeBlogs(formData);
      
      debugDataTypes(formData, 'Form data before sanitization');
      debugDataTypes(blogData, 'Sanitized blog data');
      console.log('Sending blog data:', JSON.stringify(blogData, null, 2));

      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (modalMode === 'create') {
        await adminApi.post(API_ENDPOINTS.BLOGS_ADMIN, blogData, config);
        setSuccess("Blog created successfully!");
      } else {
        await adminApi.put(API_ENDPOINTS.BLOG_ADMIN_BY_ID(editingBlog.id), blogData, config);
        setSuccess("Blog updated successfully!");
      }

      await fetchBlogs();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving blog:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.data?.message) {
        setError(`Failed to save blog: ${err.response.data.message}`);
      } else if (err.response?.status === 400) {
        setError("Invalid data format. Please check your input and try again.");
      } else {
        setError("Failed to save blog. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.delete(API_ENDPOINTS.BLOG_ADMIN_BY_ID(blog.id));
      setSuccess("Blog deleted successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to delete blog. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Loading blogs...</p>
      </Container>
    );
  }

  return (
    <div className="admin-blogs-bg">
      <Container className="my-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-success">🔧 Blog Management</h1>
          <Button variant="success" onClick={() => handleShowModal('create')}>
            ➕ Add New Blog
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}

        {/* Debug Tester */}
        <AdminBlogTester />

        {/* Blogs Table */}
        <Card className="shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No blogs found. Create your first blog!
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td>
                          <div>
                            <strong>{blog.title}</strong>
                            {blog.featured && <Badge bg="warning" className="ms-2">⭐ Featured</Badge>}
                            <br />
                            <small className="text-muted">/{blog.slug}</small>
                          </div>
                        </td>
                        <td>{blog.author}</td>
                        <td>
                          <Badge bg={blog.published ? "success" : "secondary"}>
                            {blog.published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td>
                          <small>{formatDate(blog.createdAt)}</small>
                        </td>
                        <td>
                          <small>{formatDate(blog.updatedAt)}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleShowModal('edit', blog)}
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(blog)}
                            >
                              🗑️ Delete
                            </Button>
                            {blog.published && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                              >
                                👁️ View
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Blog Form Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? '➕ Create New Blog' : '✏️ Edit Blog'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.title}
                      placeholder="Enter blog title"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Author *</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.author}
                      placeholder="Author name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.author}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Slug *</Form.Label>
                <Form.Control
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.slug}
                  placeholder="blog-url-slug"
                />
                <Form.Text className="text-muted">
                  URL-friendly version of the title (auto-generated)
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {formErrors.slug}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the blog post"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.content}
                  placeholder="Write your blog content here... (Markdown supported)"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.content}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="ayurveda, health, treatment (comma-separated)"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    name="published"
                    label="📤 Published"
                    checked={formData.published}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    label="⭐ Featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="success" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  modalMode === 'create' ? '➕ Create Blog' : '💾 Update Blog'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminBlogs;