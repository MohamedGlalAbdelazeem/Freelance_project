import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Switch } from '@mui/material';
function Categoriespage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [CategoryStatus  , setCategoryStatus ] = useState("");
  const [timeFrom , setTimeFrom] = useState("");
  const [timeTo , setTimeTo] = useState("");
  
  const [loader, setLoader] = useState(true);
  const [inputsMessage, setInputsMessage] = useState(false);
  const [categoryloyeeName, setcategoryloyeeName] = useState("");
  const [categoryloyeeMail, setcategoryloyeeMail] = useState("");
  const [categoryloyeePhone, setcategoryloyeePhone] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [searchValue , setSearchValue] = useState("");
  const userToken = localStorage.getItem('user_token');

  const [Categorys , setCategorys ] = useState([]);
  const [searchWay, setSearchWay] = useState("ID");
  const Naviagate = useNavigate();

// hande unuthenticated
  const handleUnauthenticated = () => {
    alert("يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية");
    Naviagate("/Login");
    localStorage.removeItem("user_token");
  };

  useEffect(() => {
    fetchCategorys ();
  }, []);
  
  const fetchCategorys  = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}categories`, {
        headers: {
          Authorization:`Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
          return;
        }
        setCategorys (response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
// handle categoryloyee register
  const handlecategoryRegister = (e) => {
    setLoader(true);
    e.preventDefault();
    if (
      categoryloyeeName === "" ||
      categoryloyeeMail === "" ||
      categoryloyeePassword === "" ||
      categoryloyeePasswordConfirm === "" ||
      categoryloyeePhone === "" ||
      branchNumber === ""
    ) {
      setInputsMessage(true);
      return;
    }
    if (categoryloyeePassword !== categoryloyeePasswordConfirm) {
      setInputsMessage(true);
      return;
    }
    setInputsMessage(false);
    const categoryloyeeData = {
      name: categoryloyeeName,
      email: categoryloyeeMail,
      password: categoryloyeePassword,
      password_confirmation: categoryloyeePasswordConfirm,
      phone_number: categoryloyeePhone,
      branch_id: branchNumber,
    };
    axios
      .post(`${baseUrl}Categorys `, categoryloyeeData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("category", response);
        fetchCategorys ();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const deletecategory = (id) => { 
    setLoader(true);
    axios
      .delete(`${baseUrl}Categorys /${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        console.log("category", response);
        fetchCategorys ();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      })
  }
  const updatecategory = (id) => {
    setUpdatecategoryID(id);
    setUpdateMode(true);
    const updatedcategoryloyee = Categorys .find((categoryloyee) => categoryloyee.id === id);
    if (updatedcategoryloyee) {
      setcategoryloyeeName(updatedcategoryloyee.name);
      setcategoryloyeeMail(updatedcategoryloyee.email);
      setcategoryloyeePassword(updatedcategoryloyee.password);
      setcategoryloyeePasswordConfirm(updatedcategoryloyee.password_confirmation);
      setcategoryloyeePhone(updatedcategoryloyee.phone_number);
      setBranchNumber(updatedcategoryloyee.branch_id);
    }
  };
  const handlecategoryUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}Categorys /${updatecategoryID}`,
        {
          name: categoryloyeeName,
          email: categoryloyeeMail,
          password: categoryloyeePassword,
          password_confirmation: categoryloyeePasswordConfirm,
          phone_number: categoryloyeePhone,
          branch_id: branchNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function (response) {
        console.log("category", response);
        fetchCategorys ();
        setUpdateMode(false);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);
    let searchUrl;
    if (searchWay === "ID") {
      searchUrl = `${baseUrl}categories/${searchValue}`;
    } else {
      searchUrl = `${baseUrl}Categorys /${searchValue}/branch`;
    }
    axios
      .get(searchUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        console.log("search", response.data.data);
        setCategorys ([response.data.data]);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  value={categoryloyeeName}
                  onChange={(e) => setcategoryloyeeName(e.target.value)}
                  placeholder=" نوع الرحلة  "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 py-1 text-sm px-1">
                    ادخل  نوع الرحلة 
                  </p>
                )}
              </div>
              <div className="w-full px-3 sm:w-1/2">
                              <label className='text-white'>مفعل أم غير مفعل ؟</label>
                              <div className="mb-5">
                              <Switch
                                  checked={CategoryStatus  === '1'} // '1' is considered as 'on'
                                  onChange={(e) => setCategoryStatus (e.target.checked ? '1' : '0')} // '1' for on, '0' for off
                                  color="success"
                                />
                             {inputsMessage&& <p className='text-red-600 py-1 px-1'>يجب ادخال نوع الحالة </p>}
                 </div>
              </div>
            </div>
             <div className=" flex flex-wrap gap-0">
                  <div className="w-full px-3 sm:w-1/2">
                          <div className="mb-5">
                              <label className="mb-3 block text-base font-medium text-white">
                                 الوقت من 
                              </label>
                              <input type="time"   value={timeFrom} onChange={(e)=> setTimeFrom(e.target.value)}
                                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                           {inputsMessage&& <p className='text-red-600 py-1 px-1'>ادخل الوقت</p>}
                          </div>
                  </div>
              
                    <div className="w-full px-3 sm:w-1/2">
                                <div className="mb-5">
                                    <label  className="mb-3 block text-base font-medium text-white ">
                                        الوقت إلي 
                                    </label>
                                    <input type="time"  value={timeTo} onChange={(e)=> setTimeTo(e.target.value)}
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                                      {inputsMessage&& <p className='text-red-600 py-1 px-1'>ادخل الوقت</p>}
                                </div>
                    </div>
              </div>
            <div>
                <button
                  onClick={handlecategoryUpdate}
                  disabled={loader}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block">
                   تسجيل الرحلة 
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search input form */}
      <div className="my-3">
        <form className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchIcon className="text-white" />
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`ابحث بـ ${searchWay}`}
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => handleSearch(e)}
              className="text-white absolute end-32 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث{" "}
            </button>
            <div className="absolute end-2.5 bottom-2">
              <select
                id="select"
                onChange={(e) => setSearchWay(e.target.value)}
                className="py-2 px-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="ID" className="bg-zinc-900">
                  ID
                </option>
                <option value="branch ID" className="bg-zinc-900">
                  Branch ID
                </option>
              </select>
            </div>
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {[
              "",
              "اسم الحجز",
              "الحالة ",
              "تاريخ الانشاء",
              "تعديل ",
            ].map((header, index) => (
              <th
                key={index}
                className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {Categorys .map((category, index) => {
            return (
              <tr
                key={category.id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                {/* Table data */}
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {category.name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                 {category.status === "مفعل" ?<div className='bg-green-500 text-white text-sm rounded-md'>مفعل</div> : <div className='bg-red-500 text-white rounded-md text-sm'>غير مفعل</div>}
              </td>
              
             
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {category.created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => updatecategory(category.id)}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deletecategory(category.id)}
                    className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                  >
                    <DeleteForeverIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Categoriespage;
