import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddHomeWorkOutlinedIcon from "@mui/icons-material/AddHomeWorkOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { toast } from "react-toastify";
import CategoryIcon from "@mui/icons-material/Category";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PaidIcon from "@mui/icons-material/Paid";
import GroupsIcon from "@mui/icons-material/Groups";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useEffect, useState } from "react";
import axios from "axios";
import BuildIcon from "@mui/icons-material/Build";

function Asidebar() {
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [userProfile, setUserprofile] = useState([]);
  function handelLogout() {
    if (userToken) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_role_name");
      Navigate("/Login");
      toast("تم تسجيل الخروج بنجاح", { type: "success" });
    } else {
      return null;
    }
  }

  const userrolename = localStorage.getItem("user_role_name");

  let asidebarItems = [];

  if (userrolename === "admin") {
    asidebarItems = [
      {
        text: "إدارة العملاء",
        path: "/Mainpage/clientpage",
        icon: <GroupsIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "تصنيف الرحلات ",
        path: "/Mainpage/Categoriespage",
        icon: <CategoryIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة المطارات",
        path: "/Mainpage/airports",
        icon: <FlightTakeoffIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة العملات",
        path: "/Mainpage/currencies",
        icon: <PaidIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة طرق الدفع",
        path: "/Mainpage/payments",
        icon: <CreditCardIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدراة الحجز",
        path: "/Mainpage/booking",
        icon: <SupportAgentIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الرحلات",
        path: "/Mainpage/Trippage",
        icon: <LocalAirportIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الخدمات ",
        path: "/Mainpage/Services",
        icon: <SettingsSuggestIcon sx={{ fontSize: 35 }} />,
      },
    ];
  } else if (userrolename === "super_admin") {
    asidebarItems = [
      {
        text: "إدارة الفروع",
        path: "/Mainpage/Branchpage",
        icon: <AddHomeWorkOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الموظفين",
        path: "/Mainpage/Userpage",
        icon: <GroupAddOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة العملاء",
        path: "/Mainpage/clientpage",
        icon: <GroupsIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدراة الحجز",
        path: "/Mainpage/booking",
        icon: <SupportAgentIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الرحلات",
        path: "/Mainpage/Trippage",
        icon: <LocalAirportIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الخدمات ",
        path: "/Mainpage/Services",
        icon: <SettingsSuggestIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "الإعدادات",
        path: "/Mainpage/Settings",
        icon: <BuildIcon sx={{ fontSize: 35 }} />,
      },
    ];
  }

  useEffect(() => {
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
        setUserprofile(response.data.Admin);
      })
      .catch(function (error) {
        console.error("Error refreshing token:", error);
      });
  };

  return (
    <>
      <aside
        id="asidebar"
        className="flex flex-col w-72 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700"
      >
        <div
          className="flex flex-col items-center bg-slate-600 p-4 rounded-3xl"
          id="admin"
        >
          <div className="avatar online bg-white rounded-3xl ">
            <div className="w-14 rounded-full">
              <Link to="/Mainpage/Userprofilepage">
                <AccountCircleOutlinedIcon sx={{ fontSize: 55 }} />
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="font-bold text-lg text-green-400">
              {userProfile.role_name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex-1 -mx-3 space-y-3 ">
            <ul className=" font-medium">
              {asidebarItems.map((item, index) => {
                return (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${
                          isActive ? "bg-gray-700  " : null
                        } flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`
                      }
                    >
                      <div>
                        {item.icon}
                        <span className="ms-6 text-sm font-bold asidbaritems">
                          {item.text}
                        </span>
                      </div>
                    </NavLink>
                    <div className="h-0.5 mt-0.5 w-full bg-gray-700"></div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-6">
            <div className="flex items-center justify-between mt-6">
              <button
                id="logout"
                onClick={handelLogout}
                className="text-white w-full bg-red-700 p-2 rounded-lg hover:bg-red-400"
              >
                تسجيل الخروج
                <LogoutOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Asidebar;
