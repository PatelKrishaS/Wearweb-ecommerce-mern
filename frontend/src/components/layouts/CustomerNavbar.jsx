import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import orders from "../../assets/booking.png"
import ordersHover from "../../assets/new-booking.png"
import WWLogo from "../../assets/WW-logo.png"
import Dropdown from "../../assets/photos/drpdwn.png"
import '../../assets/css/custom.css';



export const CustomerNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null); // State to store user data
  const [isHovered, setIsHovered] = useState(false);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] =useState(false)


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
    navigate("/login"); 
  };

  return (
    <nav className={`app-header navbar navbar-expand bg-body  `}>
      {/*begin::Container*/}
      <div className="container-fluid">
        {/*begin::Start Navbar Links*/}
        <ul 
          className={`navbar-nav `} 
          id='cust-navbar-items'
        >        
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
          <div className={`sidebar-brand ${visible ? 'hide-content' : ''}`} style={{height:'40px', marginRight:'240px'}} id='logo'>
                    <Link to="/customer/dashboard" className="brand-link">
                      <img src={WWLogo} alt="AdminLTE Logo"  width='50px' height='40px' className={` ${visible ? 'hide-content' : ''}`} />
                      
                    </Link>
          </div>
              
          <li className="nav-item ">
          <div className="home-container">
            <NavLink className={({ isActive }) => isActive ? "nav-link home-link active" : "nav-link home-link"}  to="/customer/dashboard" id="home" role="button"  >
              HOME
            </NavLink>
            <hr className='home-underline'/>
            </div>
          </li>
          <li className="nav-item ">
          <div className="home-container">
            <NavLink className={({ isActive }) => isActive ? "nav-link home-link active" : "nav-link home-link"}  to="/customer/collection" id="collection" role="button" >
              COLLECTION
            </NavLink>
            <hr className='home-underline'/>
            </div>

          {/* <hr className='w-2/4 border-none h-[1.5px] bg-gray-700'/> */}
          </li>
          <li className="nav-item ">
          <div className="home-container">
            <NavLink className={({ isActive }) => isActive ? "nav-link home-link active" : "nav-link home-link"}  to="/customer/about" id="about" role="button" >
              ABOUT
            </NavLink>
            <hr className='home-underline'/>
            </div>

          </li>
          <li className="nav-item ">
          <div className="home-container">
            <NavLink className={({ isActive }) => isActive ? "nav-link home-link active" : "nav-link home-link"}  to="/customer/contact" id="contact" role="button" >
              CONTACT
            </NavLink>
            <hr className='home-underline'/>
            </div>

          </li>
       
        </ul>
        {/*end::Start Navbar Links*/}
        {/*begin::End Navbar Links*/}

      
        <button 
            className="mobile-menu-btn d-md-none sm-hidden" 
            onClick={() => setVisible(true)}
          >
          <i className="bi bi-list"></i>
          </button> 

          {/* Sidebar menu for small screens   */}
          <div className="s-hidden" style={{ width: visible ? '100%' : '0%', height:'230px' }}>
            <div onClick={() => setVisible(false)} className='cust-div1' >
              <div style={{display:'inline-flex'}}>
              <img 
                src={Dropdown} 
                alt="" 
                width='30px' height='25px' 
              />
              <p style={{margin:'0'}}>Back</p>
              </div>
                <NavLink to='/customer/dashboard' className='links'>Home</NavLink>
                <NavLink to='/customer/collection'  className='links' >Collection</NavLink>
                <NavLink to='/customer/about'  className='links' >About</NavLink>
                <NavLink to='/customer/contact'  className='links' >Contact</NavLink>
                <NavLink to='/customer/wishlist'  className='links' >Wishlist</NavLink>
                <NavLink to='/customer/cart'  className='links' >Cart</NavLink>
                <NavLink to='/customer/orders'  className='links' >Orders</NavLink>
            </div>
          </div>
        <ul className="navbar-nav ms-auto">

     
        

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
          <p className='count'>10</p>
          </Link>
          </li>
          
          <li className="nav-item">
           
          </li>
    

      

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
                  Log out
                </a>
              </li>
              {/*end::Menu Footer*/}
            </ul>
          </li>
          {/*end::User Menu Dropdown*/}
          
          {/* Menu bar */}
         
      
        </ul>
        {/*end::End Navbar Links*/}
      </div>
      {/*end::Container*/}
    </nav>
  );
};