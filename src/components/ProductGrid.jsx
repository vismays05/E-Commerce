import React, { useState } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  wishlist,
  onToggleWishlist,
  selectedCategory,
  categoryName,
  searchQuery
}) => {
  const [maxPrice, setMaxPrice] = useState(500);
  const [minDiscount, setMinDiscount] = useState(0);
  const [expressOnly, setExpressOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Filter products based on search, category, price, discount, express
  let filtered = products.filter(p => {
    // Category match
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // Search match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory) return false;
    }
    // Price match
    if (p.price > maxPrice) return false;
    // Discount match
    const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    if (disc < minDiscount) return false;
    // Express delivery filter
    if (expressOnly && !p.expressDelivery) return false;

    return true;
  });

  // Sort products
  filtered.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') {
      const discA = ((a.mrp - a.price) / a.mrp);
      const discB = ((b.mrp - b.price) / b.mrp);
      return discB - discA;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // popular
  });

  const getCartQty = (productId) => {
    const found = cartItems.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };

  const handleResetFilters = () => {
    setMaxPrice(500);
    setMinDiscount(0);
    setExpressOnly(false);
    setSortBy('popular');
  };

  return (
    <div className="container-fluid px-3 my-4">
      <div className="row g-4">
        {/* Sidebar Filters Column */}
        <div className="col-12 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '140px', zIndex: 100 }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold m-0 text-dmart d-flex align-items-center gap-2">
                <i className="bi bi-funnel-fill"></i> Filter Savings
              </h6>
              <button 
                className="btn btn-link btn-sm text-decoration-none p-0 text-muted" 
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold small d-flex justify-content-between">
                <span>Max Price:</span>
                <span className="text-dmart fw-bold">Up to ₹{maxPrice}</span>
              </label>
              <input
                type="range"
                className="form-range"
                min="40"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted small">
                <span>₹40</span>
                <span>₹500</span>
              </div>
            </div>

            {/* Discount Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold small d-flex justify-content-between">
                <span>Min Discount:</span>
                <span className="badge bg-warning text-dark fw-bold">{minDiscount}% & Above</span>
              </label>
              <div className="btn-group w-100 btn-group-sm" role="group">
                {[0, 10, 20, 30].map(disc => (
                  <button
                    key={disc}
                    type="button"
                    className={`btn ${minDiscount === disc ? 'btn-dmart' : 'btn-outline-secondary'}`}
                    onClick={() => setMinDiscount(disc)}
                  >
                    {disc === 0 ? 'All' : `${disc}%+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Express Delivery Filter */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="expressSwitch"
                checked={expressOnly}
                onChange={(e) => setExpressOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold cursor-pointer" htmlFor="expressSwitch">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
                DMart Express 2-Hour Delivery
              </label>
            </div>

            {/* Special Promo Info */}
            <div className="savings-banner mt-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <span className="fw-bold small text-success">DMart Guarantee</span>
              </div>
              <p className="small text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                Lowest prices every day. If you find lower MRP discounts locally, we match it!
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid Main Column */}
        <div className="col-12 col-lg-9">
          {/* Header Controls Bar */}
          <div className="bg-white p-3 rounded-3 shadow-sm mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h5 className="fw-bold m-0 text-dark">
                {searchQuery ? `Search Results for "${searchQuery}"` : categoryName}
              </h5>
              <span className="text-muted small">Showing {filtered.length} of {products.length} products</span>
            </div>

            {/* Sort Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <span className="small fw-semibold text-muted text-nowrap">Sort By:</span>
              <select
                className="form-select form-select-sm fw-semibold"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Savings %</option>
                <option value="rating">Top Customer Ratings</option>
              </select>
            </div>
          </div>

          {/* Product Cards Container */}
          {filtered.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 g-3">
              {filtered.map(product => (
                <div className="col" key={product.id}>
                  <ProductCard
                    product={product}
                    cartQuantity={getCartQty(product.id)}
                    onAddToCart={onAddToCart}
                    onUpdateQuantity={onUpdateQuantity}
                    onQuickView={onQuickView}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm px-3">
              <i className="bi bi-search text-muted opacity-50 display-1"></i>
              <h4 className="fw-bold mt-3">No matching products found</h4>
              <p className="text-muted small mb-4">Try relaxing your price slider or search keywords to find products.</p>
              <button className="btn btn-dmart fw-bold px-4" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
