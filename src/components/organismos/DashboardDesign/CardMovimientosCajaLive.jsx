import styled from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import { TablaMovimientosCajaLive } from "../tablas/TablaMovimientosCajaLive";
import {
  useMostrarMovimientosCajaLiveQueryStack,
  useSupabaseSubscription,
} from "../../..";
import { BarLoader } from "react-spinners";

export const CardMovimientosCajaLive = () => {
  const { data, isLoading, error } = useMostrarMovimientosCajaLiveQueryStack();
  useSupabaseSubscription({
    channelName: "public:movimientos_caja",
    options: { event: "*", schema: "public", table: "movimientos_caja" },
    queryKey: ["mostrar movimientos caja live"],
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
        <Title>Movimientos caja</Title>
        <LiveIndicator></LiveIndicator>
      </HeaderCard>
      <TablaMovimientosCajaLive data={data}></TablaMovimientosCajaLive>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colortitlecard};
  border-radius: 20px;
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
