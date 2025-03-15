import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast, Bounce } from 'react-toastify';

export const UpdateAddress = () => {
  const { id } = useParams(); // Get the address ID from the URL
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Fetch the address details by ID
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/user-address/${id}`);
        console.log("Fetched Address Data:", res.data.data); // Debugging
        setAddress(res.data.data);

        // Set form values
        setValue('title', res.data.data.title);
        setValue('unitName', res.data.data.unitName);
        setValue('street', res.data.data.street);
        setValue('landmark', res.data.data.landMark);
        setValue('addressDetail', res.data.data.addressDetail);
        setValue('stateId', res.data.data.stateId._id);
        setValue('cityId', res.data.data.cityId._id);
        setValue('areaId', res.data.data.areaId?._id);
        setValue('zipCode', res.data.data.zipCode);

        // Fetch cities and areas based on the current address
        fetchCitiesByState(res.data.data.stateId._id);
        fetchAreasByCity(res.data.data.cityId._id);
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, [id, setValue]);

  // Set default values for cityId and areaId after address, cities, and areas are fetched
  useEffect(() => {
    if (address && cities.length > 0 && areas.length > 0) {
      console.log("Setting cityId:", address.cityId._id); // Debugging
      console.log("Setting areaId:", address.areaId?._id); // Debugging
      setValue('cityId', address.cityId._id);
      setValue('areaId', address.areaId?._id);
    }
  }, [address, cities, areas, setValue]);

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("/state/getallstates");
        setStates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities for the selected state
  const fetchCitiesByState = async (stateId) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${stateId}`);
      console.log("Fetched Cities:", res.data.data); // Debugging
      setCities(res.data.data);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  // Fetch areas for the selected city
  const fetchAreasByCity = async (cityId) => {
    try {
      const res = await axios.get(`/area/getareabycity/${cityId}`);
      console.log("Fetched Areas:", res.data.data); // Debugging
      setAreas(res.data.data);
    } catch (err) {
      console.error("Failed to fetch areas:", err);
    }
  };

  // Handle form submission
  const submitHandler = async (data) => {
    try {
      const payload = {
        title: data.title,
        unitName: data.unitName,
        street: data.street,
        landMark: data.landmark,
        addressDetail: data.addressDetail,
        cityId: data.cityId,
        stateId: data.stateId,
        areaId: data.areaId,
        zipCode: data.zipCode,
      };

      const res = await axios.put(`http://localhost:3000/user-address/update/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success('Address updated successfully!', {
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

      setTimeout(() => {
        navigate('/customer/account/addresses'); // Redirect to the addresses page
      }, 2000);
    } catch (err) {
      console.error("Failed to update address:", err.response?.data || err.message);
      toast.error('Failed to update address!');
    }
  };

  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Update Address</h1>
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
            {...register("areaId")}
            className="form-control"
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
          Update Address
        </button>
      </form>
    </div>
  );
};