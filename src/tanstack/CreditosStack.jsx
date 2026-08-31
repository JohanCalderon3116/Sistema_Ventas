import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCreditosStore } from "../store/CreditosStore";
import { useVentasStore } from "../store/VentasStore";
import { useDetalleVentasStore } from "../store/DetalleVentasStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useMovimientosCreditosStore } from "../store/MovimientosCreditosStore";
import { toast } from "sonner";
import { useClientesProveedoresStore } from "../store/ClientesProveedoresStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMovCajaStore } from "../store/MovCajaStore";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";

export const useMostrarCreditosQueryStack = () => {
  const { dataempresa } = useEmpresaStore();
  const { mostrarCreditos } = useCreditosStore();
  return useQuery({
    queryKey: [
      "mostrar creditos",
      {
        id_empresa: dataempresa?.id,
      },
    ],
    queryFn: () =>
      mostrarCreditos({
        id_empresa: dataempresa?.id,
      }),
  });
};
export const useBuscarCreditsoQueryStack = () => {
  const { buscador: buscadorCreditos, buscarCreditos } = useCreditosStore();
  const { dataempresa } = useEmpresaStore();
  return useQuery({
    queryKey: ["buscar creditos", buscadorCreditos],
    queryFn: () =>
      buscarCreditos({
        id_empresa: dataempresa?.id,
        nombres: buscadorCreditos,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
};
export const useInsertarMovimientoCreditoMutationStack = ({
  onClose,
  resetFuction,
}) => {
  const { creditosItemSelect } = useCreditosStore();
  const { idventa } = useVentasStore();
  const { total } = useDetalleVentasStore();
  const { insertarMovimientosCreditos } = useMovimientosCreditosStore();
  const fecha = useFormattedDate();
  const insertar = async (data) => {
    const p = {
      id_credito: creditosItemSelect?.id,
      id_venta: idventa,
      tipo_movimiento: "venta",
      valor: total,
      observacion: data.observacion,
      fecha_movimiento: fecha,
    };
    await insertarMovimientosCreditos(p);
  };
  return useMutation({
    mutationKey: ["insertar movimiento creditos"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`🚨 Error al guardar: ${error.message} ⚠️`);
    },
    onSuccess: () => {
      toast.success("🎉 ¡Registro guardado correctamente! ✨");
      resetFuction();
      onClose();
    },
  });
};
export const useInsetarCreditosMutationStack = ({ cerrarFormulario }) => {
  const queryClient = useQueryClient();
  const { cliproItemSelect } = useClientesProveedoresStore();
  const { insertarCredito } = useCreditosStore();
  async function insertar(data) {
    const p = {
      id_cliente: cliproItemSelect?.id,
      cupo_maximo: data.cupo_maximo,
      credito_disponible: data.cupo_maximo - (data.saldo_actual || 0),
      saldo_actual: data.saldo_actual || 0,
    };
    await insertarCredito(p);
  }
  return useMutation({
    mutationKey: "insertar credito",
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos guardar el crédito, algo falló en el proceso: ${error.message} 😑`,
      );
    },
    onSuccess: () => {
      toast.success("El crédito quedó registrado correctamente 🙌");
      queryClient.invalidateQueries(["mostrar creditos"]);
      cerrarFormulario();
    },
  });
};
export const useInsertarAbonoCreditoMuatationStack = () => {
  const fechaActual = useFormattedDate();
  const { creditosItemSelect } = useCreditosStore();
  const { insertarMovimientosCreditos } = useMovimientosCreditosStore();
  const { tipoRegistro, dataCierreCaja } = useCierreCajaStore();
  const { datausuarios } = useUsuariosStore();
  const { insertarMovcaja } = useMovCajaStore();
  const { selectMetodo } = useMetodosPagoStore();
  const { setStateIngresoCredito } = useMovimientosCreditosStore();
  async function insertar(data) {
    const p = {
      id_credito: creditosItemSelect?.id,
      tipo_movimiento: "abono",
      valor: data.monto,
      observacion: data.motivo,
      fecha_movimiento: fechaActual,
    };
    await insertarMovimientosCreditos(p);
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: tipoRegistro,
      monto: parseFloat(data.monto),
      id_metodo_pago: selectMetodo?.id,
      descripcion: ` ${tipoRegistro} de abono a credito `,
      id_usuario: datausuarios?.id,
      id_cierre_caja: dataCierreCaja?.id,
    };
    await insertarMovcaja(pmovcaja);
  }
  return useMutation({
    mutationKey: "insertar abono credito",
    mutationFn: insertar,
    onError: (error) => {
      toast.error(
        `No pudimos registrar el abono al crédito, algo falló en el proceso ${error.message} 😯`,
      );
    },
    onSuccess: () => {
      setStateIngresoCredito(false);
      toast.success("El abono al crédito quedó registrado correctamente 🫶");
    },
  });
};
