import { useEffect } from "react";
import {
  useCierreCajaStore,
  useEliminarVentasIncompletasMutateStack,
  useMostrarUsuariosQueryStack,
} from "../index";

export function LimpiezaVentas() {
  const { data: datausuarios } = useMostrarUsuariosQueryStack();
  const { dataCierreCaja } = useCierreCajaStore();
  const { mutate } = useEliminarVentasIncompletasMutateStack();

  useEffect(() => {
    if (datausuarios?.id && dataCierreCaja?.id) {
      mutate();
    }
  }, [datausuarios?.id, dataCierreCaja?.id]);

  return null;
}