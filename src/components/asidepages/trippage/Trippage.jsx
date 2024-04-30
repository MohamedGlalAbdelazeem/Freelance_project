import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";

function Trippage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [trips, setTrips] = useState([]);
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [branchStatus, setBranchStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateTripsID, setUpdateTripsID] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // show and hide more

  const schema = z.object({
    tripName: z.string().min(1, { message: "ادخل اسم الرحلة" }),
    tripCost: z.string().min(1, { message: "رقم الرحلة خاطئ" }),
    take_off: z.string().min(1, { message: "ادخل تاريخ الرحلة" }),
    tripFrom: z.string().min(1, { message: "ادخل المنطقة من" }),
    tripTo: z.string().min(1, { message: "ادخل المنطقة الي" }),
    tripDescription: z.string().min(1, { message: "ادخل وصف الرحلة" }),
    category_id: z.string().min(1, { message: "ادخل نوع الرحلة" }),
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
    fetchData();
    fetchCountries();
    fetchCategories();
  }, []);

  const [showCountCountries, setShowCountries] = useState([]);
  const [showCategories, setShowCategories] = useState([]);

  function fetchCountries() {
    setLoader(true);
    axios
      .get(`${baseUrl}countries`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowCountries(response.data.data);
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخ:", error);
        handleUnauthenticated();
      });
  }
