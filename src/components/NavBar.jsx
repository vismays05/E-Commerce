import React, { useState } from 'react';

const NavBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenOrders,
  onOpenPincodeModal,
  onOpenRegisterModal,
  userProfile,
  onLogout,
  pincode,
  products
}) => {
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  return (
    <nav className="navbar navbar-expand-lg bg-dmart navbar-dark sticky-top shadow-sm py-2">
      <div className="container-fluid px-3">
        {/* Brand Logo */}
        <div className="d-flex align-items-center me-3">
          <a className="navbar-brand-logo me-2" href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('all'); setSearchQuery(''); }}>
            <span className="dmart-logo-badge">D<span className="text-warning">M</span></span>
            <span className="d-none d-sm-inline fs-4 fw-black">DMart Ready</span>
          </a>
        </div>

        {/* Search Bar Container */}
        <div className="flex-grow-1 mx-2 mx-lg-4 position-relative style-search-container" style={{ maxWidth: '680px' }}>
          <div className="input-group">
            <button
              className="btn btn-light dropdown-toggle text-start d-none d-md-block border-end text-truncate"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ minWidth: '150px', maxWidth: '170px', fontSize: '0.88rem' }}
            >
              {categories.find(c => c.id === selectedCategory)?.name || 'All Categories'}
            </button>
            <ul className="dropdown-menu shadow">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`dropdown-item d-flex align-items-center gap-2 ${selectedCategory === cat.id ? 'active bg-dmart' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <i className={`bi ${cat.icon}`}></i> {cat.name}
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              className="form-control px-3"
              placeholder="Search 5000+ products (e.g. Atta, Oil, Maggi, Surf Excel)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            {searchQuery && (
              <button 
                className="btn btn-white bg-white text-secondary border-0" 
                onClick={() => setSearchQuery('')}
                type="button"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
            <button className="btn btn-warning fw-bold px-3 text-dark" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>

          {/* Live Search Suggestions Dropdown */}
          {showSearchResults && filteredSuggestions.length > 0 && (
            <div className="search-results-dropdown p-2 border">
              <div className="text-muted px-2 py-1 small fw-bold text-uppercase">Top Search Suggestions</div>
              {filteredSuggestions.map((item) => (
                <div
                  key={item.id}
                  className="search-item-hover d-flex align-items-center justify-content-between p-2 rounded cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => {
                    setSearchQuery(item.name);
                    setShowSearchResults(false);
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                    <div>
                      <div className="fw-semibold text-dark small">{item.name}</div>
                      <span className="badge bg-light text-secondary border small">{item.brand}</span>
                    </div>
                  </div>
                  <div className="text-end ms-2">
                    <span className="text-dmart fw-bold small">₹{item.price}</span>
                    <div className="text-muted small text-decoration-line-through">₹{item.mrp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Right */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Mobile Pincode button */}
          <button
            className="btn btn-outline-light btn-sm d-md-none p-1 px-2"
            onClick={onOpenPincodeModal}
            title="Change Location"
          >
            <i className="bi bi-geo-alt-fill text-warning"></i> {pincode}
          </button>

          {/* User Account / Register Button */}
          {userProfile ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-light border-0 dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-5 text-warning"></i>
                <span className="d-none d-lg-inline small fw-bold">{userProfile.fullName.split(' ')[0]}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li className="dropdown-header">
                  <div className="fw-bold text-dark">{userProfile.fullName}</div>
                  <div className="small text-muted">{userProfile.email}</div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" onClick={onOpenOrders}>
                    <i className="bi bi-bag-check-fill text-success"></i> My Orders
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right"></i> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-outline-light border-0 d-flex align-items-center gap-1"
              onClick={onOpenRegisterModal}
              title="Register or Sign In"
            >
              <i className="bi bi-person-plus-fill fs-5 text-warning"></i>
              <span className="d-none d-lg-inline small fw-bold">Sign In / Register</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button 
            className="btn btn-outline-light position-relative d-flex align-items-center gap-1 border-0"
            onClick={() => alert(`You have ${wishlistCount} item(s) in your wishlist!`)}
            title="Wishlist"
          >
            <i className="bi bi-heart-fill fs-5 text-danger"></i>
            {wishlistCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {wishlistCount}
              </span>
            )}
            <span className="d-none d-lg-inline small ms-1">Wishlist</span>
          </button>

          {/* My Orders Button */}
          <button
            className="btn btn-outline-light border-0 d-flex align-items-center gap-1"
            onClick={onOpenOrders}
            title="My Orders"
          >
            <i className="bi bi-bag-check-fill fs-5 text-warning"></i>
            <span className="d-none d-lg-inline small ms-1">Orders</span>
          </button>

          {/* Cart Drawer Trigger Button */}
          <button
            className="btn btn-warning text-dark fw-bold position-relative d-flex align-items-center gap-2 px-3 shadow-sm"
            onClick={onOpenCart}
          >
            <div className="position-relative">
              <i className="bi bi-cart-fill fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger fs-6 border border-light">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-start d-none d-sm-block lh-1">
              <div style={{ fontSize: '0.72rem' }} className="text-uppercase text-secondary fw-black">My Cart</div>
              <div style={{ fontSize: '0.9rem' }} className="fw-bold">₹{cartTotal}</div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
