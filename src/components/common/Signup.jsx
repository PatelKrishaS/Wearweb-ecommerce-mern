import React from 'react';
import { useForm } from 'react-hook-form';
import "../../assets/css/signup.css";
import { Link } from 'react-router-dom';

export const Signup = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const submitHandler = (data) => {
        console.log("User Signup Data:", { 
            ...data,
            password: "********", 
            confirmPassword: "********"});
    };

    const validationSchema = {
        nameValidator: {
            required: {
                value: true,
                message: "Name is required*"
            },
            minLength: {
                value: 3,
                message: "Name must be at least 3 characters long*"
            }
        },
        contactValidator: {
            required: {
                value: true,
                message:"Contact is required*"
            },
            pattern:{
                
                value: /[6-9]{1}[0-9]{9}/,
                message: "Contact is not valid*"
            }
        },
        emailValidator: {
            required: {
                value: true,
                message: "Email is required*"
            },
            pattern: {
                value: /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email*"
            }
        },
        passwordValidator: {
            required: {
                value: true,
                message: "Password is required*"
            },
            minLength: {
                value: 7,
                message: "Password must be at least 7 characters long*"
            },
            pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
                message: "Password must include uppercase, lowercase, number, and special character*"
            }
        },
        confirmPasswordValidator: {
            required: {
                value: true,
                message: "Confirm Password is required*"
            },
            validate: (value) =>
                value === getValues("password")|| "Passwords do not match*"
        }
    };

    return (
        <div className='custom-container'>
            <div className='form-container'>
                <form className='form' onSubmit={handleSubmit(submitHandler)} >
                    <h2>Signup</h2>

                    <div className="input-box">
                        <input type="text" placeholder='Full Name' {...register("name", validationSchema.nameValidator)}/>
                        <span style={{ color: "red" }}>{errors.name?.message}</span>
                    </div>

                    <div className="input-box">
                        <input type="text" placeholder='Contact Number' {...register("contact", validationSchema.contactValidator)} />
                        <span style={{color:"red"}}>{errors.contact?.message}</span>
                    </div>

                    <div className="input-box">
                        <input type="email" placeholder='Email' {...register("email", validationSchema.emailValidator)} />
                        <span style={{ color: "red" }}>{errors.email?.message}</span>
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' {...register("password", validationSchema.passwordValidator)} autoComplete="off" />
                        <span style={{ color: "red" }}>{errors.password?.message}</span>
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Confirm Password' {...register("confirmPassword", validationSchema.confirmPasswordValidator)}  autoComplete="off"/>
                        <span style={{color:"red"}}>{errors.confirmPassword?.message}</span>
                    </div>

                    <button type='submit'>Signup</button>
                    <p>Already Registered?  <Link to="/login">Login now</Link></p>
                </form>
            </div>
        </div>
    );
};
