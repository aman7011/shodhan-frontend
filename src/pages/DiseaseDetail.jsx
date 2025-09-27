// src/pages/DiseaseDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Card,
  Accordion,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { API_ENDPOINTS } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/disease.css"; // custom styles

function DiseaseDetail() {
  const { id } = useParams();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Reset states when ID changes
    setLoading(true);
    setError(null);
    setDisease(null);
    
    axios
      .get(API_ENDPOINTS.DISEASE_BY_ID(id))
      .then((res) => {
        setDisease(res.data);
        setLoading(false);
        setActiveTab("overview"); // Reset tab when disease changes
      })
      .catch((err) => {
        console.error(err);
        let errorMessage = "Failed to load disease details.";
        
        if (err.response?.status === 404) {
          errorMessage = `Disease with ID "${id}" was not found. It may have been removed or the ID is incorrect.`;
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error occurred. Please try again later.";
        } else if (err.code === 'NETWORK_ERROR' || !err.response) {
          errorMessage = "Unable to connect to the server. Please check your internet connection.";
        }
        
        setError(errorMessage);
        setLoading(false);
        setActiveTab("overview"); // Also reset on error
      });
  }, [id]);

  // Add ayurvedic background to body
  useEffect(() => {
    document.body.classList.add("ayurvedic-bg");
    return () => {
      document.body.classList.remove("ayurvedic-bg");
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading disease details..." />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Alert variant="danger" className="p-4">
            <h5 className="mb-3">
              {error.includes('not found') ? '🔍 Disease Not Found' : '⚠️ Error Loading Disease'}
            </h5>
            <p className="mb-4">{error}</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-success"
                onClick={() => window.history.back()}
              >
                ← Go Back
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => window.location.href = '/diseases'}
              >
                Browse All Diseases
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="disease-card">
            {/* Ayurvedic banner image */}
            {disease.imageUrl && (
              <div className="disease-image-wrapper">
                <Card.Img
                  variant="top"
                  src={disease.imageUrl}
                  alt={disease.name}
                  className="disease-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <Card.Body>
              <h2 className="disease-title text-center">{disease.name}</h2>
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                id="disease-tabs"
                className="custom-tabs mb-3 justify-content-center"
                variant="pills"
              >
                <Tab eventKey="overview" title="Overview">
                  <ReactMarkdown>{disease.description}</ReactMarkdown>
                </Tab>
                <Tab eventKey="symptoms" title="Symptoms">
                  <ReactMarkdown>
                    {disease.symptoms || "Symptoms data not available."}
                  </ReactMarkdown>
                </Tab>
                <Tab eventKey="treatment" title="Treatment">
                  <ReactMarkdown>
                    {disease.treatment || "Treatment details coming soon."}
                  </ReactMarkdown>
                </Tab>
                <Tab eventKey="causes" title="Causes">
                  <ReactMarkdown>
                    {disease.causes || "Causes data not available."}
                  </ReactMarkdown>
                </Tab>
                <Tab eventKey="faq" title="FAQs">
                  {disease.faqs && typeof disease.faqs === 'string' ? (
                    <div className="faqs-section">
                      <div className="faq-header mb-4">
                        <h5 className="text-success mb-2">
                          <i className="fas fa-question-circle me-2"></i>
                          Frequently Asked Questions
                        </h5>
                        <p className="text-muted small mb-0">
                          Click on any question below to view the detailed answer
                        </p>
                      </div>
                      <Accordion className="faq-accordion" flush>
                        {disease.faqs.split(/Q\d+:/).filter(item => item.trim()).map((faqPair, index) => {
                          const parts = faqPair.split(/A:/);
                          if (parts.length >= 2) {
                            const question = parts[0].trim();
                            const answer = parts.slice(1).join('A:').trim();
                            return (
                              <Accordion.Item 
                                eventKey={index.toString()} 
                                key={index}
                                className="faq-accordion-item"
                              >
                                <Accordion.Header className="faq-question-header">
                                  <div className="faq-question-wrapper">
                                    <span className="faq-question-number">Q{index + 1}</span>
                                    <span className="faq-question-text">{question}</span>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body className="faq-answer-body">
                                  <div className="faq-answer-content">
                                    <p>{answer}</p>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            );
                          }
                          return null;
                        }).filter(Boolean)}
                      </Accordion>
                    </div>
                  ) : disease.faqs && Array.isArray(disease.faqs) && disease.faqs.length > 0 ? (
                    <div className="faqs-section">
                      <div className="faq-header mb-4">
                        <h5 className="text-success mb-2">
                          <i className="fas fa-question-circle me-2"></i>
                          Frequently Asked Questions
                        </h5>
                        <p className="text-muted small mb-0">
                          Click on any question below to view the detailed answer
                        </p>
                      </div>
                      <Accordion className="faq-accordion" flush>
                        {disease.faqs.map((faq, index) => (
                          <Accordion.Item 
                            eventKey={index.toString()} 
                            key={index}
                            className="faq-accordion-item"
                          >
                            <Accordion.Header className="faq-question-header">
                              <div className="faq-question-wrapper">
                                <span className="faq-question-number">Q{index + 1}</span>
                                <span className="faq-question-text">{faq.question || 'Question not available'}</span>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="faq-answer-body">
                              <div className="faq-answer-content">
                                <ReactMarkdown>
                                  {faq.answer || 'Answer not available'}
                                </ReactMarkdown>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                  ) : disease.faq ? (
                    <ReactMarkdown>
                      {disease.faq}
                    </ReactMarkdown>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <p>No frequently asked questions available for this condition yet.</p>
                      <small>Check back later or contact us for specific questions.</small>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DiseaseDetail;
