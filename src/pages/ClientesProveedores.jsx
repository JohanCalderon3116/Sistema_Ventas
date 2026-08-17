import { useQuery } from "@tanstack/react-query";
import {
  ClientesProveedoresTemplate,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";
import {
  useBuscarClientesProveedoresQueryStack,
  useMostrarClientesProveedoresQueryStack,
} from "../tanstack/ClientesProveedores";

export const ClientesProveedores = () => {
  const theme = useTheme();
  const { isLoading } = useMostrarClientesProveedoresQueryStack();
  useBuscarClientesProveedoresQueryStack();
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando...</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
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
