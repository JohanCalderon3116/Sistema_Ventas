import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useLocation } from "react-router-dom";
import { useClientesProveedoresStore } from "../store/ClientesProveedoresStore";

export const useMostrarClientesProveedoresQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCliPro } = useClientesProveedoresStore();
  const location = useLocation();
  return useQuery({
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
};

export const useBuscarClientesProveedoresLocationQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const location = useLocation();
  const { buscador, buscarCliPro } = useClientesProveedoresStore();
  return useQuery({
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
};
export const useBuscarClientesQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { buscador, buscarCliPro } = useClientesProveedoresStore();
  return useQuery({
    queryKey: ["buscar cliente", dataempresa?.id, "cliente", buscador],
    queryFn: () =>
      buscarCliPro({
        id_empresa: dataempresa?.id,
        tipo: "cliente",
        buscador: buscador,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
