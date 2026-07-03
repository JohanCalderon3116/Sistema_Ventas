import styled from "styled-components";
import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import { useDashboardStore, useEmpresaStore } from "../../..";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";

export const CantidadVentas = () => {
  const { contarVentasXEmpresa, cantidadVentas, porcentajeCambio } =
    useDetalleVentasStore();
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { isLoading } = useQuery({
    queryKey: [
      "mostrar cantidad ventas",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      contarVentasXEmpresa({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
  });
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

const Container = styled.div``;
