// context/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  const fetchWishlist = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/wishlist/${userId}`);
      // Ensure we're getting the products array properly
      setWishlist(response.data.items || []);
    } catch (err) {
      setError(err.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToWishlist = async (productId) => {
    if (!userId) {
      navigate('/login');
      return;
    }
  
    try {
      // Optimistic UI update
      setWishlist(prev => [...(prev || []), { productId }]);
      
      await axios.post(`http://localhost:3000/wishlist/${userId}/add/${productId}`);
      toast.success('Added to wishlist!');
    } catch (err) {
      fetchWishlist(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // Optimistic update
      setWishlist(prev => (prev?.filter(item => item.productId !== productId) || []));
      
      await axios.delete(`http://localhost:3000/wishlist/${userId}/remove/${productId}`);
      toast.success('Removed from wishlist');
    } catch (err) {
      fetchWishlist(); // Revert on error
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist?.some(item => item.productId === productId) || false;
  };

  // Auto-fetch wishlist when userId changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, userId]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        itemCount: wishlist?.length || 0,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};