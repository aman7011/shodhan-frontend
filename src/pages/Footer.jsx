import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => (
  <footer className="footer-section">
    <div className="container text-center py-4">
      <div className="footer-brand mb-2">Shodhan Ayurveda</div>
      {/* <div className="footer-links mb-2">
        <NavLink to="/clinics">Clinics</NavLink> |
        <NavLink to="/diseases">Diseases</NavLink> |
        <NavLink to="/services">Services</NavLink> |
        <NavLink to="/blogs">Blogs</NavLink> |
        <NavLink to="/shop">Shop</NavLink>
      </div> */}
      <div className="footer-contact mb-2">
        <span>Email: shodhanayurved@gmail.com</span> | <span>Phone: +91-9868464765</span>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Shodhan Ayurved. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
