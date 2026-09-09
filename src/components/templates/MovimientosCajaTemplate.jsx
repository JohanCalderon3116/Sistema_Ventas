import styled, { useTheme } from "styled-components";
import { Title } from "../atomos/Titles";
import { TablaMovimientosCaja } from "../organismos/tablas/TablaMovimientosCaja";
import { useMostrarMovimientosCajaXEmpresYFechaQueryStack } from "../../tanstack/MovimientosCajaStack";
import { useEmpresaStore } from "../../store/EmpresaStore";
import { BeatLoader } from "react-spinners";
import { DateRangeFilterMovCajas } from "../organismos/DashboardDesign/DateRangeFilterMovCajas";
import { useMovCajaStore } from "../../store/MovCajaStore";
import { useVentasStore } from "../../store/VentasStore";
import { TicketModal } from "../moleculas/TicketModal";

export const MovimientosCajaTemplate = () => {
  const { fechaInicio, fechaFin } = useMovCajaStore();
  const { data: dataMovCajasxEmpres, isLoading } =
    useMostrarMovimientosCajaXEmpresYFechaQueryStack(fechaInicio, fechaFin);
  const { dataempresa } = useEmpresaStore();
  const { abrirTicket } = useVentasStore();
  const theme = useTheme();

  return (
    <Container>
      <section className="area1">
        <Title>Movimientos de caja por fecha</Title>{" "}
      </section>
      <ActionsContainer>
        <DateRangeFilterMovCajas></DateRangeFilterMovCajas>
      </ActionsContainer>
      <section className="main">
        {isLoading ? (
          <ConteinerLoader>
            <span>
              <strong>Cargando</strong>
            </span>
            <BeatLoader color={theme.text} size={8} />
          </ConteinerLoader>
        ) : (
          <TablaMovimientosCaja
            data={dataMovCajasxEmpres}
            dataempresa={dataempresa}
            onVerVenta={abrirTicket}
          ></TablaMovimientosCaja>
        )}
      </section>
      <TicketModal></TicketModal>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 30px);
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;

    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .main {
    grid-area: main;
  }
`;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
const ActionsContainer = styled.div`
  border: 2px solid ${({ theme }) => theme.colortitlecard};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.body};
`;
