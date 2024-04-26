import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Userpage() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [loader, setLoader] = useState(true);
  const [inputsMessage, setInputsMessage] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeMail, setEmployeeMail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeePasswordConfirm, setEmployeePasswordConfirm] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const userToken = localStorage.getItem('user_token');
  const Naviagate = useNavigate();

  const handleUnauthenticated = () => {
    alert("يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية");
    Naviagate("/Login");
    localStorage.removeItem("user_token");
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}employees`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        }
        console.log("emps", response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
        handleUnauthenticated();
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleEmpRegister = (e) => {
    setLoader(true);
    e.preventDefault();
    if (
      employeeName === "" ||
      employeeMail === "" ||
      employeePassword === "" ||
      employeePasswordConfirm === "" ||
      employeePhone === "" ||
      branchNumber === ""
    ) {
      setInputsMessage(true);
      return;
    }
    if (employeePassword !== employeePasswordConfirm) {
      setInputsMessage(true);
      return;
    }
    setInputsMessage(false);
    const employeeData = {
      name: employeeName,
      email: employeeMail,
      password: employeePassword,
      password_confirmation: employeePasswordConfirm,
      phone_number: employeePhone,
      branch_id: branchNumber,
    };
    axios
      .post(`${baseUrl}employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("emp", response);
        fetchEmployees();
      })
      .catch(function (error) {
        console.error("Error fetching", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="اسم العميل "
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">ادخل اسم العميل</p>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="email"
                  value={employeeMail}
                  onChange={(e) => setEmployeeMail(e.target.value)}
                  placeholder="البريد الإلكترونى"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">
                    ادخل البريد الالكترونى
                  </p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="text"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">ادخل كلمة المرور</p>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  value={employeePasswordConfirm}
                  onChange={(e) => setEmployeePasswordConfirm(e.target.value)}
                  placeholder="تأكيد كلمة المرور"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">
                    كلمتى المرور غير متطابقتين
                  </p>
                )}
              </div>
            </div>
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow ">
                <input
                  type="tel"
                  value={employeePhone}
                  onChange={(e) => setEmployeePhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  dir="rtl"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">أدخل رقم هاتف صحيح</p>
                )}
              </div>
              <div className="flex-grow ">
                <input
                  type="text"
                  value={branchNumber}
                  onChange={(e) => setBranchNumber(e.target.value)}
                  placeholder=" رقم الفرع"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {inputsMessage && (
                  <p className="text-red-600 py-1 px-1">أدخل رقم الفرع</p>
                )}
              </div>
            </div>

            <div>
              <button
                onClick={(e) => handleEmpRegister(e)}
                disabled={loader}
                className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
              >
                تسجيل عميل جديد
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Userpage;
