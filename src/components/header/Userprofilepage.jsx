import axios from "axios";
import { useState, useEffect } from "react";
import userPhoto from "./user.avif";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserProfilePage() {
  const [userProfile, setUserprofile] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setLoader(true);
    const userRoleName = localStorage.getItem("user_role_name");
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      handleUnauthenticated();
      return;
    }
    refreshUser();
  }, []);

  const refreshUser = () => {
    axios
      .get("http://127.0.0.1:8000/api/refresh", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setUserprofile(response.data.Admin);
        setName(response.data.Admin.name);
        setPhoneNumber(response.data.Admin.phone_number);
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          handleUnauthenticated();
        } else {
          console.error("Error refreshing token:", error);
        }
      })
      .finally(() => {
        setLoader(false);
        console.log(userProfile);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name || !phoneNumber) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }
    setLoader(true);
    axios
      .post(
        `http://127.0.0.1:8000/api/update`,
        {
          name: name,
          phone_number: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function (res) {
        toast.success("تم تحديث البيانات بنجاح");
        refreshUser();
      })
      .catch(function (error) {
        toast.error("لم يتم تعديل البيانات");
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const changePassword = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (newPassword.trim() === "" && confirmNewPassword.trim() === "") {
      setIsError(true);
      return;
    }
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      toast("كلمة المرور غير متطابقة", { type: "error" });
      return;
    }
    if (newPassword.trim().length < 6 && confirmNewPassword.trim().length < 6) {
      setIsError(true);
      return;
    }
    await axios
      .post(
        "http://127.0.0.1:8000/api/change-password",
        {
          current_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast("تم تغيير كلمة السر بنجاح", { type: "success" });
        }
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error" });
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
    navigate("/Login"); // Changed Naviagate to navigate
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  return (
    <div className="items-center justify-center">
      <div className="mx-auto w-full max-w-[750px] bg-white">
        <form>
          <div className="mb-2 pt-2">
            <div>
              <div className="flex justify-center items-center flex-col mb-10">
                <img
                  src={userPhoto}
                  className="border-double border-4 border-sky-500 w-36 rounded-full h-36 "
                  alt="user_profile_photo"
                />
                <p className="text-yellow-600">Demo</p>
                <p>
                  <strong>الاسم: </strong>
                  {userProfile.name}
                </p>
                <p>
                  <strong>رقم الهاتف: </strong>
                  {userProfile.phone_number}
                </p>
              </div>
              <input type="file" name="file" id="file" className="sr-only" />
              <label
                htmlFor="file"
                className="cursor-pointer relative flex min-h-[50px] items-center justify-center rounded-xl border border-dashed border-[#e0e0e0] p-5 text-center"
              >
                <div>
                  <span className="mb-2 block text-sm font-semibold text-[#07074D]">
                    تغيير الصورة الشخصية
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">
                    Or
                  </span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-2 text-base font-medium text-[#07074D]">
                    Browse
                  </span>
                </div>
              </label>
            </div>

            {/* Rest of the form */}
          </div>
        </form>
      </div>
      <h3 className="flex items-center w-full">
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
        <button className="mx-2 px-3 py-1 text-md font-medium  border-2 rounded-full hover:bg-gray-200">
          تعديل البيانات الشخصية
        </button>
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
      </h3>
      {/* change name  &   */}
      <div className="items-center justify-center p-12">
        <div className="rounded-3xl mx-auto w-full max-w-[750px] bg-gray-700 text-white p-10">
          <form>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium ">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                defaultValue={loader ? userProfile?.name : ""}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                defaultValue={loader ? userProfile?.phone_number : ""}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div>
              <button
                onClick={(e) => {
                  handleUpdate(e);
                }}
                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none"
              >
                تعديل
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* change passwrod  */}
      <h3 className="flex items-center w-full">
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
        <button className="mx-2 text-md font-medium  border-2 rounded-full hover:bg-gray-200">
          تغيير كلمة السر
        </button>
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
      </h3>
      <div className="items-center justify-center p-12">
        <div className="rounded-3xl mx-auto w-full max-w-[750px] bg-gray-700 text-white p-10">
          <form>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium ">
                كلمة السر الحالية
              </label>
              <input
                type="password"
                name="name"
                id="name"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                كلمة السر الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {isError && (
                <p className="text-red-500 text-sm">
                  كلمة المرور يجب ان تكون اكبر من 6 احرف
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                تأكيد كلمة السر الجديدة
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {isError && (
                <p className="text-red-500 text-sm">
                  كلمة المرور يجب ان تكون اكبر من 6 احرف
                </p>
              )}
            </div>

            <div>
              <button
                onClick={(e) => changePassword(e)}
                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none"
              >
                تغيير
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
