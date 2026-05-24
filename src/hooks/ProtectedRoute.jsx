import { Navigate, useLocation } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import { usePermisosStore } from "../store/PermisosStore";

export const ProtectedRoute = ({ children, accesby }) => {
  const { user } = userAuth();
  const { dataPermisosGlobales } = usePermisosStore();
  const location = useLocation();
  const hasPermission = dataPermisosGlobales?.some((item) => {
    console.log(
      `comparando: "${item.modulzos?.link}" === "${location.pathname}"`,
      console.log("item completo:", JSON.stringify(item)),
      item.modulos?.link === location.pathname,
    );
    return item.modulos?.link === location.pathname;
  });
  console.log("path:", location.pathname);
  console.log("permisos globales:", dataPermisosGlobales);
  console.log("hasPermission:", hasPermission);
  console.log("state permiso:", hasPermission);
  console.log("state path:", location.pathname);
  if (accesby === "non-authenticated") {
    if (!user) {
      return children;
    } else {
      return <Navigate to="/"></Navigate>;
    }
  } else if (accesby === "authenticated") {
    if (user) {
      if (!hasPermission) {
        return <Navigate to="/404"></Navigate>;
      }
      return children;
    }
  }
  return <Navigate to="/login"></Navigate>;
};
