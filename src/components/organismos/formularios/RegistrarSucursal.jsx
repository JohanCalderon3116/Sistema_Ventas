import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import { InputText, Btn1, useSucursalesStore } from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { Toaster } from "sonner";
import { BeatLoader } from "react-spinners";
import { useInsertarSucursalesMutationStack } from "../../../tanstack/SucursalesStack";
export function RegistrarSucursal() {
  const { accion, sucursalesItemSelect, setStateSucursal } =
    useSucursalesStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } =
    useInsertarSucursalesMutationStack();
  const handlesub = (data) => {
    doInsertar(data);
  };
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
                {accion == "Editar"
                  ? "Editar sucursal"
                  : "Registrar nueva sucursal"}
              </h1>
            </section>
            <section>
              <BtnClose funcion={() => setStateSucursal(false)} />
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={sucursalesItemSelect?.nombre}
                    type="text"
                    placeholder="Sucursal"
                    {...register("nombre", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Sucursal</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={
                      accion === "Editar"
                        ? sucursalesItemSelect?.direccion_fiscal
                        : ""
                    }
                    type="text"
                    placeholder="Direccion fiscal"
                    {...register("direccion_fiscal", { required: true })}
                  />
                  <label className="form__label">Dirección</label>
                  {errors.direccion_fiscal?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
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
    max-height: 80vh;
    overflow-y: auto;
    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h1 {
        font-size: 22px;
        font-weight: 700;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
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
