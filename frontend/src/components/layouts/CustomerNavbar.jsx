import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for making HTTP requests
import orders from "../../assets/booking.png"
import ordersHover from "../../assets/new-booking.png"
import WWLogo from "../../assets/WW-logo.png"



export const CustomerNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null); // State to store user data
  const [isHovered, setIsHovered] = useState(false);


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
          {/* <li className="nav-item">
            <a
              className="nav-link btn btn-light"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list" />
            </a>
          </li> */}
          <div className="sidebar-brand" style={{height:'40px'}}>
                    <Link to="/customer/dashboard" className="brand-link">
                      <img src={WWLogo} alt="AdminLTE Logo"  width='50px' height='40px' />
                      
                    </Link>
                  </div>
          <li className="nav-item ">
            <Link className="nav-link " to="/customer/dashboard" id="shopDropdown" role="button" style={{marginLeft:'350px'}}>
              HOME
            </Link>
            {/* <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/> */}
          </li>
          <li className="nav-item ">
            <Link className="nav-link " to="/customer/collection" id="accountDropdown" role="button" >
              COLLECTION
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link " to="/customer/about" id="accountDropdown" role="button" >
              ABOUT
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link " to="/customer/contact" id="helpDropdown" role="button" >
              CONTACT
            </Link>
          </li>
        </ul>
        {/*end::Start Navbar Links*/}
        {/*begin::End Navbar Links*/}

      

        <ul className="navbar-nav ms-auto">

        {/* <li className="nav-item dropdown">
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
          </li> */}

         

        {/* <li className="nav-item ">
            <a href="#" className="nav-link ">
            <img src={orders} alt="AdminLTE Logo"  width='20px' height='20px'/>
            </a>
        </li>  */}

        

        {/* Search bar */}
        <li className="nav-item ">
            <a href="#" className="nav-link ">
            <i class="fa-solid fa-magnifying-glass"></i>
            </a>
        </li>

          {/* Orders */}
        <li className="nav-item">
          <Link 
            to="/customer/orders" 
            className="nav-link"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: 'inline-block' }}
          >
          <img 
            src={isHovered ? orders : ordersHover} 
              alt="Orders" 
              width="26" 
              height="25" 
            />
          </Link>
        </li>

        {/* Wishlist icon */}
        <li className="nav-item ">
          <Link to='/customer/wishlist' className='nav-link '>
          <i class="fa-solid fa-heart"></i>
          </Link>
        </li>

          {/* Cart icon */}
          <li className="nav-item ">
          <Link to='/customer/cart' className='nav-link '>
          <i class="fa-solid fa-cart-shopping"></i>
          </Link>
          </li>
          {/*begin::Navbar Search*/}
          
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
              <li className="user-body">
                {/*begin::Row*/}
                {/* <div className="row"> */}
                <Link to="/customer/addresses" className="btn btn-default btn-flat">
                Address
                </Link> 
                <Link to="/customer/orders" className="btn btn-default btn-flat" >
                Orders
                </Link>    
                <Link to="#" className="btn btn-default btn-flat" >
                Settings
                </Link>    
                   
                {/* </div> */}
                {/*end::Row*/}
                </li>
              <li className="user-footer">
                <Link to="/customer/profile" className="btn btn-default btn-flat">
                Profile 
                </Link>  &nbsp;
                {/* <Link to="/customer/addresses" className="btn btn-default btn-flat">
                Address
                </Link>  */}
                
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