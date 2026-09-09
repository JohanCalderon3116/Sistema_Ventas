import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovCajaStore } from "../store/MovCajaStore";
import { toast } from "sonner";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useAuthStore } from "../store/AuthStore";
import { useEmpresaStore } from "../store/EmpresaStore";

export const useInsertarIngresosSalidasCajasMutationStack = (reset) => {
  const queryClient = useQueryClient();
  const fechaActual = useFormattedDate();
  const { tipoRegistro } = useCierreCajaStore();
  const { selectMetodo } = useMetodosPagoStore();
  const { datausuarios } = useUsuariosStore();
  const { dataCierreCaja, setStateIngresoSalida } = useCierreCajaStore();
  const { insertarMovcaja } = useMovCajaStore();
  const insertar = async (data) => {
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: tipoRegistro,
      monto: parseFloat(data.monto),
      id_metodo_pago: selectMetodo?.id,
      descripcion: ` ${tipoRegistro === "ingreso" ? "Ingreso" : "Salida"} de dinero con ${selectMetodo?.nombre} ${data.motivo ? ` - Detalle: ${data.motivo}` : ""} `,
      id_usuario: datausuarios?.id,
      id_cierre_caja: dataCierreCaja?.id,
    };
    await insertarMovcaja(pmovcaja);
  };
  return useMutation({
    mutationKey: ["insertar ingresos salidas caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("El movimiento de caja quedó registrado correctamente 🙌");
      queryClient.invalidateQueries({
        queryKey: ["mostrar efectivo sin ventas movCaja"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar ventas metodoPago movCaja"],
      });
      setStateIngresoSalida(false);
      reset();
    },
    onError: (error) => {
      toast.error(
        `No pudimos registrar el movimiento de caja, algo falló en el proceso. Inténtalo de nuevo 😩 ${error.message}`,
      );
    },
  });
};
export const useMostrarEfectivoSinVentasMovCajasQueryStack = () => {
  const { dataCierreCaja } = useCierreCajaStore();
  const { mostrarEfectivoSinVentasMovCierreCaja } = useMovCajaStore();
  return useQuery({
    queryKey: ["mostrar efectivo sin ventas movCaja"],
    queryFn: () =>
      mostrarEfectivoSinVentasMovCierreCaja({
        _id_cierre_caja: dataCierreCaja?.id,
      }),
    enabled: !!dataCierreCaja?.id,
    retry: 1,
  });
};
export const useMostrarVentasMetodoPagoMovCajaQueryStack = () => {
  const { mostrarVentasMetodoPagoMovCaja } = useMovCajaStore();
  const { dataCierreCaja } = useCierreCajaStore();
  return useQuery({
    queryKey: ["mostrar ventas metodoPago movCaja"],
    queryFn: () =>
      mostrarVentasMetodoPagoMovCaja({
        _id_cierre_caja: dataCierreCaja?.id,
      }),
    enabled: !!dataCierreCaja?.id,
    retry: 1,
  });
};
export const useTerminarTurnoMutationStack = (diferencia, reset) => {
  const {
    dataCierreCaja,
    cerrarTurnoCaja,
    setStateConteoCaja,
    setStateCierreCaja,
  } = useCierreCajaStore();
  const fechaActual = useFormattedDate();
  const { datausuarios } = useUsuariosStore();
  const { totalEfectivoTotalCaja } = useMovCajaStore();
  const { cerrarSesion } = useAuthStore();
  const queryClient = useQueryClient();
  const insertar = async (data) => {
    const p = {
      id: dataCierreCaja.id,
      fechacierre: fechaActual,
      id_usuario: datausuarios?.id,
      total_efectivo_calculado: parseFloat(totalEfectivoTotalCaja),
      total_efectivo_real: parseFloat(data.montoreal),
      estado: 1,
      diferencia_efectivo: diferencia,
    };
    await cerrarTurnoCaja(p);
  };
  return useMutation({
    mutationKey: ["cerrar turno caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("🎉 Caja cerrada correctamente 🎉");
      setStateConteoCaja(false);
      setStateCierreCaja(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["mostrar cierre caja por empresa"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar efectivo sin ventas movCaja"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar ventas metodoPago movCaja"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mostrar caja aperturada por usuario"],
      });
      cerrarSesion();
    },
    onError: (error) => {
      toast.error(`Error al cerrar caja: ${error.message} `);
    },
  });
};
export const useMostrarMovimientosCajaXEmpresYFechaQueryStack = (
  fechaInicio,
  fechaFin,
) => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarMovimientosCajaXEmpresYFecha } = useMovCajaStore();
  return useQuery({
    queryKey: [
      "mostrar movimientos caja por fecha",
      { id_empresa: dataempresa?.id, fechaInicio, fechaFin },
    ],
    queryFn: () => {
      const p = { _id_empresa: dataempresa?.id };
      if (fechaInicio) p._fecha_inicio = fechaInicio;
      if (fechaFin) p._fecha_fin = fechaFin;
      return mostrarMovimientosCajaXEmpresYFecha(p);
    },
    enabled: !!dataempresa?.id,
    retry: 1,
  });
};
