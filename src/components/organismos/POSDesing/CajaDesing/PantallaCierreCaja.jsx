import styled, { useTheme } from "styled-components";
import { VolverBtn } from "../../../moleculas/VolverBtn";
import { Btn1 } from "../../../moleculas/Btn1";
import { Device } from "../../../../styles/breakpoints";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { format } from "date-fns";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { FormatearNumeroDinero } from "../../../../utils/Conversiones";
import { useEmpresaStore } from "../../../../store/EmpresaStore";
import { PantallaConteoCaja } from "./PantallaConteoCaja";
import { BeatLoader } from "react-spinners";
import {
  useMostrarEfectivoSinVentasMovCajasQueryStack,
  useMostrarVentasMetodoPagoMovCajaQueryStack,
  useMostrarDetalleEfectivoSinVentasMovCajasQueryStack,
} from "../../../../tanstack/MovimientosCajaStack";

const ACCENT = {
  primary: "#10B981",
  border: "rgba(16, 185, 129, 0.35)",
  divider: "rgba(128, 128, 128, 0.22)",
};

export const PantallaCierreCaja = () => {
  const {
    setStateCierreCaja,
    dataCierreCaja,
    stateConteoCaja,
    setStateConteoCaja,
  } = useCierreCajaStore();
  const fechaActual = useFormattedDate();
  const theme = useTheme();
  const {
    totalVentasMetodoPago,
    totalVentasEfectivo,
    totalAperturaCaja,
    totalGastosVariosCaja,
    totalIngresosVariosCaja,
    totalEfectivoTotalCaja,
  } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  const fechaInicioFormateada = format(
    new Date(dataCierreCaja?.fechainicio),
    "yyyy-MM-dd HH:mm:ss",
  );
  const { isLoading: isLoading1 } =
    useMostrarEfectivoSinVentasMovCajasQueryStack();
  const { isLoading: isLoading2, data: dataventasmetodospago } =
    useMostrarVentasMetodoPagoMovCajaQueryStack();
  const { isLoading: isLoading3, data: dataDetalleMovs } =
    useMostrarDetalleEfectivoSinVentasMovCajasQueryStack();
  const isLoading = isLoading1 || isLoading2 || isLoading3;
  const formatearDescripcion = (descripcion) =>
    !descripcion || descripcion === "-" ? "Sin detalle" : descripcion;
  const entradasDetalle =
    dataDetalleMovs?.filter((m) => m.tipo_movimiento === "ingreso") ?? [];
  const salidasDetalle =
    dataDetalleMovs?.filter((m) => m.tipo_movimiento === "salida") ?? [];

  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }

  return (
    <Container>
      <VolverBtn funcion={() => setStateCierreCaja(false)} />
      <Fechas>
        Corte de caja desde: {fechaInicioFormateada} Hasta: {fechaActual}
      </Fechas>
      <Datos>
        <section>
          Ventas Totales:
          <span>
            {FormatearNumeroDinero(
              totalVentasMetodoPago,
              dataempresa?.currency,
              dataempresa?.iso,
            )}
          </span>
        </section>
        <section>
          Efectivo en caja:
          <span>
            {FormatearNumeroDinero(
              totalEfectivoTotalCaja,
              dataempresa?.currency,
              dataempresa?.iso,
            )}
          </span>
        </section>
      </Datos>
      <Division />
      <Resumen>
        <Tablas>
          <Tabla>
            <h4>Dinero en caja</h4>
            <ul>
              <li>
                Base de caja:
                <span>
                  {FormatearNumeroDinero(
                    totalAperturaCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              <li>
                Ventas (Efectivo):
                <span>
                  {FormatearNumeroDinero(
                    totalVentasEfectivo,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              <li className="conDetalle">
                Entradas:
                <span>
                  {FormatearNumeroDinero(
                    totalIngresosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              {entradasDetalle.length > 0 && (
                <DetalleList>
                  {entradasDetalle.map((mov) => (
                    <li key={mov.id}>
                      <span className="concepto">
                        {formatearDescripcion(mov.descripcion)}
                      </span>
                      <span className="monto ingreso">
                        +
                        {FormatearNumeroDinero(
                          mov.monto,
                          dataempresa?.currency,
                          dataempresa?.iso,
                        )}
                      </span>
                    </li>
                  ))}
                </DetalleList>
              )}
              <li className="conDetalle">
                Salidas / Gastos:
                <span className="gasto">
                  -
                  {FormatearNumeroDinero(
                    totalGastosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              {salidasDetalle.length > 0 && (
                <DetalleList>
                  {salidasDetalle.map((mov) => (
                    <li key={mov.id}>
                      <span className="concepto">
                        {formatearDescripcion(mov.descripcion)}
                      </span>
                      <span className="monto gasto">
                        -
                        {FormatearNumeroDinero(
                          mov.monto,
                          dataempresa?.currency,
                          dataempresa?.iso,
                        )}
                      </span>
                    </li>
                  ))}
                </DetalleList>
              )}
              <li className="total">
                <Divider />
                {FormatearNumeroDinero(
                  totalEfectivoTotalCaja,
                  dataempresa?.currency,
                  dataempresa?.iso,
                )}
              </li>
            </ul>
          </Tabla>
          <DivisionY />
          <Tabla>
            <h4>Ventas Totales</h4>
            <ul>
              {dataventasmetodospago?.map((item, index) => (
                <li key={index}>
                  En {item?.metodo_pago}:
                  <span>
                    {FormatearNumeroDinero(
                      item.monto,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}
                  </span>
                </li>
              ))}
              <li className="total">
                <Divider />
                {FormatearNumeroDinero(
                  totalVentasMetodoPago,
                  dataempresa?.currency,
                  dataempresa?.iso,
                )}
              </li>
            </ul>
          </Tabla>
          <DivisionY />
        </Tablas>
      </Resumen>
      <Btn1
        funcion={() => setStateConteoCaja(true)}
        titulo="Cerrar caja"
        color="255,255,255"
        border="1px"
        bgcolor="#18181B"
      />
      {stateConteoCaja && <PantallaConteoCaja />}
    </Container>
  );
};

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.color2};
  margin-right: 10px;
`;

const DivisionY = styled.span`
  width: 1px;
  height: 95%;
  margin: 20px 0;
  position: relative;
  display: none;
  border-left: 1px dashed ${({ theme }) => theme.color2};

  @media ${Device.tablet} {
    display: block;
  }
`;

const Division = styled.span`
  width: min(960px, 94%);
  height: 1px;
  margin: 8px 0;
  border-radius: 15px;
  background: ${({ theme }) => theme.color2};
  position: relative;
  flex-shrink: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 36px 24px 48px;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  z-index: 50;
  & > button {
    flex-shrink: 0;
    transition: all 0.2s ease-out;
    &:hover {
      transform: translateY(-2px);
    }
    &:active {
      transform: scale(0.98);
    }
  }
  @media (max-width: 768px) {
    padding: 24px 14px 40px;
  }
`;

const Fechas = styled.p`
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.colorSubtitle};
  flex-shrink: 0;
  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 8px 12px;
    font-size: 12.5px;
  }
`;

const Datos = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 16px;
  width: min(960px, 94%);
  flex-shrink: 0;
  section {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 16px 20px;
    border-radius: 14px;
    font-size: 14px;
    background: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    span {
      font-weight: 700;
      font-size: 15px;
      white-space: nowrap;
      color: ${({ theme }) => theme.text};
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    width: 94%;
  }
`;

const Resumen = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Tablas = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 24px;
  width: min(960px, 94%);
  @media (max-width: 820px) {
    flex-direction: column;
    align-items: center;
    width: 94%;
    gap: 16px;
  }
`;

const Tabla = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  width: 100%;
  max-width: 468px;
  padding: 20px 22px;
  box-sizing: border-box;
  border-radius: 14px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  h4 {
    margin: 0 0 14px;
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.colorSubtitle};
    span {
      white-space: nowrap;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }
  }
  li .gasto {
    color: #ef4444;
    font-weight: 700;
  }
  .total {
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    margin-top: 12px;
    font-weight: 700;
    font-size: 15px;
    color: ${({ theme }) => theme.text};
  }
`;

const DetalleList = styled.ul`
  width: 100%;
  box-sizing: border-box;
  padding: 4px 0 6px 12px !important;
  margin: 0 0 8px !important;
  list-style: none;
  border-left: 2px solid ${ACCENT.border};
  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    font-size: 12.5px;
    margin-bottom: 6px;
    width: 100%;
    box-sizing: border-box;
  }
  .concepto {
    flex: 1;
    min-width: 0;
    font-weight: 400;
    line-height: 1.4;
    white-space: normal !important;
    word-break: break-word;
    overflow-wrap: anywhere;
    text-align: left;
    color: ${({ theme }) => theme.colorSubtitle} !important;
  }
  .monto {
    flex-shrink: 0;
    font-weight: 600;
    white-space: nowrap;
    text-align: right;
  }
  .monto.ingreso {
    color: #10b981 !important;
  }
  .monto.gasto {
    color: #ef4444 !important;
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100vh;
  color: ${({ theme }) => theme.text};
  strong {
    font-size: 14px;
    opacity: 0.7;
  }
`;
