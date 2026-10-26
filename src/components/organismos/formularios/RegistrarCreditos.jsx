import { useEffect, useState } from "react";
import styled, { keyframes, useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  SelectList,
  Switch1,
  BtnClose,
  useInsetarCreditosMutationStack,
  useMostrarClientesQueryStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { BeatLoader } from "react-spinners";

const aparecer = keyframes`
  from { opacity: 0; margin-top: 10px; }
  to { opacity: 1; margin-top: 0; }
`;

export function RegistrarCreditos({
  onClose,
  dataSelect,
  setIsExploding,
  accion,
}) {
  const [stateCreditos, setStateCreditos] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const theme = useTheme();
  const { data: dataclipro } = useMostrarClientesQueryStack();
  const { isPending, mutate: doInsertar } = useInsetarCreditosMutationStack({
    cerrarFormulario,
    accion,
    dataSelect,
    clienteSeleccionado,
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  function cerrarFormulario() {
    onClose();
    setIsExploding(true);
  }
  useEffect(() => {
    if (!dataclipro) return;
    if (accion === "Editar" && dataSelect) {
      const clienteDelCredito = dataclipro.find(
        (c) => c.id === dataSelect.id_cliente,
      );
      setClienteSeleccionado(clienteDelCredito || dataclipro[0]);
    } else {
      setClienteSeleccionado(dataclipro[0]);
    }
  }, [accion, dataSelect, dataclipro]);
  
  return (
    <Container>
      <Toaster richColors />
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
        </ConteinerLoader>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              {accion == "Editar"
                ? "Editar crédito"
                : "Registrar nuevo crédito "}
            </section>
            <section>
              <BtnClose funcion={onClose} />
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <ContainerSelector>
                <label>Clientes: </label>
                <SelectList
                  data={dataclipro}
                  itemSelect={clienteSeleccionado}
                  onSelect={setClienteSeleccionado}
                  displayField="nombres"
                />
              </ContainerSelector>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="number"
                    placeholder="Cupo maximno"
                    defaultValue={dataSelect.cupo_maximo}
                    {...register("cupo_maximo", { required: true })}
                  />
                  <label className="form__label">Cupo Maximo</label>
                  {errors.cupo_maximo?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <span>
                <strong>¿Crédito antiguo?</strong>
              </span>
              <Switch1
                state={stateCreditos}
                setState={() => setStateCreditos(!stateCreditos)}
              />
              {stateCreditos && (
                <article>
                  <InputText icono={<v.iconoflechaderecha />}>
                    <input
                      className="form__field"
                      type="number"
                      placeholder="Debe..."
                      defaultValue={dataSelect.saldo_actual}
                      {...register("saldo_actual", { required: true })}
                    />
                    <label className="form__label">Debe...</label>
                    {errors.saldo_actual?.type === "required" && (
                      <p>Campo requerido</p>
                    )}
                  </InputText>
                </article>
              )}
              <Btn1
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#18181B"
                color="#FFFFFF"
              />
            </section>
          </form>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
  background-color: rgba(9, 9, 11, 0.55);
  backdrop-filter: blur(5px);
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 16px;
    background: ${({ theme }) => theme.bgcards || theme.body};
    border: 1px solid ${({ theme }) => theme.color2};
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
    padding: 16px 36px 24px 36px;
    z-index: 100;
    animation: ${aparecer} 0.3s ease forwards;
    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
      font-weight: 700;
      color: ${({ theme }) => theme.text};
      h1 {
        font-size: 20px;
        font-weight: 600;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      position: relative;
      z-index: 2;
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;

export const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
