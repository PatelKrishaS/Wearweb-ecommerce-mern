import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/login.css';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/user/forgotpassword", {
                email: data.email
            });
            
            toast.success(response.data.message || "Reset link sent to your email!");
            navigate('/login');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 
                "Failed to send reset link. Please try again."
            );
        }
    };

    return (
        <div className="custom-container">
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Forgot Password</h2>
                    <p>Enter your email to receive a password reset link</p>
                    
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    <button type="submit" className="submit-btn">
                        Send Reset Link
                    </button>

                    <div className="form-footer">
                        Remember your password? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};