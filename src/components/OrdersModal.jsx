import React from 'react';

const OrdersModal = ({ isOpen, onClose, orders, onReorder }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header bg-dmart text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-bag-check-fill me-2 text-warning"></i> My DMart Orders ({orders.length})
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {orders.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="card border shadow-sm rounded-3">
                    <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-2 px-3">
                      <div>
                        <span className="fw-bold text-dark me-2">Order #{order.id}</span>
                        <span className="text-muted small">Placed on {order.date}</span>
                      </div>
                      <span className="badge bg-success px-3 py-1">
                        <i className="bi bi-truck me-1"></i> {order.status}
                      </span>
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex flex-column gap-2 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center small border-bottom pb-2">
                            <div className="d-flex align-items-center gap-2">
                              <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                              <div>
                                <div className="fw-semibold text-dark">{item.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Qty: {item.quantity} | Pack: {item.selectedWeight}</div>
                              </div>
                            </div>
                            <span className="fw-bold text-dmart">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded">
                        <div>
                          <div className="small text-muted">Total Paid: <strong className="text-dark fs-6">₹{order.total}</strong></div>
                          <div className="small text-success fw-bold">Saved ₹{order.savings} on MRP</div>
                        </div>
                        <button
                          className="btn btn-outline-dmart btn-sm fw-bold px-3"
                          onClick={() => onReorder(order)}
                        >
                          <i className="bi bi-arrow-repeat me-1"></i> Re-order Items
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-bag-x text-muted opacity-50 display-1"></i>
                <h5 className="fw-bold mt-3">No orders placed yet</h5>
                <p className="text-muted small">When you complete a checkout, your order details will show up here.</p>
                <button className="btn btn-dmart fw-bold px-4" onClick={onClose}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
