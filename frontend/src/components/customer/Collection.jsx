import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/custom.css';


const Collection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/category/categories');
        setCategories(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `/subcategory/getsubcategorybycategory/${selectedCategory}`
        );
        setSubcategories(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/product/products';
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        const response = await axios.get(url);
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="collection-container">
      {/* Filters Section */}
      <div className="filters-section">
        <h2>Filters</h2>
        
        {/* Categories */}
        <div className="filter-group">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map(category => (
              <div
                key={category._id}
                className={`category-item ${
                  selectedCategory === category._id ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.categoryName}
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        {selectedCategory && (
          <div className="filter-group">
            <h3>Subcategories</h3>
            <div className="subcategory-list">
              {subcategories.map(subcategory => (
                <div key={subcategory._id} className="subcategory-item">
                  {subcategory.subCategoryName}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>Products</h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.productImage} alt={product.productName} />
                <h3>{product.productName}</h3>
                <p>${product.productPrice}</p>
              </div>
            ))
          ) : (
            <div className="no-products">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;