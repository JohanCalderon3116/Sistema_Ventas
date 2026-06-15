import { Navigate, useLocation } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import { usePermisosStore } from "../store/PermisosStore";
import { useQuery } from "@tanstack/react-query";
import { useUsuariosStore } from "../store/UsuariosStore";
import { Spinner1 } from "../components/moleculas/Spinner1";
import { SpinnerSecundario } from "../components/moleculas/SpinnerSecundario";

export const ProtectedRoute = ({ children, accesby }) => {
  const { user } = userAuth();
  const { mostrarPermisosGlobales } = usePermisosStore();
  const location = useLocation();
  const { datausuarios } = useUsuariosStore();
  const {
    data: dataPermisosGlobales,
    isLoading: isLoadingPermisosGlobales,
    error: errorPermisosGlobales,
  } = useQuery({
    queryKey: ["permisos globales", datausuarios?.id],
    queryFn: () => mostrarPermisosGlobales({ id_usuario: datausuarios?.id }),
    enabled: !!datausuarios,
  });
  if (isLoadingPermisosGlobales) {
    return (
      <SpinnerSecundario texto={"Cargando permisos :p"}></SpinnerSecundario>
    );
  }
  const hasPermission = dataPermisosGlobales?.some((item) => {
    return item.modulos?.link === location.pathname;
  });
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
