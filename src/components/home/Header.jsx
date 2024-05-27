

// this page contain header and asidbar 
import React from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook'; 
import { useNavigate , Link } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
 
import "./home.css"
import { toast } from 'react-toastify';
 
function Header() {
    const Navigate = useNavigate();
    
    //handel logout 
    function handelLogout() {
      if (localStorage.getItem('user_token')) {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_role_name");
        Navigate("/Login")
        toast("تم تسجيل الخروج بنجاح", { type: "success"});
      } else {
          return null;
      }
  }
  return (
    <>
      <div
        className="navbar bg-black w-full"
        style={{ backgroundColor: "#111827" }}
        id="headere"
      >
        <div className="flex-1">
          <Link
            to="/Mainpage/Userprofilepage"
            className="btn text-blue-600 hover:bg-gray-600 hover:text-white rounded-xl btn-ghost normal-case ml-4 bg-gray-200 text-lg"
          >
            <AccountBoxIcon sx={{ fontSize: 35 }} />
            الصفحة الشخصية
          </Link>
          <Link
            to="/Mainpage"
            className="btn text-blue-600 hover:bg-gray-600 hover:text-white rounded-xl btn-ghost normal-case bg-gray-200 text-lg"  >
            <MenuBookIcon sx={{ fontSize: 35 }} />
            الصندوق اليومي
          </Link>
        </div>

        <div className="flex-none gap-2">
          <a
            onClick={handelLogout}
            className="bg-red-500 hover:bg-red-800 transition  p-3 text-white cursor-pointer text-sm rounded-xl ml-2"
          >
            تسجيل الخروج
            <LogoutIcon className='mr-2'/>
          </a>
        </div>
      </div>
    </>
  );}

export default Header