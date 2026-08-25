import React, { useState, useEffect } from 'react';

const ProductQuickViewModal = ({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0] || 'Standard');

  useEffect(() => {
    if (product) {
      setSelectedWeight(product.weightOptions[0] || 'Standard');
    }
  }, [product]);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const totalSavings = product.mrp - product.price;

  return (
    <div className="modal fade show d-block quick-view-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg">
          <div className="modal-header border-0 bg-light">
            <span className="badge bg-dmart px-2 py-1">
              <i className="bi bi-shield-check me-1"></i> Authentic DMart Stock
            </span>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4 align-items-center">
              {/* Product Image */}
              <div className="col-12 col-md-5 text-center position-relative">
                <span className="badge-discount position-absolute top-0 start-0 m-2">
                  {discountPercent}% OFF
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '280px', objectFit: 'contain' }}
                />
              </div>

              {/* Product Info */}
              <div className="col-12 col-md-7">
                <span className="badge bg-light text-secondary border mb-2">{product.brand}</span>
                <h4 className="fw-bold text-dark mb-2">{product.name}</h4>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="badge bg-warning text-dark d-flex align-items-center gap-1">
                    <i className="bi bi-star-fill"></i> {product.rating} / 5
                  </div>
                  <span className="text-muted small">({product.reviewsCount} verified customer reviews)</span>
                </div>

                <p className="text-secondary small mb-3">{product.description}</p>

                {/* Weight Options */}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">Select Pack Size / Weight:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {product.weightOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn btn-sm ${selectedWeight === opt ? 'btn-dmart' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedWeight(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex align-items-baseline gap-2">
                    <span className="fs-2 fw-black text-dmart">₹{product.price}</span>
                    <span className="text-muted text-decoration-line-through fs-6">MRP ₹{product.mrp}</span>
                  </div>
                  <div className="text-success fw-bold small mt-1">
                    You Save: ₹{totalSavings} ({discountPercent}% off on MRP)
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 align-items-center">
                  {cartQuantity > 0 ? (
                    <div className="qty-stepper p-1 fs-5">
                      <button className="px-3 py-1" onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}>-</button>
                      <span className="px-3 fw-bold">{cartQuantity}</span>
                      <button className="px-3 py-1" onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-dmart btn-lg fw-bold flex-grow-1"
                      onClick={() => onAddToCart(product, selectedWeight)}
                    >
                      <i className="bi bi-cart-plus-fill me-2"></i> ADD TO CART
                    </button>
                  )}

                  <button
                    className={`btn btn-outline-danger btn-lg ${isWishlisted ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(product.id)}
                    title="Wishlist"
                  >
                    <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
