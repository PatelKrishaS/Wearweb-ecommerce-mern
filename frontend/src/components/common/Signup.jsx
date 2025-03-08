import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../../assets/css/signup.css";
import { Link, useNavigate} from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export const Signup = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    //navigation
    const navigate = useNavigate();

    //State to store backend errors
    const [backendError, setBackendError] = useState({});

    const submitHandler = async(data) => {

    // console.log(data);
    // console.log("User Data Sent to Backend:", data);
    try{
    data.roleId = "67c6afff789c928be79e7426";

    const res = await axios.post("/user", data)
    console.log(res.data);

    //res.status
    if(res.status === 201){
        // alert("User created successfully")
        toast.success('User created successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
        navigate("/login")
    }
}catch (error) {
    console.error("Signup Error Response:", error.response ? error.response.data : error.message);

    if (error.response && error.response.data && error.response.data.errors) {
        setBackendError(error.response.data.errors);
    } else if (error.response && error.response.data.error.includes("E11000 duplicate key error")) {
        setBackendError({ phoneNumber: "This phone number is already registered*" });
    } else {
        setBackendError({ general: "Something went wrong. Please try again." });
    }
}

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
                <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
                />
                <form className='form' onSubmit={handleSubmit(submitHandler)} >
                    <h2>Signup</h2>

                    <div className="input-box">
                        <input type="text" placeholder='Full Name' {...register("name", validationSchema.nameValidator)}/>
                        <span style={{ color: "red" }}>{errors.name?.message || backendError.name}</span>
                    </div>

                    <div className="input-box">
                        <input type="text" placeholder='Contact Number' {...register("phoneNumber", validationSchema.contactValidator)} />
                        <span style={{color:"red"}}>{errors.phoneNumber?.message || backendError.phoneNumber}</span>
                    </div>

                    <div className="input-box">
                        <input type="email" placeholder='Email' {...register("email", validationSchema.emailValidator)} />
                        <span style={{ color: "red" }}>{errors.email?.message || backendError.email}</span>
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' {...register("password", validationSchema.passwordValidator)} autoComplete="off" />
                        <span style={{ color: "red" }}>{errors.password?.message || backendError.password}</span>
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Confirm Password' {...register("confirmPassword", validationSchema.confirmPasswordValidator)}  autoComplete="off"/>
                        <span style={{color:"red"}}>{errors.confirmPassword?.message}</span>
                    </div>

                    {backendError.general && <span style={{ color: "red" }}>{backendError.general}</span>}

                    <button type='submit'>Signup</button>
                    <p>Already Registered?  <Link to="/login">Login now</Link></p>
                </form>
            </div>
        </div>
    );
};
