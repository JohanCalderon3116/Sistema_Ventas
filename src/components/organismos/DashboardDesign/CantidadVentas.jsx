import { useTheme } from "styled-components";
import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  useMostrarCantidadVentasQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";

export const CantidadVentas = () => {
  const __theme = useTheme();
  const { cantidadVentas, porcentajeCambio } =
    useDetalleVentasStore();
  const { isLoading } = useMostrarCantidadVentasQueryStack();
  if (isLoading) {
    return <BarLoader color={__theme?.text} />;
  }
  
  return (
    <CardTotales
      title="Cant. Ventas"
      icon="mdi:dollar"
      value={cantidadVentas}
      porcentage={porcentajeCambio}
    />
  );
};
