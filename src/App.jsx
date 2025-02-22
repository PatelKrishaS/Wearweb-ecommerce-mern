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
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
        </Routes>
      </div>
     </body>
    </>
  )
}

export default App
