'use client'

import React from 'react';

const FooterBanner = () => {
  return (
    <section className="footer-banner py-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-content text-center">
              <h3>Looking for similar properties?</h3>
              <p>We have more properties that might interest you</p>
              <button className="btn btn-primary mt-2">View More Properties</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterBanner;
