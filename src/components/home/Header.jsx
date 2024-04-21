

// this page contain header and asidbar 
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser ,faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import "./home.css"
 
function Header() {
     const Navigate = useNavigate()
    //handel logout 
    function handelLogout() {
        localStorage.removeItem("email")
        Navigate("/Login")
    }
  return (
     <header>
        <div className="navbar" style={{ backgroundColor: "#4A00FF" }}>
                      
            <div className="flex-1">
                
              {/* strat asidebar */}
                <aside>
                <div className="drawer z-50">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="my-drawer" className="btn btn-neutral drawer-button">
                           <FontAwesomeIcon icon={faBarsStaggered}  className='w-10 h-10'/>
                        </label>
                    </div> 
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                            {/* Sidebar content here */}
                            <li>
                                <a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Item 2
                                </a>
                            </li>
                            <li>
                                <a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Item 1
                                </a>
                            </li>
                            <li>
                                <a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Item 3
                                </a>
                            </li>
                            
                            </ul>
                    </div>
                    </div>
                </aside>
            </div>

                {/* user icon */}
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="avatar online">
                        <div className="w-15 rounded-full bg-white">
                             <FontAwesomeIcon icon={faUser}  className='w-8 h-8 p-1'/>
                        </div>
                        </div>    
                    </div>
                    <ul tabIndex={0} className="menu menu-sm text-white dropdown-content mt-3 z-[1] p-2 shadow bg-gray-700 rounded-box w-56">
                        <li>
                        <a className="justify-between">
                            الصفحة الشخصية
                        </a>
                        </li>
                        <hr/>
                        <li><a>الإعدادات</a></li>
                        <li onClick={handelLogout}>
                            <a >تسجيل الخروج</a>
                        </li>
                    </ul>
                    </div>
                </div>

               

            </div>
     </header>
  )
}

export default Header