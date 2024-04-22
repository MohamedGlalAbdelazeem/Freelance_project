 import { useNavigate } from "react-router-dom";
function Asidebar() {
    const Navigate = useNavigate()
    //handel logout 
    function handelLogout() {
        if (localStorage.getItem("email")) {
            localStorage.removeItem("email")
            Navigate("/Login")
        } else {
            console.log("ture");
            return null;
        }
      
    }
    const userEmail = localStorage.getItem("email");
  return (
    <>
     <aside className="flex flex-col w-60 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <div className="avatar online bg-white rounded-2xl">
            <div className="w-16 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
               <path d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
             </div>
        </div>
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">أهلا بك </h4>
        <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{userEmail}</p>
    </div>

    <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="flex-1 -mx-3 space-y-3 ">
            <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  className="w-5 h-5">
                    <path  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                <span className="mx-2 text-sm font-medium">Home</span>
            </a>
        </nav>



        <div className="mt-6">
            <div className="flex items-center justify-between mt-6">
                <button onClick={handelLogout} className="text-white w-full bg-red-700 p-2 rounded-lg">تسجيل الخروج</button>
            </div>
        </div>
    </div>
     </aside>
    </>
  )
}

export default Asidebar