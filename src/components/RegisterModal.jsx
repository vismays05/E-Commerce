import React, { useState } from 'react';

const RegisterModal = ({ isOpen, onClose, onRegisterSuccess, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'login'

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login Form State
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status & Validation Error
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess({
        fullName,
        mobile,
        email
      });
      onClose();
    }, 1000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(loginMobile)) {
      setError('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        fullName: 'Rohan Sharma',
        mobile: loginMobile,
        email: 'rohan.sharma@example.com'
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dmart text-white p-3">
            <div className="d-flex align-items-center gap-2">
              <span className="dmart-logo-badge fs-5">D<span className="text-warning">M</span></span>
              <h5 className="modal-title fw-bold m-0">DMart Ready Account</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-light border-bottom d-flex text-center">
            <button
              className={`flex-grow-1 py-3 border-0 fw-bold border-bottom border-3 ${activeTab === 'register' ? 'border-success text-success bg-white' : 'text-muted bg-light'}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              <i className="bi bi-person-plus-fill me-1"></i> Register Account
            </button>
            <button
              className={`flex-grow-1 py-3 border-0 fw-bold border-bottom border-3 ${activeTab === 'login' ? 'border-success text-success bg-white' : 'text-muted bg-light'}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
            </button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger small py-2 px-3 fw-semibold d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-person-fill"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rohan Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Mobile Number (10 digits) *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">+91</span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="9876543210"
                      maxLength="10"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope-fill"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="termsCheck">
                    I agree to DMart's <a href="#" className="text-dmart fw-bold">Terms of Service</a> & <a href="#" className="text-dmart fw-bold">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-dmart btn-lg w-100 fw-black shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</span>
                  ) : (
                    <span>CREATE MY DMART ACCOUNT</span>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Registered Mobile Number *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">+91</span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="9876543210"
                      maxLength="10"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-key-fill"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dmart btn-lg w-100 fw-black shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</span>
                  ) : (
                    <span>SIGN IN TO DMART</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
