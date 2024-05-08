import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row footer " style={{textAlign:'left'}}>
          <div className="col-lg-8 mb-4 mb-lg-0 mt-5">
            <h3>About Us</h3>
            <p >We are dedicated to providing high-quality products and excellent customer service.</p>
          </div>
          <div className="col-lg-4 mt-5">
            <h3>Contact Us</h3>
            <ul className="list-unstyled">
              <li>Email: &nbsp; <a href="mailto:info@example.com">shophub@example.com</a></li>
              <li>Phone: &nbsp;  <a href="tel:123-456-7890">123-456-7890</a></li>
            </ul>
            <div className="social-icons">
              <a href="https://www.facebook.com"><FaFacebook size={24} className="social-icon mr-3 me-3" /></a>
              <a href="https://www.instagram.com"><FaInstagram size={24} className="social-icon mr-3 mx-3" /></a>
              <a href="https://www.twitter.com"><FaTwitter size={24} className="social-icon mr-3 mx-3" /></a>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <p>&copy; {new Date().getFullYear()} ShopHub. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
