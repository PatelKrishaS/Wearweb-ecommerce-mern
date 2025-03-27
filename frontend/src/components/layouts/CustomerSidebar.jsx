import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import WWLogo from "../../assets/WW-logo.png"
import { CustomerNavbar } from './CustomerNavbar';

export const CustomerSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Toggle function for submenus
  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId], // Toggle the clicked menu
    }
    
  ));
  };

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  // const toggleMenu = (menuId) => {
  //   setOpenMenus((prev) => {
  //     const newState = {
  //       ...prev,
  //       [menuId]: !prev[menuId], // Toggle the clicked menu
  //     };
  //     console.log('Updated State:', newState); // Debugging log
  //     return newState;
  //   });
  // };
  

  return (
    <>
      <CustomerNavbar toggleSidebar={toggleSidebar}/>
      {/* <aside className={`app-sidebar bg-body-secondary  shadow ${
            isSidebarOpen ? "open" : "d-none"}`} data-bs-theme="dark" style={{width:'200px'}} >
        <div className="sidebar-brand" style={{height:'57px'}}>
          <a href="./index.html" className="brand-link">
            <img src={WWLogo} alt="AdminLTE Logo"  width='84px' height='72px'/>
          </a>
        </div>

        <div className="sidebar-content" data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}>
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">
              
              <li className={`nav-item ${openMenus.platform ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('platform')}>
                  <i className="nav-icon bi bi-speedometer"></i>
                  <p>
                  Account
                    <i className={`nav-arrow bi ${openMenus.platform ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="platform-menu" className={`nav nav-treeview collapse ${openMenus.platform ? 'show' : ''}`}>
                 
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Orders</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Wishlist</p>
                    </a>
                  </li>
                  <li className="nav-item">
                  <Link to="/customer/addresses" className="nav-link"> 
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Addresses</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Payment Methods</p>
                    </a>
                  </li>
                </ul>
              </li>

             
              <li className={`nav-item ${openMenus.analytics ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('analytics')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                  Shopping
                    <i className={`nav-arrow bi ${openMenus.analytics ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="analytics-menu" className={`nav nav-treeview collapse ${openMenus.analytics ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Recently Viewed</p>
                    </a>
                  </li>
                  
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Deals & Offers</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.system ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('system')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                    Support
                    <i className={`nav-arrow bi ${openMenus.system ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="system-menu" className={`nav nav-treeview collapse ${openMenus.system ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Help Center</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Contact Us</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Return Policy</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.support ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('support')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                    Settings
                    <i className={`nav-arrow bi ${openMenus.support ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="support-menu" className={`nav nav-treeview collapse ${openMenus.support ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Profile Settings</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Change Password</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside> */}

      <main className="app-main" style={{width:'100vw'}}>
        <Outlet />
      </main>
    </>
  );
};
