import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card card animate-slideUp" id={`product-${product.id}`}>
      <div className="product-image-wrapper">
        <img
          src={product.image || `https://placehold.co/400x400/FFF7ED/F97316?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-image"
        />
        {product.discount && (
          <span className="product-discount">-{product.discount}%</span>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < (product.rating || 4) ? '#F59E0B' : 'none'}
              stroke={i < (product.rating || 4) ? '#F59E0B' : '#D1D5DB'}
            />
          ))}
          <span className="rating-count">({product.reviews || 0})</span>
        </div>
        <div className="product-bottom">
          <div className="product-price">
            <span className="price-current">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          <button
            className="add-cart-btn"
            onClick={() => addItem(product)}
            id={`add-cart-${product.id}`}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
