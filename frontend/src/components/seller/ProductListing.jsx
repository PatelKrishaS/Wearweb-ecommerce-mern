import React from 'react';
import { useForm } from 'react-hook-form';

export const ProductListing = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [previewImages, setPreviewImages] = React.useState([]);

  const submitHandler = (data) => {
    console.log("Product Listing Data:", data);
    alert("Product submitted successfully!");
    reset();
    setPreviewImages([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <form className="card p-4" onSubmit={handleSubmit(submitHandler)}>
            <h2 className="card-title text-center mb-4 fs-3">Product Listing Form</h2>

            {/* Product Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                placeholder="Enter product name (e.g., Blue Jeans)"
                {...register("name", {
                  required: "Product Name is required*",
                  minLength: { value: 3, message: "Product Name must be at least 3 characters*" },
                  maxLength: { value: 100, message: "Product Name cannot exceed 100 characters*" }
                })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                placeholder="Enter product description"
                {...register("description", {
                  required: "Description is required*",
                  minLength: { value: 10, message: "Description must be at least 10 characters*" },
                  maxLength: { value: 500, message: "Description cannot exceed 500 characters*" }
                })}
              />
              {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
            </div>

            {/* Brand */}
            <div className="mb-3">
              <label htmlFor="brand" className="form-label">Brand</label>
              <input
                type="text"
                className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                id="brand"
                placeholder="Enter brand name (e.g., Nike, Apple)"
                {...register("brand", {
                  required: "Brand is required*",
                  minLength: { value: 2, message: "Brand name must be at least 2 characters*" }
                })}
              />
              {errors.brand && <div className="invalid-feedback">{errors.brand.message}</div>}
            </div>

                {/* Product Weight */}
            <div className="mb-3">
            <label htmlFor="weight" className="form-label">Weight (kg)</label>
            <input
                type="number"
                className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                id="weight"
                placeholder='Enter product weight'
                step="0.01"
                {...register("weight", {
                required: "Weight is required*",
                min: {
                    value: 0.01,
                    message: "Weight must be greater than 0*"
                }
                })}
            />
            {errors.weight && <div className="invalid-feedback">{errors.weight.message}</div>}
            </div>

            <div className="mb-3">
            <label htmlFor="dimensions" className="form-label">Dimensions (L x W x H in cm)</label>
            <div className="row">
                <div className="col">
                <input
                    type="number"
                    className={`form-control ${errors.length ? 'is-invalid' : ''}`}
                    placeholder='Length'
                    {...register("length", {
                    required: "Length is required*",
                    min: {
                        value: 1,
                        message: "Length must be at least 1 cm*"
                    }
                    })}
                />
                {errors.length && <div className="invalid-feedback">{errors.length.message}</div>}
                </div>
                <div className="col">
                <input
                    type="number"
                    className={`form-control ${errors.width ? 'is-invalid' : ''}`}
                    placeholder='Width'
                    {...register("width", {
                    required: "Width is required*",
                    min: {
                        value: 1,
                        message: "Width must be at least 1 cm*"
                    }
                    })}
                />
                {errors.width && <div className="invalid-feedback">{errors.width.message}</div>}
                </div>
                <div className="col">
                <input
                    type="number"
                    className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                    placeholder='Height'
                    {...register("height", {
                    required: "Height is required*",
                    min: {
                        value: 1,
                        message: "Height must be at least 1 cm*"
                    }
                    })}
                />
                {errors.height && <div className="invalid-feedback">{errors.height.message}</div>}
                </div>
            </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                {...register("category", { required: "Category is required*" })}
              >
                <option value="">Select Category</option>
                <option value="Men's Clothing">Men's Clothing</option>
                <option value="Women's Clothing">Women's Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
            </div>

            {/* Product Tags */}
            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags</label>
                <input
                    type="text"
                    className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                    id="tags"
                    placeholder='Enter tags (e.g., electronics, summer, casual)'
                    {...register("tags", {
                    required: "Tags are required*",
                    validate: (value) => {
                        const tags = value.split(',').map(tag => tag.trim());
                        if (tags.length < 1) return "At least one tag is required*";
                        return true;
                    }
                    })}
                />
                <small className="form-text text-muted">Separate tags with commas (e.g., electronics, summer, casual)</small>
                {errors.tags && <div className="invalid-feedback">{errors.tags.message}</div>}
            </div>

            {/* Price */}
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price ($)</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                placeholder="Enter price"
                step="0.01"
                {...register("price", {
                  required: "Price is required*",
                  min: { value: 1, message: "Price must be at least $1*" },
                  max: { value: 1000000, message: "Price cannot exceed $1,000,000*" }
                })}
              />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>

            {/* Stock Quantity */}
            <div className="mb-3">
              <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
              <input
                type="number"
                className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
                id="stockQuantity"
                placeholder="Enter stock quantity"
                {...register("stockQuantity", {
                  required: "Stock Quantity is required*",
                  min: { value: 0, message: "Stock Quantity cannot be negative*" },
                  max: { value: 100000, message: "Stock Quantity cannot exceed 100,000*" }
                })}
              />
              {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity.message}</div>}
            </div>

            {/* Product Availability */}
            <div className="mb-3">
                <label htmlFor="availability" className="form-label">Availability</label>
                <select
                    className={`form-select ${errors.availability ? 'is-invalid' : ''}`}
                    id="availability"
                    {...register("availability", { required: "Availability is required*" })}
                >
                    <option value="">Select Availability</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="pre_order">Pre-Order</option>
                </select>
                {errors.availability && <div className="invalid-feedback">{errors.availability.message}</div>}
            </div>

            {/* Product Warranty */}
            <div className="mb-3">
                <label htmlFor="warranty" className="form-label">Warranty</label>
                <input
                    type="text"
                    className={`form-control ${errors.warranty ? 'is-invalid' : ''}`}
                    id="warranty"
                    placeholder='Enter warranty details (e.g., 1 year manufacturer warranty)'
                    {...register("warranty", {
                    required: "Warranty information is required*"
                    })}
                />
                {errors.warranty && <div className="invalid-feedback">{errors.warranty.message}</div>}
            </div>

            {/* SKU */}
            <div className="mb-3">
              <label htmlFor="sku" className="form-label">SKU</label>
              <input
                type="text"
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                id="sku"
                placeholder="Enter SKU (e.g., TSHIRT-BLUE-M)"
                {...register("sku", { required: "SKU is required*" })}
              />
              {errors.sku && <div className="invalid-feedback">{errors.sku.message}</div>}
            </div>

            {/* Color and Sizes */}
            <div className="mb-3">
                <label htmlFor="colors" className="form-label">Available Colors</label>
                <input
                    type="text"
                    className={`form-control ${errors.colors ? 'is-invalid' : ''}`}
                    id="colors"
                    placeholder='Enter available colors (e.g., Red, Blue, Green)'
                    {...register("colors", {
                    required: "Color options are required*"
                    })}
                />
                {errors.colors && <div className="invalid-feedback">{errors.colors.message}</div>}
                </div>

                <div className="mb-3">
                <label htmlFor="sizes" className="form-label">Available Sizes</label>
                <input
                    type="text"
                    className={`form-control ${errors.sizes ? 'is-invalid' : ''}`}
                    id="sizes"
                    placeholder='Enter available sizes (e.g., S, M, L)'
                    {...register("sizes", {
                    required: "Size options are required*"
                    })}
                />
                {errors.sizes && <div className="invalid-feedback">{errors.sizes.message}</div>}
            </div>

            {/* Discount or Promo Codes */}
            <div className="mb-3">
                <label htmlFor="discount" className="form-label">Discount (%)</label>
                <input
                    type="number"
                    className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                    id="discount"
                    placeholder='Enter discount percentage (e.g., 10)'
                    min="0"
                    max="100"
                    {...register("discount", {
                    validate: (value) => {
                        if (value < 0 || value > 100) return "Discount must be between 0 and 100%*";
                        return true;
                    }
                    })}
                />
                {errors.discount && <div className="invalid-feedback">{errors.discount.message}</div>}
            </div>

            {/* Product Reviews */}
            <div className="mb-3">
                <label htmlFor="rating" className="form-label">Rating</label>
                <select
                    className={`form-select ${errors.rating ? 'is-invalid' : ''}`}
                    id="rating"
                    {...register("rating", {
                    required: "Rating is required*"
                    })}
                >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                {errors.rating && <div className="invalid-feedback">{errors.rating.message}</div>}
            </div>

            {/* Product shipping info */}
            <div className="mb-3">
                <label htmlFor="shippingCost" className="form-label">Shipping Cost (₹)</label>
                <input
                    type="number"
                    className={`form-control ${errors.shippingCost ? 'is-invalid' : ''}`}
                    id="shippingCost"
                    placeholder='Enter shipping cost'
                    step="0.01"
                    {...register("shippingCost", {
                    required: "Shipping cost is required*",
                    min: {
                        value: 0,
                        message: "Shipping cost cannot be negative*"
                    }
                    })}
                />
                {errors.shippingCost && <div className="invalid-feedback">{errors.shippingCost.message}</div>}
                </div>

                <div className="mb-3">
                <label htmlFor="deliveryTime" className="form-label">Estimated Delivery Time</label>
                <input
                    type="text"
                    className={`form-control ${errors.deliveryTime ? 'is-invalid' : ''}`}
                    id="deliveryTime"
                    placeholder='Enter estimated delivery time (e.g., 3-5 business days)'
                    {...register("deliveryTime", {
                    required: "Delivery time is required*"
                    })}
                />
                {errors.deliveryTime && <div className="invalid-feedback">{errors.deliveryTime.message}</div>}
            </div>

            {/* Product Return Policy */}
            <div className="mb-3">
                <label htmlFor="returnPolicy" className="form-label">Return Policy</label>
                <textarea
                    className={`form-control ${errors.returnPolicy ? 'is-invalid' : ''}`}
                    id="returnPolicy"
                    placeholder='Enter return policy details'
                    {...register("returnPolicy", {
                    required: "Return policy is required*",
                    minLength: {
                        value: 10,
                        message: "Return policy must be at least 10 characters*"
                    }
                    })}
                />
                {errors.returnPolicy && <div className="invalid-feedback">{errors.returnPolicy.message}</div>}
            </div>

            {/* Product Images */}
            <div className="mb-3">
              <label htmlFor="images" className="form-label">Product Images</label>
              <input
                type="file"
                className={`form-control ${errors.images ? 'is-invalid' : ''}`}
                id="images"
                multiple
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                {...register("images", { required: "At least one image is required*" })}
              />
              {previewImages.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  {previewImages.map((src, index) => (
                    <img key={index} src={src} alt={`Preview ${index}`} className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
                  ))}
                </div>
              )}
              {errors.images && <div className="invalid-feedback">{errors.images.message}</div>}
            </div>

            {/* Submit and Reset Buttons */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Publish Product</button>
              <button type="button" className="btn btn-secondary" onClick={() => reset()}>Clear Form</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};