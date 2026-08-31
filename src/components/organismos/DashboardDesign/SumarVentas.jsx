import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  FormatearNumeroDineroSinIsoYCurrency,
  useSumarVentasQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";

export const SumarVentas = () => {
  const { totalVentas, porcentajeCambioTotal } =
    useDetalleVentasStore();
  const { isLoading } = useSumarVentasQueryStack();
  if (isLoading) {
    return <BarLoader></BarLoader>;
  }
  return (
    <CardTotales
      title="Tot. ventas"
      icon="mdi:dollar"
      value={FormatearNumeroDineroSinIsoYCurrency(totalVentas)}
      porcentage={porcentajeCambioTotal}
    ></CardTotales>
  );
};

