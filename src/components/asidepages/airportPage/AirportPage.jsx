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
import ReactPaginate from "react-paginate";
import { ScrollUp } from "../../ScrollUp";

function AirportPage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [airports, setAirports] = useState([]);
  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [airportStatus, setAirportStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateAirportID, setUpdateAirportID] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const schema = z.object({
    airportName: z.string().min(1, { message: "ادخل اسم المطار" }),
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
    fetchAirports();
  }, []);

  // fetch data from api
  const fetchAirports = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}airports`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setAirports(response.data.data);
      })
      .catch(function (error) {
        console.error("حدث خطأ الرجاء محاولة مرة أخرى:", error);
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
    Navigate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const storeAirport = async () => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}airports`,
        {
          name: getValues("airportName"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast.success("تم إنشاء المطار  بنجاح");
        reset();
        fetchAirports();
      })
      .catch((error) => {
        if (error.response.data.message == "Already_exist") {
          toast("هذا المطار موجود بالفعل ", { type: "error" });
        }
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast.error("المطار مسجل بالفعل");
        }
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteAirport(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}airports/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف المطار بنجاح");
        fetchAirports();
      })
      .catch(function (error) {
        toast.warning("حدث خطأ غير متوقع");
        console.error("Error deleting airport:", error);
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "Unauthenticated"
        ) {
          toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
            type: "error",
          });
        } else {
          console.log("Error deleting airport:", error);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const updateAirport = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}airports/${updateAirportID}`,
        {
          name: getValues("airportName"),
          status: airportStatus ? "1" : "0",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم تحديث المطار  بنجاح", { type: "success" });
        fetchAirports();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذا المطار مسجل بالعفل ", { type: "error" });
        }
        console.log("Error updating airport:", response.response.data.message);
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
      fetchAirports();
      return;
    }
    let allAirports = [...airports];
    let filteredAirports = [];
    allAirports.forEach((cat) => {
      if (cat.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredAirports.push(cat);
      }
    });
    setAirports(filteredAirports);
    setLoader(false);
  };

  // fetch pagenation data///////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPagination();
  }, [currentPage]); // Fetch data whenever currentPage changes

  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`http://127.0.0.1:8000/api/airports?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setAirports(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <main className="branchTable">
      {/* add airport form */}
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form>
            <div className="mb-5">
              <input
                type="text"
                {...register("airportName")}
                placeholder="اسم المطار"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.airportName?.message}
                </span>
              )}
            </div>
            <div className="mb-5 pt-3">
              <div className="-mx-3 flex flex-wrap">
                {updateMode && (
                  <div className="w-full px-3 sm:w-1/2">
                    <label className="text-white">
                      تفعيل المطار أو إلغاء تفعيل المطار ؟
                    </label>
                    <div className="mb-5">
                      <Switch
                        checked={airportStatus}
                        onChange={(e) => {
                          setAirportStatus(e.target.checked);
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
                  onClick={handleSubmit(updateAirport)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث المطار
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  onClick={handleSubmit(storeAirport)}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل مطار جديد
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
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => handleSearch(e)}
              className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="البحث باسم المطار"
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

      {/* Table to display airport data */}
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
              {" "}
              التاريخ/الوقت{" "}
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التعديل
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping airports data to table rows */}
          {airports.map((airport, index) => {
            const { name, id, status, created_at } = airport;
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
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
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
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>

                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateAirportID(id);
                      setUpdateMode(true);
                      setValue("airportName", name);
                      setAirportStatus(status === "مفعل" ? true : false);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteAirport(id)}
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
      <div>
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
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          pageClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
        />
      </div>
      {loader && <div className="spinner"></div>}
    </main>
  );
}

export default AirportPage;
