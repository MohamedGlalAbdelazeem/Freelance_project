import { useEffect } from 'react';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Userprofilepage() {
  const userName = localStorage.getItem("username")
  const userRole = localStorage.getItem("userrole")
  const userEmail = localStorage.getItem("email")

    // useEffect(() => {
    //     axios.get('http://127.0.0.1:8000/api/refresh')
    //         .then(response => {
    //             // Handle successful response
    //             console.log('Response:', response.data);
    //         })
    //         .catch(error => {
    //             if (error.response && error.response.status === 401) {
    //                 // Unauthorized, redirect to login page
                
    //             } else {
    //                 // Handle other errors
    //                 console.error('Error:', error.message);
    //             }
    //         });
    // }, []);

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
                        </div>
                        <div className="mt-20 text-center border-b pb-12">
                            <h1 className="text-4xl font-medium text-gray-700">{userName}</h1>
                            <p className="font-light text-red-600 mt-3 text-2xl font-extrabold">Role : {userRole}</p>
                             
                            <p className="mt-2 text-gray-500">Email : {userEmail}</p>
                        </div>
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
