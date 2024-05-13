import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Reportpage() {
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const [data, setData] = useState([]);
  const baseUrl = "http://127.0.0.1:8000/api/";
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

  useEffect(() => {
    dailyReport();
  }, []);

  const onSubmit = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}report/between-days`,
        {
          from: getValues("from"),
          to: getValues("to"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data);
        reset();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const dailyReport = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}report/daily`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setData(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  // const handleUnauthenticated = () => {
  //   toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
  //     type: "error",
  //     autoClose: 4000,
  //   });
  //   Naviagate("/Login");
  //   localStorage.removeItem("user_token");
  //   localStorage.removeItem("user_role_name");
  // };
  return (
    <div>
      <h1 className="text-center text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
        التقرير اليومي{" "}
      </h1>
      <form className="flex justify-center mt-10 gap-5 items-center">
        <div className="flex-grow ">
          <label className=" text-2xl"> من</label>
          <input
            type="date"
            {...register("from")}
            className="text-xl w-full mt-3 p-2 rounded-lg text-center border-2 border-slate-700  text-black"
          />
          {errors && (
            <span className="text-red-500 text-sm">{errors.from?.message}</span>
          )}
        </div>
        <div className="flex-grow ">
          <label className=" text-2xl"> إلي </label>
          <input
            type="date"
            {...register("to")}
            className="text-xl w-full  mt-3 p-2 rounded-lg text-center border-2 border-slate-700  text-black"
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
        <div className="text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full">
          عرض الصندوق اليومي للفروع
          <CurrencyExchangeIcon sx={{ fontSize: 40, mx: 2 }} />
        </div>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الترتيب
              </th>
              {userRoleName === "super_admin" && (
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الفرع
                </th>
              )}
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التكلفة اليومية
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                العملة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                طريقة الدفع
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
                >
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {index + 1}
                  </td>
                  {userRoleName === "super_admin" && (
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      {item.brnach?.name}
                    </td>
                  )}
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {item.totoalCost}
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                    {item.currency?.name}
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {item.payment?.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length === 0 && (
          <p className="w-full p-3 text-lg bg-gray-200 rounded-b-full text-center">
            لايوجد بيانات للعرض
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
export default Reportpage;
