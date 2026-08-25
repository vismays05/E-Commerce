import React, { useState } from 'react';

const PincodeModal = ({ isOpen, onClose, currentPincode, onSavePincode }) => {
  if (!isOpen) return null;

  const [inputPin, setInputPin] = useState(currentPincode);
  const [error, setError] = useState('');

  const popularPincodes = [
    { city: 'Mumbai Central', pin: '400001' },
    { city: 'Bandra West', pin: '400050' },
    { city: 'Andheri East', pin: '400069' },
    { city: 'Thane West', pin: '400601' },
    { city: 'Bengaluru Central', pin: '560001' },
    { city: 'Pune City', pin: '411001' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(inputPin)) {
      onSavePincode(inputPin);
      setError('');
      onClose();
    } else {
      setError('Please enter a valid 6-digit Indian Pincode!');
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header bg-dmart text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-geo-alt-fill me-2 text-warning"></i> Select Delivery Location
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <p className="small text-muted mb-3">
              Enter your area pincode to check stock availability and DMart Express 2-Hour delivery options.
            </p>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg fw-bold"
                  placeholder="Enter 6-digit Pincode"
                  maxLength="6"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                />
                <button type="submit" className="btn btn-dmart fw-bold px-4">
                  Check & Save
                </button>
              </div>
              {error && <div className="text-danger small fw-bold mt-2">{error}</div>}
            </form>

            <h6 className="fw-bold small text-muted mb-2">Popular Cities & DMart Hubs:</h6>
            <div className="d-flex flex-wrap gap-2">
              {popularPincodes.map((item) => (
                <button
                  key={item.pin}
                  type="button"
                  className={`btn btn-sm ${inputPin === item.pin ? 'btn-dmart' : 'btn-outline-secondary'}`}
                  onClick={() => {
                    setInputPin(item.pin);
                    onSavePincode(item.pin);
                    onClose();
                  }}
                >
                  {item.city} ({item.pin})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PincodeModal;
