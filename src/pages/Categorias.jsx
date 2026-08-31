import {
  CategoriasTemplate,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";
import {
  useBuscarCategoriasQueryStack,
  useMostrarCategoriasQueryStack,
} from "../tanstack/CategoriasStack";

export const Categorias = () => {
  const theme = useTheme();
  const { isLoading } = useMostrarCategoriasQueryStack();
  useBuscarCategoriasQueryStack();
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
  return <CategoriasTemplate></CategoriasTemplate>;
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
