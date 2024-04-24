import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Branchpage() {
  const [branches, setBranches] = useState([]);
  const [loader , setLoader ] = useState(true);//true
  const [showMessage , setShowMessage ] = useState(false);
  const Naviagate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const retrievedUser = JSON.parse(storedUser);
  const token = retrievedUser.access_token;


// handel add branch 
const [accept , setAccetp] = useState(false);
const [branchName , setBranchName] = useState("");
const [branchLocation , setbBranchLocation ] = useState("");
const [timeFrom , setTimeFrom] = useState("");
const [timeTo , setTimeTo] = useState("");
const [branchHotline , setBranchHotline] = useState("");
const [branchStatus , setBranchStatus] = useState("");

const submitForm = async (e) => {
   e.preventDefault();
  setAccetp(true);
  setLoader(true);
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json', // Assuming JSON data is being sent
  };
  const requestData = {
    name: branchName,
    location: branchLocation,
    from: timeFrom,
    to: timeTo,
    hot_line: branchHotline,
    status: branchStatus,
  };
  setLoader(true);
  try {
    // Make the POST request to add a branch
    const res = await axios.post('http://127.0.0.1:8000/api/branches', requestData, { headers });
    // Hide loader
    setLoader(false);

    // Check response status
    if (res.status === 200) {
      // Branch added successfully
      console.log(res.data); // Log the response data if needed
      setSuccessMess(true);
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', res.status);
    }
  } catch (error) {
    // Hide loader and handle error
    setLoader(false);
    console.error('Error adding branch:', error);
    if (error.response && error.response.status === 422) {
      // If the error is a 422 Unprocessable Content error
      const { data } = error.response;
  
      // Check if there are specific validation errors
      if (data.errors) {
        // Extract validation error messages
        const validationErrors = Object.values(data.errors).flat();
  
        // Check for specific validation errors
        if (validationErrors.includes('Already_exist')) {
          // Handle the case where the branch already exists
          console.log('Branch already exists');
          // You can display a message to the user indicating that the branch already exists
        }
  
        if (validationErrors.includes('To must be greater than from')) {
          // Handle the case where the 'to' time must be greater than the 'from' time
          console.log('To must be greater than from');
          // You can display a message to the user indicating the time validation error
        }
  
        // You can handle other specific validation errors similarly
      } else {
        // Handle other types of validation errors or unexpected errors
        console.error('Unexpected validation error:', error);
        // You can display a general error message to the user
      }
    } else {
      // Handle other errors
      console.error('Unexpected error:', error);
      // You can display a general error message to the user
    }
  }
};  



