import styled from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import { TablaMovimientosCajaLive } from "../tablas/TablaMovimientosCajaLive";
import {
  Lottieanimation,
  useDashboardStore,
  useDetalleVentasStore,
  useEmpresaStore,
  useMovCajaStore,
} from "../../..";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";
import { TablaProductosTop10 } from "../tablas/TablaProductosTop10";
import vacio from "../../../assets/vacio2.json";

export const CardMovimientosProductosTopMonto = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { mostrarTop10ProductosMasVenidosPorMonto } = useDetalleVentasStore();
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "mostrar top 10 productos mas venidos por monto",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      mostrarTop10ProductosMasVenidosPorMonto({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa,
  });
  if (isLoading) {
    return <BarLoader color="#6d6d6d"></BarLoader>;
  }
  if (error) {
    return <span>Error: {error.message} </span>;
  }
  return (
    <Container>
      <HeaderCard>
        <Title>Top 10 PMV </Title>
        <LiveIndicator></LiveIndicator>
      </HeaderCard>
      {data && data.length > 0 ? (
        <TablaProductosTop10 data={data}></TablaProductosTop10>
      ) : (
        <Lottieanimation
          animacion={vacio}
          ancho="200"
          alto="200"
        ></Lottieanimation>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colortitlecard};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.body};
`;
const HeaderCard = styled.div`
  text-align: center;
  display: flex;
  gap: 15px;
  align-items: center;
  padding-left: 20px;
`;
const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;
