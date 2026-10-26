import styled, { keyframes, useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  useClientesProveedoresStore,
  BtnClose,
  useInsertarClientesProveedoresMutationStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const aparecer = keyframes`
  from { opacity: 0; margin-top: 10px; }
  to { opacity: 1; margin-top: 0; }
`;

export function RegistrarClientesProveedores({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
}) {
  const { tipo } = useClientesProveedoresStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } =
    useInsertarClientesProveedoresMutationStack({
      accion,
      dataSelect,
      cerrarFormulario,
    });
  const handlesub = (data) => {
    doInsertar(data);
  };
  function cerrarFormulario() {
    onClose();
    setIsExploding(true);
  }
  
  return (
    <Container>
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
              <h1>
                {accion === "Editar"
                  ? "Editar " + tipo
                  : "Registrar nuevo " + tipo}
              </h1>
            </section>
            <section>
              <BtnClose funcion={onClose} />
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombres}
                    type="text"
                    placeholder="Nombre"
                    {...register("nombres", { required: true })}
                  />
                  <label className="form__label">Nombre</label>
                  {errors.nombres?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.direccion}
                    type="text"
                    placeholder="Dirección"
                    {...register("direccion", { required: true })}
                  />
                  <label className="form__label">Dirección</label>
                  {errors.direccion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.telefono}
                    type="number"
                    placeholder="Telefono"
                    {...register("telefono", { required: true })}
                  />
                  <label className="form__label">Telefono</label>
                  {errors.telefono?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.email}
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: true })}
                  />
                  <label className="form__label">Email</label>
                  {errors.email?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.identificador_nacional}
                    type="number"
                    placeholder="Identificador_nacional"
                    {...register("identificador_nacional", { required: true })}
                  />
                  <label className="form__label">C.C</label>
                  {errors.identificador_nacional?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.identificador_fiscal}
                    type="number"
                    placeholder="Identificador_fiscal"
                    {...register("identificador_fiscal")}
                  />
                  <label className="form__label">
                    Identificador Empresa (NIT) (Opcional)
                  </label>
                </InputText>
              </article>
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
  position: fixed;
  inset: 0;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(9, 9, 11, 0.55);
  backdrop-filter: blur(5px);
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 90vw;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 16px;
    background: ${({ theme }) => theme.bgcards || theme.body};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.color2};
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
    padding: 18px 36px 24px;
    z-index: 5;
    animation: ${aparecer} 0.3s ease forwards;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colorScroll || "#3F3F46"}
      transparent;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colorScroll || "#3F3F46"};
      border-radius: 10px;
    }
    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
      h1 {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        color: ${({ theme }) => theme.text};
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
        article {
          animation: ${aparecer} 0.25s ease both;
        }
        p {
          color: #ef4444;
          font-size: 12px;
          font-weight: 700;
          margin: 5px 0 0;
        }
        > button {
          margin-top: 3px;
          transition:
            transform 0.18s ease,
            filter 0.18s ease,
            box-shadow 0.18s ease;
          &:hover {
            transform: translateY(-1px);
            filter: brightness(1.04);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
          }
          &:active {
            transform: scale(0.98);
          }
        }
      }
    }
  }
  @media (max-width: 700px) {
    padding: 12px;
    .sub-contenedor {
      width: 100%;
      max-width: 96vw;
      max-height: calc(100vh - 24px);
      padding: 16px 20px 22px;
    }
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 320px;
  strong {
    color: ${({ theme }) => theme.text};
  }
`;
