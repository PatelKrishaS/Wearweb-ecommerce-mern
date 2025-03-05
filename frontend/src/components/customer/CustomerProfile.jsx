import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

export const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "Krisha Patel",
    email: "krisha@example.com",
    phone: "123-456-7890",
    bio: "Software Engineer & Tech Enthusiast",
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  return (
    <>
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">User Profile</h2>

          {isEditing ? (
            <div>
              {/* Edit Form */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button className="btn btn-primary me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              {/* Display User Details */}
              <p><strong>Full Name:</strong> {userData.fullName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Bio:</strong> {userData.bio}</p>

              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="card card-primary card-outline mb-4">
                  {/* <!--begin::Header--> */}
                  <div className="card-header"><div class="card-title">Quick Example</div></div>
                  {/* <!--end::Header--> */}
                  {/* <!--begin::Form--> */}
                  <form>
                    {/* <!--begin::Body--> */}
                    <div className="card-body">
                      <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">
                          We'll never share your email with anyone else.
                        </div>
                      </div>
                      <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1"/>
                      </div>
                      <div className="input-group mb-3">
                        <input type="file" class="form-control" id="inputGroupFile02"/>
                        <label class="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                      </div>
                      <div className="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="htmlForm-check-label" for="exampleCheck1">Check me out</label>
                      </div>
                    </div>
                    {/* <!--end::Body--> */}
                    {/* <!--begin::Footer--> */}
                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                    {/* <!--end::Footer--> */}
                  </form>
                  {/* <!--end::Form--> */}
                </div>
    </>
  );
};



