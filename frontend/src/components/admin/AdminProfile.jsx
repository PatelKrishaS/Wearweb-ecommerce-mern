import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture file
  const { register, handleSubmit, setValue } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("id");
      console.log("User ID from localStorage:", userId); // Debugging
     

      if (!userId || userId === "null") {
        toast.error("User ID not found. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login"); // Redirect to login page
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/user/${userId}`);
        console.log("API Response:", res.data); // Debugging
        setUser(res.data.data);
        setValue("name", res.data.data.name);
        setValue("phoneNumber", res.data.data.phoneNumber);
        setValue("email", res.data.data.email);
        setValue("gender", res.data.data.gender);
        setValue("age", res.data.data.age);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        if (err.response) {
          console.error("Server responded with:", err.response.status);
        } else if (err.request) {
          console.error("No response received from server");
        } else {
          console.error("Error setting up the request:", err.message);
        }
        toast.error("Failed to fetch user details. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    fetchUserDetails();
  }, [setValue, navigate]);

  useEffect(() => {
    if (location.state?.fromOrder) {
      toast.info('Please complete your profile before placing an order', {
        position: 'top-right',
        autoClose: 5000
      });
    }
  }, [location.state]);

  // Handle form submission for updating user details
  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId || userId === "null") {
        toast.error("User ID not found. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Prepare FormData for file upload and other form data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("email", data.email);
      formData.append("gender", data.gender);
      formData.append("age", data.age);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture); // Append the file
      }

      const res = await axios.put(`http://localhost:3000/user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      console.log("User updated:", res.data);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refetch user details to update the UI
      const updatedUser = await axios.get(`http://localhost:3000/user/${userId}`);
      setUser(updatedUser.data.data);

      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Admin Profile</h2>

            {/* Display user details */}
            {!isEditing ? (
              <div >
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    style={{ width: "100px", height: "100px", borderRadius: "50%", position:"relative", left:"40%" }}
                  />
                )}
                <div style={{position:'relative', left:'35%', marginTop:'25px'}}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setIsEditing(true)} 
                  style={{width:'400px', position:"relative", right:"13%"}}
                >
                  Edit Profile
                </button>
                </div>
              </div>
            ) : (
              // Edit form
              <form onSubmit={handleSubmit(submitHandler)}>
                {/* Name */}
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="form-control"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    {...register("phoneNumber", { required: "Phone Number is required" })}
                    className="form-control"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="form-control"
                  />
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="form-control"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    {...register("age", { min: 1, required: "Age is required" })}
                    className="form-control"
                  />
                </div>

                {/* Profile Picture */}
                <div className="form-group">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files[0])} // Set the file in state
                    className="form-control"
                  />
                </div>

                {/* Submit Button */}
                <div className="row mt-3">
                  <div className="col-md-6">
                    <button type="submit" className="btn btn-success w-100">
                      Update Profile
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};