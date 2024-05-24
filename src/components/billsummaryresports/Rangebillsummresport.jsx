import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import BallotIcon from '@mui/icons-material/Ballot';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
function Rangebillsummresport() {
  
const baseUrl = "http://127.0.0.1:8000/api/";
const [loader, setLoader] = useState(true);
const Naviagate = useNavigate();
const [data, setData] = useState([]);
const [dataBillSummary, setDataBillSummar] = useState([]);
const [dataAllInfoTrip, setDataAllInfoTrip] = useState([]);
const userToken = localStorage.getItem("user_token");
const userRoleName = localStorage.getItem("user_role_name");

const schema = z.object({
  from: z.string().min(1, { message: "أدخل تاريخ البداية" }),
  to: z.string().min(1, { message: "أدخل تاريخ النهاية" }),
});
const {
  register,
  handleSubmit,
  getValues,
  reset,
  formState: { errors, isSubmitting },
} = useForm({ resolver: zodResolver(schema) });


const handleUnauthenticated = () => {
  toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
    type: "error",
    autoClose: 4000,
  });
  Naviagate("/Login");
  localStorage.removeItem("user_token");
  localStorage.removeItem("user_role_name");
};

const onSubmit = (data) => {
  setLoader(true);
  axios
    .post(
      `${baseUrl}report/bill-summary`,
      {
        from: data.from,
        to:data.to,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    )
    .then((res) => {
      setDataBillSummar(res.data.data.billSummary);
        setDataAllInfoTrip(res.data.data.allInfoTrip);
        reset();
    })
    .catch((error) => {
      if (error.response.data.message === "The to must be a date after from.") {
        toast("من فضلك قيمة التاريخ المدخلة خطأ")
      }
    })
    .finally(() => {
      setLoader(false);
    });
};
useEffect(() => {
  dailyReport();
}, []);
const dailyReport = () => {
  setLoader(true);
  axios
    .get(`${baseUrl}report/bill-summary-daily`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then(function (response) {
      setDataBillSummar(response.data.data.billSummary);
      setDataAllInfoTrip(response.data.data.allInfoTrip);
      setLoader(false);
    })
    .catch(function (error) {
      if (error.response?.data?.message === "Unauthenticated.") {
        handleUnauthenticated();
        console.error(error);
      }
    })
    .finally(() => {
      setLoader(false);
    });
};

return (
    <div className="bg-gray-300 p-9 rounded-xl">
      <div className="w-full mb-5">
        <Link
          className="bg-gray-500 text-white  float-left p-2 rounded-lg hover:bg-gray-700 hover:shadow-lg transition duration-200"
          to="/Mainpage/Billsummarypage/Billsummaryrespotsdaily" >
          انتقل إلى تقارير كشف الحساب يوميا
        </Link>
        <div className=" text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
          <BallotIcon sx={{ fontSize: 50 }} />
             تقارير  كشف الحساب خلال فترة زمنية  
        </div>
      </div>
      <form className="flex justify-center mt- gap-5 items-center mt-16">
        <div className="flex-grow ">
          <label className=" text-2xl text-center font-bold"> من</label>
          <input
            type="date"
            {...register("from")}
            className="text-xl w-full mt-3 p-2 rounded-lg text-center border-2 border-slate-500  text-black"
          />
          {errors && (
            <span className="text-red-500 text-sm">{errors.from?.message}</span>
          )}
        </div>
        <div className="flex-grow ">
          <label className=" text-2xl font-bold"> إلي </label>
          <input
            type="date"
            {...register("to")}
            className="text-xl w-full  mt-3 p-2 rounded-lg text-center border-2 border-slate-500  text-black"
          />
          {errors && (
            <span className="text-red-500 text-sm">{errors.to?.message}</span>
          )}
        </div>
        <div className="flex-grow ">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="py-3 px-5 w-full font-bold text-lg bg-gray-600 hover:bg-gray-900 transition rounded-lg text-white h-fit mt-12"
          >
            بحث
          </button>
        </div>
      </form>
      <>
       {/* bill summary  */}
       <h2 className="text-center w-full text-white p-2 bg-slate-500 mt-5">الجدول الخاص بالماليات</h2>
        <table className="border-collapse w-full  text-sm">
          <thead>
              <tr>
                {["الترتيب",
                "اسم العملة",
                "طريقة الدفع",
                " التكلفة الكلية", 
                    ].map(
                  (header, index) => (
                    <th key={index}
                      className="px-3 py-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"    >
                      {header}
                    </th>
                  )
                )}
              </tr>
          </thead>
          {
            dataBillSummary.map((data , index)=>{
              return (
                <tbody key={index}>
                <tr  className="bg-white text-center   lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded px-2 text-sm font-bold">
                    {index + 1}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  text-sm font-bold">
                      {data?.currency?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 text-sm font-bold">
                    {data?.payment?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-white bg-red-400   border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 px-3 text-sm font-bold">
                    {data?.total_cost}
                    </span>
                  </td>
                </tr>
          </tbody>
              )
            })
          }
        
        </table>
          
    {/* trip info */}
        <table className="border-collapse w-full mt-9 text-sm">
            <thead>
                <tr>
                  {["الترتيب",
                    " اسم  العميل",
                    " هاتف  العميل",
                    "الفرع الموجود به العميل",
                    "اسم الخدمة",
                    "تكلفة الخدمة", 
                    "حالة الخدمة",
                    "نوع الحجز",
                    "وقت إنشاء الخدمة",
                    "نوع حجز الرحلة",
                      ].map(
                    (header, index) => (
                      <th key={index}
                        className="px-3 py-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"    >
                        {header}
                      </th>
                    )
                  )}
                </tr>
            </thead>
            { dataAllInfoTrip.map((data , index)=>{
                return (
                  <tbody key={index}>
                  <tr  className="bg-white text-center   lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                    <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded px-2 text-sm font-bold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded  text-sm font-bold">
                        {data?.client?.name}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded  text-sm font-bold">
                        {data?.client?.phone_number}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded  text-sm font-bold">
                        {data?.client?.branch?.branch_name}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded py-1 text-sm font-bold">
                      {data?.bookingTrip === null ? data?.bookingService?.service?.name : data?.bookingTrip?.trip?.name}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2    border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded py-1 px-3 text-sm font-bold">
                      {data?.bookingTrip === null ? data?.bookingService?.service?.cost : data?.bookingTrip?.trip?.cost}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded py-1  text-sm font-bold">
                      {data?.bookingTrip === null ? data?.bookingService?.service?.status : data?.bookingTrip?.trip?.status}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2   border border-b text-center block lg:table-cell relative lg:static">
                <span className="rounded py-1  text-sm font-bold">
                {data?.bookingTrip === null ? "حجز خدمة" :  "حجز خدمة"  || data?.bookingService === null ? "حجز رحلة" :  "حجز رحلة" }
                </span>
              </td>
                    <td className="w-full lg:w-auto p-2 border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded py-1  text-sm font-bold">
                      {data?.bookingTrip === null ? data?.bookingService?.service?.created_at : data?.bookingTrip?.trip?.created_at}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 border border-b  text-white bg-red-400 text-center block lg:table-cell relative lg:static">
                      <span className="rounded py-1  text-sm font-bold">
                      {data?.bookingTrip === null ? "---" : data?.bookingTrip?.type}
                      </span>
                    </td>
                  </tr>
            </tbody>
                )
              })
            }
          </table>
          {dataAllInfoTrip.length === 0 && (
                  <p className="mx-auto w-full p-3 text-lg text-center my-7 bg-gray-600  text-white rounded-lg  ">
                  لايوجد بيانات للعرض وذلك لأنه لم يتم حجز أي رحلة أو خدمة خلال اليوم
                 </p>
           )}
    
      </>


      {loader && (
        <>
          <div className="fixed bg-black/30 top-0 left-0 w-screen h-screen"></div>
          <svg
            id="loading-spinner"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <g fill="none">
              <path
                id="track"
                fill="#C6CCD2"
                d="M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44 C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4 C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z"
              />
              <path
                id="section"
                fill="#3F4850"
                d="M24,0 C37.254834,0 48,10.745166 48,24 L44,24 C44,12.954305 35.045695,4 24,4 L24,0 Z"
              />
            </g>
          </svg>
        </>
      )}
    </div>
  );
}
export default Rangebillsummresport;
