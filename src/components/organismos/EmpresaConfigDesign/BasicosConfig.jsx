import { Icon } from "@iconify/react/dist/iconify.js";
import styled, { useTheme } from "styled-components";
import { InputText2 } from "../formularios/InputText2";
import { Btn1 } from "../../moleculas/Btn1";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useUpdatEmpresaMutateStack } from "../../../tanstack/EmpresaStack";
import { ImageSelector } from "../../../hooks/useImageSelector";
import { useGlobalStore } from "../../../store/GlobalStore";
import { BeatLoader } from "react-spinners";

export const BasicosConfig = () => {
  const { dataempresa } = useEmpresaStore();
  const { fileurl } = useGlobalStore();
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: dataempresa?.nombre,
      direccion: dataempresa?.direccion_fiscal,
      impuesto: dataempresa?.impuesto,
      valor_impuesto: dataempresa?.valor_impuesto,
      telefono_celular: dataempresa?.telefono_celular,
      cantidad_codigo: dataempresa.cantidad_codigo,
    },
  });
  const { mutate: doEditar, isPending } = useUpdatEmpresaMutateStack();

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
          <Title>Básico</Title>
          <Avatar>
            <span className="nombre"> {dataempresa?.nombre} </span>
            <ImageSelector
              fileurl={fileurl || dataempresa?.logo}
            ></ImageSelector>
          </Avatar>
          <form onSubmit={handleSubmit(doEditar)}>
            <Label>Nombre</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nombre"
                type="text"
                {...register("nombre", {
                  required: true,
                })}
              />
              {errors.nombre?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Dirección</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="direccion"
                type="text"
                {...register("direccion", {
                  required: true,
                })}
              />
              {errors.direccion?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Impuesto</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="impuesto"
                type="text"
                {...register("impuesto", {
                  required: true,
                })}
              />
              {errors.impuesto?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Valor impuesto</Label>
            <InputText2>
              <input
                step="0.01"
                className="form__field"
                placeholder="valor impuesto"
                type="number"
                {...register("valor_impuesto", {
                  required: true,
                })}
              />
              {errors.valor_impuesto?.type === "required" && (
                <p>Campo requerido</p>
              )}
            </InputText2>
            <Label>Telefono de la empresa: </Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="Telefono"
                type="number"
                {...register("telefono_celular")}
              />
            </InputText2>
            <Label>Cantidad de codigo: </Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="Codigo"
                type="number"
                {...register("cantidad_codigo")}
              />
            </InputText2>
            <br></br>
            <Btn1
              color="255,255,255"
              border="1px"
              bgcolor="#18181B"
              titulo="Guardar cambios"
            />
          </form>
          <br></br>
          <section className="advertencia">
            <Icon className="icono" icon="lucide:info" />
            <span>
              Los cambios en el logotipo se reflejarán automáticamente en unos segundos.
            </span>
          </section>
        </>
      )}
    </Container>
  );
};

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
`;

const Container = styled.div`
  padding: 20px;
  border-radius: 12px;
  max-width: 400px;
  height: 100%;
  margin: 0 auto;
  p {
    color: #ef4444;
    font-weight: 700;
  }
  .advertencia {
    background-color: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    padding: 12px 14px;
    margin-top: 10px;
    display: flex;
    gap: 10px;
    color: ${({ theme }) => theme.colorSubtitle};
    font-size: 13px;
    width: 100%;
    align-items: center;
    .icono {
      font-size: 22px;
      color: #8b5cf6;
      flex-shrink: 0;
    }
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  border-radius: 14px;
  padding: 12px;
  background-color: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  .nombre {
    font-weight: 700;
    position: absolute;
    text-align: center;
    align-self: center;
    margin: auto;
    top: 0;
    left: 100px;
    bottom: 0;
    right: 10px;
    font-size: 22px;
    overflow: hidden;
    white-space: normal;
    word-wrap: break-word;
    color: #fff !important;
  }
  img {
    object-fit: cover;
  }
  input {
    display: none;
  }
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  font-size: 14px;
  font-weight: 500;
`;
