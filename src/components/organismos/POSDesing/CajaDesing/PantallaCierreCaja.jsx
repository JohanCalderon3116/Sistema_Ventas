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
} from "../../../../tanstack/MovimientosCajaStack";
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
    "dd/MM/yyyy:HH:mm:ss",
  );
  const {
    isLoading: isLoading1,
  } = useMostrarEfectivoSinVentasMovCajasQueryStack();
  const {
    isLoading: isLoading2,
    data: dataventasmetodospago,
  } = useMostrarVentasMetodoPagoMovCajaQueryStack();
  const isLoading = isLoading1 || isLoading2;
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
          Ventas Totales:{" "}
          <span>
            {" "}
            {FormatearNumeroDinero(
              totalVentasMetodoPago,
              dataempresa?.currency,
              dataempresa?.iso,
            )}{" "}
          </span>
        </section>
        <section>
          Efectivo en caja:{" "}
          <span>
            {" "}
            {FormatearNumeroDinero(
              totalEfectivoTotalCaja,
              dataempresa?.currency,
              dataempresa?.iso,
            )}{" "}
          </span>
        </section>
      </Datos>
      <Division></Division>
      <Resumen>
        <Tablas>
          <Tabla>
            <h4>Dinero en caja</h4>
            <ul>
              <li>
                Base de caja:{" "}
                <span>
                  {FormatearNumeroDinero(
                    totalAperturaCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              <li>
                Ventas (Efectivo):{" "}
                <span>
                  {" "}
                  {FormatearNumeroDinero(
                    totalVentasEfectivo,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}{" "}
                </span>
              </li>
              <li>
                Entradas:{" "}
                <span>
                  {FormatearNumeroDinero(
                    totalIngresosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
              <li>
                Salidas / Gastos:{" "}
                <span style={{ color: "#f15050", fontWeight: "bold" }}>
                  {" "}
                  -
                  {FormatearNumeroDinero(
                    totalGastosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso,
                  )}
                </span>
              </li>
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
              {dataventasmetodospago?.map((item, index) => {
                return (
                  <li key={index}>
                    En {item?.metodo_pago}:{" "}
                    <span>
                      {FormatearNumeroDinero(
                        item.monto,
                        dataempresa?.currency,
                        dataempresa?.iso,
                      )}
                    </span>{" "}
                  </li>
                );
              })}
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
        titulo={"Cerrar caja"}
        color="#ffffff"
        border="2px"
        bgcolor="#e88018"
      />
      {stateConteoCaja && <PantallaConteoCaja></PantallaConteoCaja>}
    </Container>
  );
};

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.color2};
  margin-right: 10px;
`;
const DivisionY = styled.span`
  width: 1px;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  text-align: center;
  display: none;
  border-left: 1px dashed ${({ theme }) => theme.color2};
  height: 95%;
  @media ${Device.tablet} {
    display: block;
  }
`;
const Division = styled.span`
  background-color: ${({ theme }) => theme.color2};
  height: 1px;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  text-align: center;
  display: block;
  width: 95%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal || "#fff"};
  gap: 20px;
  position: absolute;
  width: 100%;
  justify-content: center;
  z-index: 10;
`;
const Fechas = styled.p`
  font-size: 14px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;
const Resumen = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
const Datos = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-around;
  width: 100%;
`;
const Tablas = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Tabla = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 120%;
  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  li {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .total {
    font-weight: bold;
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
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
