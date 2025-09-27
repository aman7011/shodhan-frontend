import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.BLOGS_PUBLIC);
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.BLOGS_FEATURED);
      setFeaturedBlogs(response.data);
    } catch (err) {
      console.error("Error fetching featured blogs:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(API_ENDPOINTS.BLOGS_SEARCH(searchKeyword));
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error searching blogs:", err);
      setError("Failed to search blogs. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
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

  const handleAuthorClick = (author, e) => {
    e.stopPropagation();
    navigate(`/blogs/author/${encodeURIComponent(author)}`);
  };

  if (loading) return <LoadingSpinner message="Loading blogs..." />;

  const displayBlogs = searchResults.length > 0 ? searchResults : blogs;

  return (
    <div className="blogs-bg">
      <Container className="my-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-success fw-bold mb-3">🌿 Ayurvedic Wisdom</h1>
          <p className="lead text-muted">
            Discover ancient healing wisdom through our collection of Ayurvedic articles
          </p>
        </div>

        {/* Search Section */}
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search blogs by keyword..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button variant="success" type="submit" disabled={searching}>
                  {searching ? <Spinner size="sm" /> : "🔍 Search"}
                </Button>
                {searchKeyword && (
                  <Button variant="outline-secondary" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Form>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Search Results Info */}
        {searchResults.length > 0 && (
          <Alert variant="info" className="mb-4">
            Found {searchResults.length} blog(s) matching "{searchKeyword}"
          </Alert>
        )}

        {/* Featured Blogs Section */}
        {featuredBlogs.length > 0 && searchResults.length === 0 && (
          <div className="mb-5">
            <h2 className="text-success mb-4">⭐ Featured Articles</h2>
            <Row>
              {featuredBlogs.slice(0, 3).map((blog) => (
                <Col md={4} key={blog.id} className="mb-4">
                  <Card 
                    className="h-100 blog-card featured-blog shadow-sm border-0"
                    onClick={() => handleBlogClick(blog.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg="warning" text="dark">⭐ Featured</Badge>
                        <small className="text-muted">{formatDate(blog.createdAt)}</small>
                      </div>
                      <Card.Title className="text-success h5">{blog.title}</Card.Title>
                      <Card.Text className="text-muted mb-3">
                        {blog.summary || truncateContent(blog.content)}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="link"
                          className="p-0 text-success"
                          onClick={(e) => handleAuthorClick(blog.author, e)}
                        >
                          👩‍⚕️ {blog.author}
                        </Button>
                        <small className="text-success">Read More →</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* All Blogs Section */}
        <div className="mb-5">
          <h2 className="text-success mb-4">
            {searchResults.length > 0 ? "Search Results" : "📚 All Articles"}
          </h2>
          
          {displayBlogs.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">
                {searchKeyword ? "No blogs found matching your search" : "No blogs available"}
              </h4>
              {searchKeyword && (
                <Button variant="success" onClick={clearSearch} className="mt-3">
                  View All Blogs
                </Button>
              )}
            </div>
          ) : (
            <Row>
              {displayBlogs.map((blog) => (
                <Col md={6} lg={4} key={blog.id} className="mb-4">
                  <Card 
                    className="h-100 blog-card shadow-sm border-0"
                    onClick={() => handleBlogClick(blog.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        {blog.featured && <Badge bg="warning" text="dark">⭐ Featured</Badge>}
                        <small className="text-muted">{formatDate(blog.createdAt)}</small>
                      </div>
                      <Card.Title className="text-success h6">{blog.title}</Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        {blog.summary || truncateContent(blog.content, 100)}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="link"
                          className="p-0 text-success small"
                          onClick={(e) => handleAuthorClick(blog.author, e)}
                        >
                          👩‍⚕️ {blog.author}
                        </Button>
                        <small className="text-success">Read More →</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Blogs;