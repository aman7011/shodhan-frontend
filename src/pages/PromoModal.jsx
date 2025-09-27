import { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CallConsultationModal from "./CallConsultationModal";

const PromoModal = ({ show, onHide }) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const navigate = useNavigate();

  const handlePanchakarmaClick = () => {
    onHide();
    // Navigate to Panchakarma service (assuming it has ID 1, adjust as needed)
    navigate("/services/1");
  };

  const handleCallConsultationClick = () => {
    onHide();
    setShowCallModal(true);
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={onHide} 
        size="lg" 
        centered
        backdrop="static"
        className="promo-modal"
      >
        <Modal.Header closeButton className="promo-modal-header">
          <Modal.Title className="promo-modal-title">
            🌿 Welcome to Shodhan Ayurveda! ✨
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="promo-modal-body">
          <div className="promo-intro text-center mb-4">
            <h5 className="text-success mb-3">
              Start Your Healing Journey Today
            </h5>
            <p className="text-muted">
              Experience authentic Ayurvedic healing with our expert practitioners. 
              Choose your preferred way to connect with us:
            </p>
          </div>

          <Row className="g-4">
            {/* Call Consultation Option */}
            <Col md={6}>
              <Card className="promo-card h-100 border-success">
                <Card.Body className="text-center">
                  <div className="promo-icon mb-3">
                    📞
                  </div>
                  <Card.Title className="text-success mb-3">
                    Call Consultation
                  </Card.Title>
                  <Card.Text className="mb-4">
                    Get instant expert advice from our Ayurvedic doctors. 
                    Discuss your health concerns from the comfort of your home.
                  </Card.Text>
                  <div className="promo-features mb-4">
                    <small className="text-success">✅ Immediate consultation</small><br />
                    <small className="text-success">✅ Expert diagnosis</small><br />
                    <small className="text-success">✅ Personalized treatment</small>
                  </div>
                  <Button 
                    variant="success" 
                    className="w-100 promo-btn"
                    onClick={handleCallConsultationClick}
                  >
                    Request a Call Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Panchakarma Option */}
            <Col md={6}>
              <Card className="promo-card h-100 border-warning">
                <Card.Body className="text-center">
                  <div className="promo-icon mb-3">
                    🧘‍♀️
                  </div>
                  <Card.Title className="text-warning mb-3">
                    Panchakarma Therapy
                  </Card.Title>
                  <Card.Text className="mb-4">
                    Experience the ultimate Ayurvedic detoxification and 
                    rejuvenation therapy. Complete body-mind transformation.
                  </Card.Text>
                  <div className="promo-features mb-4">
                    <small className="text-warning">✅ Complete detoxification</small><br />
                    <small className="text-warning">✅ Stress relief & rejuvenation</small><br />
                    <small className="text-warning">✅ Enhanced immunity</small>
                  </div>
                  <Button 
                    variant="warning" 
                    className="w-100 promo-btn"
                    onClick={handlePanchakarmaClick}
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="promo-footer text-center mt-4">
            <small className="text-muted">
              🌿 Trusted by thousands • Authentic Ayurveda • Expert practitioners
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="promo-modal-footer">
          <Button variant="outline-secondary" onClick={onHide}>
            Continue Browsing
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Call Consultation Modal */}
      <CallConsultationModal 
        show={showCallModal} 
        handleClose={() => setShowCallModal(false)} 
        service={{ name: "Call Consultation" }}
      />
    </>
  );
};

export default PromoModal;