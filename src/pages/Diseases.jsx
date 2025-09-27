import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, InputGroup } from "react-bootstrap";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/diseases.css"; 

function Diseases() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesWithDiseases = async () => {
      try {
        // Get all diseases and group them by category
        const allDiseasesRes = await axios.get(API_ENDPOINTS.DISEASES);
        
        if (allDiseasesRes.data && Array.isArray(allDiseasesRes.data) && allDiseasesRes.data.length > 0) {
          // Group diseases by category
          const groupedByCategory = allDiseasesRes.data.reduce((acc, disease) => {
            const categoryName = disease.category?.name || "Uncategorized";
            const categoryId = disease.category?.id || 0;
            
            if (!acc[categoryName]) {
              acc[categoryName] = {
                id: categoryId,
                name: categoryName,
                category: categoryName,
                diseases: []
              };
            }
            
            acc[categoryName].diseases.push(disease);
            return acc;
          }, {});
          
          const categoriesWithDiseases = Object.values(groupedByCategory);
          setCategories(categoriesWithDiseases);
          setFilteredCategories(categoriesWithDiseases);
          setLoading(false);
          return;
        }

        // Fallback: get categories first, then diseases for each
        const categoriesRes = await axios.get(API_ENDPOINTS.CATEGORIES);
        const categoriesData = categoriesRes.data;

        if (!categoriesData || !Array.isArray(categoriesData)) {
          console.error("Invalid categories data:", categoriesData);
          setCategories([]);
          return;
        }

        // Then fetch diseases for each category
        const categoriesWithDiseases = await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const diseasesRes = await axios.get(API_ENDPOINTS.DISEASES_BY_CATEGORY(category.name));
              return {
                ...category,
                diseases: diseasesRes.data || []
              };
            } catch (err) {
              console.error(`Error fetching diseases for category ${category.id}:`, err);
              return {
                ...category,
                diseases: []
              };
            }
          })
        );

        setCategories(categoriesWithDiseases);
        setFilteredCategories(categoriesWithDiseases);
      } catch (err) {
        console.error("Error fetching categories:", err);
        
        if (err.response) {
          // Server responded with an error status
          if (err.response.status >= 500) {
            setError('Server error occurred. Please try again later or contact support if the problem persists.');
          } else {
            setError(`Unable to load diseases. Error: ${err.response.status}`);
          }
        } else if (err.request) {
          // Network error - no response received
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          // Something else happened
          setError('An unexpected error occurred while loading diseases.');
        }
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithDiseases();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.map(category => ({
      ...category,
      diseases: category.diseases.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.diseases.length > 0);

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTotalDiseases = () => {
    return categories.reduce((total, category) => total + category.diseases.length, 0);
  };

  return (
    <div className="app-bg">
      {/* Hero Section */}
      <div className="diseases-hero">
        <Container className="text-center">
          <h2>🌿 Diseases We Treat</h2>
          <p>
            Discover comprehensive Ayurvedic treatments for a wide range of health conditions. 
            Our time-tested therapies address root causes for lasting wellness.
          </p>
          
          {/* Search Bar */}
          <div className="diseases-search">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search for diseases or conditions..."
                value={searchTerm}
                onChange={handleSearch}
                className="border-0"
              />
              <InputGroup.Text className="bg-transparent border-0">
                🔍
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Container>
      </div>

      <div className="diseases-container">
        {loading ? (
          <LoadingSpinner message="Loading diseases and categories..." />
        ) : error ? (
            <div className="alert alert-danger text-center p-4">
              <h5 className="mb-3">⚠️ Unable to Load Diseases</h5>
              <p className="mb-4">{error}</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button 
                  className="btn btn-success"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => window.location.href = '/'}
                >
                  Go to Home
                </button>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center">
              <p>No disease categories found. Please check if the server is running.</p>
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="diseases-stats">
                <h4>🏥 Treatment Statistics</h4>
                <p>Comprehensive Ayurvedic care across multiple specialties</p>
                <div className="stats-grid">
                  <div className="stat-item" style={{ '--stat-index': 0 }}>
                    <div className="stat-number">{categories.length}</div>
                    <div className="stat-label">Categories</div>
                  </div>
                  <div className="stat-item" style={{ '--stat-index': 1 }}>
                    <div className="stat-number">{getTotalDiseases()}</div>
                    <div className="stat-label">Conditions</div>
                  </div>
                  <div className="stat-item" style={{ '--stat-index': 2 }}>
                    <div className="stat-number">5+</div>
                    <div className="stat-label">Years Experience</div>
                  </div>
                  <div className="stat-item" style={{ '--stat-index': 3 }}>
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Patients Treated</div>
                  </div>
                </div>
              </div>

              {/* Search Results Info */}
              {searchTerm && (
                <div className="text-center mb-4">
                  <p className="text-muted">
                    {filteredCategories.length === 0 
                      ? `No results found for "${searchTerm}"` 
                      : `Found ${filteredCategories.reduce((total, cat) => total + cat.diseases.length, 0)} conditions matching "${searchTerm}"`
                    }
                  </p>
                </div>
              )}

              <div className="diseases-accordion accordion" id="diseasesAccordion">
                {filteredCategories.map((group, idx) => (
              <div 
                className="accordion-item" 
                key={idx}
                style={{ '--index': idx }}
              >
                <h2 className="accordion-header" id={`heading-${idx}`}>
                  <button
                    className={`accordion-button ${
                      expandedCategory === group.name ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleCategory(group.name)}
                  >
                    {group.name}
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${
                    expandedCategory === group.name ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    <ul className="disease-list">
                      {(group.diseases || []).map((d, diseaseIdx) => (
                        <li 
                          key={d.id} 
                          className="disease-item"
                          onClick={() => navigate(`/diseases/${d.id}`)}
                          role="button"
                          tabIndex={0}
                          style={{ '--disease-index': diseaseIdx }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              navigate(`/diseases/${d.id}`);
                            }
                          }}
                        >
                          {d.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default Diseases;
