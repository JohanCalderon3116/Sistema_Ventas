import styled, { useTheme } from "styled-components";
import {
  InputText,
  Btn1,
} from "../../../index";
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
import { v } from "../../../styles/variables";

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
          <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
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
              <Detalle>
                Nombre:{" "}
                <strong>
                  {" "}
                  {creditosItemSelect?.nombres
                    ? creditosItemSelect?.nombres
                    : "-"}{" "}
                </strong>
              </Detalle>
              <Detalle>
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
              </Detalle>
              <Detalle>
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
              </Detalle>
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
  overflow: hidden;
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
    overflow: hidden;
    .headers {
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h1 {
        font-size: 20px;
        font-weight: 700;
        color: ${({ theme }) => theme.text};
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      position: relative;
      z-index: 5;
      .form-subcontainer {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
    @media ${v.bplisa} {
      width: 450px;
      max-width: 90%;
      padding: 13px 25px 20px 25px;
    }
    @media ${v.bpmarge} {
      width: 95%;
      max-width: 95%;
      padding: 13px 18px 20px 18px;
      .headers {
        h1 {
          font-size: 18px;
        }
      }
    }
  }
`;

const Detalle = styled.span`
  color: ${({ theme }) => theme.text};

  strong {
    color: #8B5CF6;
    font-weight: 700;
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
  color: ${({ theme }) => theme.text};
  span {
    strong {
      font-size: 18px;
    }
  }
`;