// hid in suber  admin
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
        handleUnauthenticated();
      })
      .finally(() => {
        // console.log(showCategories.find((cat) => cat.id === 3)?.name);
      });
  }

  // fetch data from api
  const fetchData = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}trips`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        }
        setLoader(false);
        setTrips(response.data.data);
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخ:", error);
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

  // store trip
  const storeTrips = async () => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}trips`,
        {
          name: getValues("tripName"),
          cost: getValues("tripCost").toString(),
          take_off: getValues("take_off"),
          from_countries_id: getValues("tripFrom"),
          to_countries_id: getValues("tripTo"),
          description: getValues("tripDescription"),
          category_id: getValues("category_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم إنشاء الرحلة  بنجاح", { type: "success" });
        fetchData();
        reset();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالفعل ", { type: "error" });
        }
        if (
          response.response.data.message ==
          "The take off must be a date after now."
        ) {
          toast.error("يجب أن يكون وقت الإقلاع بعد الآن");
        }
        console.log("Error creating branch:", response);
        // toast.warning(response.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // delete trip
  function deleteTrips(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}trips/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        } else if (response.status === 204) {
          toast.success("تم حذف الرحلة بنجاح");
          fetchData();
        } else {
          console.error("Unexpected response status:", response.status);
          toast.warning("حدث خطأ غير متوقع");
        }
      })
      .catch(function (error) {
        console.error("Error deleting branch:", error);
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
      });
    setLoader(false);
  }

  const updateTrips = async () => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}trips/${updateTripsID}`,
        {
          name: getValues("tripName"),
          cost: getValues("tripCost").toString(),
          take_off: getValues("take_off"),
          from_countries_id: getValues("tripFrom"),
          to_countries_id: getValues("tripTo"),
          description: getValues("tripDescription"),
          category_id: getValues("category_id"),
          status: branchStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم تحديث الرحلة  بنجاح", { type: "success" });
        fetchData();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالعفل ", { type: "error" });
        }
        console.log("Error updating branch:", response.response.data.message);
      })
      .finally(() => {
        setLoader(false);
        setUpdateMode(false);
        reset();
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);

    if (!searchValue.trim()) {
      fetchData();
      return;
    }
    let allTrips = [...trips];
    let filteredTrips = [];
    allTrips.forEach((trip) => {
      if (trip.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredTrips.push(trip);
      }
    });
    setTrips(filteredTrips);
    setLoader(false);
  };

  return (
    <main className="branchTable">
      {/* add branch form */}
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className="flex gap-4	">
              <div className="flex-grow w-full">
                <input
                  type="text"
                  {...register("tripName")}
                  placeholder="اسم الرحلة"
                  className="w-full flex-grow rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.tripName?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow w-full">
                <input
                  type="number"
                  {...register("tripCost")}
                  placeholder="تكلفة الرحلة "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.tripCost?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4 ">
              <div className="w-full">
                <input
                  type="date"
                  {...register("take_off")}
                  placeholder="تاريخ إقلاع الرحلة "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.take_off?.message}
                  </span>
                )}
              </div>
              <div className="w-full">
                <textarea
                  rows="1"
                  {...register("tripDescription")}
                  placeholder="وصف بسيط عن الرحلة"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-[13px] px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.tripDescription?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <select
                id="countries"
                {...register("tripFrom")}
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" disabled selected>
                  من
                </option>
                {showCountCountries.map((trip, index) => {
                  return (
                    <option key={index} value={trip.id}>
                      {trip.en_short_name}
                    </option>
                  );
                })}
              </select>
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.tripFrom?.message}
                </span>
              )}

              <select
                id="countries"
                {...register("tripTo")}
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" disabled selected>
                  إلى
                </option>
                {showCountCountries.map((trip, index) => {
                  return (
                    <option key={index} value={trip.id}>
                      {trip.en_short_name}
                    </option>
                  );
                })}
              </select>
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.tripTo?.message}
                </span>
              )}

              <select
                id="countries"
                {...register("category_id")}
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

            <div className="pt-3">
              <div className="-mx-3 flex flex-wrap">
                {updateMode && (
                  <div className="w-full px-3 sm:w-1/2">
                    <label className="text-white">
                      تفعيل الرحلة أو إلفاء تفعيل الرحلة ؟
                    </label>
                    <div className="mb-5">
                      <Switch
                        checked={branchStatus}
                        onChange={(e) => setBranchStatus(e.target.checked)}
                        color="success"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  type="submit"
                  onClick={handleSubmit(updateTrips)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث الرحلة
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(storeTrips)}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  إنشاء الرحلة
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="divider"></div>

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
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyUp={(e) => {
                handleSearch(e);
              }}
              className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="البحث من عن طريق ID "
              required
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث{" "}
            </button>
          </div>
        </form>
      </div>

      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              اسم الرحلة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              تاريخ الإقلاع
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التكلفة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              وصف
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الحالة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              من
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              إلي
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              نوع الرحلة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              {" "}
              وقت الإنشاء{" "}
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              {" "}
              التعديل{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping trips data to table rows */}
          {trips.map((trip, index) => {
            const {
              name,
              id,
              takeOff,
              cost,
              description,
              status,
              created_at,
              from,
              to,
            } = trip;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {takeOff}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {cost}
                  </span>
                </td>
                <td className="p-0 text-gray-800  text-sm  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded   px-1 text-xs font-bold">
                    {description}
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
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {from.en_short_name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {to.en_short_name}
                  </span>
                </td>
                {/* toDo - نوع الرحلة */}
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {/* {showCategories.find((cat) => cat.id === category_id)?.name} */}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>

                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateTripsID(id);
                      setUpdateMode(true);
                      setValue("tripName", name);
                      setValue("tripCost", cost.toString());
                      setValue("take_off", takeOff);
                      setValue("tripDescription", description);
                      setValue("tripStatus", status === "مفعل" ? true : false);
                      setValue(
                        "tripFrom",
                        showCountCountries
                          .find((trip) => trip.id === from.id)
                          ?.id.toString()
                      );
                      setValue(
                        "tripTo",
                        showCountCountries
                          .find((trip) => trip.id === to.id)
                          ?.id.toString()
                      );
                      // console.log("from", from.en_short_name);
                      // setValue("category_id", category_id);
                      setBranchStatus(status === "مفعل" ? true : false);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteTrips(id)}
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

      {/* loader */}
      {loader && <div className="spinner"></div>}
    </main>
  );
}

export default Trippage;
