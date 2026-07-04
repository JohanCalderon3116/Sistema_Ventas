import styled from "styled-components";
import { Icon } from "@iconify/react";
import { InputText } from "../formularios/InputText";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Btn1 } from "../../moleculas/Btn1";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useSucursalesStore } from "../../../store/SucursalesStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useVentasStore } from "../../../store/VentasStore";
import { useDetalleVentasStore } from "../../../store/DetalleVentasStore";
import { toast } from "sonner";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PanelBuscador } from "./PanelBuscador";
import { useClientesProveedoresStore } from "../../../store/ClientesProveedoresStore";
import { useMetodosPagoStore } from "../../../store/MetodosPagoStore";
import { useCierreCajaStore } from "../../../store/CierreCajaStore";
import { useCajasStore } from "../../../store/CajaStore";
import { useMovCajaStore } from "../../../store/MovCajaStore";
import { useFormattedDate } from "../../../hooks/useFormattedDate";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { RegistrarInventario } from "../formularios/RegistrarInventario";
import { RegistrarmovimientocreditoVenta } from "../formularios/RegistrarmovimientocreditoVenta";
import { InsertarMovimientosCreditos } from "../../../supabase/crudMovimientosCreditos";
import { Linea } from "../../atomos/Linea";
import { useSerealizacionesStore } from "../../../store/SerealizacionesStore";
import { useImpresorasStore } from "../../../store/ImpresorasStore";
import { useMostrarImpresorasXCajaQueryStack } from "../../../tanstack/ImpresorasStack";
import ticket from "../../../reports/TicketVenta";
import { useProductosStore } from "../../../store/ProductosStore";
import { useStockStore } from "../../../store/StockStore";
import Swal from "sweetalert2";
export const IngresoCobro = forwardRef((props, ref) => {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  function nuevoRegistro() {
    setOpenRegistro(!openRegistro);
    setDataSelect([]);
    setIsExploding(false);
  }
  const queryClient = useQueryClient();
  const fechaActual = useFormattedDate();
  const {
    tipocobro,
    items,
    resetState,
    setStatePantallaCobro,
    confirmarVenta,
    dataventas,
  } = useVentasStore();
  const { total, detalleventa } = useDetalleVentasStore();
  const { mostrarAlertasStockXVenta } = useStockStore();
  const {
    dataComprobantes,
    itemSelectComprobanteSelect,
    setItemSelectComprobanteSelect,
  } = useSerealizacionesStore();
  const { dataImpresorasXCaja } = useImpresorasStore();
  const { ProductosItemSelect } = useProductosStore();
  const { mostrardetalleventa } = useDetalleVentasStore();
  const [stateBuscadorClientes, setStateBuscadorClientes] = useState(false);
  //valores a mostrar
  const [vuelto, setVuelto] = useState(0);
  const [restante, setRestante] = useState(0);

  const [valoresPago, setValoresPago] = useState({});
  //valores a calcular
  const [precioVenta, setPrecioVenta] = useState(total);
  const [valorTarjeta, setValorTarjeta] = useState(
    tipocobro === "tarjeta" ? total : 0,
  );
  const [valorEfectivo, setValorEfectivo] = useState(
    tipocobro === "efectivo" ? total : 0,
  );
  const [valorCredito, setValorCredito] = useState(
    tipocobro === "credito" ? total : 0,
  );

  const { datausuarios } = useUsuariosStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalesStore();
  const { dataempresa } = useEmpresaStore();
  //#region Clientes
  const {
    buscarCliPro,
    setBuscador,
    buscador,
    selectCliPro,
    cliproItemSelect,
  } = useClientesProveedoresStore();
  const { data: databuscadorcliente, isLoading: isloadingbuscadorcliento } =
    useQuery({
      queryKey: ["buscar cliente", dataempresa?.id, "cliente", buscador],
      queryFn: () =>
        buscarCliPro({
          id_empresa: dataempresa?.id,
          tipo: "cliente",
          buscador: buscador,
        }),
      enabled: !!dataempresa,
      refetchOnWindowFocus: false,
    });
  //#endregion
  //Mostrar cierres de caja
  const { dataCierreCaja } = useCierreCajaStore();
  //Movimientos de caja
  const { idventa, insertarVentas, resetarventas } = useVentasStore();
  const { insertarMovcaja } = useMovCajaStore();
  const { insertarDetalleVentas } = useDetalleVentasStore();
  //funcion para calcular vueltoas y restante

  const calcularVueltoYRestante = () => {
    const totalPagado = Object.values(valoresPago).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    const totalSinEfectivo = totalPagado - (valoresPago["Efectivo"] || 0);
    //Si el total sin efectivo excede el precio de venta , no permitir el exceso
    if (totalSinEfectivo > precioVenta) {
      setVuelto(0);
      setRestante(precioVenta - totalSinEfectivo); //restante negativo para indicar que se excede sin efectivo
    } else {
      //Permitir el exceso solo si es efectivo
      if (totalPagado >= precioVenta) {
        const exceso = totalPagado - precioVenta;
        setVuelto(valoresPago["Efectivo"] ? exceso : 0);
        setRestante(0);
      } else {
        //Si el total pagado no cubre el precio de venta, calcular el restante
        setVuelto(0);
        setRestante(precioVenta - totalPagado);
      }
    }
  };

  //Manjeador de cambio
  const handleChangePago = (tipo, valor) => {
    setValoresPago((prev) => ({
      ...prev,
      [tipo]: parseFloat(valor) || 0,
    }));
  };
  // exponiendo la funcion mutation a travez de ref
  useImperativeHandle(ref, () => ({
    mutateAsync: mutation.mutateAsync,
  }));
  //funcion para realizar venta
  const mutation = useMutation({
    mutationKey: ["insertar ventas"],
    mutationFn: ConfirmarVenta,
    onSuccess: async () => {
      if (restante != 0) {
        return;
      }
      const alertas = await mostrarAlertasStockXVenta({
        _id_venta: idventa,
      });
      const alertasUnicas = Object.values(
        alertas?.reduce((acc, item) => {
          acc[item.id_producto] = item;
          return acc;
        }, {}) || {},
      );

      if (alertasUnicas.length > 0) {
        const listaHtml = alertasUnicas
          .map(
            (item) =>
              `<li><strong>${item.nombre_producto}</strong>: ${item.stock_actual} unidades (mínimo: ${item.stock_minimo})</li>`,
          )
          .join("");

        Swal.fire({
          icon: "warning",
          title: "Stock bajo",
          html: `Los siguientes productos quedaron con poco stock: <ul style="text-align:left;">${listaHtml}</ul>`,
          confirmButtonText: "Entendido",
        });
      }
      resetState();
      queryClient.invalidateQueries(["mostrar detalle venta"]);
      toast.success("😁🎉 Venta generada correctamente :p");
    },
  });
  async function ConfirmarVenta(p) {
    if (restante === 0) {
      const pventas = {
        _id_venta: idventa,
        _id_usuario: datausuarios?.id,
        _vuelto: vuelto,
        _id_tipo_comprobante: itemSelectComprobanteSelect?.id_tipo_comprobante,
        _serie: itemSelectComprobanteSelect?.serie,
        _id_sucursal: dataCierreCaja?.caja?.id_sucursal,
        _id_cliente: cliproItemSelect?.id ?? null,
        _fecha: fechaActual,
        _monto_total: total,
      };

      const responseVentaConfirmada = await confirmarVenta(pventas);

      for (const [tipo, monto] of Object.entries(valoresPago)) {
        if (monto > 0) {
          const metodoPago = dataMetodosPago.find(
            (item) => item.nombre === tipo,
          );
          const pmovcaja = {
            tipo_movimiento: "ingreso",
            monto: monto,
            id_metodo_pago: metodoPago?.id,
            descripcion: `Pago de venta con ${tipo} `,
            id_usuario: datausuarios?.id,
            id_cierre_caja: dataCierreCaja?.id,
            id_venta: idventa,
            vuelto: tipo === "Efectivo" ? vuelto : 0,
          };
          await insertarMovcaja(pmovcaja);
        }
      }
      dataImpresorasXCaja?.state
        ? imprimirDirectoTicket()
        : imprimirConVentanaEmergente(responseVentaConfirmada);
    } else {
      toast.warning("Falta completar el pago, el restante tiene que ser cero");
    }
  }

  const imprimirConVentanaEmergente = async (responseVentaConfirmada) => {
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
  };
  const imprimirDirectoTicket = () => {};
  //useeffect para calcular cunaod los valores cambian
  useEffect(() => {
    if (tipocobro !== "Mixto" && valoresPago[tipocobro] != total) {
      setValoresPago((prev) => ({
        ...prev,
        [tipocobro]: total,
      }));
    }
  }, [tipocobro, total]);

  useEffect(() => {
    calcularVueltoYRestante();
  }, [precioVenta, tipocobro, valoresPago]);
  return (
    <Container>
      {mutation.isPending ? (
        <span>Guardando...</span>
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
                  titulo="¿Fiado? Presiona :p"
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
  box-shadow: 2px 2px 15px 0px #e2e2e2;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #000;
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
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -8px /16px
      16px repeat-x;
  }
  &::after {
    bottom: -5px;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        #fbfbfb 50%,
        #fbfbfb 100%
      ) -7px -2px /16px
      16px repeat-x;
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
      }
    }
    .cliente {
      font-weight: 700;
    }
    .tipocobro {
      position: absolute;
      right: 6px;
      top: 6px;
      background-color: rgba(233, 6, 184, 0.2);
      padding: 5px;
      color: #e61eb1;
      border-radius: 5px;
      font-size: 15px;
      font-weight: 650;
    }
  }
  .area2 {
    margin-top: 5px;
    input {
      color: #000 !important; /* 👈 se mueve aquí, ya scoped solo a .area2 */
      font-weight: 700;
      font-size: 30px;
    }
  }
  .area3 {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    article {
      display: flex;
      flex-direction: column;
    }
    .total {
      font-weight: 700;
    }
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
