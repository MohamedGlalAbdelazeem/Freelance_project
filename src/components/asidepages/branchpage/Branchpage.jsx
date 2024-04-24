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
  const [loader , setLoader ] = useState(true);
  const [showMessage , setShowMessage ] = useState(false);
  const Naviagate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const retrievedUser = JSON.parse(storedUser);


  useEffect(() => {
    const token = retrievedUser.access_token;
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
    const token = retrievedUser.access_token;
    axios.delete(`http://127.0.0.1:8000/api/branches/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(function (response) {
      if (response.status === 204) {
        // Successfully deleted, update UI accordingly
        setShowMessage(ture)
        setLoader(false); // Turn off loader if necessary
        // Remove the deleted branch from branches state
        setBranches(prevBranches => prevBranches.filter(branch => branch.id !== id));
      } else {
        // Handle unexpected response status
        console.error('Unexpected response status:', response.status);
        setLoader(true); // Depending on your logic, you might want to set loader to false here instead
        setShowMessage(false)
      }
    })
    .catch(function (error) {
      // Handle error
      console.error('Error deleting branch:', error);
      setLoader(true); // Depending on your logic, you might want to set loader to false here instead
    });
  }
  
  
  return (
    <main className='branchTable'>

      { showMessage&&
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
</div>
      }
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
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">ID</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الاسم</th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">الحالة</th>
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
