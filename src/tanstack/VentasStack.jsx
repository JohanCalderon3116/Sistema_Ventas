import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVentasStore } from "../store/VentasStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { toast } from "sonner";
import { useSerealizacionesStore } from "../store/SerealizacionesStore";
import { useClientesProveedoresStore } from "../store/ClientesProveedoresStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useDetalleVentasStore } from "../store/DetalleVentasStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { useMovCajaStore } from "../store/MovCajaStore";
import { useImpresorasStore } from "../store/ImpresorasStore";
import { useStockStore } from "../store/StockStore";
import Swal from "sweetalert2";

export const useEliminarVentasIncompletasMutateStack = () => {
  const { eliminarventasIncompletas } = useVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["elimina ventas incompletas"],
    mutationFn: async () => {
      await eliminarventasIncompletas({
        id_usuario: datausuarios?.id,
        id_cierre_caja: dataCierreCaja?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};
export const useConfirmarVentasMutationStack = ({
  imprimirDirectoTicket,
  imprimirConVentanaEmergente,
}) => {
  const queryClient = useQueryClient();
  const { restante, idventa, vuelto, confirmarVenta, valoresPago, resetState } =
    useVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { itemSelectComprobanteSelect } = useSerealizacionesStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { cliproItemSelect } = useClientesProveedoresStore();
  const fechaActual = useFormattedDate();
  const { total } = useDetalleVentasStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { insertarMovcaja } = useMovCajaStore();
  const { dataImpresorasXCaja } = useImpresorasStore();
  const { mostrarAlertasStockXVenta } = useStockStore();
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
            fecha_movimiento: fechaActual,
            tipo_movimiento: "venta",
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
  return useMutation({
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
      toast.success("😁🎉 Venta generada correctamente");
    },
    onError: (error) => {
      toast.error("Tuvimos un error al insertar la venta");
    },
  });
};
