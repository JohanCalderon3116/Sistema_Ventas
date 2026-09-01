import { Navigate, useLocation } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import { usePermisosStore } from "../store/PermisosStore";
import { useQuery } from "@tanstack/react-query";
import { useUsuariosStore } from "../store/UsuariosStore";
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

  const isLoading = !datausuarios || isLoadingPermisosGlobales;

  if (accesby === "non-authenticated") {
    if (!user) {
      return children;
    } else {
      return <Navigate to="/"></Navigate>;
    }
  }

  if (accesby === "authenticated") {
    if (!user) {
      return <Navigate to="/login"></Navigate>;
    }

    if (isLoading) {
      return <SpinnerSecundario texto={"🔐 Verificando permisos..."} />;
    }

    const hasPermission = dataPermisosGlobales?.some((item) => {
      return item.modulos?.link === location.pathname;
    });

    if (!hasPermission) {
      return <Navigate to="/sin-permiso"></Navigate>;
    }

    return children;
  }

  return <Navigate to="/login"></Navigate>;
};
