import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-y-scroll no-scrollbar " >
      <Navbar />
      <div className=" flex flex-1"> 
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
      {/*<Footer />*/}
    </div>
  )
}

export default Layout