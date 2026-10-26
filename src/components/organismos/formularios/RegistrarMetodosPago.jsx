import { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  Icono,
  useMetodosPagoStore,
  useInsertarMetodosPagoMutationStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { BeatLoader } from "react-spinners";

export function RegistrarMetodosPago({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
}) {
  const { setFile } = useMetodosPagoStore();
  const theme = useTheme();
  const ref = useRef(null);
  const [fileurl, setFileurl] = useState();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const cerrarFormulario = () => {
    setFile([]);
    onClose();
    setIsExploding(true);
  };
  const { isPending, mutate: doInsertar } = useInsertarMetodosPagoMutationStack(
    accion,
    dataSelect,
    cerrarFormulario,
  );
  const handlesub = (data) => {
    doInsertar(data);
  };

  function abrirImagenes() {
    ref.current.click();
  }
  function prepararImagen(e) {
    let filelocal = e.target.files;
    let fileReaderlocal = new FileReader();
    fileReaderlocal.readAsDataURL(filelocal[0]);
    const tipoimg = e.target.files[0];
    setFile(tipoimg);
    if (fileReaderlocal && filelocal && filelocal.length) {
      fileReaderlocal.onload = function load() {
        setFileurl(fileReaderlocal.result);
      };
    }
  }
  useEffect(() => {
    if (accion === "Editar") {
      setFileurl(dataSelect.icono);
    } else {
      setFile([]);
      setFileurl(undefined);
    }
  }, []);

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
                  ? "Editar método de pago"
                  : "Registrar nuevo método de pago"}
              </h1>
            </section>
            <section>
              <BtnClose funcion={onClose}></BtnClose>
            </section>
          </div>
          <PictureContainer>
            {fileurl != "-" ? (
              <div className="ContentImage">
                <img src={fileurl}></img>
              </div>
            ) : (
              <Icono>{<v.iconoimagenvacia />}</Icono>
            )}
            <Btn1
              funcion={abrirImagenes}
              titulo="+imagen(opcional)"
              color="#5f5f5f"
              bgcolor="rgb(183, 183, 182)"
              icono={<v.iconosupabase />}
            />
            <input
              type="file"
              ref={ref}
              onChange={(e) => prepararImagen(e)}
            ></input>
          </PictureContainer>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    placeholder="nombre"
                    {...register("nombre", { required: true })}
                  />
                  <label className="form__label">Metodo de pago</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
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

const PictureContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  border: 1px dashed ${({ theme }) => theme.color2};
  border-radius: 8px;
  background-color: transparent;
  padding: 8px;
  position: relative;
  gap: 3px;
  margin-bottom: 12px;
  .ContentImage {
    overflow: hidden;
    img {
      width: 100%;
      object-fit: contain;
    }
  }
  input {
    display: none;
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
