import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { Link } from 'react-router-dom';
import './OrdersPage.css';

const statusConfig = {
  Delivered: { icon: CheckCircle, color: 'success' },
  Pending: { icon: Clock, color: 'warning' },
  Processing: { icon: Package, color: 'info' },
  Cancelled: { icon: Package, color: 'error' },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderAPI.getMyOrders()
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="orders-page page-content">
        <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
          <div className="spinner"></div> Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-content" id="orders-page">
      <div className="container">
        <div className="orders-header animate-slideUp">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your orders</p>
          </div>
          <div className="orders-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search orders..." className="input-field" style={{ paddingLeft: '36px' }} />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-cart animate-scaleIn" style={{ textAlign: 'center', padding: '80px 0' }}>
            <ShoppingBag size={64} style={{ color: 'var(--grey-300)', marginBottom: '24px' }} />
            <h2 style={{ fontFamily: 'var(--font-primary)' }}>No orders yet</h2>
            <p style={{ color: 'var(--grey-500)', marginBottom: '32px' }}>You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, idx) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              const statusColor = statusConfig[order.status]?.color || 'info';
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="order-card card animate-slideUp"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  id={`order-${order.id}`}
                >
                  <div
                    className="order-card-header"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="order-meta">
                      <h3 className="order-id">ORD-{order.id.substring(order.id.length - 8).toUpperCase()}</h3>
                      <span className="order-date">
                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="order-right">
                      <span className={`badge badge-${statusColor}`}>
                        <StatusIcon size={12} />
                        {order.status}
                      </span>
                      <span className="order-total">
                        ₹{order.totalAmount ? order.totalAmount.toLocaleString() : 0}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="order-details animate-slideUp">
                      <div className="order-items-list">
                        {order.items.map((item, i) => (
                          <div key={i} className="order-item">
                            <img src={item.image} alt={item.name} className="order-item-img" />
                            <div className="order-item-info">
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-qty">Qty: {item.quantity}</span>
                            </div>
                            <span className="order-item-price">₹{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-secondary btn-sm">Track Order</button>
                        {order.status === 'Delivered' && (
                          <button className="btn btn-ghost btn-sm">Write Review</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
