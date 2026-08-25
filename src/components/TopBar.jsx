import React from 'react';

const TopBar = ({ pincode, onOpenPincodeModal, deliveryMode, setDeliveryMode, onOpenRegisterModal, userProfile }) => {
  return (
    <div className="top-bar py-1 px-3 d-none d-md-block border-bottom border-secondary border-opacity-25">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          {/* Delivery Mode Toggle */}
          <div className="btn-group btn-group-sm" role="group" aria-label="Delivery mode">
            <button
              type="button"
              className={`btn ${deliveryMode === 'home' ? 'btn-success text-white fw-bold' : 'btn-outline-light text-light'}`}
              style={{ fontSize: '0.75rem' }}
              onClick={() => setDeliveryMode('home')}
            >
              <i className="bi bi-truck me-1"></i> Home Delivery
            </button>
            <button
              type="button"
              className={`btn ${deliveryMode === 'pickup' ? 'btn-success text-white fw-bold' : 'btn-outline-light text-light'}`}
              style={{ fontSize: '0.75rem' }}
              onClick={() => setDeliveryMode('pickup')}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> DMart Ready Pick-up Point
            </button>
          </div>

          {/* Location / Pincode Selector */}
          <button 
            className="btn btn-sm text-light p-0 d-flex align-items-center gap-1 border-0"
            onClick={onOpenPincodeModal}
            style={{ fontSize: '0.82rem' }}
          >
            <i className="bi bi-geo-fill text-warning"></i>
            <span>Pincode: <strong>{pincode}</strong></span>
            <i className="bi bi-pencil-square ms-1 text-warning"></i>
          </button>
        </div>

        <div className="d-flex align-items-center gap-4">
          <span style={{ fontSize: '0.8rem' }} className="text-light">
            <i className="bi bi-tags-fill text-warning me-1"></i>
            Daily Minimum <strong>7% OFF</strong> on MRP guaranteed!
          </span>

          {!userProfile && (
            <button
              className="btn btn-sm btn-warning text-dark fw-bold py-0 px-2 rounded"
              style={{ fontSize: '0.78rem' }}
              onClick={onOpenRegisterModal}
            >
              <i className="bi bi-person-plus-fill me-1"></i> Register / Sign In
            </button>
          )}

          <a href="tel:02242004200" className="text-light text-decoration-none" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-telephone-fill me-1"></i> 022-4200 4200
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
