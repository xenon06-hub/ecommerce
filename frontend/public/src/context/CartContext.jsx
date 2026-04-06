import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart]       = useState({ items: [], total: '0.00' });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const data = await api.getCart();
    setCart(data);
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    await api.addToCart(productId, quantity);
    await refreshCart();
    setLoading(false);
  };

  const updateItem = async (id, quantity) => {
    await api.updateCart(id, quantity);
    await refreshCart();
  };

  const removeItem = async (id) => {
    await api.removeFromCart(id);
    await refreshCart();
  };

  const placeOrder = async () => {
    setLoading(true);
    const result = await api.checkout();
    await refreshCart();
    setLoading(false);
    return result;
  };

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, itemCount, loading, addToCart, updateItem, removeItem, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);