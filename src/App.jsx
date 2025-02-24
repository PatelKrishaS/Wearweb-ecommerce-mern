import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import './assets/css/adminlte.css'
import './assets/css/adminlte.min.css'
import { Route, Routes } from 'react-router-dom'
import { Login } from './components/common/Login'
import { Signup } from './components/common/Signup'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminProfile } from './components/admin/AdminProfile'
import { SellerSidebar } from './components/layouts/SellerSidebar'
import { SellerDashboard } from './components/seller/SellerDashboard'
import { SellerProfile } from './components/seller/SellerProfile'
import { ProductListing } from './components/common/ProductListing'
import { CustomerProfile } from './components/customer/CustomerProfile'
import { CustomerDashboard } from './components/customer/CustomerDashboard'
import { CustomerSidebar } from './components/layouts/CustomerSidebar'
import { CustomerNavbar } from './components/layouts/CustomerNavbar'


function App() {

  return (
    <>
     <body className='layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open' >
      <div className='app-wrapper'>
        <Routes>
          <Route path='/customer' element={<CustomerSidebar/>}>
            <Route path='profile' element= {<CustomerProfile/>}></Route>
            <Route path='dashboard' element= {<CustomerDashboard/>}></Route>
          </Route>
          <Route path='/admin' element={<AdminSidebar/>}>
            <Route path='dashboard' element= {<AdminDashboard/>}></Route>
            <Route path='profile' element= {<AdminProfile/>}></Route>
          </Route>
          <Route path='/seller' element={<SellerSidebar/>}>
          <Route path='dashboard' element= {<SellerDashboard/>}></Route>
          <Route path='profile' element= {<SellerProfile/>}></Route>
            <Route path="store-management">
              <Route path="product-listing" element={<ProductListing />} />
              {/* <Route path="inventory-management" element={<InventoryManagement />} />
              <Route path="order-fulfillment" element={<OrderFulfillment />} /> */}
            </Route>
          </Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
        </Routes>
      </div>
     </body>
    </>
  )
}

export default App
