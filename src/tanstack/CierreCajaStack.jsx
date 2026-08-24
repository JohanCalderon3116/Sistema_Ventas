import { useQuery } from "@tanstack/react-query";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useEmpresaStore } from "../store/EmpresaStore";

export const useMostrarCierreCajaPorEmpresaQueryStack = () => {
  const { mostrarCierreCajaPorEmpresa } = useCierreCajaStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: [
      "mostrar cierre caja por empresa",
      { _id_empresa: dataempresa?.id },
    ],
    queryFn: () =>
      mostrarCierreCajaPorEmpresa({
        _id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
};
export const useMostrarAperturaCajaPorUsuarioQueryStack = () => {
  const { mostrarCierreCajaXUsuario } = useCierreCajaStore();
  const { datausuarios } = useUsuariosStore();
  return useQuery({
    queryKey: [
      "mostrar caja aperturada por usuario",
      { id_usuario: datausuarios?.id },
    ],
    queryFn: () =>
      mostrarCierreCajaXUsuario({
        id_usuario: datausuarios?.id,
      }),
    enabled: !!datausuarios,
  });
};
