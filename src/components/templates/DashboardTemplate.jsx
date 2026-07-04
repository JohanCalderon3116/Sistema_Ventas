import styled from "styled-components";
import { Device } from "../../styles/breakpoints";
import { DashboardHeader } from "../organismos/DashboardDesign/DashboardHeader";
import { CardTotales } from "../organismos/DashboardDesign/CardTotales";
import { ChartVentas } from "../organismos/DashboardDesign/ChartVentas";
import { ChartProductosTop5 } from "../organismos/DashboardDesign/ChartProductosTop5";
import { CardMovimientosCajaLive } from "../organismos/DashboardDesign/CardMovimientosCajaLive";
import { CardMovimientosProductosTopMonto } from "../organismos/DashboardDesign/CardMovimientosProductosTopMonto";
import { useQuery } from "@tanstack/react-query";
import { useDetalleVentasStore } from "../../store/DetalleVentasStore";
import { useDashboardStore, useEmpresaStore } from "../..";
import { BarLoader } from "react-spinners";
import { CantidadVentas } from "../organismos/DashboardDesign/CantidadVentas";
import { SumarVentas } from "../organismos/DashboardDesign/SumarVentas";
import { Ganacias } from "../organismos/DashboardDesign/Ganancias";

export const DashboardTemplate = () => {
  return (
    <Container>
      <DashboardHeader></DashboardHeader>
      <MainContent>
        <Area1>
          <ContentTotales $accent="#3300E3">
            <CantidadVentas></CantidadVentas>
          </ContentTotales>
          <ContentTotales $accent="#7C3AED">
            <SumarVentas></SumarVentas>
          </ContentTotales>
          <ContentTotales $accent="#A855F7">
            <Ganacias></Ganacias>
          </ContentTotales>
        </Area1>
        <Area2>
          <ChartVentas></ChartVentas>
        </Area2>
        <Area3>
          <ChartProductosTop5></ChartProductosTop5>
        </Area3>
        <Area4>
          <CardMovimientosCajaLive></CardMovimientosCajaLive>
          <CardMovimientosProductosTopMonto></CardMovimientosProductosTopMonto>
        </Area4>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 1400px;
  margin: auto;
  gap: 22px;
  padding: 24px;
  position: relative;

  /* halo morado suave detrás del contenido, como en el landing */
  &::before {
    content: "";
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 320px;
    background: radial-gradient(
      ellipse at center,
      rgba(51, 0, 227, 0.14) 0%,
      rgba(124, 58, 237, 0.06) 45%,
      transparent 75%
    );
    pointer-events: none;
    z-index: 0;
  }

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
  border: 1px solid ${({ theme }) => theme.colortitlecard};
  box-shadow: 0 12px 30px -12px rgba(51, 0, 227, 0.18);
  border-radius: 22px;
  background-color: ${({ theme }) => theme.body};
  position: relative;
  overflow: hidden;

  /* franja superior morada, sutil, como firma de marca */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3300e3, #7c3aed, #a855f7);
  }
`;

const Area3 = styled.section`
  grid-area: area3;
  background-color: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.colortitlecard};
  box-shadow: 0 12px 30px -12px rgba(124, 58, 237, 0.18);
  border-radius: 22px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #a855f7, #7c3aed, #3300e3);
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
  background-color: ${({ theme }) => theme.body};
  padding: 16px;
  border-radius: 18px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colortitlecard};
  box-shadow: 0 10px 24px -14px rgba(51, 0, 227, 0.2);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* barrita lateral de acento, cada card con su tono morado */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => props.$accent || "#3300E3"};
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 30px -14px rgba(51, 0, 227, 0.28);
  }
`;