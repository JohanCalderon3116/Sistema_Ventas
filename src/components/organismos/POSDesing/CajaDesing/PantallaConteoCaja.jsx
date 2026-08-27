import styled from "styled-components";
import { VolverBtn } from "../../../moleculas/VolverBtn";
import { InputText2 } from "../../formularios/InputText2";
import {
  Btn1,
  FormatearNumeroDinero,
  useCierreCajaStore,
  useEmpresaStore,
  useMovCajaStore,
} from "../../../../index";
import { BarLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Toaster } from "sonner";
import { useTerminarTurnoMutationStack } from "../../../../tanstack/MovimientosCajaStack";

export const PantallaConteoCaja = () => {
  const { totalEfectivoTotalCaja } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const {
    setStateConteoCaja,
  } = useCierreCajaStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const diferencia = montoEfectivo - totalEfectivoTotalCaja;
  const { isPending, mutate: doInsertar } = useTerminarTurnoMutationStack(
    diferencia,
    reset,
  );
  const handleSub = (data) => {
    doInsertar(data);
  };
  const anuncioMensaje =
    diferencia === 0
      ? "¡Excelente trabajo! La caja ha cuadrado perfectamente. Gracias por tu honestidad y orden."
      : "Existe una diferencia en el cierre. El reporte se enviará automáticamente al administrador. Por favor, asegúrate de haber anotado todos los gastos y entradas.";
  const anuncioColor = diferencia === 0 ? "#09bc42" : "#ff3f56";
  return (
    <Container>
      <Toaster richColors></Toaster>
      <VolverBtn funcion={() => setStateConteoCaja(false)}></VolverBtn>
      <span className="title">Efectivo esperado en caja</span>
      <span className="title">
        {" "}
        {FormatearNumeroDinero(
          totalEfectivoTotalCaja,
          dataempresa?.currency,
          dataempresa?.iso,
        )}{" "}
      </span>
      {isPending ? (
        <BarLoader color="#2af169"></BarLoader>
      ) : (
        <form action="" onSubmit={handleSubmit(handleSub)}>
          <section className="area1">
            <span>¿Cuanto efectivo hay en la caja física?</span>
            <InputText2>
              <input
                type="number"
                className="form__field"
                {...register("montoreal", {
                  required: true,
                  onChange: (e) =>
                    setMontoEfectivo(parseFloat(e.target.value) || 0),
                })}
              />
              {errors.montoreal?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Divider></Divider>
            <span>
              Diferencía:{" "}
              {FormatearNumeroDinero(
                diferencia,
                dataempresa?.currency,
                dataempresa?.iso,
              )}
            </span>
            <article className="contentbtn">
              <Btn1
                titulo="Cerrar turno"
                color="#ffffff"
                border="2px"
                bgcolor="#1da393"
              ></Btn1>
            </article>
          </section>
        </form>
      )}
      <span style={{ color: anuncioColor, textAlign: "center" }}>
        {" "}
        {anuncioMensaje}:{" "}
      </span>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal};
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 10px;
  flex-direction: column;
  input {
    text-align: center;
  }
  p {
    color: #ff0062;
    font-weight: bold;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .contentbtn {
      margin-top: 15px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.color2};
  margin-right: 10px;
`;
