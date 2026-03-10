import { Route, Routes } from "react-router-dom";
import { Home, Login, ProtectedRoute, userAuth } from "../index";

export function Myroutes() {
  const { user } = userAuth();
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute user={user} redirectTo={"/login"}></ProtectedRoute>
        }
      >
        <Route path="/" element={<Home></Home>}></Route>
      </Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
  );
}
