import axios from 'axios';
import { useState, useEffect } from 'react';
import userPhoto from './user.avif';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



function Userprofilepage() {
    const [userProfile, setUserprofile] = useState([]);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate(); // Renamed useNavigate to navigate to avoid confusion with component
  
    const schema = z
    .object({
      name: z.string().min(1, "الاسم يجب ان يكون 4 احرف على الاقل"),
      phone_number: z.string().min( "ادخل رقم الهاتف"),
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
        const userRoleName = localStorage.getItem('user_role_name');
        const userToken = localStorage.getItem('user_token');

        if (!userToken) {
            handleUnauthenticated();
            return;
        }

        axios.get('http://127.0.0.1:8000/api/refresh', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
        .then(function (response) { 
            setLoader(false);
            setUserprofile(response.data.Admin);
        })
        .catch(function (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthenticated();
            } else {
                // Handle other errors
                console.error("Error refreshing token:", error);
            }
            setLoader(false);
        });
    }, []);
    const handleUpdate = () => {
        setLoader(true);
        axios
          .post(
            `${baseUrl}update`,
            {
                name: getValues("name"),
                phone_number: getValues("phone_number"),
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then(function () {
            toast.success("تم تحديث البيانات بنجاح");
            fetchEmployees();
            setUpdateMode(false);
          })
          .catch(function (error) {
            toast.error(error.response.data.message);
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
                        <div className="flex justify-center items-center">
                                <img  src={userPhoto} className="border-double border-4 border-sky-500 w-36 rounded-full h-36 mb-8" alt="user_profile_photo" /> </div>
                             <input type="file" name="file" id="file" className="sr-only" />
                            <label className="cursor-pointer relative flex min-h-[50px] items-center justify-center rounded-xl border border-dashed border-[#e0e0e0] p-5 text-center">
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
                <button className="mx-2 text-md font-medium  border-2 rounded-full hover:bg-gray-200">
                    تعديل البيانات الشخصية
                </button>
                <span className="flex-grow bg-gray-200 rounded h-1"></span>
                </h3>

         {/* change name  & phone  */}
            <div className="items-center justify-center p-12">
                <div className="rounded-3xl mx-auto w-full max-w-[750px] bg-gray-700 text-white p-10">
                    <form>
                        <div className="mb-5">
                            <label  className="mb-3 block text-base font-medium ">
                                 الاسم 
                            </label>
                            <input type="text" 
                              {...register("name")}
                              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                        <div className="mb-5">
                            <label  className="mb-3 block text-base font-medium">
                                رقم الهاتف
                            </label>
                            <input type="number"
                              {...register("phone_number")}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                        <div>
                            <button
                               onClick={handleSubmit(handleUpdate)}
                                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none">
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
                            <label  className="mb-3 block text-base font-medium ">
                                 كلمة السر الحالية 
                            </label>
                            <input type="password" name="name" id="name" 
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                        <div className="mb-5">
                            <label  className="mb-3 block text-base font-medium">
                                كلمة السر الجديدة 
                            </label>
                            <input type="password"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>

                        <div className="mb-5">
                            <label  className="mb-3 block text-base font-medium">
                                                تأكيد كلمة السر الجديدة
                            </label>
                            <input type="password"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                      
                        <div>
                            <button
                                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none">
                                تغيير 
                            </button>
                        </div>
                    </form>
                </div>
              </div>
        </div>
    );
}

export default Userprofilepage;
