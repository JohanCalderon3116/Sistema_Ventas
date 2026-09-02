import { Navigate, useLocation } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import { usePermisosStore } from "../store/PermisosStore";
import { useQuery } from "@tanstack/react-query";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerSecundario } from "../components/moleculas/SpinnerSecundario";
import { Spinner1 } from "../components/moleculas/Spinner1";
import { useMostrarPermisosGlobalesQueryStack } from "../tanstack/PermisosStack";

export const ProtectedRoute = ({ children, accesby }) => {
  const { user } = userAuth();
  const { mostrarPermisosGlobales } = usePermisosStore();
  const location = useLocation();
  const { datausuarios } = useUsuariosStore();
  const { data: dataPermisosGlobales, isLoading: isLoadingPermisosGlobales } =
    useMostrarPermisosGlobalesQueryStack();
  const isLoading = !datausuarios || isLoadingPermisosGlobales;
  if (user === undefined) return <Spinner1></Spinner1>;
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
