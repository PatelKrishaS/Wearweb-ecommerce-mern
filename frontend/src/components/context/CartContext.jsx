import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('id');

  // Memoized fetch function to prevent unnecessary recreations
  const fetchCart = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/cart/user/${userId}`);
      setCart(response.data.data);
    } catch (err) {
      setError(err.message);
      // If cart doesn't exist, create an empty one
      if (err.response?.status === 404) {
        setCart({ items: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = async (product) => {
    if (!userId) {
      navigate('/login');
      return;
    }
  
    try {
      const { _id, name, offerprice, baseprice, imageURL1, hasSizes } = product;
      const price = offerprice || baseprice;
      
      // Optimistic UI update
      const tempCart = cart || { items: [], total: 0 };
      const existingItemIndex = tempCart.items.findIndex(
        item => item.productId === _id && item.size === (hasSizes ? product.selectedSize : null)
      );
  
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...tempCart.items];
        updatedItems[existingItemIndex].quantity += product.quantity || 1;
        setCart({
          ...tempCart,
          items: updatedItems,
          total: tempCart.total + (price * (product.quantity || 1))
        });
      } else {
        // Add new item (counts as +1 to cart icon)
        setCart({
          ...tempCart,
          items: [
            ...tempCart.items,
            {
              productId: _id,
              quantity: product.quantity || 1,
              size: hasSizes ? product.selectedSize : null,
              price,
              image: imageURL1,
              name,
              _id: Date.now().toString()
            }
          ],
          total: tempCart.total + (price * (product.quantity || 1))
        });
      }
  
      // API call to backend
      await axios.post(`http://localhost:3000/cart/user/${userId}/add`, {
        productId: _id,
          quantity: product.quantity || 1,
        size: hasSizes ? product.selectedSize : null,
        price,
        image: imageURL1,
        name
      });
  
      toast.success('Added to cart!');
    } catch (err) {
      fetchCart(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      // Optimistic update
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item._id === itemId ? { ...item, quantity } : item
        ),
        total: prev.items.reduce((sum, item) => 
          sum + (item.price * (item._id === itemId ? quantity : item.quantity)), 0)
      }));

      const response = await axios.put(
        `http://localhost:3000/cart/user/${userId}/item/${itemId}`,
        { quantity }
      );
      
      // Sync with server response
      setCart(response.data.data);
    } catch (err) {
      fetchCart(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Optimistic update
      const itemToRemove = cart.items.find(item => item._id === itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId),
        total: prev.total - (itemToRemove.price * itemToRemove.quantity)
      }));

      const response = await axios.delete(
        `http://localhost:3000/cart/user/${userId}/item/${itemId}`
      );
      
      setCart(response.data.data);
      toast.success('Item removed from cart');
    } catch (err) {
      fetchCart(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      setCart({ items: [], total: 0 }); // Optimistic update
      await axios.delete(`http://localhost:3000/cart/user/${userId}/clear`);
      toast.success('Cart cleared');
    } catch (err) {
      fetchCart(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  // Calculate total items count
  const itemCount = cart?.items?.length || 0;

  // Auto-fetch cart when userId changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, userId]);

  return (
    <CartContext.Provider
      value={{
      cart, 
        loading,
        error,
        itemCount, // Added item count
      addToCart,
        updateCartItem,
      removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};