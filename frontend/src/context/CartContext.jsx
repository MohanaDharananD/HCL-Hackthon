import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('retail_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('retail_token');
      if (!token) return; // No token (demo mode) — keep local cart as-is
      
      cartAPI.getCart().then(res => {
        if (res.data && res.data.length > 0) {
          const mappedItems = res.data.map(i => ({ ...i, id: i.productId }));
          setItems(mappedItems);
          localStorage.setItem('retail_cart', JSON.stringify(mappedItems));
        }
        // If backend cart is empty, keep any existing local items
      }).catch(err => console.error("Could not fetch cart:", err));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('retail_cart', JSON.stringify(items));
  }, [items]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addItem = async (product) => {
    if (user) {
      try {
        const res = await cartAPI.addToCart(product.id, 1);
        const mappedItems = res.data.map(i => ({ ...i, id: i.productId }));
        setItems(mappedItems);
        showToast(`${product.name} added to cart`);
        return;
      } catch (err) {
        console.error("Cart add error:", err);
      }
    }
    
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        showToast(`Updated ${product.name} quantity`);
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      showToast(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = async (productId) => {
    if (user) {
      try {
        const res = await cartAPI.removeFromCart(productId);
        setItems(res.data.map(i => ({ ...i, id: i.productId })));
        return;
      } catch (err) {
        console.error("Cart remove error:", err);
      }
    }
    setItems(prev => prev.filter(i => i.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    if (user) {
      try {
        const res = await cartAPI.updateQuantity(productId, quantity);
        setItems(res.data.map(i => ({ ...i, id: i.productId })));
        return;
      } catch (err) {
        console.error("Cart update error:", err);
      }
    }
    setItems(prev =>
      prev.map(i => (i.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clearCart();
      } catch (err) {
        console.error("Cart clear error:", err);
      }
    }
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice, toast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
