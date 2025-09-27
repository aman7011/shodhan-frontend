import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "../styles/navbar.css";

// Component to handle category diseases
const CategoryDiseasesList = ({ categoryId, categoryName, isHovered, onDiseaseClick }) => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHovered && diseases.length === 0) {
      setLoading(true);
      axios
        .get(API_ENDPOINTS.DISEASES_BY_CATEGORY(categoryName))
        .then((res) => {
          setDiseases(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isHovered, categoryName, diseases.length]);

  if (!isHovered) return null;

  return (
    <div className="category-diseases">
      {loading ? (
        <div className="dropdown-item-text">Loading...</div>
      ) : (
        diseases.map((disease) => (
          <NavDropdown.Item
            as={NavLink}
            to={`/diseases/${disease.id}`}
            key={disease.id}
            onClick={onDiseaseClick}
            className="disease-link"
          >
            {disease.name}
          </NavDropdown.Item>
        ))
      )}
    </div>
  );
};

const NavbarMain = () => {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const closeNavbar = () => setExpanded(false);

  useEffect(() => {
    // Fetch categories
    axios
      .get(API_ENDPOINTS.CATEGORIES)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    // Fetch services
    axios
      .get(API_ENDPOINTS.SERVICES)
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchCategoryDiseases = async (categoryId) => {
    try {
      const res = await axios.get(API_ENDPOINTS.CATEGORY_BY_ID(categoryId));
      return res.data.diseases || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" expanded={expanded}>
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          onClick={closeNavbar}
          className="navbar-brand-custom"
        >
          Shodhan Ayurved
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Home */}
            <Nav.Link
              as={NavLink}
              to="/"
              onClick={closeNavbar}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </Nav.Link>

            {/* Clinics */}
            <Nav.Link
              as={NavLink}
              to="/clinics"
              onClick={closeNavbar}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Clinics
            </Nav.Link>

            {/* Diseases dropdown with categories */}
            <NavDropdown title="Diseases" id="diseases-dropdown" className="diseases-mega-dropdown">
              <div className="mega-dropdown-content">
                <div className="container">
                  <div className="row">
                    {categories.map((category) => (
                      <div key={category.id} className="col-md-3">
                        <div 
                          className="category-section"
                          onMouseEnter={() => setHoveredCategory(category.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <h6 className="dropdown-header">{category.name}</h6>
                          <CategoryDiseasesList 
                            categoryId={category.id}
                            categoryName={category.name}
                            isHovered={hoveredCategory === category.id}
                            onDiseaseClick={closeNavbar}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </NavDropdown>

            {/* Services dropdown */}
            <NavDropdown title="Services" id="services-dropdown">
              {services.map((service) => (
                <NavDropdown.Item
                  as={NavLink}
                  to={`/services/${service.id}`}
                  key={service.id}
                  onClick={closeNavbar}
                >
                  {service.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* Other links */}
            {["blogs"].map((path) => (
              <Nav.Link
                as={NavLink}
                key={path}
                to={`/${path}`}
                onClick={closeNavbar}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMain;
