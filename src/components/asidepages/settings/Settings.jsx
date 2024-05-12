import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";

function Settings() {
  const userToken = localStorage.getItem("user_token");
  const updateValue = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://127.0.0.1:8000/api/settings/allow_updated",
        {
          days: updateValue.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.data.message === "Update Successfully")
          toast.success("تم التحديث بنجاح");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div>
        <div className="flex items-center justify-center border-2 rounded-xl p-5 bg-gray-700 w-fit mx-auto">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="flex-grow">
                <label htmlFor="settingsNum" className="text-white">
                  عدد الايام المسموح بالتعديل خلالها
                </label>
                <input
                  ref={updateValue}
                  id="settingsNum"
                  type="number"
                  placeholder="عدد الايام"
                  className="w-full mt-3 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            <div>
              <button
                onClick={(e) => handleSubmit(e)}
                className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
              >
                تعديل عدد الايام
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;
