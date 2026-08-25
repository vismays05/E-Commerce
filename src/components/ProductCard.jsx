import React, { useState } from 'react';

const ProductCard = ({
  product,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  isWishlisted,
  onToggleWishlist
}) => {
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0] || 'Standard');

  // Calculate discount percentage
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const totalSavings = product.mrp - product.price;

  return (
    <div className="card product-card shadow-sm h-100 position-relative">
      {/* Discount Badge */}
      <span className="badge-discount">
        {product.badge || `${discountPercent}% OFF`}
      </span>

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => onToggleWishlist(product.id)}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <i className={`bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
      </button>

      {/* Product Image */}
      <div 
        className="product-img-wrapper cursor-pointer"
        onClick={() => onQuickView(product)}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      {/* Product Body */}
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.7rem' }}>
            {product.brand}
          </span>
          <div className="d-flex align-items-center text-warning" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-star-fill me-1"></i>
            <span className="fw-bold text-dark">{product.rating}</span>
            <span className="text-muted ms-1">({product.reviewsCount})</span>
          </div>
        </div>

        <h6 
          className="card-title text-dark fw-bold text-truncate-2 mb-2 style-product-title" 
          style={{ minHeight: '2.5rem', fontSize: '0.92rem', cursor: 'pointer' }}
          onClick={() => onQuickView(product)}
        >
          {product.name}
        </h6>

        {/* Weight Selector */}
        {product.weightOptions.length > 1 ? (
          <select 
            className="form-select form-select-sm mb-2 text-muted fw-semibold"
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          >
            {product.weightOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="small text-muted mb-2 fw-medium" style={{ fontSize: '0.8rem' }}>
            Size / Pack: <strong>{selectedWeight}</strong>
          </div>
        )}

        {/* Price & Savings */}
        <div className="mt-auto pt-2">
          <div className="d-flex align-items-baseline gap-2">
            <span className="dmart-price">₹{product.price}</span>
            <span className="mrp-strike">MRP ₹{product.mrp}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-1 mb-3">
            <span className="savings-tag">
              SAVE ₹{totalSavings}
            </span>
            {product.expressDelivery && (
              <span className="text-success small fw-bold" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-lightning-fill me-1 text-warning"></i>Express
              </span>
            )}
          </div>

          {/* Add to Cart or Stepper Controls */}
          <div className="d-grid gap-2">
            {cartQuantity > 0 ? (
              <div className="d-flex align-items-center justify-content-between bg-light p-1 rounded border">
                <div className="qty-stepper w-100 justify-content-between">
                  <button 
                    type="button" 
                    onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
                  >
                    -
                  </button>
                  <span className="fw-bold">{cartQuantity}</span>
                  <button 
                    type="button" 
                    onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-1">
                <button
                  className="btn btn-outline-secondary btn-sm px-2"
                  onClick={() => onQuickView(product)}
                  title="Quick View"
                >
                  <i className="bi bi-eye-fill"></i>
                </button>
                <button
                  className="btn btn-dmart btn-sm flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onAddToCart(product, selectedWeight)}
                >
                  <i className="bi bi-cart-plus-fill"></i> ADD TO CART
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
