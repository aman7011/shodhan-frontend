import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Badge } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/blogs.css";

function BlogsByAuthor() {
  const { author } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogsByAuthor();
  }, [author]);

  const fetchBlogsByAuthor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_ENDPOINTS.BLOGS_BY_AUTHOR(author));
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching blogs by author:", err);
      if (err.response?.status === 404) {
        setError(`No blogs found by author "${author}".`);
      } else if (err.response?.status >= 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('An unexpected error occurred while loading blogs.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "";
    
    // Clean up the content by removing \r\n and extra spaces
    const cleanContent = content
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanContent.length <= maxLength) return cleanContent;
    
    // Find the last complete word within the limit
    const truncated = cleanContent.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return (lastSpace > 0 ? truncated.substr(0, lastSpace) : truncated) + "...";
  };

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  const handleBackToBlogs = () => {
    navigate('/blogs');
  };

  if (loading) return <LoadingSpinner message={`Loading blogs by ${author}...`} />;

  return (
    <div className="blogs-bg">
      <Container className="my-5">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline-success" onClick={handleBackToBlogs}>
            ← Back to All Blogs
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 text-success fw-bold mb-3">
            👩‍⚕️ Articles by {decodeURIComponent(author)}
          </h1>
          {blogs.length > 0 && (
            <p className="lead text-muted">
              {blogs.length} article{blogs.length !== 1 ? 's' : ''} published
            </p>
          )}
        </div>

        {error && (
          <Alert variant="warning" className="mb-4 text-center">
            <h5 className="mb-3">📚 No Articles Found</h5>
            <p className="mb-4">{error}</p>
            <Button variant="success" onClick={handleBackToBlogs}>
              Browse All Blogs
            </Button>
          </Alert>
        )}

        {/* Blogs Grid */}
        {blogs.length > 0 && (
          <Row>
            {blogs.map((blog) => (
              <Col md={6} lg={4} key={blog.id} className="mb-4">
                <Card 
                  className="h-100 blog-card shadow-sm border-0"
                  onClick={() => handleBlogClick(blog.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      {blog.featured && (
                        <Badge bg="warning" text="dark">⭐ Featured</Badge>
                      )}
                      <small className="text-muted">{formatDate(blog.createdAt)}</small>
                    </div>
                    
                    <Card.Title className="text-success h6 mb-3">
                      {blog.title}
                    </Card.Title>
                    
                    <Card.Text className="text-muted small mb-3">
                      {blog.summary || truncateContent(blog.content, 120)}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success small fw-bold">
                        👩‍⚕️ {blog.author}
                      </span>
                      <small className="text-success">Read More →</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-5">
            <h4 className="text-muted mb-4">
              No articles found by {decodeURIComponent(author)}
            </h4>
            <Button variant="success" onClick={handleBackToBlogs}>
              Browse All Blogs
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default BlogsByAuthor;