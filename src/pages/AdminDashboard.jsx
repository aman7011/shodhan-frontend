import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import AdminBlogs from "./AdminBlogs";
import AdminLogin from "./AdminLogin";
import ChangePasswordModal from "./ChangePasswordModal";
import { isAdminAuthenticated, getAdminUser, logoutAdmin } from "../utils/adminAuth";
import "../styles/admin.css";

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  const handlePasswordChanged = () => {
    // Optionally show a success message or force re-login
    console.log('Password changed successfully');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-dashboard-bg">
      <Container fluid>
        {/* Admin Header */}
        <Row>
          <Col>
            <Card className="admin-header mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="text-success mb-1">🌿 Shodhan Ayurveda Admin</h2>
                    <p className="text-muted mb-0">
                      Welcome back, <strong>{getAdminUser()?.username || 'Admin'}</strong>
                    </p>
                  </div>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      🔐 Change Password
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => window.open('/', '_blank')}
                    >
                      🌐 View Website
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Admin Navigation */}
        <Row>
          <Col md={3}>
            <Card className="admin-sidebar">
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'blogs'}
                      onClick={() => setActiveTab('blogs')}
                      className="admin-nav-link"
                    >
                      📚 Blog Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'stats'}
                      onClick={() => setActiveTab('stats')}
                      className="admin-nav-link"
                    >
                      📊 Statistics
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                      className="admin-nav-link"
                    >
                      ⚙️ Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={9}>
            {activeTab === 'blogs' && <AdminBlogs />}
            {activeTab === 'stats' && <AdminStats />}
            {activeTab === 'settings' && <AdminSettings onChangePassword={() => setShowPasswordModal(true)} />}
          </Col>
        </Row>
      </Container>

      {/* Password Change Modal */}
      <ChangePasswordModal 
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
}

// Placeholder components for other admin sections
function AdminStats() {
  return (
    <Card className="admin-card">
      <Card.Header>
        <h5 className="mb-0">📊 Blog Statistics</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <div className="stat-card text-center p-3">
              <h3 className="text-success">0</h3>
              <p className="text-muted">Total Blogs</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center p-3">
              <h3 className="text-warning">0</h3>
              <p className="text-muted">Published</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center p-3">
              <h3 className="text-info">0</h3>
              <p className="text-muted">Drafts</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card text-center p-3">
              <h3 className="text-danger">0</h3>
              <p className="text-muted">Featured</p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

function AdminSettings({ onChangePassword }) {
  return (
    <Card className="admin-card">
      <Card.Header>
        <h5 className="mb-0">⚙️ Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <h6 className="text-success mb-3">🔐 Security Settings</h6>
                <p className="text-muted mb-3">
                  Manage your admin account security settings.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={onChangePassword}
                  className="mb-2"
                >
                  🔄 Change Password
                </Button>
                <div>
                  <small className="text-muted">
                    Last login: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <h6 className="text-success mb-3">🌐 Website Settings</h6>
                <p className="text-muted mb-3">
                  Website configuration and preferences.
                </p>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-success" 
                    onClick={() => window.open('/', '_blank')}
                  >
                    🌐 View Live Website
                  </Button>
                  <Button 
                    variant="outline-info" 
                    onClick={() => window.open('/blogs', '_blank')}
                  >
                    📚 View Blog Section
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default AdminDashboard;