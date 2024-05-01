import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollUp } from "../../ScrollUp";

function Services() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);

  const [updateMode, setUpdateMode] = useState(false);
  const [updateEmpID, setUpdateEmpID] = useState("");
  const [showCategories, setShowCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const userToken = localStorage.getItem("user_token");
  const [services, setServices] = useState([]);
  const Naviagate = useNavigate();

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Naviagate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const schema = z.object({
    name: z.string().min(1, "ادخل اسم الخدمة"),
    cost: z.string().min(1, "ادخل تكلفة الخدمة "),
    description: z.string().min(1, "ادخل وصف الخدمة"),
    category_id: z.string().min(1, "اختر تصنيف الخدمة"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoader(true);
    axios
      .get(`${baseUrl}categories/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowCategories(response.data.data);
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخرى:", error);
        // handleUnauthenticated();
      });
  }

  const fetchServices = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}services`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setServices(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeService = () => {
    setLoader(true);
    const servicesData = {
      name: getValues("name"),
      cost: getValues("cost"),
      description: getValues("description"),
      category_id: getValues("category_id"),
    };
    axios
      .post(`${baseUrl}services`, servicesData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم تسجيل الخدمة  بنجاح");
        fetchServices();
        reset();
      })
      .catch(function (error) {
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast.error("الخدمة موجودة بالفعل");
        }
        console.error("Error fetching", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteService = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}services/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          // handleUnauthenticated();
        } else {
          console.error("Unexpected response status:", response.status);
          toast.warning("حدث خطأ غير متوقع");
        }
        toast.success("تم حذف الخدمة بنجاح");
        fetchServices();
      })
      .catch(function (error) {
        console.error("Error deleting service:", error);
        setLoader(true);
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "Unauthenticated"
        ) {
          toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
            type: "error",
          });
        } else {
          console.log("Error deleting branch:", error);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSrvUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}services/${updateEmpID}`,
        {
          name: getValues("name"),
          cost: getValues("cost"),
          description: getValues("description"),
          category_id: getValues("category_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث البيانات بنجاح");
        fetchServices();
        setUpdateMode(false);
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);

    if (!searchValue.trim()) {
      fetchServices();
      return;
    }
    let allSrv = [...services];
    let filteredSrv = [];
    allSrv.forEach((srv) => {
      if (srv.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredSrv.push(srv);
      }
    });
    setServices(filteredSrv);
    setLoader(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className="space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="w-[49%] flex-grow">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="اسم الخدمة"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div className="w-[49%] flex-grow">
                <input
                  type="number"
                  {...register("cost")}
                  placeholder="تكلفة الخدمة"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.cost?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[49%] flex-grow">
                <select
                  id="countries"
                  {...register("category_id")}
                  className=" border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" disabled selected>
                    نوع الرحلة
                  </option>
                  {showCategories.map((categories, index) => {
                    return (
                      <option key={index} value={categories.id}>
                        {categories.name}
                      </option>
                    );
                  })}
                </select>
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.category_id?.message}
                  </span>
                )}
              </div>
              <div className="w-[49%] flex flex-wrap gap-3">
                <div className="w-[49%] flex-grow">
                  <textarea
                    rows={1}
                    type="text"
                    {...register("description")}
                    placeholder="وصف الخدمة "
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.description?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  onClick={handleSubmit(handleSrvUpdate)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث الخدمة
                </button>
              ) : (
                <button
                  onClick={handleSubmit(storeService)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل خدمة جديد
                </button>
              )}
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
              placeholder={`ابحث عن خدمة بالاسم`}
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => handleSearch(e)}
            />
            <button
              onClick={(e) => handleSearch(e)}
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث
            </button>
            {/* <div className="absolute end-2.5 bottom-2">
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
            </div> */}
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {[
              "الترتيب",
              "اسم الخدمة ",
              "تكلفة الخدمة",
              "وصف عن الخدمة",
              "تاريخ الانشاء",
              " الحالة",
              "التعديل",
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
          {services.map((service, index) => {
            const {
              id,
              name,
              cost,
              description,
              status,
              branch_id,
              created_at,
            } = service;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {cost}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {description}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {status === "مفعل" ? (
                    <div className="bg-green-500 text-white text-sm rounded-md">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white rounded-md text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateEmpID(id);
                      setUpdateMode(true);
                      setValue("name", name);
                      setValue("cost", cost.toString());
                      setValue("description", description);
                      setValue(
                        "category_id",
                        showCategories
                          .find((cat) => cat.id === branch_id)
                          ?.id.toString()
                      );
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteService(id)}
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
      {loader && <div className="spinner"></div>}
    </div>
  );
}

export default Services;
