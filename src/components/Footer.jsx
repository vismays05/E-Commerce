import React from 'react';

const Footer = ({ onSelectCategory }) => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5 border-top border-success border-4">
      <div className="container-fluid px-4">
        <div className="row g-4 mb-4">
          {/* Brand Col */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="dmart-logo-badge fs-3">D<span className="text-warning">M</span></span>
              <span className="fs-3 fw-black text-white">DMart Ready</span>
            </div>
            <p className="text-secondary small mb-3">
              DMart Ready is your one-stop online supermarket for fresh groceries, household supplies, personal care essentials, and daily deals at unbeatable prices.
            </p>
            <div className="d-flex gap-3 fs-5 text-warning">
              <i className="bi bi-facebook cursor-pointer"></i>
              <i className="bi bi-twitter-x cursor-pointer"></i>
              <i className="bi bi-instagram cursor-pointer"></i>
              <i className="bi bi-youtube cursor-pointer"></i>
            </div>
          </div>

          {/* Categories Col */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-warning mb-3 text-uppercase">Top Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li className="cursor-pointer hover-white" onClick={() => onSelectCategory('groceries')}>Groceries & Staples</li>
              <li className="cursor-pointer hover-white" onClick={() => onSelectCategory('dairy')}>Dairy & Bakery</li>
              <li className="cursor-pointer hover-white" onClick={() => onSelectCategory('snacks')}>Packaged Foods</li>
              <li className="cursor-pointer hover-white" onClick={() => onSelectCategory('personal-care')}>Personal Care</li>
              <li className="cursor-pointer hover-white" onClick={() => onSelectCategory('household')}>Household Cleaners</li>
            </ul>
          </div>

          {/* Customer Service Col */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-warning mb-3 text-uppercase">Customer Care</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><i className="bi bi-geo-alt-fill text-success me-1"></i> Pick-up Point Locations</li>
              <li><i className="bi bi-question-circle-fill text-info me-1"></i> Frequently Asked Questions</li>
              <li><i className="bi bi-truck text-warning me-1"></i> Shipping & Delivery Policy</li>
              <li><i className="bi bi-arrow-counterclockwise text-danger me-1"></i> Easy Returns & Refunds</li>
              <li><i className="bi bi-telephone-fill text-success me-1"></i> Helpline: 022-4200 4200</li>
            </ul>
          </div>

          {/* Trust Badges Col */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-warning mb-3 text-uppercase">Why Shop At DMart?</h6>
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 p-2 rounded">
                <i className="bi bi-tag-fill text-warning fs-5"></i>
                <div>
                  <div className="fw-bold text-white">Daily Minimum 7% Off</div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Guaranteed lowest MRP discounts</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 p-2 rounded">
                <i className="bi bi-lightning-charge-fill text-warning fs-5"></i>
                <div>
                  <div className="fw-bold text-white">DMart Express Delivery</div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Speedy 2-hour doorstep delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small gap-3">
          <div>
            © 2026 Avenue Supermarts Ltd. (DMart). All Rights Reserved.
          </div>
          <div className="d-flex gap-3">
            <span className="badge bg-secondary">100% Secure Checkout</span>
            <span className="badge bg-secondary">UPI / Cards / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
