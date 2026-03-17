import { Navigate } from "react-router-dom";
import { userAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, accesby }) => {
  const {user} = userAuth();
  if (accesby === "non-authenticated") {
    if (!user) {
      return children;
    } else {
      return <Navigate to="/"></Navigate>;
    }
  } else if (accesby === "authenticated") {
    if (user) {
      return children;
    }
  }
  return <Navigate to="/login"></Navigate>;
};
