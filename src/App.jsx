import Mainpage from "./components/home/Mainpage"
import Login from "./components/registerpages/Login"
import Forgetpasssword from "./components/registerpages/Forgetpasssword"
import { Routes, Route } from "react-router-dom"
import Userpage from "./components/asidepages/userpage/Userpage"
import Branchpage from "./components/asidepages/branchpage/Branchpage"
import Userprofilepage from "./components/header/Userprofilepage"
import ClientPage from "./components/asidepages/clientPage/ClientPage"
import Categoriespage from "./components/asidepages/categoriespage/Categoriespage"
import Trippage from "./components/asidepages/trippage/Trippage"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Resetpassword from "./components/registerpages/Resetpassword"
import Services from "./components/asidepages/servicespage/Services"
 
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Resetpassword" element={<Resetpassword />} />
        <Route path="/Forgetpasssword" element={<Forgetpasssword />} />
        <Route path="/Mainpage" element={<Mainpage />}>
          <Route path="Userpage" element={<Userpage />} />
          <Route path="clientpage" element={<ClientPage />} />
          <Route path="Branchpage" element={<Branchpage />} />
          <Route path="Categoriespage" element={<Categoriespage />} />
          <Route path="Trippage" element={<Trippage />} />
          <Route path="Services" element={<Services />} />
          <Route path="Userprofilepage" element={<Userprofilepage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App
