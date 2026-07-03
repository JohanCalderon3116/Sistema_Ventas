import { useQuery } from "@tanstack/react-query";
import {
  ClientesProveedoresTemplate,
  useClientesProveedoresStore,
  useEmpresaStore,
} from "../index";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";

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
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color="#FFFFFF" size={8} />
      </ConteinerLoader>
    );
  }
  return <ClientesProveedoresTemplate></ClientesProveedoresTemplate>;
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
