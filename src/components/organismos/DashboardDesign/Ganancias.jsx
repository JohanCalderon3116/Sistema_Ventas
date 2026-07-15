import styled from "styled-components";
import { CardTotales } from "./CardTotales";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import {
  FormatearNumeroDineroSinIsoYCurrency,
  useDashboardStore,
  useEmpresaStore,
} from "../../..";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";

export const Ganacias = () => {
  const {
    calcularGananciasXEmpresa,
    totalGanancias,
    porcentajeCambioGanancias,
  } = useDetalleVentasStore();
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { isLoading } = useQuery({
    queryKey: [
      "mostrar ganacias x empresa",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      calcularGananciasXEmpresa({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa?.id && !!fechaInicio && !!fechaFin,
  });
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

const Container = styled.div``;
