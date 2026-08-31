import styled from "styled-components";
import { LiveIndicator } from "../../moleculas/LiveIndicator";
import {
  Lottieanimation,
  useMostrarTop10MasVendidosXMontoQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";
import { TablaProductosTop10 } from "../tablas/TablaProductosTop10";
import vacio from "../../../assets/vacio2.json";

export const CardMovimientosProductosTopMonto = () => {
  const { data, isLoading, error } =
    useMostrarTop10MasVendidosXMontoQueryStack();
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
