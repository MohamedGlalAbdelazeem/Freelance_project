
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";

function Reportpage() {
    const [loader, setLoader] = useState(true);
    const [branches, setBranches] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [payment, setPayment] = useState([]);
    const baseUrl = "http://127.0.0.1:8000/api/";
    const userToken = localStorage.getItem("user_token");

  useEffect(() => {
    fetchBranches();
  }, []);

//fetch barnches data
  const fetchBranches = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}report/daily`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        } else {
          setLoader(false);
          setBranches(response.data.data);
          console.log(response.data.data);
        }
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Naviagate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };
  return (
    <div>
       
            <div className="divider divider-info ">
            <h1  className="text-4xl font-bold text-center ">التقارير </h1>
            </div>
        
             <form className='flex justify-evenly mt-10'>
               <div>
               <label className=' text-2xl'> من</label>
               <input type="date" className='text-xl w-full mt-3 p-2 rounded-lg text-center border-2 border-slate-700  text-black' />
               </div>
               <div>
               <label className=' text-2xl' > إلي </label>
               <input type="date" className='text-xl w-full  mt-3 p-2 rounded-lg text-center border-2 border-slate-700  text-black' />
               </div>
           </form>
            
            <div className='text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full'>عرض الفروع 
            <AccountBalanceIcon sx={{ fontSize: 40 , mx:2 }}/>
            </div>
            <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الاسم
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الموقع
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الخط الساخن{" "}
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الحالة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              إظهار العملاء
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              من
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              إلي
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التاريخ/الوقت
            </th>
          </tr>
        </thead>
        <tbody>
              <tr
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"  >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
             
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
              
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
             
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {"status" === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {"show_client" === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>

                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
               
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                
                  </span>
                </td>

                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                 
                  </span>
                </td>
              </tr>
        </tbody> 
            </table>
            <div className="divider"></div>

            <div className='text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full'>عرض العملة 
            <CurrencyExchangeIcon sx={{ fontSize: 40 , mx:2 }}/>
            </div>
            <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الاسم
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الحالة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التاريخ/الوقت
            </th>
          </tr>
        </thead>
        <tbody>
              <tr
             
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
             
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
              
                  </span>
                </td>
               
                
                <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {"status" === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                 
                 </td>
              </tr>
        </tbody> 
            </table>



            <div className="divider"></div>
            <div className='text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full'>عرض طرق الدفع
            <PriceChangeIcon sx={{ fontSize: 40 , mx:2 }}/>
            </div>
                <table className="border-collapse w-full">
            <thead>
            <tr>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الترتيب
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الاسم
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الحالة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التاريخ/الوقت
                </th>
            </tr>
            </thead>
            <tbody>
                <tr className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    
                    </td>
                
                    <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                    {"status" === "مفعل" ? (
                        <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                        مفعل
                        </div>
                    ) : (
                        <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                        غير مفعل
                        </div>
                    )}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    
                    </td>
                </tr>
            </tbody> 
                </table>


           
    </div>
  )
}

export default Reportpage