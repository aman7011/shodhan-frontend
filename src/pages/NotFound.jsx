import { Container, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();

  return (
    <Container className="mt-5">
      <div className="text-center">
        <Alert variant="warning" className="p-5">
          <h1 className="display-4 mb-4">🔍 404 - Page Not Found</h1>
          <h5 className="mb-3">The page you're looking for doesn't exist</h5>
          <p className="mb-4">
            The URL <code>{location.pathname}</code> could not be found on this server.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button 
              className="btn btn-success btn-lg"
              onClick={() => window.location.href = '/'}
            >
              🏠 Go to Home
            </button>
            <button 
              className="btn btn-outline-success btn-lg"
              onClick={() => window.history.back()}
            >
              ← Go Back
            </button>
          </div>
          
          <hr className="my-4" />
          
          <div className="row mt-4">
            <div className="col-md-4">
              <h6 className="text-success">🌿 Explore Treatments</h6>
              <button 
                className="btn btn-outline-success btn-sm"
                onClick={() => window.location.href = '/diseases'}
              >
                Browse Diseases
              </button>
            </div>
            <div className="col-md-4">
              <h6 className="text-success">🏥 Find Clinics</h6>
              <button 
                className="btn btn-outline-success btn-sm"
                onClick={() => window.location.href = '/clinics'}
              >
                View Clinics
              </button>
            </div>
            <div className="col-md-4">
              <h6 className="text-success">💬 Get Help</h6>
              <button 
                className="btn btn-outline-success btn-sm"
                onClick={() => window.location.href = '/'}
              >
                Contact Us
              </button>
            </div>
          </div>
        </Alert>
      </div>
    </Container>
  );
}

export default NotFound;