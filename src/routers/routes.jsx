import { Route, Routes } from "react-router-dom";
import { Home, Login } from "../index";

export function Myroutes() {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
  );
}
