import styled, { useTheme } from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import {
  Lottieanimation,
  useMostrarTop10MasVendidosXMontoQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";
import { TablaProductosTop10 } from "../tablas/TablaProductosTop10";
import vacio from "../../../assets/vacio2.json";

export const CardMovimientosProductosTopMonto = () => {
  const __theme = useTheme();
  const { data, isLoading, error } =
    useMostrarTop10MasVendidosXMontoQueryStack();
  if (isLoading) {
    return <BarLoader color={__theme.text} />;
  }
  if (error) {
    return <span>Error: {error.message} </span>;
  }

  return (
    <Container>
      <HeaderCard>
        <Title>Top 10 PMV</Title>
        <LiveIndicator />
      </HeaderCard>
      {data && data.length > 0 ? (
        <TablaProductosTop10 data={data} />
      ) : (
        <Lottieanimation animacion={vacio} ancho="200" alto="200" />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
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
