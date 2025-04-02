import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create context with default values
export const ProductContext = createContext({
  relatedProducts: [],
  fetchRelatedProducts: () => {},
});

export const ProductProvider = ({ children }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [errorRelated, setErrorRelated] = useState(null);

  const fetchRelatedProducts = async (categoryId) => {
    if (!categoryId) {
      setRelatedProducts([]);
      return;
    }

    setLoadingRelated(true);
    setErrorRelated(null);
    
    try {
      const response = await axios.get(
        `http://localhost:3000/product/getProductsByCategory`,
        {
          params: {
            categoryId,
            limit: 4
          }
        }
      );
      
      setRelatedProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setErrorRelated(error.message);
      setRelatedProducts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        relatedProducts,
        fetchRelatedProducts,
        loadingRelated,
        errorRelated
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook with validation
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};