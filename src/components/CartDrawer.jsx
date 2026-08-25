import React, { useState } from 'react';

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountAmount,
  setDiscountAmount
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCodeName, setAppliedCodeName] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalMrp = cartItems.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);
  const totalDmartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSavings = totalMrp - totalDmartPrice;
  const finalPrice = Math.max(0, totalDmartPrice - discountAmount);

  // Free delivery threshold ₹500
  const freeDeliveryThreshold = 500;
  const deliveryFee = (totalDmartPrice >= freeDeliveryThreshold || appliedCodeName === 'FREESHIP') ? 0 : 49;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - totalDmartPrice);
  const progressPercent = Math.min(100, (totalDmartPrice / freeDeliveryThreshold) * 100);

  const applyCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DMART50') {
      setDiscountAmount(50);
      setCouponApplied(true);
      setAppliedCodeName('DMART50');
      setCouponError('');
      setCouponCode('DMART50');
    } else if (cleanCode === 'DMART100') {
      setDiscountAmount(100);
      setCouponApplied(true);
      setAppliedCodeName('DMART100');
      setCouponError('');
      setCouponCode('DMART100');
    } else if (cleanCode === 'FREESHIP') {
      setDiscountAmount(0);
      setCouponApplied(true);
      setAppliedCodeName('FREESHIP');
      setCouponError('');
      setCouponCode('FREESHIP');
    } else if (cleanCode === 'FIRST10') {
      const tenPercent = Math.round(totalDmartPrice * 0.1);
      setDiscountAmount(tenPercent);
      setCouponApplied(true);
      setAppliedCodeName('FIRST10');
      setCouponError('');
      setCouponCode('FIRST10');
    } else {
      setCouponError('Invalid code! Try DMART50, DMART100, FREESHIP, or FIRST10');
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    applyCode(couponCode);
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setCouponApplied(false);
    setAppliedCodeName('');
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div 
      className="offcanvas offcanvas-end show d-flex flex-column cart-offcanvas shadow-lg position-fixed top-0 end-0 h-100" 
      tabIndex="-1" 
      style={{ backgroundColor: '#ffffff', zIndex: 1055, width: '420px', maxWidth: '100vw' }}
    >
      {/* Drawer Header */}
      <div className="offcanvas-header bg-dmart text-white p-3 flex-shrink-0">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cart-check-fill fs-4 text-warning"></i>
          <h5 className="offcanvas-title fw-bold m-0">Your DMart Cart ({cartItems.length})</h5>
        </div>
        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="offcanvas-body p-3 flex-grow-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {/* Free Delivery Bar */}
        {cartItems.length > 0 && (
          <div className="p-3 mb-3 bg-light rounded-3 border">
            <div className="d-flex justify-content-between small fw-bold mb-1">
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> You unlocked FREE Delivery!</span>
                ) : (
                  <span>Add ₹{amountNeededForFreeDelivery} more for <strong>FREE Delivery</strong></span>
                )}
              </span>
              <span className="text-muted">{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className={`progress-bar ${deliveryFee === 0 ? 'bg-success' : 'bg-warning'}`}
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Item List */}
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedWeight}`} className="card mb-3 border-0 shadow-sm bg-light">
                <div className="card-body p-2.5 d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    className="rounded bg-white p-1"
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="fw-bold text-dark text-truncate mb-0 small" title={item.name}>
                      {item.name}
                    </h6>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      Pack: <span className="fw-semibold">{item.selectedWeight}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="fw-black text-dmart">₹{item.price * item.quantity}</span>
                      <span className="text-muted text-decoration-line-through small">
                        ₹{item.mrp * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="d-flex flex-column align-items-end gap-1">
                    <button
                      className="btn btn-sm text-danger border-0 p-0"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                    <div className="qty-stepper">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Input & Quick Coupon Chips */}
            <div className="mt-3 p-3 bg-light rounded-3 border">
              <label className="form-label fw-bold small text-muted mb-1 d-flex align-items-center gap-1">
                <i className="bi bi-tags-fill text-warning"></i> DMart Promo & Coupon Codes:
              </label>

              {/* Quick Coupon Chips */}
              <div className="d-flex flex-wrap gap-1.5 mb-2">
                <button
                  type="button"
                  className={`btn btn-xs ${appliedCodeName === 'DMART50' ? 'btn-success' : 'btn-outline-success'} fw-bold py-1 px-2`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => applyCode('DMART50')}
                >
                  DMART50 (₹50 OFF)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${appliedCodeName === 'DMART100' ? 'btn-success' : 'btn-outline-success'} fw-bold py-1 px-2`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => applyCode('DMART100')}
                >
                  DMART100 (₹100 OFF)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${appliedCodeName === 'FIRST10' ? 'btn-success' : 'btn-outline-primary'} fw-bold py-1 px-2`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => applyCode('FIRST10')}
                >
                  FIRST10 (10% OFF)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${appliedCodeName === 'FREESHIP' ? 'btn-success' : 'btn-outline-warning text-dark'} fw-bold py-1 px-2`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => applyCode('FREESHIP')}
                >
                  FREESHIP (Free Delivery)
                </button>
              </div>

              {couponApplied ? (
                <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 border border-success p-2 rounded">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check-fill text-success fs-5"></i>
                    <div>
                      <div className="fw-bold text-success small">Code '{appliedCodeName}' Applied!</div>
                      <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                        {appliedCodeName === 'FREESHIP' ? 'Free Shipping Unlocked' : `Extra ₹${discountAmount} Discount`}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm text-uppercase fw-bold"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-dmart btn-sm fw-bold px-3">
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <div className="text-danger small fw-bold mt-2 d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-circle-fill"></i> {couponError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-5 my-auto">
            <i className="bi bi-cart-x text-muted opacity-50 display-1"></i>
            <h5 className="fw-bold mt-3">Your cart is empty!</h5>
            <p className="text-muted small">Explore our super deals and start saving today.</p>
            <button className="btn btn-dmart fw-bold px-4" onClick={onClose}>
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Cart Summary Footer */}
      {cartItems.length > 0 && (
        <div className="offcanvas-footer p-3 border-top bg-light flex-shrink-0">
          <div className="savings-banner mb-3 py-2 text-center">
            <span className="fw-bold text-success">
              🎉 Total DMart Savings on this order: <strong>₹{totalSavings + discountAmount}</strong>
            </span>
          </div>

          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Total MRP:</span>
            <span className="text-decoration-line-through">₹{totalMrp}</span>
          </div>
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>DMart Subtotal:</span>
            <span className="fw-bold text-dark">₹{totalDmartPrice}</span>
          </div>
          {couponApplied && discountAmount > 0 && (
            <div className="d-flex justify-content-between small text-success mb-1">
              <span>Coupon Discount ('{appliedCodeName}'):</span>
              <span className="fw-bold">- ₹{discountAmount}</span>
            </div>
          )}
          <div className="d-flex justify-content-between small text-muted mb-2">
            <span>Delivery Charges:</span>
            <span className={deliveryFee === 0 ? 'text-success fw-bold' : ''}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center fs-5 fw-black text-dark mb-3 pt-2 border-top">
            <span>Final Pay Amount:</span>
            <span className="text-dmart fs-4">₹{finalPrice + deliveryFee}</span>
          </div>

          <button
            className="btn btn-dmart btn-lg w-100 fw-black shadow d-flex justify-content-between align-items-center px-4"
            onClick={onProceedToCheckout}
          >
            <span>PROCEED TO CHECKOUT</span>
            <i className="bi bi-arrow-right-circle-fill fs-5"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
