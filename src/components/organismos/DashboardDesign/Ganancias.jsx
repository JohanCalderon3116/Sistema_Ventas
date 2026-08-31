import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  FormatearNumeroDineroSinIsoYCurrency,
  useMostrarGanaciasXEmpresaQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";

export const Ganacias = () => {
  const {
    totalGanancias,
    porcentajeCambioGanancias,
  } = useDetalleVentasStore();
  const { isLoading } = useMostrarGanaciasXEmpresaQueryStack();
  if (isLoading) {
    return <BarLoader></BarLoader>;
  }
  return (
    <CardTotales
      title="Ganancias"
      icon="mdi:dollar"
      value={FormatearNumeroDineroSinIsoYCurrency(totalGanancias)}
      porcentage={porcentajeCambioGanancias}
    ></CardTotales>
  );
};

