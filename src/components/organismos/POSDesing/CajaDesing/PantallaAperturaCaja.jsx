import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";
import { useState } from "react";
import { useUsuariosStore } from "../../../../store/UsuariosStore";
import { useCajasStore } from "../../../../store/CajaStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useAsignacionCajaSucursalesStore } from "../../../../store/AsignacionCajaSucursales";

export const PantallaAperturaCaja = () => {
  const fechaActual = useFormattedDate();
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const queryClient = useQueryClient();
  const { datausuarios } = useUsuariosStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalesStore();
  const { aperturarCaja } = useCierreCajaStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { insertarMovcaja } = useMovCajaStore();
  const registrarMovCaja = async (p) => {
    const id_metodo_pago = dataMetodosPago
      .filter((item) => item.nombre === "Efectivo")
      .map((item) => item.id)[0];
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: "apertura",
      monto: montoEfectivo,
      id_metodo_pago: id_metodo_pago,
      descripcion: `Apertura de caja`,
      id_usuario: datausuarios?.id,
      id_cierre_caja: p.id_cierre_caja,
    };
    await insertarMovcaja(pmovcaja);
    console.log(pmovcaja);
  };

  const insertar = async () => {
    const p = {
      fechainicio: fechaActual,
      fechacierre: fechaActual,
      id_usuario: datausuarios?.id,
      id_caja: sucursalesItemSelectAsignadas?.id_caja,
    };
    const data = await aperturarCaja(p);
    console.log(data);
    await registrarMovCaja({ id_cierre_caja: data?.id });
  };
  const mutation = useMutation({
    mutationKey: ["aperturar caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("Caja aperturada correctamente :v");
      queryClient.invalidateQueries("mostrar cierre de caja");
    },
    onError: () => {
      toast.error("Error al aperturar caja :'/");
    },
  });
  return (
    <Container>
      <Toaster richColors></Toaster>
      <section className="area1">
        <span className="title">Aperturar caja con: </span>
        <InputText2>
          <input
            onChange={(e) => setMontoEfectivo(parseFloat(e.target.value))}
            type="number"
            placeholder="0.00"
            className="form__field"
          />
        </InputText2>
        <span>En efectivo</span>
        <article className="contentbtn">
          <Btn1
            titulo="Omitir"
            funcion={() => {
              setMontoEfectivo(0);
              mutation.mutateAsync();
            }}
          ></Btn1>
          <Btn1
            funcion={() => {
              mutation.mutateAsync();
            }}
            titulo="Aperturar"
            color="#ffffff"
            bgcolor="#1da139"
            border="2px"
          ></Btn1>
        </article>
      </section>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  align-items: center;
  justify-content: center;
  display: flex;
  .area1 {
    display: flex;
    gap: 12px;
    flex-direction: column;
    .title {
      font-size: 19px;
      font-weight: bold;
    }
    .contentbtn {
      display: flex;
      gap: 12px;
    }
  }
`;
