import React, { useState } from 'react';

const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
  pincode
}) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Slot, 3: Payment, 4: Success
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedSlot, setSelectedSlot] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const totalDmartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSavings = cartItems.reduce((acc, item) => acc + ((item.mrp - item.price) * item.quantity), 0);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = 'DMART-' + Math.floor(100000 + Math.random() * 900000);
      setPlacedOrderId(orderId);
      setIsProcessing(false);
      setStep(4);
      onOrderComplete({
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: cartItems,
        total: totalDmartPrice,
        savings: totalSavings,
        status: 'Order Placed & Packed',
        slot: selectedSlot === 'express' ? 'Express 2-Hour Delivery' : 'Tomorrow Morning (8 AM - 11 AM)'
      });
    }, 1500);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dmart text-white p-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-shield-lock-fill me-2 text-warning"></i>
              DMart Express Checkout
            </h5>
            {step !== 4 && (
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            )}
          </div>

          <div className="modal-body p-4">
            {/* Step Progress Pills */}
            {step !== 4 && (
              <div className="d-flex justify-content-between mb-4 pb-3 border-bottom text-center">
                <div className={`flex-grow-1 border-bottom border-3 ${step >= 1 ? 'border-success text-success fw-bold' : 'text-muted'}`}>
                  1. Delivery Address
                </div>
                <div className={`flex-grow-1 border-bottom border-3 ${step >= 2 ? 'border-success text-success fw-bold' : 'text-muted'}`}>
                  2. Delivery Slot
                </div>
                <div className={`flex-grow-1 border-bottom border-3 ${step >= 3 ? 'border-success text-success fw-bold' : 'text-muted'}`}>
                  3. Payment
                </div>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <h5 className="fw-bold mb-3">Select Delivery Address (Pincode: {pincode})</h5>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div
                      className={`card p-3 cursor-pointer border-2 ${selectedAddress === 'home' ? 'border-success bg-light' : ''}`}
                      onClick={() => setSelectedAddress('home')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-success">Home Address</span>
                        <input type="radio" checked={selectedAddress === 'home'} readOnly />
                      </div>
                      <h6 className="fw-bold m-0">Rohan Sharma</h6>
                      <p className="small text-muted mb-0 mt-1">
                        Flat 402, Green Heights, SV Road, Near DMart Ready Hub, Mumbai - {pincode}
                      </p>
                      <span className="small text-dark fw-bold mt-2">Ph: +91 98765 43210</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div
                      className={`card p-3 cursor-pointer border-2 ${selectedAddress === 'office' ? 'border-success bg-light' : ''}`}
                      onClick={() => setSelectedAddress('office')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-secondary">Office</span>
                        <input type="radio" checked={selectedAddress === 'office'} readOnly />
                      </div>
                      <h6 className="fw-bold m-0">Rohan Sharma (Office)</h6>
                      <p className="small text-muted mb-0 mt-1">
                        Tech Park Tower B, 6th Floor, Bandra Kurla Complex, Mumbai - {pincode}
                      </p>
                      <span className="small text-dark fw-bold mt-2">Ph: +91 98765 43210</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-dmart fw-bold px-4" onClick={() => setStep(2)}>
                    Continue to Slot <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Slot */}
            {step === 2 && (
              <div>
                <h5 className="fw-bold mb-3">Choose Convenient Delivery Time</h5>
                <div className="list-group mb-4">
                  <label className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 ${selectedSlot === 'express' ? 'active bg-success text-white border-success' : ''}`}>
                    <div className="d-flex align-items-center gap-3">
                      <input type="radio" name="slot" checked={selectedSlot === 'express'} onChange={() => setSelectedSlot('express')} />
                      <div>
                        <div className="fw-bold">⚡ DMart Express (Within 2 Hours)</div>
                        <div className="small opacity-75">Order packed & dispatched directly from nearest DMart Ready hub.</div>
                      </div>
                    </div>
                    <span className="badge bg-warning text-dark fw-bold">₹0 Free</span>
                  </label>
                  <label className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 mt-2 ${selectedSlot === 'morning' ? 'active bg-success text-white border-success' : ''}`}>
                    <div className="d-flex align-items-center gap-3">
                      <input type="radio" name="slot" checked={selectedSlot === 'morning'} onChange={() => setSelectedSlot('morning')} />
                      <div>
                        <div className="fw-bold">🌅 Tomorrow Morning (8:00 AM - 11:00 AM)</div>
                        <div className="small opacity-75">Fresh morning delivery directly to your doorstep.</div>
                      </div>
                    </div>
                    <span className="badge bg-warning text-dark fw-bold">₹0 Free</span>
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary fw-bold" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button className="btn btn-dmart fw-bold px-4" onClick={() => setStep(3)}>
                    Continue to Payment <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h5 className="fw-bold mb-3">Select Payment Method</h5>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <div className={`card p-3 border-2 ${paymentMethod === 'upi' ? 'border-success bg-light' : ''}`} onClick={() => setPaymentMethod('upi')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                        <i className="bi bi-qr-code-scan fs-4 text-success"></i>
                        <span className="fw-bold">UPI / GPay / PhonePe / Paytm</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className={`card p-3 border-2 ${paymentMethod === 'card' ? 'border-success bg-light' : ''}`} onClick={() => setPaymentMethod('card')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" checked={paymentMethod === 'card'} readOnly />
                        <i className="bi bi-credit-card-2-front-fill fs-4 text-primary"></i>
                        <span className="fw-bold">Credit / Debit Card</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className={`card p-3 border-2 ${paymentMethod === 'cod' ? 'border-success bg-light' : ''}`} onClick={() => setPaymentMethod('cod')} style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                        <i className="bi bi-cash-stack fs-4 text-warning"></i>
                        <span className="fw-bold">Pay on Delivery (Cash / QR)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Order Total ({cartItems.length} items):</span>
                    <span className="fw-bold">₹{totalDmartPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between text-success fw-bold">
                    <span>Total DMart Savings:</span>
                    <span>₹{totalSavings}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary fw-bold" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button
                    className="btn btn-dmart btn-lg fw-black px-4"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</span>
                    ) : (
                      <span>PAY & PLACE ORDER (₹{totalDmartPrice})</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="text-success display-1 mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h3 className="fw-black text-dark">Order Successfully Placed!</h3>
                <p className="text-muted mb-3">
                  Order ID: <strong className="text-dmart">{placedOrderId}</strong>
                </p>
                <div className="bg-light p-3 rounded-3 max-w-md mx-auto mb-4 text-start">
                  <div className="small text-muted mb-1">Estimated Delivery:</div>
                  <div className="fw-bold text-success mb-2">
                    <i className="bi bi-clock-fill me-1"></i> {selectedSlot === 'express' ? 'Within 2 Hours (Today)' : 'Tomorrow Morning (8 AM - 11 AM)'}
                  </div>
                  <div className="small text-muted">Delivery Address:</div>
                  <div className="fw-medium small">Flat 402, Green Heights, SV Road, Mumbai - {pincode}</div>
                </div>

                <button className="btn btn-dmart btn-lg fw-bold px-5" onClick={onClose}>
                  Back to Super Store
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
