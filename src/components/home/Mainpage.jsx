import Header from "./Header";
import Asidebar from "./Asidebar";
import { Outlet } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function Mainpage() {
  return (
    <main className="flex">
      <div>
        <Asidebar />
      </div>
      <div className="w-full">
        <Header />
        <div className="p-5">
          <Outlet />
           <a href="https://wa.me/00972599339233" target="_blank" >
              <WhatsAppIcon sx={{ width:"60px",height:"60px", position:"fixed",left:"30px", bottom:"30px",  borderRadius:"50%",fontSize:"100px" , backgroundColor:"green" , color:"white"}}/>
           </a>
        </div>
      </div>
    </main>
  );
}

export default Mainpage;
