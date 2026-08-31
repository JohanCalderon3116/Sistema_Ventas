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
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { useAlmacenesStore } from "../store/AlmacenesStore";
import { useDashboardStore } from "../store/DashboardStore";

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
  const { total, resetDetalleVenta } = useDetalleVentasStore();
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
        ? await imprimirDirectoTicket()
        : await imprimirConVentanaEmergente(responseVentaConfirmada);
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
      resetDetalleVenta();
      resetState();
      queryClient.invalidateQueries({
        queryKey: ["mostrar detalle venta"],
        refetchType: "none",
      });
      toast.success("😁🎉 Venta generada correctamente");
      document.getElementById("input-buscador-pos")?.focus();
    },
    onError: (error) => {
      toast.error("Tuvimos un error al insertar la venta");
    },
  });
};
export const useInsertarVentasConDetalleVentasMutationStack = (buscadorRef) => {
  const { dataStockXAlmacenesYProducto, setStateModal } = useStockStore();
  const queryClien = useQueryClient();
  const { idventa, insertarVentas, catidadInput, setCantidadInput } =
    useVentasStore();
  const { almacenSelelctItem } = useAlmacenesStore();
  const fechaActual = useFormattedDate();
  const { datausuarios } = useUsuariosStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { dataempresa } = useEmpresaStore();
  const { insertarDetalleVentas } = useDetalleVentasStore();
  const { setBuscador } = useProductosStore();
  async function insertarDVentas(p) {
    const ProductosItemSelect =
      useProductosStore.getState().ProductosItemSelect;
    const pDetalleventas = {
      _id_venta: p,
      _cantidad: parseFloat(catidadInput) || 1,
      _precio_venta: ProductosItemSelect.precio_venta,
      _descripcion: ProductosItemSelect.nombre,
      _id_producto: ProductosItemSelect.id,
      _precio_compra: ProductosItemSelect.precio_compra,
      _id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      _id_almacen: almacenSelelctItem?.id,
    };
    await insertarDetalleVentas(pDetalleventas);
  }
  async function insertarventa() {
    if (idventa === 0) {
      const pventas = {
        fecha: fechaActual,
        id_usuario: datausuarios?.id,
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
        id_empresa: dataempresa?.id,
        id_cierre_caja: dataCierreCaja?.id,
      };
      const result = await insertarVentas(pventas);
      if (result?.id > 0) {
        await insertarDVentas(result?.id);
      }
    } else {
      await insertarDVentas(idventa);
    }
    setBuscador("");
    buscadorRef.current.focus();
    setCantidadInput(1);
  }
  return useMutation({
    mutationKey: ["insertar ventas"],
    mutationFn: insertarventa,
    onError: (error) => {
      toast.error(`Error al insertar la venta ${error.message}`);
      queryClien.invalidateQueries(["mostrar Stock Almacenes y Producto"]);
      if (dataStockXAlmacenesYProducto) {
        setStateModal(true);
      }
    },
    onSuccess: () => {
      queryClien.invalidateQueries(["mostrar detalle venta"]);
    },
  });
};
export const useEliminarVentasMutationStack = () => {
  const { eliminarVenta, idventa, resetState } = useVentasStore();
  const { resetDetalleVenta } = useDetalleVentasStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["elminar venta"],
    mutationFn: () => {
      if (idventa > 0) {
        return eliminarVenta({ id: idventa });
      } else {
        return Promise.reject(
          new Error("🛒 No tienes ninguna venta activa para eliminar"),
        );
      }
    },
    onError: (error) => {
      toast.error(`❌ Ups, algo falló: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mostrar detalle venta"]);
      resetDetalleVenta();
      resetState();
      toast.success(
        "🗑️ Listo, eliminaste la venta correctamente, ya limpiaste el carrito 🧹",
      );
      document.getElementById("input-buscador-pos")?.focus();
    },
  });
};
export const useMostrarCantidadVentasQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { contarVentasXEmpresa } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "mostrar cantidad ventas",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      contarVentasXEmpresa({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa?.id && !!fechaInicio && !!fechaFin,
  });
};
export const useSumarVentasQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { sumarTotalVentasXEmpresa } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "sumar ventas",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      sumarTotalVentasXEmpresa({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),

    enabled: !!dataempresa?.id && !!fechaInicio && !!fechaFin,
  });
};
export const useMostrarGanaciasXEmpresaQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { calcularGananciasXEmpresa } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "mostrar ganacias x empresa",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      calcularGananciasXEmpresa({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa?.id && !!fechaInicio && !!fechaFin,
  });
};
export const useMostrarVentasAgrupadasXFechaQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { mostrarVentasAgrupadasFecha } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "mostrar ventas agrupadas x fecha",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      mostrarVentasAgrupadasFecha({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),

    enabled: !!dataempresa?.id && !!fechaInicio && !!fechaFin,
  });
};
export const useMostrarTop5MasVendidosXCantidadQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { mostrarTop5ProductosMasVenidosPorCantidad } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "mostrar top 5 mas vendidos por cantidad",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      mostrarTop5ProductosMasVenidosPorCantidad({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa,
  });
};
export const useMostrarMovimientosCajaLiveQueryStack = () => {
  const { mostrarMovimentosCajaLive } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["mostrar movimientos caja live"],
    queryFn: () => mostrarMovimentosCajaLive({ _id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
};
export const useMostrarTop10MasVendidosXMontoQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { fechaInicio, fechaFin } = useDashboardStore();
  const { mostrarTop10ProductosMasVenidosPorMonto } = useDetalleVentasStore();
  return useQuery({
    queryKey: [
      "mostrar top 10 productos mas venidos por monto",
      {
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      },
    ],
    queryFn: () =>
      mostrarTop10ProductosMasVenidosPorMonto({
        _id_empresa: dataempresa?.id,
        _fecha_inicio: fechaInicio,
        _fecha_fin: fechaFin,
      }),
    enabled: !!dataempresa,
  });
};
