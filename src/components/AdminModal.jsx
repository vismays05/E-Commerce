import React, { useState } from 'react';
import { api } from '../services/api';

const AdminModal = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
  orders,
  onOrdersUpdated
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('grocery');
  const [brand, setBrand] = useState('DMart Select');
  const [weightOptionsStr, setWeightOptionsStr] = useState('500 g, 1 kg');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('FRESH');
  const [expressDelivery, setExpressDelivery] = useState(true);
  const [inStock, setInStock] = useState(true);

  // Status & Notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Search filter for products & orders in admin list
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !price || !mrp) {
      setError('Please fill in product name, price, and MRP.');
      return;
    }

    const weightOptions = weightOptionsStr.split(',').map(w => w.trim()).filter(Boolean);

    setIsSubmitting(true);
    const res = await api.createProduct({
      name,
      category,
      brand,
      weightOptions,
      price: Number(price),
      mrp: Number(mrp),
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      badge,
      expressDelivery,
      inStock
    });
    setIsSubmitting(false);

    if (res && res.success) {
      setMessage(`🎉 Product '${name}' created successfully in ${res.source || 'Database'}!`);
      setName('');
      setPrice('');
      setMrp('');
      setImage('');
      // Reload products list
      const freshProducts = await api.getProducts();
      if (freshProducts) onProductsUpdated(freshProducts);
    } else {
      setError(res?.message || 'Failed to create product.');
    }
  };

  const handleToggleStock = async (prod) => {
    const newStock = !prod.inStock;
    const res = await api.updateProduct(prod.id, { inStock: newStock });
    if (res && res.success) {
      const freshProducts = await api.getProducts();
      if (freshProducts) onProductsUpdated(freshProducts);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(`Are you sure you want to delete product ID #${productId}?`)) return;

    const res = await api.deleteProduct(productId);
    if (res && res.success) {
      const freshProducts = await api.getProducts();
      if (freshProducts) onProductsUpdated(freshProducts);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res && res.success) {
      const freshOrders = await api.getOrders();
      if (freshOrders) onOrdersUpdated(freshOrders);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white p-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark fs-6 fw-bold">ADMIN</span>
              <h5 className="modal-title fw-bold m-0 text-white">DMart Seller & Inventory Control Panel</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-light border-bottom d-flex text-center">
            <button
              className={`flex-grow-1 py-3 border-0 fw-bold border-bottom border-3 ${activeTab === 'products' ? 'border-success text-success bg-white' : 'text-muted bg-light'}`}
              onClick={() => { setActiveTab('products'); setMessage(''); setError(''); }}
            >
              <i className="bi bi-box-seam me-1"></i> Product Inventory Management ({products.length})
            </button>
            <button
              className={`flex-grow-1 py-3 border-0 fw-bold border-bottom border-3 ${activeTab === 'orders' ? 'border-success text-success bg-white' : 'text-muted bg-light'}`}
              onClick={() => { setActiveTab('orders'); setMessage(''); setError(''); }}
            >
              <i className="bi bi-receipt me-1"></i> Customer Orders Fulfillment ({orders.length})
            </button>
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {message && <div className="alert alert-success py-2 px-3 small fw-bold mb-3">{message}</div>}
            {error && <div className="alert alert-danger py-2 px-3 small fw-bold mb-3">{error}</div>}

            {/* TAB 1: PRODUCTS INVENTORY MANAGEMENT */}
            {activeTab === 'products' && (
              <div>
                {/* Form to add product */}
                <div className="card p-3 border-0 bg-light mb-4 shadow-sm">
                  <h6 className="fw-bold text-dark mb-3"><i className="bi bi-plus-circle-fill me-1 text-success"></i> Add New Product to DMart Catalog</h6>
                  <form onSubmit={handleCreateProduct}>
                    <div className="row g-2 mb-2">
                      <div className="col-12 col-md-4">
                        <label className="form-label small text-muted fw-bold">Product Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Amul Pure Ghee 1L"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-2">
                        <label className="form-label small text-muted fw-bold">Category</label>
                        <select className="form-select form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                          <option value="grocery">Grocery</option>
                          <option value="dairy">Dairy & Bakery</option>
                          <option value="personal-care">Personal Care</option>
                          <option value="home">Home & Kitchen</option>
                        </select>
                      </div>
                      <div className="col-6 col-md-2">
                        <label className="form-label small text-muted fw-bold">Brand</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Brand Name"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-2">
                        <label className="form-label small text-muted fw-bold">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="150"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-2">
                        <label className="form-label small text-muted fw-bold">MRP (₹) *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="180"
                          value={mrp}
                          onChange={(e) => setMrp(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 align-items-end">
                      <div className="col-12 col-md-4">
                        <label className="form-label small text-muted fw-bold">Weight Options (comma separated)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="500 g, 1 kg, 5 kg"
                          value={weightOptionsStr}
                          onChange={(e) => setWeightOptionsStr(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label small text-muted fw-bold">Image URL (optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="https://..."
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-2">
                        <label className="form-label small text-muted fw-bold">Badge</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="OFFER"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-2 text-end">
                        <button type="submit" className="btn btn-dmart btn-sm w-100 fw-bold" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Add Product'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Filter Search */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold m-0 text-dark">Live Product List</h6>
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Products Table */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle border">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price / MRP</th>
                        <th>Stock</th>
                        <th>Express</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img src={p.image} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} className="rounded border" />
                              <div>
                                <div className="fw-bold small">{p.name}</div>
                                <span className="small text-muted">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge bg-secondary text-capitalize">{p.category}</span></td>
                          <td>
                            <span className="fw-bold text-success">₹{p.price}</span> <del className="small text-muted">₹{p.mrp}</del>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${p.inStock ? 'btn-outline-success' : 'btn-outline-danger'} py-0 px-2 fw-bold`}
                              onClick={() => handleToggleStock(p)}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td>
                            {p.expressDelivery ? <span className="badge bg-warning text-dark">⚡ 2-Hr</span> : <span className="badge bg-light text-dark">Standard</span>}
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => handleDeleteProduct(p.id)}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold m-0 text-dark">Customer Orders ({orders.length})</h6>
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto"
                    placeholder="Search by Order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle border">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items Count</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th className="text-end">Update Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id}>
                          <td><strong className="text-dmart">{o.id}</strong></td>
                          <td className="small text-muted">{o.date}</td>
                          <td className="fw-bold">{o.items ? o.items.length : 0} items</td>
                          <td className="fw-bold text-success">₹{o.total}</td>
                          <td>
                            <span className={`badge ${o.status === 'Delivered' ? 'bg-success' : o.status.includes('Packed') ? 'bg-primary' : 'bg-warning text-dark'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <select
                              className="form-select form-select-sm d-inline-block w-auto"
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            >
                              <option value="Order Placed & Packed">Order Placed & Packed</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
