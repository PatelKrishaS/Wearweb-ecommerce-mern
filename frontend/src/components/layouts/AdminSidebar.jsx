import React, { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { Outlet } from 'react-router-dom';
import WWLogo from "../../assets/WW-logo.png"


export const AdminSidebar = () => {
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
      <AdminNavbar toggleSidebar={toggleSidebar}/>
      <aside className={`app-sidebar bg-body-secondary shadow ${
            isSidebarOpen ? "open" : "d-none"}`}  data-bs-theme="dark">
        <div className="sidebar-brand" style={{height:'80px'}}>
          <a href="./index.html" className="brand-link">
            <img src={WWLogo} alt="AdminLTE Logo"  width='84px' height='73px'/>
            <span className="brand-text fw-light">ADMIN</span>
          </a>
        </div>

        <div className="sidebar-content" data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}>
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">
              
              {/* Platform Management */}
              <li className={`nav-item ${openMenus.platform ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('platform')}>
                  <i className="nav-icon bi bi-speedometer"></i>
                  <p>
                    Platform Management
                    <i className={`nav-arrow bi ${openMenus.platform ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="platform-menu" className={`nav nav-treeview collapse ${openMenus.platform ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Dashboard</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>User Management</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Seller Approvals</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Product Moderation</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index2.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Category Management</p>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Analytics */}
              <li className={`nav-item ${openMenus.analytics ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('analytics')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                    Analytics
                    <i className={`nav-arrow bi ${openMenus.analytics ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="analytics-menu" className={`nav nav-treeview collapse ${openMenus.analytics ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Sales Trends</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>User Activity</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Inventory Reports</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className={`nav-item ${openMenus.system ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('system')}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>
                    System Settings
                    <i className={`nav-arrow bi ${openMenus.system ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul id="system-menu" className={`nav nav-treeview collapse ${openMenus.system ? 'show' : ''}`}>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Site Configuration</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Payment Gateways</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>API Keys</p>
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
                      <p>Dispute Resolution</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Help Center</p>
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
