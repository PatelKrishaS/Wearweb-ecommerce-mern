import React, { useState, useEffect } from "react";
import axios from "axios";

export const CustomerAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    unitName: "",
    street: "",
    landMark: "",
    cityId: "",
    stateId: "",
    addressDetail: "",
    zipCode: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Retrieve userId from localStorage
  const userId = localStorage.getItem("userId");

  // Fetch all states
  const fetchStates = async () => {
    try {
      console.log("Fetching states..."); // Debug: Check if the function is called
      const res = await axios.get("/state/getallstates");
      console.log("API Response:", res); // Debug: Check the entire response
      console.log("States fetched:", res.data.data); // Debug: Check the data structure
      setStates(res.data.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  // Fetch cities by state ID
  const fetchCitiesByState = async (stateId) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${stateId}`);
      setCities(res.data.data);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  // Fetch addresses for the user
  const fetchAddresses = async () => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    try {
      const res = await axios.get(`/user-address/user/${userId}`);
      setAddresses(res.data.data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle state dropdown change
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData({ ...formData, stateId, cityId: "" }); // Reset cityId
    await fetchCitiesByState(stateId);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user-address/add", { ...formData, userId });
      alert("Address added successfully!");
      setShowForm(false); // Hide the form
      setFormData({ // Reset form data
        title: "",
        unitName: "",
        street: "",
        landMark: "",
        cityId: "",
        stateId: "",
        addressDetail: "",
        zipCode: "",
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
    if (userId) {
      fetchAddresses(); // Only fetch addresses if userId is defined
    }
  }, [userId]); // Re-run effect if userId changes

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
                <label>Title</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Title</option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unit Name</label>
                <input
                  type="text"
                  name="unitName"
                  value={formData.unitName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
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
              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landMark"
                  value={formData.landMark}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
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
                      {state.stateName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!formData.stateId}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Address Detail</label>
                <input
                  type="text"
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Addresses */}
      <div className="row">
        {addresses.map((address) => (
          <div key={address._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{address.title}</h5>
                <p className="card-text">
                  {address.unitName}, {address.street}, {address.landMark}
                </p>
                <p className="card-text">
                  {address.cityId?.name}, {address.stateId?.name}, {address.zipCode}
                </p>
                <p className="card-text">{address.addressDetail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};