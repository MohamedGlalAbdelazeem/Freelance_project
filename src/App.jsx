import Mainpage from "./components/home/Mainpage"
import Login from "./components/registerpages/Login"
import Forgetpasssword from "./components/registerpages/Forgetpasssword"
import { Routes , Route } from "react-router-dom"
import Userpage from "./components/asidepages/userpage/Userpage"
import Branchpage from "./components/asidepages/branchpage/Branchpage"
import Userprofilepage from "./components/header/Userprofilepage"


function App() {
  

  return (
    <>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Forgetpasssword" element={<Forgetpasssword />} />
        <Route path="/Mainpage" element={<Mainpage />}>
          <Route path="Userpage" element={<Userpage />} />
          <Route path="Branchpage" element={<Branchpage />} />
          <Route path="Userprofilepage" element={<Userprofilepage />} />
          
        </Route>
    </Routes>

    </>
  )
}

export default App
