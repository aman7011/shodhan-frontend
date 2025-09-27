import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/blogs.css";

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_ENDPOINTS.BLOG_BY_SLUG(slug));
      setBlog(response.data);
      
      // Fetch related blogs by same author
      if (response.data.author) {
        fetchRelatedBlogs(response.data.author, response.data.id);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      if (err.response?.status === 404) {
        setError(`Blog post "${slug}" was not found. Please check the URL or browse our available articles.`);
      } else if (err.response?.status >= 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('An unexpected error occurred while loading the blog post.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (author, currentBlogId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.BLOGS_BY_AUTHOR(author));
      // Filter out current blog and limit to 3 related blogs
      const filtered = response.data.filter(b => b.id !== currentBlogId).slice(0, 3);
      setRelatedBlogs(filtered);
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAuthorClick = (author) => {
    navigate(`/blogs/author/${encodeURIComponent(author)}`);
  };

  const handleRelatedBlogClick = (blogSlug) => {
    navigate(`/blogs/${blogSlug}`);
  };

  const handleBackToBlogs = () => {
    navigate('/blogs');
  };

  // Function to preprocess blog content for better formatting
  const preprocessBlogContent = (content) => {
    if (!content) return "";
    
    return content
      // Convert \r\n to proper line breaks
      .replace(/\r\n/g, '\n')
      // Convert multiple line breaks to paragraph breaks
      .replace(/\n\n+/g, '\n\n')
      // Add proper heading formatting
      .replace(/^([A-Z][^\n]*:)$/gm, '## $1')
      .replace(/^([A-Z][A-Za-z\s]+)$/gm, (match, p1) => {
        // Only convert to heading if it's a standalone line and looks like a heading
        if (p1.length > 5 && p1.length < 60 && !p1.includes('.') && !p1.includes(',')) {
          return `### ${p1}`;
        }
        return match;
      })
      // Format numbered lists
      .replace(/^(\d+\.)\s+(.+)$/gm, '**$1** $2')
      // Format bullet points that start with dash
      .replace(/^-\s+(.+)$/gm, '• $1')
      // Ensure proper spacing around sections
      .replace(/\n(#{1,3}\s+)/g, '\n\n$1')
      .replace(/(#{1,3}\s+[^\n]+)\n/g, '$1\n\n')
      // Clean up extra whitespace
      .trim();
  };

  if (loading) return <LoadingSpinner message="Loading blog post..." />;

  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Alert variant="danger" className="p-4">
            <h5 className="mb-3">
              {error.includes('not found') ? '🔍 Blog Post Not Found' : '⚠️ Error Loading Blog'}
            </h5>
            <p className="mb-4">{error}</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button variant="success" onClick={() => navigate(-1)}>
                ← Go Back
              </Button>
              <Button variant="outline-success" onClick={handleBackToBlogs}>
                Browse All Blogs
              </Button>
              <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="text-center">
          Blog post not found.
        </Alert>
      </Container>
    );
  }

  return (
    <div className="blog-detail-bg">
      <Container className="my-5">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline-success" onClick={handleBackToBlogs}>
            ← Back to All Blogs
          </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Main Blog Card */}
            <Card className="blog-detail-card shadow-lg rounded-4 border-0 mb-5">
              {/* Blog Image */}
              {blog.imageUrl && (
                <div className="blog-image-container">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="blog-detail-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <Card.Body className="p-4 p-md-5">
                {/* Blog Header */}
                <div className="blog-header mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    {blog.featured && (
                      <Badge bg="warning" text="dark" className="mb-2">
                        ⭐ Featured Article
                      </Badge>
                    )}
                    <small className="text-muted">
                      📅 {formatDate(blog.createdAt)}
                    </small>
                  </div>
                  
                  <h1 className="blog-title text-success fw-bold mb-3">
                    {blog.title}
                  </h1>
                  
                  <div className="blog-meta d-flex align-items-center mb-4">
                    <Button
                      variant="link"
                      className="p-0 text-success fw-bold"
                      onClick={() => handleAuthorClick(blog.author)}
                    >
                      👩‍⚕️ By {blog.author}
                    </Button>
                    {blog.updatedAt !== blog.createdAt && (
                      <small className="text-muted ms-3">
                        Updated: {formatDate(blog.updatedAt)}
                      </small>
                    )}
                  </div>

                  {/* Blog Summary */}
                  {blog.summary && (
                    <div className="blog-summary p-3 bg-light rounded mb-4">
                      <h6 className="text-success mb-2">📝 Summary</h6>
                      <p className="mb-0 text-muted">
                        {blog.summary.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="blog-content">
                  <ReactMarkdown 
                    components={{
                      // Custom component renderers for better formatting
                      p: ({children}) => <p className="blog-paragraph mb-3">{children}</p>,
                      h1: ({children}) => <h2 className="blog-heading text-success mt-4 mb-3">{children}</h2>,
                      h2: ({children}) => <h3 className="blog-subheading text-success mt-4 mb-3">{children}</h3>,
                      h3: ({children}) => <h4 className="blog-subheading text-success mt-3 mb-2">{children}</h4>,
                      h4: ({children}) => <h5 className="blog-minor-heading text-success mt-2 mb-2">{children}</h5>,
                      ul: ({children}) => <ul className="blog-list mb-3">{children}</ul>,
                      ol: ({children}) => <ol className="blog-ordered-list mb-3">{children}</ol>,
                      li: ({children}) => <li className="blog-list-item mb-1">{children}</li>,
                      strong: ({children}) => <strong className="blog-bold text-success">{children}</strong>,
                      em: ({children}) => <em className="blog-italic">{children}</em>,
                      blockquote: ({children}) => (
                        <blockquote className="blog-quote border-start border-success border-3 ps-3 py-2 bg-light rounded mb-3">
                          {children}
                        </blockquote>
                      ),
                      code: ({children}) => (
                        <code className="blog-code bg-light px-2 py-1 rounded">{children}</code>
                      )
                    }}
                  >
                    {preprocessBlogContent(blog.content)}
                  </ReactMarkdown>
                </div>

                {/* Blog Footer */}
                <div className="blog-footer border-top pt-4 mt-5">
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="success"
                      onClick={() => handleAuthorClick(blog.author)}
                    >
                      📚 More by {blog.author}
                    </Button>
                    <div className="text-muted">
                      <small>Published on {formatDate(blog.createdAt)}</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="related-blogs-section">
                <h3 className="text-success mb-4">📖 More Articles by {blog.author}</h3>
                <Row>
                  {relatedBlogs.map((relatedBlog) => (
                    <Col md={4} key={relatedBlog.id} className="mb-4">
                      <Card 
                        className="h-100 related-blog-card shadow-sm border-0"
                        onClick={() => handleRelatedBlogClick(relatedBlog.slug)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body>
                          {relatedBlog.featured && (
                            <Badge bg="warning" text="dark" className="mb-2">
                              ⭐ Featured
                            </Badge>
                          )}
                          <Card.Title className="text-success h6">
                            {relatedBlog.title}
                          </Card.Title>
                          <Card.Text className="text-muted small">
                            {relatedBlog.summary || relatedBlog.content.substring(0, 100) + "..."}
                          </Card.Text>
                          <small className="text-success">Read Article →</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default BlogDetail;