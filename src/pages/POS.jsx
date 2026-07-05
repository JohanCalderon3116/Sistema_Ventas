import { useQuery } from "@tanstack/react-query";
import {
  PantallaAperturaCaja,
  POSTemplate,
  Spinner1,
  useCierreCajaStore,
  useEmpresaStore,
  useMostrarAperturaCajaPorUsuarioQueryStack,
  useProductosStore,
} from "../index";
import { useCajasStore } from "../store/CajaStore";
import { useAsignacionCajaSucursalesStore } from "../store/AsignacionCajaSucursales";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { useMostrarMetodosDePagoQueryStack } from "../tanstack/MetodosPagoStack";

export function POS() {
  const { dataCierreCaja } = useCierreCajaStore();
  const { isLoading: isLoadingmetodosPago, error: errorMetodosPago } =
    useMostrarMetodosDePagoQueryStack();
  const { isLoading: isLoadingCierreCaja, error: errorCiereCaja } =
    useMostrarAperturaCajaPorUsuarioQueryStack();
  const isLoading = isLoadingCierreCaja;
  const error = errorCiereCaja;
  if (isLoading) {
    return <Spinner1 texto="Verificando apertiras de caja"></Spinner1>;
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
