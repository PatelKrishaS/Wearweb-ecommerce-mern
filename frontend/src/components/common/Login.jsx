import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import "../../assets/css/login.css";
// import "../../assets/css/toast.css";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    // const submitHandler = (data, event) => {
    //     event.preventDefault();
    //     console.log(`Login attempt with Email: ${data.email}`);
    // };

    const submitHandler = async(data) => {
        // console.log("User Data:", { ...data, password: "********" });
        //login api... http://localhost:3000/user/login
        try{
        const res = await axios.post("/user/login", data)
        // console.log("API Response:", res.data); // Log the response

        console.log(res.data);
            if(res.status === 200){
                // alert("Login Success")
                toast.success('User logged in successfully!', {
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
                localStorage.setItem("id", res.data.data._id)
                localStorage.setItem("role",res.data.data.roleId.name)

                if(res.data.data.roleId.name === "CUSTOMER"){
                    navigate("/customer") //check in app.js
                } else if(res.data.data.roleId.name === "SELLER"){
                    navigate("/seller")
                } else if(res.data.data.roleId.name === "ADMIN"){
                    navigate("/admin")
                } else{
                    navigate("/login");
                }
            }
            else{
                alert("Login Failed")
            }
        }
        catch(error){
            console.error("Login Failed: ", error);
            alert("Login Failed. Please check your credentials and try again.")
        }
        
    };

    const validationSchema = {
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
        }
    };

    // console.log(errors);

    return (
        <>
            
        <div className='custom-container'>
            <div className='form-container'>
                <form className='form' onSubmit={handleSubmit(submitHandler)} >
                    <h2>Login</h2>
                    <div className="input-box">
                        <input  type="email" placeholder='Email' {...register("email", validationSchema.emailValidator)} />
                        <span style={{ color: "red" }}>{errors.email?.message}</span>
                    </div>
                    <div className="input-box">
                        <input  type="password" placeholder='Password' {...register("password", validationSchema.passwordValidator)} autoComplete="off" />
                        <span style={{ color: "red" }}>{errors.password?.message}</span>
                    </div>
                    <a href='#'>Forgot Password?</a>
                    <button type='submit'>Login</button>
                    <p>Not Registered?  <Link to="/signup">Signup now</Link></p>
                </form>
            </div>
        </div>
        </>
    );
};
