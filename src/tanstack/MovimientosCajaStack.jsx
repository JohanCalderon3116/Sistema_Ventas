import { useMutation, useQuery } from "@tanstack/react-query";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovCajaStore } from "../store/MovCajaStore";
import { toast } from "sonner";
import { useFormattedDate } from "../hooks/useFormattedDate";

export const useInsertarIngresosSalidasCajasMutationStack = (reset) => {
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
  });
};
