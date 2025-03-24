import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for making HTTP requests

export const CustomerNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null); // State to store user data

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id"); // Get the user ID from localStorage
        if (userId) {
          const response = await axios.get(`http://localhost:3000/user/${userId}`); // Fetch user data
          setUser(response.data.data); // Set the user data in state
         
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle sign-out
  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login"); // Use navigate for redirection
  };

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Start Navbar Links*/}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link btn btn-light"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list" />
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link " href="#" id="shopDropdown" role="button" >
              HOME
            </a>
           
          </li>
          <li className="nav-item ">
            <a className="nav-link " href="#" id="accountDropdown" role="button" >
              COLLECTION
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link " href="#" id="helpDropdown" role="button" >
              CONTACT
            </a>
          </li>
        </ul>
        {/*end::Start Navbar Links*/}
        {/*begin::End Navbar Links*/}
        <ul className="navbar-nav ms-auto">
          {/*begin::Navbar Search*/}
          <li className="nav-item dropdown">
            <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown">
              <i className="bi bi-search"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-3">
              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search..." aria-label="Search" />
                <button className="btn btn-outline-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          </li>
          {/*end::Navbar Search*/}
          {/*begin::Messages Dropdown Menu*/}
          
          {/*end::Messages Dropdown Menu*/}
          {/*begin::Notifications Dropdown Menu*/}
          
          {/*end::Notifications Dropdown Menu*/}
          {/*begin::Fullscreen Toggle*/}
          <li className="nav-item">
            {/* <a className="nav-link" href="#" data-lte-toggle="fullscreen">
              <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen" />
              <i
                data-lte-icon="minimize"
                className="bi bi-fullscreen-exit"
                style={{ display: "none" }}
              />
            </a> */}
          </li>
          {/*end::Fullscreen Toggle*/}
          {/*begin::User Menu Dropdown*/}
          <li className="nav-item dropdown user-menu">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="user-image rounded-circle shadow"
                  alt="User Image"
                />
              ) : (
                <img
                  src="../../dist/assets/img/user2-160x160.jpg"
                  className="user-image rounded-circle shadow"
                  alt="User Image"
                />
              )}
              <span className="d-none d-md-inline">{user?.name || "Alexander Pierce"}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              {/*begin::User Image*/}
              <li className="user-header text-bg-primary">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    className="rounded-circle shadow"
                    alt="User Image"
                  />
                ) : (
                  <img
                    src="../../dist/assets/img/user2-160x160.jpg"
                    className="rounded-circle shadow"
                    alt="User Image"
                  />
                )}
                <p>
                  {user?.name || "User's name"} 
                  <small>...</small>
                </p>
              </li>
              {/*end::User Image*/}
                
              <li className="user-footer">
                <Link to="/customer/profile" className="btn btn-default btn-flat">
                  Profile
                </Link>
                <a
                  href="#"
                  className="btn btn-default btn-flat float-end"
                  onClick={handleSignOut} // Attach handleSignOut to the Sign out button
                >
                  Sign out
                </a>
              </li>
              {/*end::Menu Footer*/}
            </ul>
          </li>
          {/*end::User Menu Dropdown*/}
        </ul>
        {/*end::End Navbar Links*/}
      </div>
      {/*end::Container*/}
    </nav>
  );
};