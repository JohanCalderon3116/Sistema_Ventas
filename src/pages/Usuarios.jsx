import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate } from "../components/templates/UsuariosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { BarLoader, BeatLoader } from "react-spinners";
import styled, { useTheme } from "styled-components";

export const Usuarios = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarUsariosAsignados, buscarUsariosAsignados, buscador } =
    useAsignacionCajaSucursalesStore();
  const theme = useTheme();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios asignados", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarUsariosAsignados({
        _id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
  useQuery({
    queryKey: [
      "buscar usuarios asignados",
      { id_empresa: dataempresa?.id, buscador: buscador },
    ],
    queryFn: () =>
      buscarUsariosAsignados({
        _id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
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

