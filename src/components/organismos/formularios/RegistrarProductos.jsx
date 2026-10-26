import styled, { keyframes, useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  useProductosStore,
  Switch1,
  useSucursalesStore,
  Checkbox1,
  Btngenerarcodigo,
  useAlmacenesStore,
  SelectList,
  BtnClose,
  useCategoriasStore,
  useMostrarStckAlmacenYProductoQueryStack,
  useInsertarProductosMutationStack,
  useMostrarAlmacenesXSucursalItemSelectQueryStack,
  EliminarStock,
} from "../../../index";
import { useForm } from "react-hook-form";
import { Device } from "../../../styles/breakpoints";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ContainerSelector } from "./RegistrarInventario";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

const aparecer = keyframes`
  from {
    opacity: 0;
    margin-top: 10px;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
`;

export function RegistrarProductos({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
  state,
}) {
  if (!state) {
    return;
  }
  const [isCheked1, setIsCheked1] = useState(true);
  const [isCheked2, setIsCheked2] = useState(false);
  const [stockMinimo, setStockMinimo] = useState("");
  const [stock, setStock] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const handleCheckboxChange = (cheboxNumber) => {
    if (cheboxNumber === 1) {
      setIsCheked1(true);
      setIsCheked2(false);
      setSevendePor("Unidad");
    } else {
      setIsCheked1(false);
      setIsCheked2(true);
      setSevendePor("Peso (Kg)");
    }
  };
  const {
    generarCodigo,
    codigogenerado,
    refetchs,
    setRandomCodeInterno,
    randomCodeInterno,
    randomCodeBarras,
    setRandomCodeBarras,
    setSevendePor,
    stateInventarios,
    setStateInventarios,
  } = useProductosStore();
  const { dataalmacen, almacenSelelctItem, setAlmacenSelelctItem } =
    useAlmacenesStore();
  const [stateEnabledStock, setstatEEnabledStock] = useState(false);
  const { datacategorias, selectCategoria, categoriaItemSelect } =
    useCategoriasStore();
  const { sucursalesItemSelect, dataSucursales, selectSucursal } =
    useSucursalesStore();
  const theme = useTheme();
  const { data: dataStockXAlamacenYProducto } =
    useMostrarStckAlmacenYProductoQueryStack({
      dataSelect,
    });
  const { data: dataAlmacenes } =
    useMostrarAlmacenesXSucursalItemSelectQueryStack();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } = useInsertarProductosMutationStack({
    accion,
    dataSelect,
    validarVacios,
    cerrarFormulario,
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  function cerrarFormulario() {
    onClose();
    setIsExploding(true);
  }
  function validarVacios(data) {
    if (!randomCodeInterno) {
      generarCodigoInterno();
    }
    if (!randomCodeBarras) {
      generarCodigoBarras();
    }
    if (data.precio_venta.trim() === "") {
      data.precio_venta = 0;
    }
    if (data.precio_compra.trim() === "") {
      data.precio_compra = 0;
    }
    if (stateInventarios) {
      if (!dataalmacen) {
        if (data.stock.trim() === "") {
          data.stock = 0;
        }
        if (data.stock_minimo.trim() === "") {
          data.stock_minimo = 0;
        }
      }
    }
  }
  function generarCodigoInterno() {
    generarCodigo();
    setRandomCodeInterno(codigogenerado);
    dataSelect.codigo_interno = codigogenerado;
  }
  function generarCodigoBarras() {
    generarCodigo();
    setRandomCodeBarras(codigogenerado);
    dataSelect.codigo_barra = codigogenerado;
  }
  const handleChangeinterno = (event) => {
    setRandomCodeInterno(event.target.value);
  };
  const handleChangebarras = (event) => {
    setRandomCodeBarras(event.target.value);
  };
  useEffect(() => {
    if (accion != "Editar") {
      setSevendePor("Unidad");
      generarCodigoInterno();
      setRandomCodeBarras("");
    } else {
      selectCategoria({
        id: dataSelect.id_categoria,
        nombre: dataSelect.categoria,
      });
      setRandomCodeInterno(dataSelect.codigo_interno);
      setRandomCodeBarras(dataSelect.codigo_barra);
      if (dataSelect.sevende_por === "Unidad") {
        handleCheckboxChange(1);
      } else {
        handleCheckboxChange(0);
      }
      dataSelect.maneja_inventarios
        ? setStateInventarios(true)
        : setStateInventarios(false);
      dataSelect.maneja_inventarios
        ? setstatEEnabledStock(true)
        : setstatEEnabledStock(false);
    }
  }, []);
  function checkUseInventarios() {
    if (accion === "Editar") {
      if (dataalmacen) {
        if (stateInventarios) {
          Swal.fire({
            title: "¿Estás seguro(a)?",
            text: "Si desactiva esta opción se elimina el stock",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#18181B",
            cancelButtonColor: "#71717A",
            confirmButtonText: "Si, eliminar",
            background: theme.bgcards || theme.bg2,
            color: theme.text,
          }).then(async (result) => {
            if (result.isConfirmed) {
              setStateInventarios(false);
              await EliminarStock({
                id: dataStockXAlamacenYProducto.id,
              });
              toast.success("Stock eliminado correctamente");
            }
          });
        } else {
          setStateInventarios(true);
        }
      } else {
        setStateInventarios(!stateInventarios);
      }
    } else {
      setStateInventarios(!stateInventarios);
    }
  }
  useEffect(() => {
    setStock("");
    setStockMinimo("");
    setUbicacion("");
  }, [almacenSelelctItem]);

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
                  ? "Editar producto"
                  : "Registrar nuevo producto"}
              </h1>
            </section>
            <section>
              <BtnClose
                funcion={() => {
                  onClose();
                  refetchs;
                }}
              ></BtnClose>
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
                    {...register("nombre", { required: true })}
                  />
                  <label className="form__label">Nombre</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.precio_venta}
                    type="number"
                    step="0.01"
                    placeholder="precio venta"
                    {...register("precio_venta", {})}
                  />
                  <label className="form__label">Precio venta</label>
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.precio_compra}
                    type="number"
                    step="0.01"
                    placeholder="precio compra"
                    {...register("precio_compra", {})}
                  />
                  <label className="form__label">Precio compra</label>
                </InputText>
              </article>
              <article className="contentPadregenerar">
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodeBarras}
                    onChange={handleChangebarras}
                    type="number"
                    placeholder="codigo de barras"
                  />
                  <label className="form__label">Codigo de barras</label>
                </InputText>
                <ContainerBtnGenerar>
                  <Btngenerarcodigo
                    titulo="Generar"
                    funcion={generarCodigoBarras}
                  ></Btngenerarcodigo>
                </ContainerBtnGenerar>
              </article>
              <article className="contentPadregenerar">
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodeInterno}
                    onChange={handleChangeinterno}
                    type="text"
                    placeholder="codigo interno"
                  />
                  <label className="form__label">Codigo interno</label>
                </InputText>
                <ContainerBtnGenerar>
                  <Btngenerarcodigo
                    titulo="Generar"
                    funcion={generarCodigoInterno}
                  ></Btngenerarcodigo>
                </ContainerBtnGenerar>
              </article>
            </section>
            <section className="section2">
              <label>Se vende por: </label>
              <ContainerSelector>
                <label>Unidad</label>
                <Checkbox1
                  isChecked={isCheked1}
                  onChange={() => handleCheckboxChange(1)}
                ></Checkbox1>
                <label>Pesado (decimales)</label>
                <Checkbox1
                  isChecked={isCheked2}
                  onChange={() => handleCheckboxChange(2)}
                ></Checkbox1>
              </ContainerSelector>
              <ContainerSelector>
                <label>Categoria</label>
                <SelectList
                  data={datacategorias}
                  itemSelect={categoriaItemSelect}
                  onSelect={selectCategoria}
                  displayField="nombre"
                ></SelectList>
              </ContainerSelector>
              <ContainerSelector>
                <label>Controlar stock:</label>
                <Switch1
                  state={stateInventarios}
                  setState={checkUseInventarios}
                ></Switch1>
              </ContainerSelector>
              {stateInventarios && (
                <ContainerStock>
                  <ContainerSelector>
                    <label>Sucursal: </label>
                    <SelectList
                      data={dataSucursales}
                      itemSelect={sucursalesItemSelect}
                      onSelect={selectSucursal}
                      displayField="nombre"
                    ></SelectList>
                  </ContainerSelector>
                  <br />
                  <ContainerSelector>
                    <label>Almacen: </label>
                    <SelectList
                      data={dataAlmacenes}
                      itemSelect={almacenSelelctItem}
                      onSelect={setAlmacenSelelctItem}
                      displayField="nombre"
                    ></SelectList>
                  </ContainerSelector>
                  {stateEnabledStock && dataStockXAlamacenYProducto && (
                    <ContainerMensajeStock>
                      Para modificar el stock existente, dirígete al módulo de Inventario.
                    </ContainerMensajeStock>
                  )}
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlamacenYProducto}
                        className="form__field"
                        value={
                          dataStockXAlamacenYProducto
                            ? (dataStockXAlamacenYProducto.stock ?? "")
                            : stock
                        }
                        type="number"
                        step="0.01"
                        placeholder="stock "
                        {...register("stock", {})}
                        onChange={(e) => setStock(e.target.value)}
                      />
                      <label className="form__label">Stock</label>
                    </InputText>
                  </article>
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlamacenYProducto}
                        className="form__field"
                        value={
                          dataStockXAlamacenYProducto
                            ? (dataStockXAlamacenYProducto.stock_minimo ?? "")
                            : stockMinimo
                        }
                        type="number"
                        step="0.01"
                        placeholder="stock minimo"
                        {...register("stock_minimo", {})}
                        onChange={(e) => setStockMinimo(e.target.value)}
                      />
                      <label className="form__label">Stock minimo</label>
                    </InputText>
                  </article>
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlamacenYProducto}
                        className="form__field"
                        value={
                          dataStockXAlamacenYProducto
                            ? (dataStockXAlamacenYProducto.ubicacion ?? "")
                            : ubicacion
                        }
                        type="text"
                        placeholder="ubicacion"
                        {...register("ubicacion", {})}
                        onChange={(e) => setUbicacion(e.target.value)}
                      />
                      <label className="form__label">Ubicación</label>
                    </InputText>
                  </article>
                </ContainerStock>
              )}
            </section>
            <Btn1
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#18181B"
              color="#FFFFFF"
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
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 16px;
    background: ${({ theme }) => theme.bgcards || theme.body};
    border: 1px solid ${({ theme }) => theme.color2};
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
    padding: 16px 36px 24px 36px;
    z-index: 100;
    overflow-x: hidden;
    animation: ${aparecer} 0.3s ease forwards;
    .headers {
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h1 {
        font-size: 22px;
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
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      .section1,
      .section2 {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .contentPadregenerar {
        position: relative;
      }
    }
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
    @media ${v.bplisa} {
      max-width: 92%;
      padding: 13px 25px 20px 25px;
    }
    @media ${v.bpmarge} {
      max-width: 95%;
      padding: 13px 18px 20px 18px;
      .headers {
        h1 {
          font-size: 20px;
        }
      }
    }
  }
`;

const ContainerStock = styled.div`
  border: 1px solid ${({ theme }) => theme.color2};
  display: flex;
  border-radius: 12px;
  padding: 14px;
  flex-direction: column;
  background-color: transparent;
  transition: 0.2s ease;
  &:hover {
    border-color: rgba(139, 92, 246, 0.32);
  }
`;

const ContainerBtnGenerar = styled.div`
  position: absolute;
  right: 0px;
  top: 10%;
`;

const ContainerMensajeStock = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colorSubtitle || "#A1A1AA"};
  background-color: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.22);
  border-radius: 10px;
  padding: 8px 12px;
  margin: 10px 0;
  font-size: 13px;
  font-weight: 500;
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
