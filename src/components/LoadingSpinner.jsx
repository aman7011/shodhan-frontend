import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;