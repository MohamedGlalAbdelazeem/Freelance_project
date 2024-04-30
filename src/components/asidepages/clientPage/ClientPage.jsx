import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { toast } from "react-toastify";
import { ScrollUp } from "../../ScrollUp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function ClientPage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);
  const userToken = localStorage.getItem("user_token");
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateClientID, setUpdateClientID] = useState("");
  const Navigate = useNavigate();

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Navigate("/Login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const schema = z.object({
    name: z.string().min(1, { message: "يجب ادخال اسم العميل" }),
    email: z.string().email({ message: "يجب ادخال بريد الكترونى صحيح" }),
    phone_number: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
    address: z.string().min(1, { message: "يجب ادخال العنوان" }),
    branch_id: z.string().min(1, { message: "يجب ادخال رقم الفرع" }),
    country_id: z.string().min(1, { message: "يجب ادخال رمز المدينة" }),
    image : z.any(),
    notes: z.string().min(1, { message: "يجب ادخال ملاحظات" }),
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
    fetchClients();
  }, []);

  const fetchClients = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}clients`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        // console.log(clients);
        setLoader(false);
      });
  };
  const [picture, setPicture] = useState(null);
  const handleImage = (e) => {
    setPicture(e.target.files[0]);
    console.log(picture.name);

  }
  const storeClient = () => {
    // e.preventDefault();
    // const formData = new FormData();

    setLoader(true);
    const clientData = {
      name: getValues("name"),
      email: getValues("email"),
      phone_number: getValues("phone_number"),
      address: getValues("address"),
      branch_id: getValues("branch_id"),
      countries_id: getValues("countries_id"),
      image: picture.name,
      notes: getValues("notes"),
    };
    console.log(clientData);
    axios
      .post(`${baseUrl}clients`, clientData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function () {
        toast.success("تم تسجيل العميل بنجاح");
        fetchClients();
        reset();
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const deleteClient = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}clients/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        fetchClients();
        toast.success("تم حذف العميل بنجاح");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };
  const handleClientUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}clients/${updateClientID}`,
        {
          name: getValues("name"),
          email: getValues("email"),
          phone_number: getValues("phone_number"),
          address: getValues("address"),
          branch_id: getValues("branch_id"),
          countries_id: getValues("countries_id"),
          image: getValues("image"),
          notes: getValues("notes"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث العميل بنجاح");
        fetchClients();
        setUpdateMode(false);
        reset();
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
      fetchClients();
      return;
    }
    let allClients = [...clients];
    let filteredClients = [];
    allClients.forEach((client) => {
      if (client.name.toLowerCase().includes(searchValue.toLowerCase())) {
        filteredClients.push(client);
      }
    });
    setClients(filteredClients);
    setLoader(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="اسم العميل "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="البريد الإلكترونى"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.email?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="tel"
                  {...register("phone_number")}
                  placeholder="رقم الهاتف"
                  dir="rtl"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.phone_number?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("address")}
                  placeholder="العنوان"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.address?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("branch_id")}
                  placeholder="رقم الفرع"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.branch_id?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  {...register("countries_id")}
                  placeholder="رمز المدينة"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.countries_id?.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <textarea
                  {...register("notes")}
                  placeholder="ملاحظات"
                  className="w-full min-h-36 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.notes?.message}
                  </span>
                )}
              </div>
              <div className="flex-grow ">
                <div className="flex items-center justify-center w-full">
                  {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label> */}
                  <input
                    {...register("image")}
                    onChange={handleImage}
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                  />
                </div>
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  onClick={handleSubmit(handleClientUpdate)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث العميل
                </button>
              ) : (
                <button
                  onClick={handleSubmit(storeClient)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل عميل جديد
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
              placeholder={`ابحث عن عميل بالاسم`}
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
              "الاسم",
              "الجنسية",
              "العنوان",
              "البريد الالكترونى",
              "رقم الموبايل",
              "الفرع",
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
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {clients.map((client, index) => {
            const {
              id,
              name,
              address,
              email,
              phone_number,
              branch,
              nationality,
              created_at,
            } = client;
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
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {nationality.nationality}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {address}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {email}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {phone_number}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {branch.branch_name}
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
                      setUpdateClientID(id);
                      setUpdateMode(true);
                      setValue("name", name);
                      setValue("address", address);
                      setValue("email", email);
                      setValue("phone_number", phone_number);
                      setValue("branch_id", branch.branch_name);
                      setValue("countries_id", nationality.id);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteClient(id)}
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

export default ClientPage;
