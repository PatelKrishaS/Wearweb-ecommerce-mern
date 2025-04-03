import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();

  const onSubmit = async (data) => {
        try {
        const userId = localStorage.getItem('id');
        
        if (!userId) {
            toast.error('Please login to submit a review');
            return;
        }

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        const reviewData = {
            userId,
            productId,
            rating,
            comment: data.comment
        };

        const response = await axios.post('http://localhost:3000/review/add', reviewData);
        
        if (response.status === 201) {
            toast.success('Review submitted successfully!');
            reset();
            setRating(0);
            if (onReviewSubmit) {
            onReviewSubmit(response.data.data); // Pass the new review data back
            }
        }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
            console.error('Review submission error:', error);
          }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className="star"
        style={{
          cursor: 'pointer',
          fontSize: '2rem',
          color: star <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9',
          transition: 'color 0.2s'
        }}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Write a Review</h5>
           <form onSubmit={(e) => {
            e.preventDefault(); // This prevents the page reload
            handleSubmit(onSubmit)(e);
            }}>         
            <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <div className="d-flex align-items-center">
              {renderStars()}
              <span className="ms-2">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Not rated'}
              </span>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Your Review
            </label>
            <textarea
              id="comment"
              className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
              rows="4"
              placeholder="Share your experience with this product..."
              {...register('comment', {
                required: 'Review comment is required',
                maxLength: {
                  value: 500,
                  message: 'Review cannot exceed 500 characters'
                }
              })}
            />
            {errors.comment && (
              <div className="invalid-feedback">
                {errors.comment.message}
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width:'200px'}}>
            Submit Review
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};