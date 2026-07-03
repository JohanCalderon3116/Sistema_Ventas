import styled from "styled-components";
import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  FormatearNumeroDinero,
  FormatearNumeroDineroSinIsoYCurrency,
  useDashboardStore,
  useEmpresaStore,
} from "../../..";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";

export const SumarVentas = () => {
  const { sumarTotalVentasXEmpresa, totalVentas, porcentajeCambioTotal } =
    useDetalleVentasStore();
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { isLoading } = useQuery({
    queryKey: [
      "sumar ventas",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      sumarTotalVentasXEmpresa({
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
      title="Tot. ventas"
      icon="mdi:dollar"
      value={FormatearNumeroDineroSinIsoYCurrency(totalVentas)}
      porcentage={porcentajeCambioTotal}
    ></CardTotales>
  );
};

const Container = styled.div``;
