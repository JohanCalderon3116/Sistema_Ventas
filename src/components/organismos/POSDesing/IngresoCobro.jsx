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
export const IngresoCobro = forwardRef((props, ref) => {
  const queryClient = useQueryClient();
  const fechaActual = useFormattedDate();
  const {
    tipocobro,
    items,
    resetState,
    setStatePantallaCobro,
    confirmarVenta,
  } = useVentasStore();
  const { total, detalleventa } = useDetalleVentasStore();
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
    onSuccess: () => {
      if (restante != 0) {
        return;
      }
      resetState();
      queryClient.invalidateQueries(["mostrar detalle venta"]);
      toast.success("😁🎉 Venta generada correctamente :p");
    },
  });
  async function ConfirmarVenta(p) {
    if (restante === 0) {
      const pventas = {
        fecha: fechaActual,
        id_usuario: datausuarios?.id,
        id_cliente: cliproItemSelect?.id,
        estado: "confirmada",
        vuelto: vuelto,
        monto_total: total,
      };
      if (idventa === 0) {
        const result = await confirmarVenta(pventas);
        if (result?.id > 0) {
          //Insertar movimiento de caja, solo los metodos de pago con mayor a cero
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
                id_venta: result?.id,
                vuelto: tipo === "Efectivo" ? vuelto : 0,
              };
              await insertarMovcaja(pmovcaja);
            }
          }
        }
      }
    } else {
      toast.warning("Falta completar el pago, el restante tiene que ser cero");
    }
  }

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
            <span className="tipocobro"> {tipocobro} </span>
            <Icon
              icon="fluent-emoji:smiling-face-with-sunglasses"
              width="20"
              height="20"
            ></Icon>
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
            <Btn1
              funcion={() => mutation.mutateAsync()}
              border="2px"
              titulo="Cobrar (Enter)"
              bgcolor="#0aca21"
              color="#ffffff"
              width="100%"
            ></Btn1>
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
  min-height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  input {
    color: #000 !important;
    font-weight: 700;
  }
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
