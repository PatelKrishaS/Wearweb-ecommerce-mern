import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import './assets/css/adminlte.css'
import './assets/css/adminlte.min.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Login } from './components/common/Login'
import { Signup } from './components/common/Signup'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminProfile } from './components/admin/AdminProfile'
import { SellerSidebar } from './components/layouts/SellerSidebar'
import { SellerDashboard } from './components/seller/SellerDashboard'
import { SellerProfile } from './components/seller/SellerProfile'
import { CustomerProfile } from './components/customer/CustomerProfile'
import { CustomerDashboard } from './components/customer/CustomerDashboard'
import { CustomerSidebar } from './components/layouts/CustomerSidebar'
import { CustomerNavbar } from './components/layouts/CustomerNavbar'
import axios from 'axios'
import { ProductListing } from './components/seller/ProductListing'
import { CustomerAddressPage } from './components/customer/CustomerAddressPage'
import { Bounce, ToastContainer } from 'react-toastify'
import LandingPage from './components/common/LandingPage'
import PrivateRoutes from './hooks/PrivateRoutes'


function App() {

  axios.defaults.baseURL = "http://localhost:3000";

  const location = useLocation();

  useEffect(() => {
    if(location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = ""; //Remove the unwanted class for login and signup
    } else {
      document.body.className = "layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open"
    }
  }, [location.pathname])
  

  return (
    <div className={location.pathname === "/login" || location.pathname === "/signup" ? "" : "app-wrapper"}>
         <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss = {false}
        draggable
        pauseOnHover = {false}
        theme="dark"
        transition={Bounce}
      />

        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path="/" element ={<LandingPage/>}></Route>

          <Route path="" element={<PrivateRoutes/>}>
            <Route path='/customer' element={<CustomerSidebar/>}>
              <Route path='profile' element= {<CustomerProfile/>}></Route>
              <Route path='dashboard' element= {<CustomerDashboard/>}></Route>
              <Route path='account'>
                <Route path='my-profile' element={<CustomerProfile/>} /> 
                <Route path='addresses' element={<CustomerAddressPage/>} /> 
              </Route>
            </Route>
          </Route>
          <Route path='/admin' element={<AdminSidebar/>}>
            <Route path='dashboard' element= {<AdminDashboard/>}></Route>
            <Route path='profile' element= {<AdminProfile/>}></Route>
          </Route>
          <Route path='/seller' element={<SellerSidebar/>}>
            <Route path='dashboard' element= {<SellerDashboard/>}></Route>
            <Route path='profile' element= {<SellerProfile/>}></Route>
            <Route path='store-management'>
              <Route path='product-listing' element={<ProductListing />} />
            </Route>
          </Route>
        </Routes>
    </div>
  )
}

export default App
