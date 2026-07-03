import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useAlmacenesStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { BeatLoader } from "react-spinners";
export function RegistrarAlmacen() {
  const queryClient = useQueryClient();
  const {
    accion: accionAlmacen,
    almacenSelelctItem,
    setStateAlmacen,
    insertarAlmacenes,
    editarAlmacenes,
  } = useAlmacenesStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const insertar = async (data) => {
    if (accionAlmacen == "Editar") {
      const p = {
        id: almacenSelelctItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await editarAlmacenes(p);
    } else {
      const p = {
        id_sucursal: almacenSelelctItem?.id,
        nombre: ConvertirCapitalize(data.nombre),
      };
      await insertarAlmacenes(p);
    }
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar almacen"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`No pudimos guardar tu almacén, algo falló en el proceso 😬`);
    },
    onSuccess: () => {
      toast.success("Tu almacén quedó registrado correctamente 🥹");
      queryClient.invalidateQueries(["mostrar almacenes x empresa"]);
      setStateAlmacen(false);
    },
  });

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
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {accionAlmacen == "Editar"
                  ? "Editar almacen"
                  : "Registrar nuevo almacen"}
              </h1>
            </section>

            <section>
              <BtnClose funcion={() => setStateAlmacen(false)} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={
                      accionAlmacen === "Editar"
                        ? almacenSelelctItem?.nombre
                        : ""
                    }
                    type="text"
                    placeholder="nombre"
                    {...register("nombre", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Almacen</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
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
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;
