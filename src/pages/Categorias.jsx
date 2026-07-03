import { useQuery } from "@tanstack/react-query";
import {
  CategoriasTemplate,
  Spinner1,
  useCategroriasStore,
  useEmpresaStore,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";

export const Categorias = () => {
  const theme = useTheme();
  const { mostrarCategorias, buscarCategorias, buscador } =
    useCategroriasStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ["buscar categorias", buscador],
    queryFn: () =>
      buscarCategorias({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
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
