import {
  PantallaAperturaCaja,
  POSTemplate,
  Spinner1,
  useCierreCajaStore,
  useMostrarAperturaCajaPorUsuarioQueryStack,
  useProductosStore,
} from "../index";
import { toast } from "sonner";
import { useMostrarMetodosDePagoQueryStack } from "../tanstack/MetodosPagoStack";
import { useEffect } from "react";

export function POS() {
  const { dataCierreCaja } = useCierreCajaStore();
  const { setBuscador } = useProductosStore();
  const { isLoading: isLoadingmetodosPago, error: errorMetodosPago } =
    useMostrarMetodosDePagoQueryStack();
  const { isLoading: isLoadingCierreCaja, error: errorCiereCaja } =
    useMostrarAperturaCajaPorUsuarioQueryStack();
  useEffect(() => {
    setBuscador(""); 
    return () => setBuscador(""); 
  }, []);
  const isLoading = isLoadingCierreCaja || isLoadingmetodosPago;
  const error = errorCiereCaja || errorMetodosPago;
  if (isLoading) {
    return <Spinner1 texto="Verificando aperturas de caja"></Spinner1>;
  }
  if (error) {
    toast.error("Error al mostrar la apertura de caja...");
  }
  return dataCierreCaja ? (
    <POSTemplate></POSTemplate>
  ) : (
    <PantallaAperturaCaja></PantallaAperturaCaja>
  );
}
