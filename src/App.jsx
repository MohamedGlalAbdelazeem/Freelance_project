import Mainpage from "./components/home/Mainpage";
import Login from "./components/registerpages/Login";
import Forgetpasssword from "./components/registerpages/Forgetpasssword";
import { Routes, Route } from "react-router-dom";
import Userpage from "./components/asidepages/userpage/Userpage";
import Branchpage from "./components/asidepages/branchpage/Branchpage";
import Userprofilepage from "./components/header/Userprofilepage";
import ClientPage from "./components/asidepages/clientPage/ClientPage";
import Categoriespage from "./components/asidepages/categoriespage/Categoriespage";
import Trippage from "./components/asidepages/trippage/Trippage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Resetpassword from "./components/registerpages/Resetpassword";
import Services from "./components/asidepages/servicespage/Services";
import AirportPage from "./components/asidepages/airportPage/AirportPage";
import CurrencyPage from "./components/asidepages/currencyPage/CurrencyPage";
import PaymentPage from "./components/asidepages/paymentPage/PaymentPage";
import BookingPage from "./components/asidepages/bookingPage/BookingPage";
import ProtectedRoute from "./ProtectedRoute";
import TripBooking from "./components/asidepages/bookingPage/tripBooking";
import ServiceBooking from "./components/asidepages/bookingPage/serviceBooking";
import Settings from "./components/asidepages/settings/Settings";
import Addsupueradminpage from "./components/asidepages/addsuperadmin/Addsupueradminpage";
import Reportpage from "./components/home/Reportpage";
import Airlines from "./components/asidepages/airlines/Airlines";
import Clientsreport from "./components/asidepages/clientsreport/Clientsreport";
import Billsummarypage from "./components/billsummaryresports/Billsummarypage";
import Rangeclientreports from "./components/asidepages/clientsreport/Rangeclientreports";
import Dailyclientsreports from "./components/asidepages/clientsreport/Dailyclientsreports";
import Billsummaryrespotsdaily from "./components/billsummaryresports/Billsummaryrespotsdaily";
 
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Resetpassword"
          element={
              <Resetpassword />
          }
        />
        <Route path="/Forgetpasssword" element={<Forgetpasssword />} />
        <Route
          path="/Mainpage"
          element={
            <ProtectedRoute>
              <Mainpage />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Reportpage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="booking/trip" element={<TripBooking />} />
          <Route path="booking/service" element={<ServiceBooking />} />
          
          <Route path="Clientsreport" element={<Clientsreport />} />
          <Route path="Clientsreport/Dailyclientsreports" element={<Dailyclientsreports />} />
          <Route path="Clientsreport/Rangeclientreports" element={<Rangeclientreports />} />



          <Route path="Billsummarypage" element={<Billsummarypage />} />
          <Route path="Billsummarypage/Billsummaryrespotsdaily" element={<Billsummaryrespotsdaily />} />
 
          <Route path="Userpage" element={<Userpage />} />
          <Route path="clientpage" element={<ClientPage />} />
          <Route path="Branchpage" element={<Branchpage />} />
          <Route path="Categoriespage" element={<Categoriespage />} />
          <Route path="airports" element={<AirportPage />} />
          <Route path="Airlines" element={<Airlines />} />
          <Route path="currencies" element={<CurrencyPage />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="Trippage" element={<Trippage />} />
          <Route path="Services" element={<Services />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Addsupueradminpage" element={<Addsupueradminpage />} />
          <Route path="Userprofilepage" element={<Userprofilepage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
