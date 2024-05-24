import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import axios from "axios";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactPaginate from "react-paginate";

function Trippage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [trips, setTrips] = useState([]);
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");
  const [branchStatus, setBranchStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateTripsID, setUpdateTripsID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showCountCountries, setShowCountries] = useState([]);
  const [showCategories, setShowCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleTrip, setSingleTrip] = useState({});
  const [showAirports, setShowAirports] = useState([]);
  const [showCurrencies, setShowCurrencies] = useState([]);
  const [showAirLines, setShowAirLines] = useState([]);
  const [airportId, setAirportId] = useState([]);

  const schema = z.object({
    tripName: z.string().min(1, { message: "ادخل اسم الرحلة" }),
    tripCost: z.string().min(1, { message: "يجب تعيين تكلفة الرحلة" }),
    take_off: z.string().min(1, { message: "ادخل تاريخ الرحلة" }),
    tripFrom: z.string().min(1, { message: "يجب تعيين بلد الانطلاق" }),
    tripTo: z.string().min(1, { message: "يجب تعيين بلد الوصول" }),
    tripDescription: z.string().min(1, { message: "ادخل وصف الرحلة" }),
    category_id: z.string().min(1, { message: "اختر نوع الرحلة" }),
    airport_id: z.string().min(1, { message: "اختر المطار" }),
    currency_id: z.string().min(1, { message: "اختر العملة" }),
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
    fetchAirports();
    fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchPagenation();
  }, [currentPage]);

  useEffect(() => {
    fetchAirLines();
  }, [airportId]);

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
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          console.error("حدث خطأ الرجاء محاولة مرة أخري", error);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const fetchSingleTrip = (id) => {
    let single = trips.filter((trip) => trip.id === id);
    setSingleTrip(...single);
  };

  const fetchPagenation = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}trips?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setTrips(response.data.data);
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
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          console.error("هذا المستخدم ليس له صلاحية التعديل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  function fetchAirports() {
    setLoader(true);
    axios
      .get(`${baseUrl}airports/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowAirports(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          console.error("هذا المستخدم ليس له صلاحية التعديل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  function fetchAirLines() {
    let url = `${baseUrl}airlines/show-air-line/${airportId}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowAirLines([response.data.data]);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          console.error("هذا المستخدم ليس له صلاحية التعديل");
        }
      })
  }
  function fetchCurrencies() {
    setLoader(true);
    axios
      .get(`${baseUrl}currencies/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowCurrencies(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          console.error("هذا المستخدم ليس له صلاحية التعديل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const fetchData = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}trips`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setTrips(response.data.data);
      })
      .catch(function (error) {
        if (error.response.data.message === "Unauthenticated.") {
          handleUnauthenticated();
        }
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
          airport_id: getValues("airport_id"),
          currency_id: getValues("currency_id"),
          air_line_id: getValues("air_line_id"),
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
        setValue("tripFrom", "");
        setValue("tripTo", "");
        setValue("category_id", "");
        setValue("airport_id", "");
        setValue("currency_id", "");
        setValue("air_line_id", "");
      })
      .catch((error) => {
        if (error.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالفعل ", { type: "error" });
        }
        if (
          error.response.data.message ==
          "The take off must be a date after now."
        ) {
          toast.error("يجب أن يكون وقت الإقلاع بعد الآن");
        }
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast.error("الرحلة موجود بالفعل");
        }
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteTrips(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}trips/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف الرحلة بنجاح");
        fetchData();
      })
      .catch(function (error) {
        console.error("Error deleting branch:", error);
        setLoader(true);
      })
      .finally(() => {
        setLoader(false);
      });
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
          airport_id: getValues("airport_id"),
          air_line_id: getValues("air_line_id"),
          currency_id: getValues("currency_id"),
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
        reset();
        setValue("tripFrom", "");
        setValue("tripTo", "");
        setValue("category_id", "");
        setValue("airport_id", "");
        setValue("air_line_id", "");
        setValue("currency_id", "");
        setUpdateMode(false);
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الرحلة موجودة بالعفل ", { type: "error" });
        } else {
          toast.error(response.response.data.message);
        }
      })
      .finally(() => {
        setLoader(false);
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
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          <div className="modal-action absolute -top-4 left-2">
            <form method="dialog">
              <button className="btn rounded-full w-12 h-10 bg-red-500 text-white">
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
                      اسم الرحلة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      التكلفة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.cost}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      تاريخ الاقلاع :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.takeOff}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">من :</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.from?.en_short_name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">إلى :</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.to?.en_short_name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      نوع الرحلة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.category?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      المطار :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.airport?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      خط الطيران :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.airLine?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      العملة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.currency?.name}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الحالة :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.status}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الوصف :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.description}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      وقت الإنشاء :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleTrip?.created_at}
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
                    placeholder=" ملاحظات  "
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-[13px] px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.tripDescription?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2	">
                <div className="flex-grow w-full">
                  <select
                    {...register("airport_id", {
                      onChange: () => {
                        setAirportId([getValues("airport_id")]);
                      },
                    })}
                    className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" disabled selected>
                      اختر المطار
                    </option>
                    {showAirports.map((airport, index) => {
                      return (
                        <option
                          key={index}
                          value={airport.id}
                        >
                          {airport.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.airport_id?.message}
                    </span>
                  )}
                </div>
                <div className="flex-grow w-full">
                  <select
                    {...register("air_line_id")}
                    className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" disabled selected>
                      اختر خط الطيران
                    </option>
                    {showAirLines[0]?.airLines?.map((line, index) => {
                      return (
                        <option key={index} value={line.id} >
                          {line.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.air_line_id?.message}
                    </span>
                  )}
                </div>
                <div className="flex-grow w-full">
                  <select
                    {...register("currency_id")}
                    className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" disabled selected>
                      اختر العملة
                    </option>
                    {showCurrencies.map((currency, index) => {
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
              <div className="flex gap-2">
                <div className="flex-grow w-full">
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
                </div>
                <div className="flex-grow w-full">
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
                </div>
                <div className="flex-grow w-full">
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
                          onChange={(e) => {
                            console.log(branchStatus);
                            setBranchStatus(e.target.checked);
                          }}
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
          <div className="divider"></div>
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
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyUp={(e) => {
                handleSearch(e);
              }}
              className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="بحث باسم الرحلة"
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
        {userRoleName === "admin" ? (
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الترتيب
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                اسم الرحلة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                من
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                إلي
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                وقت الإقلاع
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التكلفة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الحالة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التعديل
              </th>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الترتيب
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                اسم الرحلة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                من
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                إلي
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                وقت الإقلاع
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التكلفة
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الحالة
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {trips.map((trip, index) => {
            const {
              name,
              id,
              takeOff,
              cost,
              status,
              from,
              to,
              description,
              category,
              airport,
              airLine,
            } = trip;
            const tableIndex = (currentPage - 1) * 15 + index + 1;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {name}
                  </span>
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
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {takeOff}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1 text-xs font-bold">
                    {cost}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2  text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {status === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>

                {userRoleName === "admin" ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => {
                          setAirportId([airport.id]);
                          setValue("air_line_id", airLine.id);
                          ScrollUp();
                          setUpdateTripsID(id);
                          setUpdateMode(true);
                          setValue("tripName", name);
                          setValue("tripCost", cost.toString());
                          const [datePart] = takeOff.split(" ");
                          const [year, month, day] = datePart.split("-");
                          const formattedDateString = `${year}-${month}-${day}`;
                          setValue("take_off", formattedDateString);
                          setValue("tripDescription", description);
                          setBranchStatus(status === "مفعل" ? true : false);
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
                          setValue(
                            "category_id",
                            showCategories
                              .find((cat) => cat.id === category.id)
                              ?.id.toString()
                          );
                          setValue(
                            "airport_id",
                            showAirports
                              .find((air) => air.id === airport.id)
                              ?.id.toString()
                          );
                          setValue(
                            "currency_id",
                            showCurrencies
                              .find((currency) => currency.id === currency.id)
                              ?.id.toString()
                          );
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
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_2").showModal();
                          fetchSingleTrip(id);
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
      {/* loader */}
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
    </main>
  );
}

export default Trippage;
