import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  useMostrarCantidadVentasQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";

export const CantidadVentas = () => {
  const { cantidadVentas, porcentajeCambio } =
    useDetalleVentasStore();
  const { isLoading } = useMostrarCantidadVentasQueryStack();
  if (isLoading) {
    return <BarLoader></BarLoader>;
  }
  return (
    <CardTotales
      title="Cant. Ventas"
      icon="mdi:dollar"
      value={cantidadVentas}
      porcentage={porcentajeCambio}
    ></CardTotales>
  );
};
