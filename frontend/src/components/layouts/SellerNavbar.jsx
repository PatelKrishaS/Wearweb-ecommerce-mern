import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import axios from 'axios';

export const SellerNavbar = ({ toggleSidebar }) => {

  const location = useLocation();
  const { searchQuery, setSearchQuery, isSearchVisible, setIsSearchVisible } = useSearch();
  const [user, setUser] = useState(null); 
  const [isHovered, setIsHovered] = useState(false);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] =useState(false)

    const navigate = useNavigate(); // Initialize useNavigate

  // Handle sign-out
  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login"); // Use navigate for redirection
  };


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
//   const handleSignOut = () => {
//     // Clear localStorage
//     localStorage.removeItem("id");
//     localStorage.removeItem("role");

//     // Redirect to the login page
//     navigate("/login"); 
//   };

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
            <li className="nav-item d-none d-md-block">
            <Link to="/seller/store-management/view-my-products" className="nav-link">
                Home
            </Link>
            </li>
            {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="storeDropdown" role="button" data-bs-toggle="dropdown">
                Store
                </a>
                    <ul className="dropdown-menu" aria-labelledby="storeDropdown">
                        <li><a className="dropdown-item" href="#">Product Listings</a></li>
                        <li><a className="dropdown-item" href="#">Inventory Management</a></li>
                        <li><a className="dropdown-item" href="#">Order Fulfillment</a></li>
                    </ul>
            </li> */}
            {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="salesDropdown" role="button" data-bs-toggle="dropdown">
                Sales
                </a>
                    <ul className="dropdown-menu" aria-labelledby="salesDropdown">
                        <li><a className="dropdown-item" href="#">Sales Reports</a></li>
                        <li><a className="dropdown-item" href="#">Customer Insights</a></li>
                        <li><a className="dropdown-item" href="#">Revenue Trends</a></li>
                    </ul>
            </li> */}
            {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="marketingDropdown" role="button" data-bs-toggle="dropdown">
                Marketing 
                </a>
                    <ul className="dropdown-menu" aria-labelledby="marketingDropdown">
                        <li><a className="dropdown-item" href="#">Promotions/Coupons</a></li>
                        <li><a className="dropdown-item" href="#">Ads Manager</a></li>
                        <li><a className="dropdown-item" href="#">Email Campaigns</a></li>
                    </ul>
            </li> */}
        </ul>
        {/*end::Start Navbar Links*/}
        {/*begin::End Navbar Links*/}
        <ul className="navbar-nav ms-auto">
        {/*begin::Navbar Search*/}
        <li className="nav-item dropdown">
            {/* <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-search"></i>
            </a> */}
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
              {/* <li className="user-body">
                <Link to="#" className="btn btn-default btn-flat">
                Address
                </Link> 
                <Link to="#" className="btn btn-default btn-flat" >
                Orders
                </Link>    
                <Link to="#" className="btn btn-default btn-flat" >
                Settings
                </Link>    
                   
                </li> */}
              <li className="user-footer">
                <Link to="/seller/profile" className="btn btn-default btn-flat">
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
                  Log out
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
  
  )
}
