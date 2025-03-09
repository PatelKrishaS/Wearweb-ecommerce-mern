import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';

export const CustomerAddressPage = () => {
  const [states, setStates] = useState([]); // State to store all states
  const [cities, setCities] = useState([]); // State to store cities for the selected state
  const [areas, setAreas] = useState([]); // State to store areas for the selected city
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [userAddresses, setUserAddresses] = useState([]); // State to store user addresses

  // Fetch all states
  const fetchStates = async () => {
    try {
      const res = await axios.get("/state/getallstates");
      setStates(res.data.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  // Fetch cities for the selected state
  const fetchCitiesByState = async (stateId) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${stateId}`);
      setCities(res.data.data);
      setAreas([]); // Reset areas when state changes
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  // Fetch areas for the selected city
  const fetchAreasByCity = async (cityId) => {
    try {
      const res = await axios.get(`/area/getareabycity/${cityId}`);
      setAreas(res.data.data);
    } catch (err) {
      console.error("Failed to fetch areas:", err);
    }
  };

  // Fetch addresses for the current user
  const fetchUserAddresses = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const res = await axios.get(`/user-address/user/${userId}`);
      setUserAddresses(res.data.data); // Assuming the API returns { data: [...] }
    } catch (err) {
      console.error("Failed to fetch user addresses:", err);
    }
  };

  // Fetch states and user addresses on component mount
  useEffect(() => {
    fetchStates();
    fetchUserAddresses();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Handle form submission
  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      // Prepare the payload with the correct field names
      const payload = {
        userId,
        title: data.title,
        unitName: data.unitName,
        street: data.street,
        landMark: data.landmark,
        addressDetail: data.addressDetail,
        cityId: data.cityId,
        stateId: data.stateId,
        areaId: data.areaId,
        zipCode: data.zipCode, // Use zipCode instead of pincode
      };

      console.log("Data being sent:", payload); // Log the payload

      const res = await axios.post("http://localhost:3000/user-address/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response from server:", res.data); // Log the response

      reset();
      setShowForm(false);
      // alert("Address added successfully");
      toast.success('Address added successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });

    setTimeout(() => toast.dismiss(id), 2000);

      // Refresh the list of addresses after adding a new one
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to save address:", err.response?.data || err.message); // Log the error
      alert("Failed to add address");
    }
  };

  return (
    <div className="container">
      <h1>User Addresses</h1>

      {/* Add Address Button */}
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Address"}
      </button>

      {/* Add Address Form (Conditionally Rendered) */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Address</h5> <br />
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* Title Dropdown */}
              <div className="form-group">
                <label>Title</label>
                <select
                  {...register("title", { required: "Title is required" })}
                  className="form-control"
                >
                  <option value="">Select title</option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
                {errors.title && <span className="text-danger">{errors.title.message}</span>}
              </div>

              {/* Unit Name Input */}
              <div className="form-group">
                <label>Unit Name</label>
                <input
                  type="text"
                  {...register("unitName", { required: "Unit Name is required" })}
                  className="form-control"
                />
                {errors.unitName && <span className="text-danger">{errors.unitName.message}</span>}
              </div>

              {/* Street Input */}
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  {...register("street", { required: "Street is required" })}
                  className="form-control"
                />
                {errors.street && <span className="text-danger">{errors.street.message}</span>}
              </div>

              {/* Landmark Input */}
              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  {...register("landmark", { required: "Landmark is required" })}
                  className="form-control"
                />
                {errors.landmark && <span className="text-danger">{errors.landmark.message}</span>}
              </div>

              {/* Address Detail Input */}
              <div className="form-group">
                <label>Address Detail</label>
                <textarea
                  {...register("addressDetail")}
                  className="form-control"
                  rows="3"
                  placeholder="Enter additional address details"
                />
              </div>

              {/* State Dropdown */}
              <div className="form-group">
                <label>State</label>
                <select
                  {...register("stateId", { required: "State is required" })}
                  className="form-control"
                  onChange={(e) => {
                    const stateId = e.target.value;
                    fetchCitiesByState(stateId);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
                {errors.stateId && <span className="text-danger">{errors.stateId.message}</span>}
              </div>

              {/* City Dropdown */}
              <div className="form-group">
                <label>City</label>
                <select
                  {...register("cityId", { required: "City is required" })}
                  className="form-control"
                  onChange={(e) => {
                    const cityId = e.target.value;
                    fetchAreasByCity(cityId);
                  }}
                  disabled={!cities.length}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
                {errors.cityId && <span className="text-danger">{errors.cityId.message}</span>}
              </div>

              {/* Area Dropdown */}
              <div className="form-group">
                <label>Area</label>
                <select
                  {...register("areaId")} // Optional field
                  className="form-control"
                  disabled={!areas.length}
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {errors.areaId && <span className="text-danger">{errors.areaId.message}</span>}
              </div>

              {/* ZipCode Input */}
              <div className="form-group">
                <label>ZipCode</label>
                <input
                  type="text"
                  {...register("zipCode", {
                    required: "ZipCode is required",
                    minLength: { value: 6, message: "ZipCode must be 6 digits" },
                    maxLength: { value: 6, message: "ZipCode must be 6 digits" },
                    pattern: { value: /^[0-9]{6}$/, message: "Invalid ZipCode" },
                  })}
                  className="form-control"
                />
                {errors.zipCode && <span className="text-danger">{errors.zipCode.message}</span>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-success">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display User Addresses */}
      <div className="mt-4">
        <h3>Your Saved Addresses</h3>
        {userAddresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          <div className="list-group">
            {userAddresses.map((address) => (
              <div key={address._id} className="list-group-item">
                <h5>{address.title}</h5>
                <p>
                  {address.unitName}, {address.street}, {address.landMark}, {address.addressDetail}
                </p>
                <p>
                  {address.cityId?.cityName}, {address.stateId?.stateName}, {address.zipCode}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};