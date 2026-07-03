import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate } from "../components/templates/UsuariosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { BarLoader } from "react-spinners";
import { useTheme } from "styled-components";

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
  const {
    isLoading: buscarUsuariosAsignados,
    error: errorBuscarusuariosAsignados,
  } = useQuery({
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
    return <BarLoader color={theme.text}></BarLoader>;
  }
  if (error) {
    return <span>Error... {error.message} </span>;
  }
  return <UsuariosTemplate></UsuariosTemplate>;
};
