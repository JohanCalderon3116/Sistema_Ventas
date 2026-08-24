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
export const IngresoCobro = forwardRef((props, ref) => {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [stateBuscadorClientes, setStateBuscadorClientes] = useState(false);
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
  const { data: databuscadorcliente} =
    useBuscarClientesQueryStack();
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
    setValoresPago(tipocobro === "Mixto" ? {} : { [tipocobro]: total });
  }, [tipocobro]);

  useEffect(() => {
    if (tipocobro !== "Mixto") {
      setValoresPago({ [tipocobro]: total });
    }
  }, [total]);

  useEffect(() => {
    calcularVueltoYRestante();
  }, [precioVenta, tipocobro, valoresPago]);
  return (
    <Container>
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
          <section className="area1">
            {openRegistro && (
              <ContentReg>
                <RegistrarmovimientocreditoVenta
                  onClose={() => setOpenRegistro(!openRegistro)}
                ></RegistrarmovimientocreditoVenta>
              </ContentReg>
            )}
            <span className="tipocobro"> {tipocobro} </span>
            <section>
              <span>
                {" "}
                {itemSelectComprobanteSelect?.tipo_comprobantes?.nombre} :{" "}
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
                      height={"70px"}
                      width={"100%"}
                      titulo={item?.tipo_comprobantes?.nombre}
                    ></Btn1>
                  </article>
                );
              })}
            </section>
            <span>Cliente</span>
            <EditButton
              onClick={() => setStateBuscadorClientes(!stateBuscadorClientes)}
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
          <section className="area2">
            {dataMetodosPago?.map((item, index) => {
              return (tipocobro === "Mixto" && item.nombre !== "Mixto") ||
                (tipocobro === item.nombre && item.nombre != "Mixto") ? (
                <InputText textaling="center">
                  <input
                    key={index}
                    onChange={(e) =>
                      handleChangePago(item.nombre, e.target.value)
                    }
                    defaultValue={tipocobro === item.nombre ? total : ""}
                    className="form__field"
                    type="number"
                    disabled={
                      tipocobro === "Mixto" || tipocobro === "Efectivo"
                        ? false
                        : true
                    }
                  ></input>
                  <label className="form__label"> {item.nombre} </label>
                </InputText>
              ) : null;
            })}
          </section>
          <section className="area3">
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
          <section className="area4">
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
                  funcion={() => mutation.mutateAsync()}
                  border="2px"
                  titulo="Cobrar (Enter)"
                  bgcolor="#0aca21"
                  color="#ffffff"
                  width="100%"
                ></Btn1>
              </>
            ) : (
              <Btn1
                funcion={() => mutation.mutateAsync()}
                border="2px"
                titulo="Cobrar (Enter)"
                bgcolor="#0aca21"
                color="#ffffff"
                width="100%"
              ></Btn1>
            )}
          </section>
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
  width: 400px;
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
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 5px;
    height: 6px;
    width: 380px;
  }
  &::before {
    top: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        ${({ theme }) => theme.bg2} 50%,
        ${({ theme }) => theme.bg2} 100%
      ) -7px -8px /
      16px 16px repeat-x;
  }
  &::after {
    bottom: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        ${({ theme }) => theme.bg2} 50%,
        ${({ theme }) => theme.bg2} 100%
      ) -7px -2px /
      16px 16px repeat-x;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5px;
    .areacomprobantes {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
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
    .cliente {
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }
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
  }
  .area2 {
    margin-top: 5px;
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
  .area3 {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: ${({ theme }) => theme.text};
    article {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .total {
      font-weight: 700;
      color: ${({ theme }) => (theme.body === "#fff" ? "#088f17" : "#0aca21")};
    }
  }
  .area4 {
    width: 100%;
    margin-top: 15px;
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
