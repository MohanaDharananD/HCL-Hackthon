import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Plus, Edit, Trash2,
  TrendingUp, DollarSign, Eye, BarChart3, ChevronDown, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const DEMO_STATS = [
  { label: 'Total Revenue', value: '₹2,45,800', change: '+12.5%', icon: DollarSign, color: 'primary' },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', icon: ShoppingCart, color: 'success' },
  { label: 'Active Users', value: '5,678', change: '+15.3%', icon: Users, color: 'info' },
  { label: 'Products', value: '342', change: '+3.1%', icon: Package, color: 'warning' },
];

const DEMO_ADMIN_PRODUCTS = [
  { id: '1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 2499, stock: 45, status: 'Active' },
  { id: '2', name: 'Premium Cotton T-Shirt', category: 'Fashion', price: 799, stock: 120, status: 'Active' },
  { id: '3', name: 'Smart Fitness Band', category: 'Electronics', price: 1999, stock: 0, status: 'Out of Stock' },
  { id: '4', name: 'Running Shoes - Ultra Light', category: 'Fashion', price: 3299, stock: 28, status: 'Active' },
  { id: '5', name: 'Organic Green Tea', category: 'Groceries', price: 449, stock: 200, status: 'Active' },
  { id: '6', name: 'Ceramic Coffee Mug Set', category: 'Home & Kitchen', price: 899, stock: 8, status: 'Low Stock' },
];

const DEMO_ADMIN_ORDERS = [
  { id: 'ORD-001', customer: 'Rahul Sharma', date: '2026-03-29', total: 4298, status: 'Delivered', items: 2 },
  { id: 'ORD-002', customer: 'Priya Patel', date: '2026-03-28', total: 3299, status: 'Pending', items: 1 },
  { id: 'ORD-003', customer: 'Amit Kumar', date: '2026-03-28', total: 2498, status: 'Processing', items: 3 },
  { id: 'ORD-004', customer: 'Sneha Reddy', date: '2026-03-27', total: 1598, status: 'Delivered', items: 2 },
  { id: 'ORD-005', customer: 'Kiran Desai', date: '2026-03-27', total: 5997, status: 'Cancelled', items: 3 },
];

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '' });

  if (!isAdmin) {
    return (
      <div className="admin-page page-content" id="admin-page">
        <div className="container">
          <div className="admin-denied animate-scaleIn">
            <span className="denied-icon">🔒</span>
            <h2>Access Denied</h2>
            <p>You must be an administrator to access this page.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page page-content" id="admin-page">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar" id="admin-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-logo">🛒</span>
            <span className="sidebar-title">Admin Panel</span>
          </div>
          <nav className="sidebar-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                id={`sidebar-${tab.id}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-content animate-fadeIn">
              <div className="content-header">
                <h1 className="content-title">Dashboard Overview</h1>
                <span className="content-date">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="stats-grid">
                {DEMO_STATS.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`stat-card card stat-${stat.color} animate-slideUp`}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="stat-card-header">
                      <span className="stat-card-label">{stat.label}</span>
                      <div className={`stat-icon-wrapper ${stat.color}`}>
                        <stat.icon size={18} />
                      </div>
                    </div>
                    <div className="stat-card-value">{stat.value}</div>
                    <div className="stat-card-change">
                      <TrendingUp size={14} />
                      <span>{stat.change}</span>
                      <span className="change-label">vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="card recent-section">
                <div className="recent-header">
                  <h3>Recent Orders</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('orders')}>
                    View All <ChevronDown size={14} />
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_ADMIN_ORDERS.slice(0, 3).map(order => (
                        <tr key={order.id}>
                          <td className="table-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td className="table-date">{new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                          <td className="table-price">₹{order.total.toLocaleString()}</td>
                          <td>
                            <span className={`badge badge-${
                              order.status === 'Delivered' ? 'success' :
                              order.status === 'Pending' ? 'warning' :
                              order.status === 'Cancelled' ? 'error' : 'info'
                            }`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="admin-content animate-fadeIn">
              <div className="content-header">
                <h1 className="content-title">Products Management</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  id="add-product-btn"
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_ADMIN_PRODUCTS.map(product => (
                        <tr key={product.id}>
                          <td className="table-product">{product.name}</td>
                          <td><span className="table-category">{product.category}</span></td>
                          <td className="table-price">₹{product.price.toLocaleString()}</td>
                          <td className={product.stock === 0 ? 'text-error' : product.stock < 10 ? 'text-warning' : ''}>
                            {product.stock}
                          </td>
                          <td>
                            <span className={`badge ${
                              product.status === 'Active' ? 'badge-success' :
                              product.status === 'Low Stock' ? 'badge-warning' : 'badge-error'
                            }`}>{product.status}</span>
                          </td>
                          <td className="table-actions">
                            <button className="action-btn edit" id={`edit-${product.id}`}><Edit size={14} /></button>
                            <button className="action-btn delete" id={`delete-${product.id}`}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="admin-content animate-fadeIn">
              <div className="content-header">
                <h1 className="content-title">Orders Management</h1>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_ADMIN_ORDERS.map(order => (
                        <tr key={order.id}>
                          <td className="table-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td className="table-date">
                            {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td>{order.items}</td>
                          <td className="table-price">₹{order.total.toLocaleString()}</td>
                          <td>
                            <span className={`badge badge-${
                              order.status === 'Delivered' ? 'success' :
                              order.status === 'Pending' ? 'warning' :
                              order.status === 'Cancelled' ? 'error' : 'info'
                            }`}>{order.status}</span>
                          </td>
                          <td className="table-actions">
                            <button className="action-btn view"><Eye size={14} /></button>
                            <button className="action-btn edit"><Edit size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card card animate-scaleIn" onClick={e => e.stopPropagation()} id="add-product-modal">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category</label>
                  <select
                    className="input-field"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-product-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
