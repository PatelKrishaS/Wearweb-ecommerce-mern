import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/login.css';

export const ResetPassword = () => {
    const token = useParams().token;
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        watch
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }

            const response = await axios.post("/user/resetpassword", {
                token: token,
                password: data.password
            });

            toast.success(response.data.message || "Password updated successfully!");
            navigate('/login');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 
                "Failed to reset password. Please try again."
            );
        }
    };

    return (
        <div className="custom-container">
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Reset Password</h2>
                    <p>Enter your new password below</p>

                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="New Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Must include uppercase, lowercase, number, and special character"
                                }
                            })}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => 
                                    value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button type="submit" className="submit-btn">
                        Reset Password
                    </button>

                    <div className="form-footer">
                        Remember your password? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};