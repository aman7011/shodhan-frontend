import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css"; // your custom styles
import "./styles/mobile-responsive.css"; // mobile responsiveness

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
