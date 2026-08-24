import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import { InputText, Btn1, useFormattedDate } from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { toast, Toaster } from "sonner";
import { BuscadorList } from "../../ui/lists/Buscador";
import { BeatLoader } from "react-spinners";
import { useCreditosStore } from "../../../store/CreditosStore";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import {
  useBuscarCreditsoQueryStack,
  useInsertarMovimientoCreditoMutationStack,
  useMostrarCreditosQueryStack,
} from "../../../tanstack/CreditosStack";
export function RegistrarmovimientocreditoVenta({ onClose }) {
  const {
    creditosItemSelect,
    setCreditosItemSelect,
    setBuscador: setBuscadorCreditos,
    datacreditos,
  } = useCreditosStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { error } = useMostrarCreditosQueryStack();
  useBuscarCreditsoQueryStack();
  const { isPending, mutate: doInsertar } =
    useInsertarMovimientoCreditoMutationStack({ onClose, resetFuction });
  const handlesub = (data) => {
    doInsertar(data);
  };
  function resetFuction() {
    reset();
  }
  if (error) {
    toast.error(`error: ${error.message}`);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>Registrar fiado</h1>
            </section>
            <section>
              <BtnClose funcion={onClose} />
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <BuscadorList
                data={datacreditos}
                onSelect={setCreditosItemSelect}
                itemSelect={creditosItemSelect}
                setBuscador={setBuscadorCreditos}
                displayField="nombres"
              ></BuscadorList>
              <span>
                Nombre:{" "}
                <strong>
                  {" "}
                  {creditosItemSelect?.nombres
                    ? creditosItemSelect?.nombres
                    : "-"}{" "}
                </strong>
              </span>
              <span>
                Credito máximo aprobado:{" "}
                <strong>
                  {" "}
                  {creditosItemSelect?.cupo_maximo
                    ? FormatearNumeroDinero(
                        creditosItemSelect?.cupo_maximo,
                        "COP",
                        "CO",
                      )
                    : "-"}{" "}
                </strong>
              </span>
              <span>
                Credito disponible:
                <strong>
                  {" "}
                  {creditosItemSelect?.credito_disponible
                    ? FormatearNumeroDinero(
                        creditosItemSelect?.credito_disponible,
                        "COP",
                        "CO",
                      )
                    : "-"}{" "}
                </strong>
              </span>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="Observacion (opcional)"
                    {...register("observacion")}
                  />
                  <label className="form__label">Observacion (Opcional)</label>
                </InputText>
              </article>
              <Btn1
                disabled={!creditosItemSelect?.nombres}
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#F9D70B"
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
  backdrop-filter: blur(5px);
  .sub-contenedor {
    position: relative;
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bg2};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 30px;
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
  height: 100vh;
`;
