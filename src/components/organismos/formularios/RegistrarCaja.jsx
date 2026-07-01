import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useCajasStore,
  useAsignacionCajaSucursalesStore,
  useUsuariosStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
export function RegistrarCaja() {
  const queryClient = useQueryClient();
  const {
    accion: accionCaja,
    cajaSelelctItem,
    setStateCaja,
    insertarCaja,
    editarCaja,
  } = useCajasStore();
  const { insertarAsignacionSucusal } = useAsignacionCajaSucursalesStore();
  const { datausuarios } = useUsuariosStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const insertar = async (data) => {
    if (accionCaja == "Editar") {
      const p = {
        id: cajaSelelctItem?.id,
        descripcion: ConvertirCapitalize(data.descripcion),
      };
      await editarCaja(p);
    } else {
      const p = {
        descripcion: ConvertirCapitalize(data.descripcion),
        id_sucursal: cajaSelelctItem?.id,
      };
      const response = await insertarCaja(p);
      const pAsignaciones = {
        id_sucursal: cajaSelelctItem?.id,
        id_usuario: datausuarios?.id,
        id_caja: response?.id,
      };
      await insertarAsignacionSucusal(pAsignaciones);
    }
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar caja"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Caja registrada correctamenete");
      queryClient.invalidateQueries(["mostrar cajas por sucursal"]);
      setStateCaja(false);
    },
  });

  const handlesub = (data) => {
    doInsertar(data);
  };
  return (
    <Container>
      {isPending ? (
        <span>Guardando</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {accionCaja == "Editar"
                  ? "Editar caja"
                  : "Registrar nueva caja"}
              </h1>
            </section>

            <section>
              <BtnClose funcion={() => setStateCaja(false)} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={
                      accionCaja === "Editar"
                        ? cajaSelelctItem?.descripcion
                        : ""
                    }
                    type="text"
                    placeholder="descripcion"
                    {...register("descripcion", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Descripcion</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <Btn1
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
    background: ${({ theme }) => theme.body};
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
