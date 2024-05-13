import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Switch } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ScrollUp } from "../../ScrollUp";
import ReactPaginate from "react-paginate";

function Services() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);
  const userRoleName = localStorage.getItem("user_role_name");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateEmpID, setUpdateEmpID] = useState("");
  const [showCategories, setShowCategories] = useState([]);
  const [showCurrency, setShowCurrency] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const userToken = localStorage.getItem("user_token");
  const [services, setServices] = useState([]);
  const [singleSrv, setSingleSrv] = useState({});
  const [showSrv, setShowSrv] = useState(false);
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
    currency_id: z.string().min(1, "اختر العملة"),
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
    fetchCurrency();
  }, []);
  // fetch pagenation data///////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPagenation();
  }, [currentPage]); // Fetch data whenever currentPage changes

  const fetchPagenation = () => {
    setLoader(true);
    axios
      .get(`http://127.0.0.1:8000/api/services?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setServices(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

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
      });
  }

  function fetchCurrency() {
    setLoader(true);
    axios
      .get(`${baseUrl}currencies/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowCurrency(response.data.data);
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخرى:", error);
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
      currency_id: getValues("currency_id"),
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
        setValue("name", "");
        setValue("cost", "");
        setValue("description", "");
        setValue("category_id", "");
        setValue("currency_id", "");
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
      .then(function () {
        toast.success("تم حذف الخدمة بنجاح");
        fetchServices();
      })
      .catch(function (error) {
        console.error("Error deleting service:", error);
        setLoader(true);
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
          currency_id: getValues("currency_id"),
          status: showSrv,
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

  const fetchSrvById = (id) => {
    let single = services.filter((client) => client.id === id);
    setSingleSrv(...single);
  };

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          <div className="modal-action absolute -top-4 left-2">
            <form method="dialog">
              <button className="btn rounded-full w-12 h-10 bg-red-600 text-white">
                X
              </button>
            </form>
          </div>
          <div className="text-center flex flex-col justify-center">
            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الاسم :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.name}
                    </dd>
                  </div>

                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      اسم العملة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.currency?.name}
                    </dd>
                  </div>

                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      التكلفة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.cost}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      نوع الرحلة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.category?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الوصف :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.description}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الحالة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.status}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      تاريخ الإنشاء :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleSrv?.created_at}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {userRoleName === "admin" ? (
        <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
          {/* register & update users */}
          <div className="mx-auto w-full ">
            <form className="space-y-3">
              <div className=" flex flex-wrap gap-3">
                <div className="flex-grow w-full">
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
                <div className="flex gap-4 flex-grow">
                  <div className="flex-grow w-[49%]">
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
                  <div className="flex-grow w-[49%]">
                    <select
                      {...register("currency_id")}
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 block w-full dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled selected>
                        اختر العملة
                      </option>
                      {showCurrency.map((currency, index) => {
                        return (
                          <option key={index} value={currency.id}>
                            {currency.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.currency_id?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-[49%] flex-grow">
                  <select
                    id="countries"
                    {...register("category_id")}
                    className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              {updateMode ? (
                <div className="px-2">
                  <label className="text-white ">تفعيل الخدمة أم لا؟</label>
                  <div className="mb-5">
                    <Switch
                      checked={showSrv}
                      onChange={(e) => {
                        setShowSrv(e.target.checked);
                      }}
                      color="success"
                    />
                  </div>
                </div>
              ) : null}

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
                    تسجيل خدمة جديدة
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}

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
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          {userRoleName === "admin" ? (
            <tr>
              {[
                "الترتيب",
                "اسم الخدمة ",
                "تكلفة الخدمة",
                " الحالة",
                "تاريخ الانشاء",
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
          ) : (
            <tr>
              {[
                "الترتيب",
                "اسم الخدمة ",
                "تكلفة الخدمة",
                " الحالة",
                "تاريخ الانشاء",
              ].map((header, index) => (
                <th
                  key={index}
                  className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                >
                  {header}
                </th>
              ))}
            </tr>
          )}
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
              category,
              created_at,
              currency,
            } = service;
            const tableIndex = (currentPage - 1) * 15 + index + 1;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded text-xs font-bold">{name}</span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded text-xs font-bold">{cost}</span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                  {status === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 text-white text-sm rounded-lg p-1">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 text-white rounded-lg text-sm p-1">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded text-xs font-bold">
                    {created_at}
                  </span>
                </td>

                {userRoleName === "admin" ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => {
                          ScrollUp();
                          setUpdateEmpID(id);
                          setUpdateMode(true);
                          setValue("name", name);
                          setValue("cost", cost.toString());
                          setValue("description", description);
                          setValue("category_id", category.id.toString());
                          setValue("currency_id", currency.id.toString());
                          setShowSrv(status === "مفعل" ? true : false);
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
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_2").showModal();
                          fetchSrvById(id);
                        }}
                        className="bg-sky-700 text-white p-2 rounded hover:bg-sky-500"
                      >
                        <VisibilityIcon />
                      </button>
                    </div>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        {/* Render pagination */}
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center mt-4 text-2xl"}
          activeClassName={"bg-blue-500 text-white hover:bg-blue-700"}
          previousLabel={"السابق"}
          nextLabel={"التالي"}
          previousClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          pageClassName={"mx-1 px-3 py-1 border rounded-lg text-2xl font-bold "}
        />
      </div>
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

export default Services;
