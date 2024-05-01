import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import "./branchpage.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";
//pagenation
import ReactPaginate from "react-paginate";

function Branchpage() {
  const baseUrl = "http://127.0.0.1:8000/api/";

  const [branches, setBranches] = useState([]);
  const [loader, setLoader] = useState(true);
  const Naviagate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [branchStatus, setBranchStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateBranchID, setUpdateBranchID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showClient, setShowClient] = useState(false);

  const schema = z.object({
    branchName: z.string().min(1, { message: "ادخل اسم الفرع" }),
    branchLocation: z.string().min(1, { message: "ادخل عنوان الفرع" }),
    timeFrom: z.string().min(1, { message: "ادخل الوقت من" }),
    timeTo: z.string().min(1, { message: "ادخل الوقت الي" }),
    hotline: z.string().min(1, { message: "ادخل الخط الساخن" }),
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
    fetchBranches();
    fetchPagenation();
  }, []);

  const fetchBranches = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}branches`, {
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

  // fetch pagenation data///////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPagenation();
  }, [currentPage]); // Fetch data whenever currentPage changes

  const fetchPagenation = () => {
    setLoader(true);
    axios
      .get(`http://127.0.0.1:8000/api/branches?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setBranches(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  // fetch pagenation data///////////////////////

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Naviagate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const storeBranch = async () => {
    setLoader(true);
    if (getValues("timeTo") <= getValues("timeFrom")) {
      toast.error("يجب أن تكون بداية الوقت اقل من نهاية الوقت");
      return;
    }
    await axios
      .post(
        `${baseUrl}branches`,
        {
          name: getValues("branchName"),
          location: getValues("branchLocation"),
          from: getValues("timeFrom"),
          to: getValues("timeTo"),
          hot_line: getValues("hotline"),
          status: branchStatus,
          show_client: showClient,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم إنشاء الفرع بنجاح", { type: "success" });
        reset();
        fetchBranches();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast.error("هذا الفرع موجود بالفعل");
        }
        if (response.response.data.message == "To must be greter than from") {
          toast.error("يجب أن تكون بداية الوقت اقل من نهاية الوقت");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteBranch(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}branches/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        } else if (response.status === 204) {
          toast.success("تم حذف الفرع بنجاح");
          fetchBranches();
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
  const updateBranch = async () => {
    setLoader(true);
    await axios
      .post(
        `${baseUrl}branches/${updateBranchID}`,
        {
          name: getValues("branchName"),
          location: getValues("branchLocation"),
          from: getValues("timeFrom"),
          to: getValues("timeTo"),
          hot_line: getValues("hotline"),
          status: branchStatus,
          show_client: showClient,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم تحديث الفرع بنجاح", { type: "success" });
        fetchBranches();
        reset();
        setUpdateMode(false);
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذا الفرع موجود بالفعل", { type: "error" });
        }
        if (response.response.data.message == "To must be greter than from") {
          toast.error("يجب أن تكون بداية الوقت اقل من نهاية الوقت");
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
      fetchBranches();
      return;
    }
    let allBranches = [...branches];
    let filteredBranches = [];
    allBranches.forEach((Branch) => {
      if (Branch.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredBranches.push(Branch);
      }
    });
    setBranches(filteredBranches);
    setLoader(false);
  };

  return (
    <main className="branchTable">
      {/* add branch form */}
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form>
            <div className="mb-5">
              <input
                type="text"
                {...register("branchName")}
                placeholder="اسم الفرع "
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.branchName?.message}
                </span>
              )}
            </div>
            <div className="mb-5">
              <input
                type="text"
                {...register("branchLocation")}
                placeholder="عنوان الفرع "
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.branchLocation?.message}
                </span>
              )}
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-white">
                    الوقت من
                  </label>
                  <input
                    type="time"
                    {...register("timeFrom")}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.timeFrom?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-white ">
                    الوقت إلي
                  </label>
                  <input
                    type="time"
                    {...register("timeTo")}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.timeTo?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5 pt-3">
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      {...register("hotline")}
                      placeholder="الخط الساخن"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.hotline?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-1/2 flex gap-5 justify-evenly px-5 ">
                  <div>
                    <label className="text-white">تفعيل الفرع أم لا ؟</label>
                    <div className="mb-5">
                      <Switch
                        checked={branchStatus}
                        onChange={(e) => setBranchStatus(e.target.checked)}
                        color="success"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white">إظهار العميل أم لا ؟</label>
                    <div className="mb-5">
                      <Switch
                        checked={showClient}
                        onChange={(e) => setShowClient(e.target.checked)}
                        color="success"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  type="submit"
                  onClick={handleSubmit(updateBranch)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث الفرع
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(storeBranch)}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل فرع جديد
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
              placeholder="ابحث عن فرع بالاسم"
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
              إظهار العميل
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              من
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              إلي{" "}
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
          {/* Mapping branches data to table rows */}
          {branches.map((branch, index) => {
            const {
              name,
              id,
              location,
              hotLine,
              status,
              show_client,
              from,
              to,
              created_at,
            } = branch;
            const tableIndex = (currentPage - 1) * 15 + index + 1;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {location}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {hotLine}
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
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {show_client === "مفعل" ? (
                    <div className="bg-green-500 text-white text-sm rounded-md">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white rounded-md text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>

                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {from}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {to}
                  </span>
                </td>

                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-3 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      onClick={() => {
                        ScrollUp();
                        setUpdateBranchID(id);
                        setUpdateMode(true);
                        setValue("branchName", name);
                        setValue("branchLocation", location);
                        setValue("timeFrom", from);
                        setValue("timeTo", to);
                        setValue("hotline", hotLine);
                        setBranchStatus(status === "مفعل" ? true : false);
                        setShowClient(show_client === "مفعل" ? true : false);
                      }}
                      className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                    >
                      <DriveFileRenameOutlineIcon />
                    </button>
                    <button
                      onClick={() => deleteBranch(id)}
                      className="bg-red-800 text-white p-2 rounded hover:bg-red-500"
                    >
                      <DeleteForeverIcon />
                    </button>
                    <button
                      onClick={() =>
                        document.getElementById("my_modal_2").showModal()
                      }
                      className="bg-sky-700 text-white p-2 rounded hover:bg-sky-500"
                    >
                      <VisibilityIcon />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          <div className="modal-action absolute -top-4 left-2">
            <form method="dialog" className="">
              <button className="btn rounded-full w-12 h-10">X</button>
            </form>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
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

export default Branchpage;
