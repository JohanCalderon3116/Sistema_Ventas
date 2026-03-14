import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useProductosStore,
  ContainerSelector,
  Switch1,
  Selector,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useMutation } from "@tanstack/react-query";
import { Device } from "../../../styles/breakpoints";
import { useState } from "react";

export function RegistrarProductos({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
}) {
  const { insertarProductos, editarProductos } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const [stateInventarios, setStateInventarios] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: "insertar marca",
    onError: (err) => console.log("El error", err.message),
    onSuccess: () => cerrarFormulario(),
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  const cerrarFormulario = () => {
    onClose();
    setIsExploding(true);
  };
  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        _nombre: ConvertirCapitalize(data.marca),
        _id_empresa: dataempresa.id,
        _id: dataSelect.id,
      };
      await editarProductos(p);
    } else {
      const p = {
        _nombre: ConvertirCapitalize(data.marca),
        _id_empresa: dataempresa.id,
      };

      await insertarProductos(p);
    }
  }
  return (
    <Container>
      {isPending ? (
        <span>...🔼</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {accion == "Editar"
                  ? "Editar producto"
                  : "Registrar nuevo producto"}
              </h1>
            </section>

            <section>
              <span onClick={onClose}>x</span>
            </section>
          </div>
          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="section1">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    placeholder="nombre"
                    {...register("nombre", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Nombre</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="number"
                    step="0.01"
                    placeholder="precio venta"
                    {...register("precio_venta", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Precio venta</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="number"
                    step="0.01"
                    placeholder="precio compra"
                    {...register("precio_compra", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Precio compra</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    step="1"
                    placeholder="codigo de barras"
                    {...register("codigo_barras", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Codigo de barras</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    step="1"
                    placeholder="codigo interno"
                    {...register("codigo_interno", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Codigo interno</label>
                  {errors.descripcion?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
            </section>
            <section className="section2">
              <ContainerSelector>
                <label>Controlar stock:</label>
                <Switch1
                  state={stateInventarios}
                  setState={() => setStateInventarios(!stateInventarios)}
                ></Switch1>
              </ContainerSelector>
              {stateInventarios && (
                <ContainerStock>
                  <ContainerSelector>
                    <label>Sucursal</label>
                    <Selector color="#fc6027" texto1="🏬"></Selector>
                  </ContainerSelector>
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        className="form__field"
                        defaultValue={dataSelect.nombre}
                        type="number"
                        step="0.01"
                        placeholder="stock "
                        {...register("stock", {
                          required: true,
                        })}
                      />
                      <label className="form__label">Stock</label>
                      {errors.descripcion?.type === "required" && (
                        <p>Campo requerido</p>
                      )}
                    </InputText>
                  </article>
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        className="form__field"
                        defaultValue={dataSelect.nombre}
                        type="number"
                        step="0.01"
                        placeholder="stock minimo"
                        {...register("stock_minimo", {
                          required: true,
                        })}
                      />
                      <label className="form__label">Stock minimo</label>
                      {errors.descripcion?.type === "required" && (
                        <p>Campo requerido</p>
                      )}
                    </InputText>
                  </article>
                </ContainerStock>
              )}
            </section>

            <Btn1
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor={v.colorPrincipal}
            />
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
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    position: relative;
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section{
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;
const ContainerStock = styled.div`
  border: 1px solid rgba(240, 104, 46, 0.9);
  display: flex;
  border-radius: 15px;
  padding: 12px;
  flex-direction: column;
  background-color: rgba(240, 127, 46, 0.05);
`;
const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;

  svg {
    font-size: 25px;
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
  border: 2px dashed #f9d70b;
  border-radius: 5px;
  background-color: rgba(249, 215, 11, 0.1);
  padding: 8px;
  position: relative;
  gap: 3px;
  margin-bottom: 8px;

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
