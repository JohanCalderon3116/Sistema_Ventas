import { useQuery } from "@tanstack/react-query";
import {
  ClientesProveedoresTemplate,
  useClientesProveedoresStore,
  useEmpresaStore,
} from "../index";
import { useLocation } from "react-router-dom";

export const ClientesProveedores = () => {
  const location = useLocation();
  const { dataempresa } = useEmpresaStore();
  const { tipo, mostrarCliPro, buscarCliPro, buscador } =
    useClientesProveedoresStore();
  const { isLoading } = useQuery({
    queryKey: [
      "mostrar clientes proveedores",
      {
        dataempresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
      },
    ],
    queryFn: () =>
      mostrarCliPro({
        id_empresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: [
      "buscar clientes proveedores",
      {
        dataempresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
        buscador: buscador,
      },
    ],
    queryFn: () =>
      buscarCliPro({
        id_empresa: dataempresa?.id,
        tipo:
          location.pathname === "/configuracion/clientes"
            ? "cliente"
            : "proveedor",
        buscador: buscador,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <span>Cargando...</span>;
  }
  return <ClientesProveedoresTemplate></ClientesProveedoresTemplate>;
};
