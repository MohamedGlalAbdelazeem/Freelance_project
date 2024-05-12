import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Reportpage() {
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const [data, setData] = useState([]);
  const [singleBranch, setSingleBranch] = useState([]);
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

  const fetchBranch = (id) => {
    setLoader(true);
    axios
      .get(`${baseUrl}branches/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setSingleBranch([response.data.data]);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
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
        console.log(response.data.data);
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
        <h1 className="text-4xl font-bold text-center ">التقارير </h1>
      </div>
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
            className="py-3 px-5 w-full font-bold text-lg bg-gray-900 rounded-lg text-white h-fit mt-12"
          >
            بحث
          </button>
        </div>
      </form>
      {userRoleName === "admin" ? (
        <>
          {/* Currency */}
          <div className="text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full">
            عرض التكلفة وطريقة الدفع
            <CurrencyExchangeIcon sx={{ fontSize: 40, mx: 2 }} />
          </div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الترتيب
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  التكلفة
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
              {data.length === 0 && (
                 <tr className="w-full text-center">لايوجد بيانات للعرض</tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* branch */}
          <div className="text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full">
            عرض الفروع
            <AccountBalanceIcon sx={{ fontSize: 40, mx: 2 }} />
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
                  الخط الساخن
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الحالة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  إظهار المزيد
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const branch = item.brnach;
                return (
                  <tr
                    key={index}
                    className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
                  >
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      {index + 1}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded  px-2 text-xs font-bold">
                        {branch.name}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      <span className="rounded  py-1 px-3 text-xs font-bold">
                        {branch.hotLine}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                      {branch.status === "مفعل" ? (
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
                      <span className="rounded  px-1  text-xs font-bold">
                        <button
                          onClick={() => {
                            fetchBranch(branch.id);
                            document.getElementById("my_modal_2").showModal();
                          }}
                          className="bg-sky-700 text-white p-2 rounded hover:bg-sky-500"
                        >
                          <VisibilityIcon />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* branch dialog */}
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box max-w-[90%] relative">
              <div className="modal-action absolute -top-4 left-2">
                <form method="dialog">
                  <button className="btn rounded-full w-12 h-10">X</button>
                </form>
              </div>
              <div className="text-center flex flex-col justify-center">
                <>
                  <table>
                    <thead>
                      <tr>
                        {[
                          "الترتيب",
                          "اسم الفرع",
                          "الموقع",
                          "إظهار العملاء	",
                          "من",
                          "   إلي ",
                          "التاريخ / الوقت",
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
                      {singleBranch.map((item, index) => {
                        return (
                          <tr
                            key={index}
                            className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
                          >
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                              {index + 1}
                            </td>
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                              <span className="rounded  px-2 text-xs font-bold">
                                {item.name}
                              </span>
                            </td>
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                              <span className="rounded  px-2 text-xs font-bold">
                                {item.location}
                              </span>
                            </td>
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                              {item.show_client === "مفعل" ? (
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
                                {item.from}
                              </span>
                            </td>
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                              <span className="rounded  py-1 px-3 text-xs font-bold">
                                {item.to}
                              </span>
                            </td>
                            <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                              <span className="rounded  px-1  text-xs font-bold">
                                {item.created_at}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <div className="divider"></div>

          {/* Currency */}
          <div className="text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-t-full">
            عرض التكلفة وطريقة الدفع
            <CurrencyExchangeIcon sx={{ fontSize: 40, mx: 2 }} />
          </div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الترتيب
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  التكلفة
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
        </>
      )}
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
