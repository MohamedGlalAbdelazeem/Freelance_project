import { Switch } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Updatebranch() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [branchName, setBranchName] = useState("");
  const [branchLocation, setbBranchLocation] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [branchHotline, setBranchHotline] = useState("");
  const [branchStatus, setBranchStatus] = useState(""); // Set initial value to "0"
  const id = window.location.pathname.split("/").slice(-1)[0];
  const storedUser = localStorage.getItem("user");
  const retrievedUser = JSON.parse(storedUser);
  const token = retrievedUser.access_token;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranch();
  }, []);

  const fetchBranch = () => {
    axios
      .get(`${baseUrl}branches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 401) {
          handleUnauthenticated();
        }
        const branchData = response.data.data;
        setBranchName(branchData.name || ""); // Ensure a default value is set
        setbBranchLocation(branchData.location || ""); // Ensure a default value is set
        setTimeFrom(branchData.from || ""); // Ensure a default value is set
        setTimeTo(branchData.to || ""); // Ensure a default value is set
        setBranchHotline(branchData.hot_line || ""); // Ensure a default value is set
        setBranchStatus(branchData.status || "0"); // Ensure a default value is set
      })
      .catch(function (error) {
        console.error("Error fetching branch:", error);
        // Handle error here
        handleUnauthenticated();
      });
  };
  const handleUpdateBranch = (e) => {
    e.preventDefault();
    axios
      .post(
        `${baseUrl}branches/${id}`,
        {
          name: branchName,
          location: branchLocation,
          from: timeFrom,
          to: timeTo,
          hot_line: branchHotline,
          status: branchStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        navigate("/Mainpage/Branchpage");
      })
      .catch(function (error) {
        console.error("Error updating branch:", error);
        // Handle error here
      });
  };
  // hande unuthenticated
  const handleUnauthenticated = () => {
    alert("يجب عليك التسجيل مرة أخرى لانتهاء وقت الصلاحية");
    navigate("/Login");
    localStorage.removeItem("user");
  };
  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form onSubmit={handleUpdateBranch}>
            <div className="mb-5">
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="اسم الفرع"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                value={branchLocation}
                onChange={(e) => setbBranchLocation(e.target.value)}
                placeholder="عنوان الفرع"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-white">
                    الوقت من
                  </label>
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-white ">
                    الوقت إلي
                  </label>
                  <input
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="mb-5 pt-3">
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      value={branchHotline}
                      onChange={(e) => setBranchHotline(e.target.value)}
                      placeholder="الخط الساخن"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <label className="text-white">تفعيل الفرع أم لا ؟</label>
                  <div className="mb-5">
                    <Switch
                      checked={branchStatus === "1"} // '1' is considered as 'on'
                      onChange={(e) =>
                        setBranchStatus(e.target.checked ? "1" : "0")
                      } // '1' for on, '0' for off
                      color="success"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
              >
                تعديل
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Updatebranch;
