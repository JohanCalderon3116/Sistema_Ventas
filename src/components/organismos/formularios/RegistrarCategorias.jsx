import { useEffect, useRef, useState } from "react";
import styled, { keyframes, useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  Icono,
  BtnClose,
  useCategoriasStore,
  useInsertarCategoriasMutationStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { BeatLoader } from "react-spinners";

const aparecer = keyframes`
  from { opacity: 0; margin-top: 10px; }
  to { opacity: 1; margin-top: 0; }
`;

export function RegistrarCategorias({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
}) {
  const { currentColor, setColor, setFile } = useCategoriasStore();
  const theme = useTheme();
  const ref = useRef(null);
  const [fileurl, setFileurl] = useState();
  function elegirColor(color) {
    setColor(color.hex);
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } = useInsertarCategoriasMutationStack({
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
      setColor(dataSelect.color);
      setFileurl(dataSelect.icono);
    } else {
      setColor("#F44336");
      setFileurl(null);
    }
    setFile([]);
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
                {accion == "Editar"
                  ? "Editar categoría"
                  : "Registrar nueva categoría"}
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
                    placeholder="categoria"
                    {...register("descripcion", { required: true })}
                  />
                  <label className="form__label">categoría</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article className="colorContainer">
                <ContentTitle>
                  {<v.paletacolores />}
                  <span>Color</span>
                </ContentTitle>
                <div className="colorPickerContent">
                  <CirclePicker onChange={elegirColor} color={currentColor} />
                </div>
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
  background-color: rgba(9, 9, 11, 0.55);
  backdrop-filter: blur(5px);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
    animation: ${aparecer} 0.3s ease forwards;
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
        .colorContainer {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid ${({ theme }) => theme.color2};
          background: transparent;
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
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

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  svg {
    font-size: 25px;
    color: #8B5CF6;
    opacity: 0.85;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
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
