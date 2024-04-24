

// this page contain header and asidbar 
import React from 'react'
 
import { useNavigate , Link } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
 
import "./home.css"
 
function Header() {
    const Navigate = useNavigate();
    
    //handel logout 
    function handelLogout() {
      if (localStorage.getItem('user')) {
          localStorage.removeItem("user")
          Navigate("/Login")
      } else {
          return null;
      }
  }
  return (
    <>
      <div className="navbar bg-black w-full" style={{backgroundColor:"#111827"}} id='headere'>
        <div className="flex-1">
        
        </div>
        <div className="flex-none gap-2">
        
          <div className="dropdown dropdown-end ">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-white">
               <AccountCircleOutlinedIcon sx={{fontSize: 40}}/>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-xl rounded-box w-52">
            <Link to="/Mainpage/Userprofilepage" className='p-3 text-sm  hover:text-success  '>
              <li>
                  الصفحة الشخصية
              </li>
            </Link>
             
              <li>
                  <a onClick={handelLogout} className='bg-red-500 p-3 text-white cursor-pointer hover:text-black text-sm'>
                      تسجيل الخروج
                  </a>
              </li>
              </ul>
          </div>
        </div>
      </div>

      
     </>
)}

export default Header