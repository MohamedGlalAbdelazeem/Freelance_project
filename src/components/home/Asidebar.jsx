import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
 function Asidebar() {
    const Navigate = useNavigate()
    //handel logout 
function handelLogout() {
        if (localStorage.getItem("email")) {
            localStorage.removeItem("email")
            Navigate("/Login")
        } else {
            return null;
        }
      
    }
    const userName = localStorage.getItem("username");
    const userRole = localStorage.getItem("userrole");

   const  asidebarItems = [
      {text:"إدارة المستخدمين", path:"/Userpage" , icon:<GroupAddOutlinedIcon sx={{ fontSize: 37 }}/>},
      {text:"إدارة الفروع", path:"/Branchpage" , icon:<AddHomeWorkOutlinedIcon sx={{ fontSize: 37 }}/>},
      
    ];

  return (
    <>
     <aside id="asidebar" className="flex flex-col w-72 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col items-center bg-slate-600 p-4 rounded-3xl" id="admin">
        <div className="avatar online bg-white rounded-3xl ">
            <div className="w-14 rounded-full">
               < AccountCircleOutlinedIcon sx={{ fontSize: 55 }}/>
             </div>
        </div>
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">أهلا بك </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-white">{userName}</p>
         <p className="mx-2 mt-1 text-sm font-medium text-blue-300">Role : {userRole}</p>
    </div>


    <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="flex-1 -mx-3 space-y-3 ">
        <ul className="space-y-2 font-medium">
        {asidebarItems.map((item, index)=>{
         return(
               <li key={index}>
                <Link to={item.path}>
              <div href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    {item.icon}
                  <span className="ms-6 text-lg font-bold asidbaritems">
                      {item.text} 
                  </span>
            </div>
            </Link>
            <div className="divider divider-info p-0 m-0"></div>
         </li>
         );
        })}
      </ul>
        </nav>

        <div className="mt-6">
            <div className="flex items-center justify-between mt-6">
            <button id="logout" onClick={handelLogout} className="text-white w-full bg-red-700 p-2 rounded-lg hover:bg-red-400">
            تسجيل الخروج 
            <LogoutOutlinedIcon/>
            </button>
            </div>
            
        </div>
    </div>
     </aside>
    </>
  )
}

export default Asidebar