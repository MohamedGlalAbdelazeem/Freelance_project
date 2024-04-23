import React from 'react'
import Header from './Header'
import Asidebar from './Asidebar'
import {Outlet} from 'react-router-dom';
function Mainpage() {
  return (
     <main className='flex'>
      <div>
         <Asidebar/>
      </div>
      <div className='w-full'>
        <Header/>
        <div className='p-5'>
            <Outlet/>
        </div>
      </div>
     </main>
  )
}

export default Mainpage