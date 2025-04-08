import React, { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { Outlet, Link } from 'react-router-dom';
import WWLogo from "../../assets/WW-logo.png";

export const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${isSidebarOpen ? "open" : "d-none"}`}
        data-bs-theme="dark"
        style={{ height: '100vh' }}
      >
        <div className="sidebar-brand" style={{ height: '80px' }}>
          <a href="/" className="brand-link d-flex align-items-center">
            <img src={WWLogo} alt="Admin Logo" width="84" height="73" />
            <span className="brand-text fw-light ms-2">ADMIN</span>
          </a>
        </div>

        <div className="sidebar-content">
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">

              {/* Dashboard */}
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">
                  <i className="nav-icon bi bi-speedometer2"></i>
                  <p>Dashboard</p>
                </Link>
              </li>

              {/* User Management */}
              <li className={`nav-item ${openMenus.user ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('user')}>
                  <i className="nav-icon bi bi-people"></i>
                  <p>
                    User Management
                    <i className={`nav-arrow bi ${openMenus.user ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul className={`nav nav-treeview collapse ${openMenus.user ? 'show' : ''}`}>
                  <li className="nav-item">
                    <Link to="/admin/users" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>All Users</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/users/sellers" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>All Sellers</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Reports & Analytics */}
              <li className={`nav-item ${openMenus.reports ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('reports')}>
                  <i className="nav-icon bi bi-bar-chart-line"></i>
                  <p>
                    Reports & Analytics
                    <i className={`nav-arrow bi ${openMenus.reports ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                  </p>
                </a>
                <ul className={`nav nav-treeview collapse ${openMenus.reports ? 'show' : ''}`}>
                  <li className="nav-item">
                    <Link to="/admin/reports/categories" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Top Categories</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/reports/users" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Top Users</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/reports/revenue" className="nav-link">
                      <i className="nav-icon bi bi-circle"></i>
                      <p>Revenue Chart</p>
                    </Link>
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
