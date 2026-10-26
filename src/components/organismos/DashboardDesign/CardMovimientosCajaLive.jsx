import styled, { useTheme } from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import { TablaMovimientosCajaLive } from "../tablas/TablaMovimientosCajaLive";
import {
  useMostrarMovimientosCajaLiveQueryStack,
  useSupabaseSubscription,
} from "../../..";
import { BarLoader } from "react-spinners";

export const CardMovimientosCajaLive = () => {
  const __theme = useTheme();
  const { data, isLoading, error } = useMostrarMovimientosCajaLiveQueryStack();
  useSupabaseSubscription({
    channelName: "public:movimientos_caja",
    options: { event: "*", schema: "public", table: "movimientos_caja" },
    queryKey: ["mostrar movimientos caja live"],
  });
  if (isLoading) {
    return <BarLoader color={__theme.text} />;
  }
  if (error) {
    return <span>Error: {error.message} </span>;
  }

  return (
    <Container>
      <HeaderCard>
        <Title>Movimientos caja</Title>
        <LiveIndicator />
      </HeaderCard>
      <TablaMovimientosCajaLive data={data} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards};
  box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: border-color 0.2s ease-out;
  &:hover {
    border-color: ${({ theme }) => theme.text === "#FFFFFF" ? "rgba(255, 255, 255, 0.22)" : "rgba(17, 17, 17, 0.22)"};
  }
`;

const HeaderCard = styled.div`
  text-align: center;
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
