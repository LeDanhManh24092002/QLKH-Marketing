import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-white text-center py-3" style={{ backgroundColor: '#006666' }}>
      <div className="container">
        <p className="mb-0">© 2025 NEXLIFY. All rights reserved.</p>
        {/* <div className="mt-2">
          <Link to="/about" className="text-white mx-2">About</Link>
          <Link to="/contact" className="text-white mx-2">Contact</Link>
          <Link to="/terms" className="text-white mx-2">Terms</Link>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;