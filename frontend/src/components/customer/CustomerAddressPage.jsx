// components/CustomerAddressPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export const CustomerAddressPage = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [formData, setFormData] = useState({
    street: "",
    cityId: "",
    stateId: "",
    areaId: "",
    pincode: "",
    country: "India", // Default country
    isDefault: false,
  });

  // Fetch all states
  const fetchStates = async () => {
    try {
      const res = await axios.get("/state/getallstates");
      setStates(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch cities by state ID
  const fetchCitiesByState = async (stateId) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${stateId}`);
      setCities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch areas by city ID
  const fetchAreasByCity = async (cityId) => {
    try {
      const res = await axios.get(`/area/getareabycity/${cityId}`);
      setAreas(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch addresses for the user
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`/address/user/${userId}`);
      setAddresses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle state dropdown change
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData({ ...formData, stateId, cityId: "", areaId: "" }); // Reset city and area
    await fetchCitiesByState(stateId);
  };

  // Handle city dropdown change
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setFormData({ ...formData, cityId, areaId: "" }); // Reset area
    await fetchAreasByCity(cityId);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/address/add", { ...formData, userId });
      alert("Address added successfully!");
      setShowForm(false); // Hide the form
      setFormData({ // Reset form data
        street: "",
        cityId: "",
        stateId: "",
        areaId: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
      fetchAddresses(); // Refresh the address list
    } catch (err) {
      console.error(err);
      alert("Failed to add address");
    }
  };

  // Fetch states and addresses on component mount
  useEffect(() => {
    fetchStates();
    fetchAddresses();
  }, [userId]);

  return (
    <div className="container">
      <h1>Addresses</h1>

      {/* Add Address Button */}
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Address"}
      </button>

      {/* Add Address Form (Conditionally Rendered) */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Address</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* State Dropdown */}
              <div className="form-group">
                <label>State</label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleStateChange}
                  className="form-control"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="form-group">
                <label>City</label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleCityChange}
                  className="form-control"
                  required
                  disabled={!formData.stateId}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Dropdown */}
              <div className="form-group">
                <label>Area</label>
                <select
                  name="areaId"
                  value={formData.areaId}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!formData.cityId}
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Set as Default</label>
              </div>
              <button type="submit" className="btn btn-success">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Addresses in Cards */}
      <div className="row">
        {addresses.map((address) => (
          <div key={address._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{address.street}</h5>
                <p className="card-text">
                  {address.city}, {address.state}, {address.country} - {address.pincode}
                </p>
                {address.isDefault && (
                  <span className="badge badge-success">Default</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

