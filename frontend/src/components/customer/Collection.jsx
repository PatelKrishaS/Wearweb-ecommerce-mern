import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Title } from './Title';
import dropdown_icon from '../../assets/photos/dropdown_icon.png'
// import { sortProducts } from '../../utils/productUtils';
import { sortProducts } from '../../utils/ProductUtils.js';


axios.defaults.baseURL = 'http://localhost:3000';

export const Collection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    subcategories: false,
    products: true
  });
  const [sortOption, setSortOption] = useState('relevant');
 

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    let result = [...products];
    
     

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => {
        const productCategoryId = 
          typeof product.categoryId === 'object' 
            ? product.categoryId._id 
            : product.categoryId;
        return productCategoryId === selectedCategory;
      });
    }
  
    // Apply subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => {
        const productSubCategoryId = 
          typeof product.subCategoryId === 'object'
            ? product.subCategoryId._id?.toString()
            : product.subCategoryId?.toString();
        return selectedSubcategories.includes(productSubCategoryId);
      });
    }
  
    // Apply sorting
    result = sortProducts(result, sortOption);
  
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategories, products, sortOption]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/category/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        setSelectedSubcategories([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, subcategories: true }));
        const response = await axios.get(
          `/subcategory/getsubcategorybycategory/${selectedCategory}`
        );
        setSubcategories(response.data.data);
        setSelectedSubcategories([]);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      } finally {
        setLoading(prev => ({ ...prev, subcategories: false }));
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(prev => ({ ...prev, products: true }));
        const response = await axios.get('/product');
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };
    fetchProducts();
  }, []);

  // Apply filters when selections change
  // useEffect(() => {
  //   let result = [...products];

  //   if (selectedCategory) {
  //     result = result.filter(product => {
  //       const productCategoryId = 
  //         typeof product.categoryId === 'object' 
  //           ? product.categoryId._id 
  //           : product.categoryId;
  //       return productCategoryId === selectedCategory;
  //     });
  //   }

  //   if (selectedSubcategories.length > 0) {
  //     result = result.filter(product => {
  //       const productSubCategoryId = 
  //         typeof product.subCategoryId === 'object'
  //           ? product.subCategoryId._id?.toString()
  //           : product.subCategoryId?.toString();
  //       return selectedSubcategories.includes(productSubCategoryId);
  //     });
  //   }

  //   setFilteredProducts(result);
  // }, [selectedCategory, selectedSubcategories, products]);

  const handleSubcategoryToggle = (subcategoryId) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  if (loading.categories) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  

  return (
    <div className="container-fluid my-5">
      <div className="row">
        {/* Filters Section - Left Sidebar */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">FILTERS</h5>
            </div>
            <div className="card-body">
              {/* Categories Filter */}
              <div className="mb-4">
                <h6 className="font-weight-bold">CATEGORIES</h6>
                <div className="list-group list-group-flush">
                  {categories.map(category => (
                    <button
                      key={category._id}
                      className={`list-group-item list-group-item-action ${selectedCategory === category._id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category._id)}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Subcategories Filter */}
              {selectedCategory && (
                <div className="mb-4">
                  <h6 className="font-weight-bold">SUBCATEGORIES</h6>
                  <div className="list-group list-group-flush">
                    {loading.subcategories ? (
                      <div className="text-center py-2">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : subcategories.length > 0 ? (
                      subcategories.map(subcategory => (
                        <button
                          key={subcategory._id}
                          className={`list-group-item list-group-item-action ${selectedSubcategories.includes(subcategory._id) ? 'active' : ''}`}
                          onClick={() => handleSubcategoryToggle(subcategory._id)}
                        >
                          {subcategory.subCategoryName}
                        </button>
                      ))
                    ) : (
                      <div className="text-muted small">No subcategories available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section - Main Content */}
        <div className="col-md-9">
          <div className='d-flex justify-content-between' >
            <Title text1={'PRODUCT'} text2={'COLLECTION'} />
            <p className=" mx-auto small text-secondary">
              {selectedCategory 
                ? `Showing ${filteredProducts.length} products in ${categories.find(c => c._id === selectedCategory)?.categoryName}`
                : `Showing all ${filteredProducts.length} products`}
            </p>
            <select 
  className="form-select border border-secondary p-0" 
  style={{ width: '180px', height: '26px', fontSize: '14px', textAlign:'center' }}
  value={sortOption}
  onChange={handleSortChange}
>
  <option value="relevant">Sort by: Relevant</option>
  <option value="low-high">Sort by: Low to High</option>
  <option value="high-low">Sort by: High to Low</option>
</select>

            </div>

          {loading.products ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col d-flex">
                  <Link 
                    to={`/customer/getProductById/${product._id}`}
                    className="text-decoration-none text-dark w-100"
                  >
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      {/* Discount badge */}
                      {product.offerPercentage && (
                        <span className="badge bg-success position-absolute top-0 end-0 m-2">
                          {product.offerPercentage}% OFF
                        </span>
                      )}
                      
                      {/* Product image */}
                      <div className="flex-grow-1 d-flex align-items-center p-3" style={{ minHeight: '250px' }}>
                        <img 
                          src={product.imageURL1} 
                          className="card-img-top img-fluid mx-auto" 
                          alt={product.name}
                          style={{ 
                            maxHeight: '220px',
                            width: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                      
                      {/* Product details */}
                      <div className="card-body p-3">
                        <div className="product-name" style={{ minHeight: '72px' }}>
                          {product.name.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                        
                        <div className="price-section mt-2">
                          <div className="d-flex align-items-baseline">
                            <span className="text-danger fw-bold fs-5">
                              ₹{product.offerprice || product.baseprice}
                            </span>
                            {product.offerprice && (
                              <small className="text-muted text-decoration-line-through ms-2 fs-6">
                                ₹ {product.baseprice}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="alert alert-info">
                No products match your selected filters
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

