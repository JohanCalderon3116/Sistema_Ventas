import styled, { useTheme } from "styled-components";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import {
  Btn1,
  InputText2,
  useMetodosPagoStore,
  VolverBtn,
} from "../../../../index";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { useInsertarIngresosSalidasCajasMutationStack } from "../../../../tanstack/MovimientosCajaStack";
export const PantallaIngresoSalidaDinero = () => {
  const { tipoRegistro, setStateIngresoSalida } = useCierreCajaStore();
  const { dataMetodosPago, selectMetodo, setSelectMetodo } =
    useMetodosPagoStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { isPending, mutate: doInsertar } =
    useInsertarIngresosSalidasCajasMutationStack(reset);
  const manejadorEnvio = (data) => {
    doInsertar(data);
  };
  const handleMetodoClick = (item) => {
    setSelectMetodo(item);
  };
  useEffect(() => {
    const efectivo = dataMetodosPago?.find(
      (item) => item.nombre === "Efectivo",
    );
    if (efectivo) {
      setSelectMetodo(efectivo);
    }
  }, [dataMetodosPago]);
  return (
    <Container>
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <>
          <VolverBtn funcion={() => setStateIngresoSalida(false)}></VolverBtn>
          <span className="title">
            {tipoRegistro === "ingreso"
              ? "Ingresar dinero a caja"
              : "Retirar dinero de caja"}
          </span>
          <section className="areatipopago">
            {dataMetodosPago
              ?.filter((item) => item.nombre === "Efectivo")
              .map((item, index) => {
                return (
                  <article className="box" key={index}>
                    <Btn1
                      funcion={() => handleMetodoClick(item)}
                      imagen={item.icono != "-" ? item.icono : null}
                      border="0"
                      height="70px"
                      width="100%"
                      titulo={item.nombre}
                      bgcolor={
                        item.id === selectMetodo?.id ? "#ffd700" : "#fff"
                      }
                    ></Btn1>
                  </article>
                );
              })}
          </section>
          <form action="" onSubmit={handleSubmit(manejadorEnvio)}>
            <section className="area1">
              <span>Monto: </span>
              <InputText2>
                <input
                  type="number"
                  className="form__field"
                  placeholder="0.00"
                  {...register("monto", { required: true })}
                />
                {errors.monto?.type === "required" && (
                  <span>Campo requerido</span>
                )}
              </InputText2>
              <span>Motivo (Puede ser blanco)</span>
              <InputText2>
                <textarea
                  type="text"
                  className="form__field"
                  rows="3"
                  placeholder="Motivo"
                  {...register("motivo")}
                />
              </InputText2>
              <article className="contentbtn">
                <Btn1
                  color="#fff"
                  border="2px"
                  bgcolor="#1da939"
                  titulo="Registrar"
                ></Btn1>
              </article>
            </section>
          </form>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  position: absolute;
  background-color: ${({ theme }) => theme.bgtotal};
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .areatipopago {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    .box {
      flex: 1 1 40%;
      display: flex;
    }
  }
  .area1 {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
  .contentbtn {
    margin-top: 15px;
    display: flex;
    gap: 12px;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
`;
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
