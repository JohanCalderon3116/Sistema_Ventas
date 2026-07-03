import { useQuery } from "@tanstack/react-query";
import {
  MetodosPagoTemplate,
  Spinner1,
  useEmpresaStore,
  useMetodosPagoStore,
} from "../index";
import styled, { useTheme } from "styled-components";
import { BeatLoader } from "react-spinners";

export const MetodosPago = () => {
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const theme = useTheme();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar metodos pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
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
  return <MetodosPagoTemplate></MetodosPagoTemplate>;
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
