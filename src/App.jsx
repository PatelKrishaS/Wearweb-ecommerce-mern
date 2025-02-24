import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { UserNavbar } from './components/layouts/UserNavbar'
// import './App.css'
import './assets/css/adminlte.css'
import './assets/css/adminlte.min.css'
import { UserSidebar } from './components/layouts/UserSidebar'
import { Route, Routes } from 'react-router-dom'
import { Login } from './components/common/Login'
import { Signup } from './components/common/Signup'
import { UserDashboard } from './components/user/UserDashboard'
import { UserProfile } from './components/user/UserProfile'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminProfile } from './components/admin/AdminProfile'
import { SellerSidebar } from './components/layouts/SellerSidebar'
import { SellerDashboard } from './components/seller/SellerDashboard'
import { SellerProfile } from './components/seller/SellerProfile'
import { ProductListing } from './components/common/ProductListing'


function App() {

  return (
    <>
     <body className='layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open' >
      <div className='app-wrapper'>
        <Routes>
          <Route path='/user' element={<UserSidebar/>}>
            <Route path='dashboard' element= {<UserDashboard/>}></Route>
            <Route path='profile' element= {<UserProfile/>}></Route>
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
