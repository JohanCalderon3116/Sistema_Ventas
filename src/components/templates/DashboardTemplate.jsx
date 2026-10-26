import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import { DashboardHeader } from "../organismos/DashboardDesign/DashboardHeader";
import { ChartVentas } from "../organismos/DashboardDesign/ChartVentas";
import { ChartProductosTop5 } from "../organismos/DashboardDesign/ChartProductosTop5";
import { CardMovimientosCajaLive } from "../organismos/DashboardDesign/CardMovimientosCajaLive";
import { CardMovimientosProductosTopMonto } from "../organismos/DashboardDesign/CardMovimientosProductosTopMonto";
import { Ganacias } from "../..";
import { CantidadVentas } from "../organismos/DashboardDesign/CantidadVentas";
import { SumarVentas } from "../organismos/DashboardDesign/SumarVentas";

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

export const DashboardTemplate = () => {
  return (
    <Container>
      <FondoCorporativo aria-hidden="true" />
      <DashboardHeader />
      <MainContent>
        <Area1>
          <ContentTotales>
            <CantidadVentas />
          </ContentTotales>
          <ContentTotales>
            <SumarVentas />
          </ContentTotales>
          <ContentTotales>
            <Ganacias />
          </ContentTotales>
        </Area1>
        <Area2>
          <ChartVentas />
        </Area2>
        <Area3>
          <ChartProductosTop5 />
        </Area3>
        <Area4>
          <CardMovimientosCajaLive />
          <CardMovimientosProductosTopMonto />
        </Area4>
      </MainContent>
    </Container>
  );
};

const FondoCorporativo = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  @media print {
    display: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1400px;
  margin: auto;
  gap: 22px;
  padding: 24px;
  position: relative;
  > * {
    position: relative;
    z-index: 1;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-areas:
    "area1"
    "area2"
    "area3"
    "area4";
  grid-template-columns: 1fr;
  gap: 18px;
  @media ${Device.desktop} {
    grid-template-areas:
      "area1 area1 area3"
      "area2 area2 area3"
      "area4 area4 area4";
    grid-template-columns: 2fr 1fr 1fr;
    gap: 22px;
  }
`;

const Area1 = styled.section`
  grid-area: area1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  @media ${Device.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Area2 = styled.section`
  grid-area: area2;
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 4px 20px -4px rgba(0, 0, 0, 0.4)"
      : "0 2px 10px -2px rgba(9, 9, 11, 0.04)"};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-out;
  &:hover {
    border-color: ${({ theme }) => theme.text === "#FFFFFF" ? "rgba(255, 255, 255, 0.24)" : "rgba(17, 17, 17, 0.24)"};
  }
`;

const Area3 = styled.section`
  grid-area: area3;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 4px 20px -4px rgba(0, 0, 0, 0.4)"
      : "0 2px 10px -2px rgba(9, 9, 11, 0.04)"};
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-out;
  &:hover {
    border-color: ${({ theme }) => theme.text === "#FFFFFF" ? "rgba(255, 255, 255, 0.24)" : "rgba(17, 17, 17, 0.24)"};
  }
`;

const Area4 = styled.section`
  grid-area: area4;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  @media ${Device.desktop} {
    flex-wrap: nowrap;
  }
`;

const ContentTotales = styled.div`
  background-color: ${({ theme }) => theme.bgcards};
  padding: 18px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 4px 16px -4px rgba(0, 0, 0, 0.35)"
      : "0 1px 3px rgba(9, 9, 11, 0.04)"};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-out;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: ${(props) => props.$accent || props.theme.text};
    opacity: 0.85;
  }
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.text === "#FFFFFF" ? "rgba(255, 255, 255, 0.24)" : "rgba(17, 17, 17, 0.24)"};
    box-shadow: ${({ theme }) =>
      isDarkTheme(theme)
        ? "0 10px 24px -8px rgba(0, 0, 0, 0.5)"
        : "0 8px 20px -6px rgba(9, 9, 11, 0.07)"};
  }
`;
