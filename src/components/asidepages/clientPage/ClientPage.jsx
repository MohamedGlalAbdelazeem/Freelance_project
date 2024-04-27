import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

function ClientPage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);
  const [inputsMessage, setInputsMessage] = useState(false);
  
  const [clientName, setClientName] = useState("");
  const [clientMail, setClientMail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [countriesNumber, setCountriesNumber] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  const userToken = localStorage.getItem("user_token");

  const [clients, setClients] = useState([]);
  const [searchWay, setSearchWay] = useState("ID");
  const [searchValue, setSearchValue] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateClientID, setUpdateClientID] = useState("");

  const Naviagate = useNavigate();
  const handleUnauthenticated = () => {
    alert("يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية");
    Naviagate("/Login");
    localStorage.removeItem("user_token");
  };

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
        if (response.status === 401) {
          handleUnauthenticated();
          return;
        }
        setClients(response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleClientRegister = (e) => {
    setLoader(true);
    e.preventDefault();
    if (
      !clientName ||
      !clientMail ||
      !clientPhone ||
      !clientAddress ||
      !countriesNumber ||
      !branchNumber ||
      !clientImage 
    ) {
      setInputsMessage(true);
      return;
    }
    setInputsMessage(false);
    const clientData = {
      name: clientName,
      email: clientMail,
      address: clientAddress,
      phone_number: clientPhone,
      branch_id: branchNumber,
      countries_id: countriesNumber,
      image: clientImage,
      notes: clientNotes,
    };
    axios
      .post(`${baseUrl}clients`, clientData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("client", response);
        fetchClients();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
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
      .then(function (response) {
        console.log("client", response);
        fetchClients();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      });
  };
  const updateClient = (id) => {
    setUpdateClientID(id);
    setUpdateMode(true);
    const updatedClient = clients.find((client) => client.id === id);
    if (updatedClient) {
      setClientName(updatedClient.name);
      setClientMail(updatedClient.email);
      setClientPhone(updatedClient.phone_number);
      setBranchNumber(updatedClient.branch_id);
    }
  };
  const handleClientUpdate = () => {
    setLoader(true);

    axios
      .post(
        `${baseUrl}clients/${updateClientID}`,
        {
          name: clientName,
          email: clientMail,
          address: clientAddress,
          phone_number: clientPhone,
          branch_id: branchNumber,
          countries_id: countriesNumber,
          image: clientImage,
          notes: clientNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function (response) {
        console.log("client", response);
        fetchClients();
        setUpdateMode(false);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setLoader(true);
    let searchUrl;
    if (searchWay === "ID") {
      searchUrl = `${baseUrl}clients/${searchValue}`;
    } else {
      searchUrl = `${baseUrl}clients/${searchValue}/branch`;
    }
    axios
      .get(searchUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        console.log("search", response.data.data);
        setClients([response.data.data]);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
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
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسم العميل "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 py-1 text-sm px-1">
                    ادخل اسم العميل
                  </p>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  value={clientMail}
                  onChange={(e) => setClientMail(e.target.value)}
                  placeholder="البريد الإلكترونى"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    ادخل البريد الالكترونى
                  </p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  dir="rtl"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    أدخل رقم هاتف صحيح
                  </p>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="العنوان"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">أدخل العنوان</p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  value={branchNumber}
                  onChange={(e) => setBranchNumber(e.target.value)}
                  placeholder="رقم الفرع"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    أدخل رقم الفرع
                  </p>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  value={countriesNumber}
                  onChange={(e) => setCountriesNumber(e.target.value)}
                  placeholder="رمز المدينة"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    أدخل رمز المدينة
                  </p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="ملاحظات"
                  className="w-full min-h-36 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="flex-grow ">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">اضغط للرفع</span> أو
                        استخدم السحب والافلات
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {clientImage
                          ? clientImage
                          : "SVG, PNG, JPG or GIF (MAX. 800x400px)"}
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>

                {inputsMessage && (
                  <p className="text-red-300 text-sm py-1 px-1">
                    برجاء رفع الصورة
                  </p>
                )}
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  onClick={handleClientUpdate}
                  disabled={loader}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث المستخدم
                </button>
              ) : (
                <button
                  onClick={(e) => handleClientRegister(e)}
                  disabled={loader}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل مستخدم جديد
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
              placeholder={`ابحث بـ ${searchWay}`}
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => handleSearch(e)}
              className="text-white absolute end-32 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              بحث{" "}
            </button>
            <div className="absolute end-2.5 bottom-2">
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
            </div>
          </div>
        </form>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {[
              "",
              "الترتيب",
              "الاسم",
              "البريد",
              "ID",
              "رقم الهاتف",
              "رقم الفرع",
              "الدور",
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
            return (
              <tr
                key={client.id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                  <input type="checkbox" />
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {index + 1}
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {client.name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {client.email}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {client.id}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {client.phone_number}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {client.branch_id}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-0 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {client.role_name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {client.created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => updateClient(client.id)}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
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
    </div>
  );
}

export default ClientPage;
