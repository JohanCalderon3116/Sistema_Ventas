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

const ACCENT = {
  primary: "#8B5CF6",
  primarySoft: "rgba(139, 92, 246, 0.06)",
  primaryBorder: "rgba(139, 92, 246, 0.22)",
  primaryGlow: "rgba(139, 92, 246, 0.08)",
};

export const PantallaConteoCaja = () => {
  const { totalEfectivoTotalCaja } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const { setStateConteoCaja } = useCierreCajaStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const diferenciaCalculada = montoEfectivo - totalEfectivoTotalCaja;
  const diferencia = diferenciaCalculada === 0 ? 0 : diferenciaCalculada;
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
  const anuncioColor = diferencia === 0 ? "#10b981" : "#ef4444";

  return (
    <Container>
      <Toaster richColors />
      <VolverBtn funcion={() => setStateConteoCaja(false)} />
      <span className="title">Efectivo esperado en caja</span>
      <span className="amount">
        {FormatearNumeroDinero(
          totalEfectivoTotalCaja,
          dataempresa?.currency,
          dataempresa?.iso,
        )}
      </span>
      {isPending ? (
        <LoaderContainer>
          <span className="loading-text">Cerrando turno...</span>
          <BarLoader color={ACCENT.primary} width={180} />
        </LoaderContainer>
      ) : (
        <form onSubmit={handleSubmit(handleSub)}>
          <section className="area1">
            <span className="question">
              ¿Cuánto efectivo hay en la caja física?
            </span>
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
            <Divider />
            <span className="diferencia">
              Diferencia:
              <strong className={diferencia === 0 ? "correcta" : "incorrecta"}>
                {FormatearNumeroDinero(
                  diferencia,
                  dataempresa?.currency,
                  dataempresa?.iso,
                )}
              </strong>
            </span>
            <article className="contentbtn">
              <Btn1
                titulo="Cerrar turno"
                color="255,255,255"
                border="1px"
                bgcolor="#18181B"
              />
            </article>
          </section>
        </form>
      )}
      <span
        className="anuncio"
        style={{
          color: anuncioColor,
        }}
      >
        {anuncioMensaje}
      </span>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  inset: 0;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 25px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  text-align: center;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${ACCENT.primaryBorder};
    opacity: 0.8;
    pointer-events: none;
  }
  input {
    text-align: center;
  }
  form {
    width: min(500px, 94vw);
  }
  p {
    color: #ef4444;
    font-weight: 700;
    font-size: 13px;
    margin: 3px 0 0;
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 2px;
  }
  .amount {
    font-size: 30px;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    line-height: 1.15;
    margin-bottom: 8px;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  .area1 .question {
    font-size: 15px;
    color: ${({ theme }) => theme.colorSubtitle};
    margin-bottom: 2px;
  }
  .area1 .diferencia {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }
  .area1 .diferencia .correcta {
    color: #10b981;
    font-weight: 800;
  }
  .area1 .diferencia .incorrecta {
    color: #ef4444;
    font-weight: 800;
  }
  .area1 .contentbtn {
    margin-top: 8px;
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: center;
  }
  .anuncio {
    width: min(680px, 92vw);
    font-size: 13px;
    line-height: 1.5;
    margin-top: 5px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.color2};
  margin: 3px 0;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 30%;
    right: 30%;
    top: 0;
    height: 1px;
    background: ${ACCENT.primaryBorder};
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 45px;
  margin-top: 4px;
  .loading-text {
    font-size: 14px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;
