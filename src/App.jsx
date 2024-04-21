import Mainpage from "./components/home/Mainpage"
import Login from "./components/registerpages/Login"
import Forgetpasssword from "./components/registerpages/Forgetpasssword"

import { Routes , Route } from "react-router-dom"
function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
         <Route path="/Forgetpasssword" element={<Forgetpasssword />} />
        <Route path="/Mainpage" element={<Mainpage />} />
      </Routes>
    </>
  )
}

export default App
