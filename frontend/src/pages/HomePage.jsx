import { useState, useEffect } from 'react';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import './HomePage.css';

// Fallback demo product data (used only when backend is unavailable)
const DEMO_PRODUCTS = [
  { id: 'demo-1', name: 'Wireless Bluetooth Headphones', price: 2499, originalPrice: 4999, category: 'Electronics', rating: 5, reviews: 234, discount: 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 'demo-2', name: 'Premium Cotton T-Shirt', price: 799, originalPrice: 1299, category: 'Fashion', rating: 4, reviews: 167, discount: 38, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 'demo-3', name: 'Stainless Steel Water Bottle', price: 599, category: 'Home & Kitchen', rating: 4, reviews: 89, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80' },
  { id: 'demo-4', name: 'Smart Fitness Band', price: 1999, originalPrice: 3499, category: 'Electronics', rating: 5, reviews: 312, discount: 43, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80' },
  { id: 'demo-5', name: 'Organic Green Tea (100 bags)', price: 449, category: 'Groceries', rating: 4, reviews: 56, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80' },
  { id: 'demo-6', name: 'Running Shoes - Ultra Light', price: 3299, originalPrice: 5999, category: 'Fashion', rating: 5, reviews: 420, discount: 45, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 'demo-7', name: 'Ceramic Coffee Mug Set (4 pcs)', price: 899, category: 'Home & Kitchen', rating: 4, reviews: 78, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
  { id: 'demo-8', name: 'USB-C Fast Charger 65W', price: 1299, originalPrice: 1999, category: 'Electronics', rating: 4, reviews: 198, discount: 35, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80' },
  { id: 'demo-9', name: 'Yoga Mat - Premium Grip', price: 1499, originalPrice: 2499, category: 'Sports', rating: 5, reviews: 145, discount: 40, image: 'https://images.unsplash.com/photo-1599815598696-6b222384784a?w=500&q=80' },
  { id: 'demo-10', name: 'Bamboo Cutting Board', price: 699, category: 'Home & Kitchen', rating: 4, reviews: 63, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745f6e?w=500&q=80' },
  { id: 'demo-11', name: 'Wireless Mouse - Ergonomic', price: 999, originalPrice: 1599, category: 'Electronics', rating: 4, reviews: 287, discount: 37, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
  { id: 'demo-12', name: 'Leather Wallet - Slim Design', price: 1199, originalPrice: 1999, category: 'Fashion', rating: 5, reviews: 192, discount: 40, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80' },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Groceries', 'Sports'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products from backend API; fall back to demo data if backend is unavailable
  useEffect(() => {
    productAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(DEMO_PRODUCTS);
        }
      })
      .catch(err => {
        console.warn('Backend unavailable, using demo products:', err.message);
        setProducts(DEMO_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="home-page page-content" id="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-slideUp">
            <span className="hero-tag">🔥 Summer Sale — Up to 50% Off</span>
            <h1 className="hero-title">
              Discover Premium<br />
              Products <span className="hero-highlight">Today</span>
            </h1>
            <p className="hero-desc">
              Shop thousands of products from top brands with fast delivery and easy returns.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                Shop Now <ChevronRight size={18} />
              </a>
              <button className="btn btn-secondary btn-lg">View Deals</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">10K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">50K+</span>
                <span className="stat-label">Customers</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">4.8★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section" id="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Products</h2>
            <div className="filter-actions">
              <button className="btn btn-ghost btn-sm">
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>
          <div className="category-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="products-section">
        <div className="container">
          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No products found</h3>
              <p>Try a different category or search term</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} style={{ animationDelay: `${idx * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
