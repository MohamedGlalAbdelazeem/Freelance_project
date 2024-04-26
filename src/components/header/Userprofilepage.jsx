import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState , useEffect } from 'react';

function Userprofilepage() {

    // const [userProfile, setUserprofile] = useState([]);
    // const [loader , setLoader ] = useState(true)
    // useEffect(() => {
      // const storedUser = localStorage.getItem('user');
      // const retrievedUser = JSON.parse(storedUser);
      // const token = retrievedUser.access_token;
    //   axios.get('http://127.0.0.1:8000/api/refresh', {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   })
    //   .then(function (response) {
    //     if (response.status === 401) {
    //         handleUnauthenticated();
    //       } else {
    //         setLoader(false)
    //        setUserprofile(response.data.Admin);
    //       }
        
    //   })
    //   .catch(function (error) {
    //     alert(error);
    //     setLoader(true);
    //     handleUnauthenticated();
    //   })
    // }, []);

//     // hande unuthenticated
// const handleUnauthenticated = () => {
//     alert('يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية');
//     Naviagate("/Login");
//     localStorage.removeItem('user');
//   };
    // const userName = userProfile.name
    // const userEmail = userProfile.email
    // const userRole = userProfile.role_name
    // const userPhone = userProfile.phone_number
    // const userRoleID = userProfile.role_id
    // const userTime = userProfile.created_at
 
    return (
        <div className="flex bg-slate-700 rounded-3xl">
            <div className="w-full">
                <div className="p-16">
                    <div className=" bg-white shadow p-5 rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                            </div>
                            <div className="relative">
                                <div className="w-32 h-32 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-16 flex items-center justify-center text-indigo-500">
                                    <AccountCircleIcon sx={{ fontSize: "8rem" }} />
                                </div>
                            </div>
                        {/* </div>
                        {loader && <div className="spinner"></div>}
                        <div className="mt-20 text-center border-b pb-12">
                            <h1 className="text-4xl text-gray-700 font-bold">{userName}</h1>
                            <p className="font-bold  text-red-600 mt-3 text-2xl underline">{userRole}</p>
                            <p className="font-bold  text-red-600 mt-3 text-xl">Role_ID : {userRoleID}</p>
                            <p className="font-bold  text-red-500 mt-3 text-xl"> الوقت / التاريخ : {userTime}</p>
                            <p className="mt-2 text-gray-500">{userEmail}</p>
                            <p className="mt-2 text-gray-500">{userPhone}</p> */}
                        </div>
                        <div className="divider divider-info">تعديل المعلومات الشخصية</div>
                        <div className="mt-12 flex flex-col justify-center">
                            <p className="text-gray-600 text-center font-light lg:px-16">
                              tesssssssssssssssssssssssssst
                            </p>
                            <button
                                className="text-indigo-500 py-2 px-4  font-medium mt-4"
                            >
                                button
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Userprofilepage;
