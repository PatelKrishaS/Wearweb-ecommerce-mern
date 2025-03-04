import React, { useState } from 'react'
import { SellerNavbar } from './SellerNavbar'
import { Link, Outlet } from 'react-router-dom'
import WWLogo from "../../assets/WW-logo.png"

export const SellerSidebar = () => {
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


  return (
    <>
      <SellerNavbar toggleSidebar={toggleSidebar}/>
      <aside className={`app-sidebar bg-body-secondary  shadow ${
            isSidebarOpen ? "open" : "d-none"}`} data-bs-theme="dark">
        <div className="sidebar-brand" style={{height:'80px'}}>
          <a href="./index.html" className="brand-link">
            <img src={WWLogo} alt="AdminLTE Logo"  width='84px' height='73px'/>
            <span className="brand-text fw-light">SELLER</span>
          </a>
        </div>

        <div className="sidebar-content" data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}>
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">
              
              {/* Store Management */}
              <li className={`nav-item ${openMenus.store ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('store')}>
                  <i className="nav-icon bi bi-speedometer"></i>
                  <p>
                  Store Management
                    <i className={`nav-arrow bi ${openMenus.store ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="store-menu" className={`nav nav-treeview collapse ${openMenus.store ? 'show' : ''}`}>
                  <li className="nav-item">
                  <Link to="/seller/store-management/product-listing" className="nav-link"> {/* Use Link */}
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Product Listings</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Inventory Management</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Order Fulfillment</p>
                    </a>
                  </li>
                </ul>
              </li>

              {/*Sale and Analytics */}
              <li className={`nav-item ${openMenus.analytics ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('analytics')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                  Sales & Analytics
                    <i className={`nav-arrow bi ${openMenus.analytics ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="analytics-menu" className={`nav nav-treeview collapse ${openMenus.analytics ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Sales Reports</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Customer Insights</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Revenue Trends</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.marketing ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('marketing')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                  Marketing
                    <i className={`nav-arrow bi ${openMenus.marketing ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="marketing-menu" className={`nav nav-treeview collapse ${openMenus.marketing ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Promotions/Coupons</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Ads Manager</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.settings ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('settings')}>
                  {/* <i className="nav-icon bi bi-graph-up"></i> */}
                  {/* <i class="fa-regular fa-gear"></i> */}
                  <i className="fas fa-cog"></i>

                  <p>
                    Settings
                    <i className={`nav-arrow bi ${openMenus.settings ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="settings-menu" className={`nav nav-treeview collapse ${openMenus.settings ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Store Profile</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>GST/Bank Details </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Shipping Policies</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.support ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('support')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                  Support
                    <i className={`nav-arrow bi ${openMenus.support ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="support-menu" className={`nav nav-treeview collapse ${openMenus.support ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Seller Help Center</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Contact Support</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
