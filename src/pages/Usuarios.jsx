import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate } from "../components/templates/UsuariosTemplate";
import { BeatLoader } from "react-spinners";
import styled, { useTheme } from "styled-components";
import {
  useBuscarUsuariosAsignados,
  useMostrarUsuariosAsignadosQueryStack,
} from "../tanstack/UsuariosStack";

export const Usuarios = () => {
  const theme = useTheme();
  const { isLoading } = useMostrarUsuariosAsignadosQueryStack();
  useBuscarUsuariosAsignados();
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  return <UsuariosTemplate></UsuariosTemplate>;
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
