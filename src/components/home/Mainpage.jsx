import React from 'react'
import Header from './Header'
import Asidebar from './Asidebar'
function Mainpage() {
  return (
     <main className='flex'>
      <div>
         <Asidebar/>
      </div>
      <div className='w-full'>
        <Header/>
          
      </div>

     </main>
  )
}

export default Mainpage