// show branches
useEffect(() => {
  axios.get('http://127.0.0.1:8000/api/branches', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(function (response) {
    if (response.status === 401 ) {
      localStorage.removeItem('user');
      Naviagate("/Login")
      }else{
      setLoader(false);
      setBranches(response.data.data);
      }
  })
  .catch(function (error) {
    setLoader(false);
  })
},[]);




// handel delete branch
function deleteBranch(id) {
  axios.delete(`http://127.0.0.1:8000/api/branches/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(function (response) {
    if (response.status === 401) {
      setShowMessage(true);
      setLoader(true); // Set loader to true to hide loader
      // Inform the user to log in again due to token expiration
      setErrorMessage('يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية');

      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      // Redirect the user to the login page
      Naviagate("/Login");
    } else if (response.status === 204) {
      setLoader(false); 
      setBranches(prevBranches => prevBranches.filter(branch => branch.id !== id));
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    } else {
      console.error('Unexpected response status:', response.status);
      alert("من فضلك اعمل ريفريش للمتصفح ")
      setLoader(true); 
    }
  })
  .catch(function (error) {
    console.error('Error deleting branch:', error);
    setLoader(true); 
  });
}

  return (
    <main className='branchTable'>
       {/* add branch form */}
        <div className="flex items-center justify-center border-2 rounded-xl p-1">
          <div className="mx-auto w-full bg-white">
              <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-5">
                      <input type="text" value={branchName} onChange={(e)=> setBranchName(e.target.value)}  placeholder="اسم الفرع "
                          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                  <div className="mb-5">
                      <input type="text" value={branchLocation} onChange={(e)=> setbBranchLocation(e.target.value)} placeholder="عنوان الفرع "
                          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                  <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2">
                          <div className="mb-5">
                              <label className="mb-3 block text-base font-medium text-[#07074D]">
                                  من 
                              </label>
                              <input type="time" value={timeFrom} onChange={(e)=> setTimeFrom(e.target.value)}
                                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                          </div>
                      </div>
                      <div className="w-full px-3 sm:w-1/2">
                          <div className="mb-5">
                              <label  className="mb-3 block text-base font-medium text-[#07074D]">
                                  إلي 
                              </label>
                              <input type="time" value={timeTo} onChange={(e)=> setTimeTo(e.target.value)}
                                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                          </div>
                      </div>
                  </div>

                  <div className="mb-5 pt-3">
                      <div className="-mx-3 flex flex-wrap">
                          <div className="w-full px-3 sm:w-1/2">
                              <div className="mb-5">
                                  <input type="text" value={branchHotline} onChange={(e)=> setBranchHotline(e.target.value)} placeholder="الخط الساخن"
                                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                              </div>
                          </div>
                          <div className="w-full px-3 sm:w-1/2">
                              <div className="mb-5">
                                <label>   إذا كان الفرع مفعل ادخل 1 
                                  <br />
                                  إذا كان الفرع غير مففل ادخل 0
                                </label>
                                  <input type="text" value={branchStatus} onChange={(e)=> setBranchStatus(e.target.value)} placeholder="حالة الفرع"
                                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 mt-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                              </div>
                          </div>
                        
                      </div>
                  </div>

                  <div>
                  <button className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block">
                      إنشاء فرع جديد
                    </button>
                  </div>
              </form>
          </div>
      </div>
<div className="divider"></div>

      {/* show message for any modify in branch */}
      {showMessage&&
      <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
    <div className="flex items-center justify-center w-12 bg-emerald-500 text-white">
        <CheckCircleIcon/>
    </div>
    <div className="px-4 py-2 -mx-3">
        <div className="mx-3">
            <span className="font-semibold text-emerald-500 dark:text-emerald-400">Success</span>
            <p className="text-sm text-gray-600 dark:text-gray-200">تم حذف الفرع بنجاح</p>
        </div>
    </div>
      </div>}


      {/* Search input form */}
      <div className='my-3'>
        <form className="w-full">  
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchIcon className='text-white'/>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="البحث من عن طريق ID " required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">بحث </button>
          </div>
        </form>
      </div>

      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"><input type="checkbox" /></th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الترتيب</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الاسم</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الحالة</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">ID</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الموقع</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">من</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">إلي </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الخط الساخن </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"> التاريخ/الوقت </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">التعديل</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {branches.map((branch , index)=>{
            return(
              <tr key={branch.id} className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
              <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b block lg:table-cell relative lg:static"> 
                <input type="checkbox" />
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                {index+1}
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  px-2 text-xs font-bold">{branch.name}</span>
              </td>
              <td className="w-full lg:w-auto  text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                {branch.status === "مفعل" ?<div className='bg-green-500 text-white text-sm rounded-md'>مفعل</div> : <div className='bg-red-500 text-white rounded-md text-sm'>غير مفعل</div>}
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  py-1 px-3 text-xs font-bold">{branch.id}</span>
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  py-1 px-3 text-xs font-bold">{branch.location}</span>
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  py-1 px-3 text-xs font-bold">{branch.from}</span>
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  py-1 px-3 text-xs font-bold">{branch.to}</span>
              </td>
              <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  py-1 px-3 text-xs font-bold">{branch.hotLine}</span>
              </td>
              <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded  px-1  text-xs font-bold">{branch.created_at}</span>
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <button className='bg-green-700 text-white p-2 rounded hover:bg-green-500'>
                  <DriveFileRenameOutlineIcon/>
                </button>
                <button onClick={()=>deleteBranch(branch.id)} className='bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500'>
                  <DeleteForeverIcon/>
                </button>
              </td>
            </tr>
            )
          })
        }
        </tbody>
      </table>

      {loader && <div className="spinner"></div>}
      {/* Pagination */}
      <div className="flex mt-5">
        <a href="#" className="px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md cursor-not-allowed ">
          <div className="flex items-center -mx-1">
            <KeyboardDoubleArrowRightIcon/>
            <span className="mx-1">
              previous
            </span>
          </div>
        </a>
        <a href="#" className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md sm:inline   hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200">
          1
        </a>
        <a href="#" className="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md sm:inline   hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200">
          2
        </a>
        <a href="#" className="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md   hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200">
          <div className="flex items-center -mx-1">
            <span className="mx-1">
              Next
            </span>
            <KeyboardDoubleArrowLeftIcon/>
          </div>
        </a>
      </div>
    </main>
  )
}

export default Branchpage;
