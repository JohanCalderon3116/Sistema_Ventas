import styled, { useTheme } from "styled-components";
import { Icon } from "@iconify/react";
import { InputText } from "../formularios/InputText";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Btn1 } from "../../moleculas/Btn1";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useVentasStore } from "../../../store/VentasStore";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import { PanelBuscador } from "./PanelBuscador";
import { useClientesProveedoresStore } from "../../../store/ClientesProveedoresStore";
import { useMetodosPagoStore } from "../../../store/MetodosPagoStore";
import { RegistrarmovimientocreditoVenta } from "../formularios/RegistrarmovimientocreditoVenta";
import { Linea } from "../../atomos/Linea";
import { useSerealizacionesStore } from "../../../store/SerealizacionesStore";
import ticket from "../../../reports/TicketVenta";
import { useProductosStore } from "../../../store/ProductosStore";
import { useBuscarClientesQueryStack } from "../../../tanstack/ClientesProveedoresStack";
import { useConfirmarVentasMutationStack } from "../../../tanstack/VentasStack";
import { BeatLoader } from "react-spinners";
import { useMostrarMonedaQueryStack } from "../../../tanstack/MonedaStack";

export const IngresoCobro = forwardRef((props, ref) => {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [stateBuscadorClientes, setStateBuscadorClientes] = useState(false);
  const [montoManualEfectivo, setMontoManualEfectivo] = useState("");
  // Lo que el cliente entrega en efectivo. 0 = pago exacto.
  const [recibido, setRecibido] = useState(0);
  const {
    tipocobro,
    restante,
    setRestante,
    valoresPago,
    setValoresPago,
    idventa,
    setVuelto,
    vuelto,
  } = useVentasStore();
  const { total, mostrardetalleventa } = useDetalleVentasStore();
  const [precioVenta, setPrecioVenta] = useState(total);
  const { data: dataMonedas } = useMostrarMonedaQueryStack();
  const {
    dataComprobantes,
    itemSelectComprobanteSelect,
    setItemSelectComprobanteSelect,
  } = useSerealizacionesStore();
  const { ProductosItemSelect } = useProductosStore();
  const { datausuarios } = useUsuariosStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const theme = useTheme();
  const { dataempresa } = useEmpresaStore();
  const { setBuscador, selectCliPro, cliproItemSelect } =
    useClientesProveedoresStore();
  const usaEfectivo = tipocobro === "Efectivo";
  const denominacionesOrdenadas = [...(dataMonedas ?? [])].sort(
    (a, b) => a.numero - b.numero,
  );
  const calcularVueltoYRestante = () => {
    const totalPagado = Object.values(valoresPago).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    const totalSinEfectivo = totalPagado - (valoresPago["Efectivo"] || 0);
    if (totalSinEfectivo > precioVenta) {
      setVuelto(0);
      setRestante(precioVenta - totalSinEfectivo);
    } else {
      if (totalPagado >= precioVenta) {
        const exceso = totalPagado - precioVenta;
        setVuelto(valoresPago["Efectivo"] ? exceso : 0);
        setRestante(0);
      } else {
        setVuelto(0);
        setRestante(precioVenta - totalPagado);
      }
    }
  };
  const { data: databuscadorcliente } = useBuscarClientesQueryStack();
  const mutation = useConfirmarVentasMutationStack({
    imprimirDirectoTicket,
    imprimirConVentanaEmergente,
  });
  const handleChangePago = (tipo, valor) => {
    setValoresPago((prev) => ({
      ...prev,
      [tipo]: parseFloat(valor) || 0,
    }));
  };
  const handleAgregarMontoEfectivo = (monto) => {
    if (!monto || monto <= 0) return;
    setRecibido((prev) => prev + monto);
  };
  const handleAgregarMontoManual = () => {
    const valor = parseFloat(montoManualEfectivo);
    if (!isNaN(valor) && valor > 0) {
      handleAgregarMontoEfectivo(valor);
      setMontoManualEfectivo("");
    }
  };
  const handleLimpiarEfectivo = () => {
    setRecibido(0);
    setMontoManualEfectivo("");
  };
  useImperativeHandle(ref, () => ({
    mutateAsync: mutation.mutateAsync,
  }));
  async function imprimirConVentanaEmergente(responseVentaConfirmada) {
    const items = await mostrardetalleventa({ id_venta: idventa });
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const fechaFormateada = ahora.toLocaleDateString();
    const dataenv = {
      hora: horaFormateada,
      fecha: fechaFormateada,
      logo: dataempresa.logo,
      nombre: dataempresa.nombre,
      direccion_empresa: dataempresa.direccion_fiscal,
      pais: dataempresa.pais,
      id_venta: responseVentaConfirmada?.nro_comprobante,
      nombre_usuario: datausuarios?.nombres,
      nombre_cliente: cliproItemSelect?.nombres || "-",
      cc: cliproItemSelect?.identificador_nacional || "-",
      direccion_cliente: cliproItemSelect.direccion || "-",
      codigo_producto: ProductosItemSelect?.codigo_barra,
      productos: items,
      tipo_de_pago: tipocobro,
      monto_total: total,
      pie_pagina: dataempresa?.pie_pagina_ticket,
      nombre_comprobante: itemSelectComprobanteSelect?.tipo_comprobantes.nombre,
      telefono: dataempresa?.telefono_celular,
    };
    await ticket("print", dataenv);
  }
  function imprimirDirectoTicket() {}
  useEffect(() => {
    if (tipocobro === "Mixto") {
      setValoresPago({});
    } else if (tipocobro === "Efectivo") {
      setRecibido(0);
      setValoresPago({ Efectivo: total });
    } else {
      setValoresPago({ [tipocobro]: total });
    }
  }, [tipocobro]);
  useEffect(() => {
    if (tipocobro !== "Mixto" && tipocobro !== "Efectivo") {
      setValoresPago({ [tipocobro]: total });
    }
  }, [total]);
  // Efectivo = lo recibido, o el total si no han puesto nada (pago exacto)
  useEffect(() => {
    if (tipocobro === "Efectivo") {
      setValoresPago({ Efectivo: recibido > 0 ? recibido : total });
    }
  }, [recibido, total]);
  useEffect(() => {
    calcularVueltoYRestante();
  }, [precioVenta, tipocobro, valoresPago]);
  return (
    <Container $ancho={usaEfectivo ? "1000px" : "480px"}>
      {mutation.isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <>
          {mutation.isError && <span>Error: {mutation.error.message} </span>}
          <span className="tipocobro"> {tipocobro} </span>
          <Libro>
            <PaginaIzquierda>
              {openRegistro && (
                <ContentReg>
                  <RegistrarmovimientocreditoVenta
                    onClose={() => setOpenRegistro(!openRegistro)}
                  ></RegistrarmovimientocreditoVenta>
                </ContentReg>
              )}

              <section className="cabecera">
                <section>
                  <span>
                    {" "}
                    {
                      itemSelectComprobanteSelect?.tipo_comprobantes?.nombre
                    } :{" "}
                    <strong>
                      {" "}
                      {itemSelectComprobanteSelect?.serie}-
                      {itemSelectComprobanteSelect?.correlativos}{" "}
                    </strong>{" "}
                  </span>
                </section>
                <section className="areacomprobantes">
                  {dataComprobantes?.map((item, index) => {
                    return (
                      <article className="box" key={index}>
                        <Btn1
                          funcion={() => setItemSelectComprobanteSelect(item)}
                          border="0"
                          height={"48px"}
                          width={"100%"}
                          titulo={item?.tipo_comprobantes?.nombre}
                        ></Btn1>
                      </article>
                    );
                  })}
                </section>
                <section className="filacliente">
                  <span>Cliente</span>
                  <EditButton
                    onClick={() =>
                      setStateBuscadorClientes(!stateBuscadorClientes)
                    }
                  >
                    <Icon
                      className="icono"
                      icon="line-md:pencil-twotone"
                      width="24"
                      height="24"
                    />
                  </EditButton>
                  <span className="cliente"> {cliproItemSelect?.nombres} </span>
                </section>
              </section>
              <section className="metodos">
                {dataMetodosPago?.map((item, index) => {
                  const mostrar =
                    (tipocobro === "Mixto" &&
                      item.nombre !== "Mixto" &&
                      item.nombre !== "Credito") ||
                    (tipocobro === item.nombre && item.nombre !== "Mixto");
                  if (!mostrar) return null;
                  if (item.nombre === "Efectivo") {
                    if (tipocobro === "Efectivo") {
                      return (
                        <EfectivoContainer key={index}>
                          <FilaMontos>
                            <div>
                              <label className="form__label">
                                Total a cobrar
                              </label>
                              <DisplayEfectivo>
                                {FormatearNumeroDinero(
                                  total,
                                  dataempresa?.currency,
                                  dataempresa?.iso,
                                )}
                              </DisplayEfectivo>
                            </div>
                            <div>
                              <label className="form__label">Recibido</label>
                              <DisplayEfectivo $vacio={recibido === 0}>
                                {FormatearNumeroDinero(
                                  recibido,
                                  dataempresa?.currency,
                                  dataempresa?.iso,
                                )}
                              </DisplayEfectivo>
                            </div>
                          </FilaMontos>
                          {recibido === 0 && (
                            <Hint>
                              Pago exacto: presiona Cobrar directamente
                            </Hint>
                          )}

                          <ManualRow>
                            <input
                              type="number"
                              placeholder="Otro monto"
                              value={montoManualEfectivo}
                              onChange={(e) =>
                                setMontoManualEfectivo(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAgregarMontoManual();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAgregarMontoManual}
                            >
                              Agregar
                            </button>
                            <button
                              type="button"
                              className="limpiar"
                              onClick={handleLimpiarEfectivo}
                            >
                              Limpiar
                            </button>
                          </ManualRow>
                        </EfectivoContainer>
                      );
                    }
                  }
                  return (
                    <InputText textaling="center" key={index}>
                      <input
                        onChange={(e) =>
                          handleChangePago(item.nombre, e.target.value)
                        }
                        defaultValue={tipocobro === item.nombre ? total : ""}
                        className="form__field"
                        type="number"
                        disabled={tipocobro === "Mixto" ? false : true}
                      ></input>
                      <label className="form__label"> {item.nombre} </label>
                    </InputText>
                  );
                })}
              </section>

              <section className="totales">
                <article>
                  <span className="total">Total: </span>
                  <span>Vuelto: </span>
                  <span>Restante: </span>
                </article>
                <article>
                  <span className="total">
                    {" "}
                    {FormatearNumeroDinero(
                      total,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}{" "}
                  </span>
                  <span>
                    {" "}
                    {FormatearNumeroDinero(
                      vuelto,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}{" "}
                  </span>
                  <span>
                    {" "}
                    {FormatearNumeroDinero(
                      restante,
                      dataempresa?.currency,
                      dataempresa?.iso,
                    )}{" "}
                  </span>
                </article>
              </section>

              <section className="acciones">
                {tipocobro === "Credito" ? (
                  <>
                    <Btn1
                      border="2px"
                      titulo="¿Fiado? Presiona"
                      bgcolor="#ddd319"
                      color="#ffffff"
                      width="100%"
                      funcion={() => setOpenRegistro(!openRegistro)}
                    ></Btn1>
                    <Linea></Linea>
                    <Btn1
                      border="2px"
                      titulo="Cobrar (Enter)"
                      bgcolor="#0aca21"
                      color="#ffffff"
                      width="100%"
                    ></Btn1>
                  </>
                ) : (
                  <Btn1
                    funcion={() => {
                      if (mutation.isPending) return;
                      mutation.mutateAsync();
                    }}
                    border="2px"
                    titulo="Cobrar (Enter)"
                    bgcolor="#0aca21"
                    color="#ffffff"
                    width="100%"
                  ></Btn1>
                )}
              </section>
            </PaginaIzquierda>
            {usaEfectivo && (
              <>
                <Lomo />
                <PaginaDerecha>
                  <h4>Denominaciones</h4>
                  <DenominacionesGrid>
                    {denominacionesOrdenadas.map((moneda) => (
                      <DenominacionBtn
                        key={moneda.id}
                        type="button"
                        onClick={() =>
                          handleAgregarMontoEfectivo(moneda.numero)
                        }
                      >
                        {moneda.icono ? (
                          <img
                            src={moneda.icono}
                            alt={`$${moneda.numero}`}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                        <span>
                          {FormatearNumeroDinero(
                            moneda.numero,
                            dataempresa?.currency,
                            dataempresa?.iso,
                          )}
                        </span>
                      </DenominacionBtn>
                    ))}
                  </DenominacionesGrid>
                </PaginaDerecha>
              </>
            )}
          </Libro>

          {stateBuscadorClientes && (
            <PanelBuscador
              data={databuscadorcliente}
              selector={selectCliPro}
              setBuscador={setBuscador}
              displayField="nombres"
              setStateBuscador={() =>
                setStateBuscadorClientes(!stateBuscadorClientes)
              }
            ></PanelBuscador>
          )}
        </>
      )}
    </Container>
  );
});

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${({ $ancho }) => $ancho || "480px"};
  max-width: 96vw;
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${({ theme }) =>
    theme.body === "#fff"
      ? "0px 10px 25px rgba(0, 0, 0, 0.08)"
      : "0px 10px 30px rgba(0, 0, 0, 0.5)"};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  height: auto;
  align-items: center;
  justify-content: flex-start;
  font-size: 22px;
  transition: width 0.2s ease;

  .tipocobro {
    position: absolute;
    right: 6px;
    top: 6px;
    background-color: rgba(233, 6, 184, 0.15);
    padding: 5px;
    color: ${({ theme }) => (theme.body === "#fff" ? "#c20f96" : "#ff66d8")};
    border-radius: 5px;
    font-size: 15px;
    font-weight: 650;
  }
`;

const Libro = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;
`;

const Lomo = styled.div`
  width: 2px;
  align-self: stretch;
  background: ${({ theme }) =>
    theme.body === "#fff" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"};
  box-shadow: 0 0 8px 1px
    ${({ theme }) =>
      theme.body === "#fff" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.6)"};
  margin: 0 14px;
`;

const PaginaIzquierda = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .cabecera {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;

    .areacomprobantes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 6px 0;
      width: 100%;

      .box {
        flex: 1 1 40%;
        display: flex;
        gap: 10px;
        button {
          background-color: ${({ theme }) =>
            theme.body === "#fff"
              ? "#e0e0e0"
              : "rgba(255, 255, 255, 0.08)"} !important;
          color: ${({ theme }) => theme.text} !important;
          border: 1px solid
            ${({ theme }) =>
              theme.body === "#fff"
                ? "#ccc"
                : "rgba(255, 255, 255, 0.1)"} !important;

          &:hover {
            background-color: ${({ theme }) =>
              theme.body === "#fff"
                ? "#d4d4d4"
                : "rgba(255, 255, 255, 0.15)"} !important;
          }
        }
      }
    }

    .filacliente {
      display: flex;
      align-items: center;
      gap: 10px;

      button {
        margin: 0;
      }
    }

    .cliente {
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }
  }

  .metodos {
    margin-top: 5px;
    width: 100%;
    input {
      color: ${({ theme }) => theme.text} !important;
      font-weight: 700;
      font-size: 30px;
      background: transparent;
      border-bottom: 2px solid
        ${({ theme }) =>
          theme.body === "#fff"
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(255, 255, 255, 0.2)"};
    }
    .form__label {
      color: ${({ theme }) => theme.text} !important;
      opacity: 0.7;
    }
  }

  .totales {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: ${({ theme }) => theme.text};
    article {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .total {
      font-weight: 700;
      color: ${({ theme }) => (theme.body === "#fff" ? "#088f17" : "#0aca21")};
    }
  }

  .acciones {
    width: 100%;
    margin-top: 8px;
  }
`;

const PaginaDerecha = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  h4 {
    margin: 0 0 10px 0;
    opacity: 0.7;
    font-size: 16px;
    align-self: center;
  }
`;

const EditButton = styled.button`
  background-color: #62c6f7;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  .icono {
    font-size: 20px;
  }
`;
const ContentReg = styled.div`
  color: ${({ theme }) => theme.color3};
`;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;

const EfectivoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
`;

const FilaMontos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const DisplayEfectivo = styled.div`
  font-weight: 700;
  font-size: 30px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid
    ${({ theme }) =>
      theme.body === "#fff"
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.2)"};
  padding-bottom: 6px;
  user-select: none;
  opacity: ${({ $vacio }) => ($vacio ? 0.45 : 1)};
`;

const Hint = styled.span`
  font-size: 14px;
  text-align: center;
  opacity: 0.6;
`;

const ManualRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    font-size: 16px !important;
    font-weight: 500 !important;
    border: 1px solid
      ${({ theme }) =>
        theme.body === "#fff" ? "#ccc" : "rgba(255, 255, 255, 0.15)"};
    background: transparent;
    color: ${({ theme }) => theme.text} !important;
  }

  button {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    background-color: #0aca21;
    color: #fff;

    &.limpiar {
      background-color: #e04040;
    }
  }
`;

const DenominacionesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 4px;
`;

const DenominacionBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff" ? "#ccc" : "rgba(255, 255, 255, 0.15)"};
  background-color: ${({ theme }) =>
    theme.body === "#fff" ? "#e8f8ec" : "rgba(10, 202, 33, 0.12)"};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.08s ease,
    background-color 0.15s ease;

  img {
    width: 42px;
    height: 42px;
    object-fit: contain;
    pointer-events: none;
  }

  &:hover {
    background-color: ${({ theme }) =>
      theme.body === "#fff" ? "#d3f2da" : "rgba(10, 202, 33, 0.2)"};
  }
  &:active {
    transform: scale(0.96);
  }
`;
