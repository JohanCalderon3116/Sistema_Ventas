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
  useSucursalesStore,
  ListaDesplegable,
  useCategroriasStore,
  Checkbox1,
  Btngenerarcodigo,
  useAlmacenesStore,
  ConvertirMinusculas,
  SelectList,
  BtnClose,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Device } from "../../../styles/breakpoints";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useStockStore } from "../../../store/StockStore";
import { toast } from "sonner";

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
  const [sevendePor, setSevendePor] = useState("Unidad");
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
    insertarProductos,
    editarProductos,
    generarCodigo,
    codigogenerado,
    refetchs,
  } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const {
    mostrarAlmacen,
    dataalmacen,
    eliminarAlmacen,
    mostrarAlmacenesXSucursal,
    almacenSelelctItem,
    setAlmacenSelelctItem,
  } = useAlmacenesStore();
  const [stateInventarios, setStateInventarios] = useState(false);
  const [stateEnabledStock, setstatEEnabledStock] = useState(false);
  const { datacategorias, selectCategoria, categoriaItemSelect } =
    useCategroriasStore();
  const { sucursalesItemSelect, dataSucursales, selectSucursal } =
    useSucursalesStore();
  const [stateSucursalesLista, setStateSucursalesLista] = useState(false);
  const [stateCategoriasLista, setStateCategoriasLista] = useState(false);
  const { insertarStock, mostrarStockAlmacenYProduct } = useStockStore();
  const {
    data: dataStockXAlamacenYProducto,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "mostrar stock almacen y producto",
      { id_producto: dataSelect.id, id_almacen: almacenSelelctItem?.id },
    ],
    queryFn: () =>
      mostrarStockAlmacenYProduct({
        id_almacen: almacenSelelctItem?.id,
        id_producto: dataSelect?.id,
      }),
  });
  const {
    data: dataAlmacenes,
    isLoading: isLoadingAlmacenes,
    error: errorAlmacenes,
  } = useQuery({
    queryKey: [
      "mostrar almacenes x sucursal",
      { id_producto: dataSelect.id, id_sucursal: sucursalesItemSelect.id },
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect.id,
      }),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: "insertar productos",
    onError: (err) =>
      toast.error(`Error al insertar producto... ${err.message}`),
    onSuccess: () => {
      toast.success("Producto guardado correctamnete");
      cerrarFormulario();
    },
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  const cerrarFormulario = () => {
    onClose();
    setIsExploding(true);
  };
  async function insertar(data) {
    validarVacios(data);
    if (accion === "Editar") {
      const p = {
        _id: dataSelect.id,
        _nombre: ConvertirMinusculas(data.nombre),
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barra: randomCodeBarras ? randomCodeBarras : codigogenerado,
        _codigo_interno: randomCodeInterno ? randomCodeInterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendePor,
        _maneja_inventarios: stateInventarios,
      };
      await editarProductos(p);
      if (stateInventarios) {
        if (!dataStockXAlamacenYProducto) {
          const pstock = {
            id_almacen: almacenSelelctItem.id,
            id_producto: dataSelect.id,
            stock: parseFloat(data.stock),
            stock_minimo: parseFloat(data.stock_minimo),
            ubicacion: data.ubicacion,
          };
          await insertarStock(pstock);
        }
      }
    } else {
      const p = {
        _nombre: ConvertirMinusculas(data.nombre),
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barra: randomCodeBarras ? randomCodeBarras : codigogenerado,
        _codigo_interno: randomCodeInterno ? randomCodeInterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendePor,
        _maneja_inventarios: stateInventarios,
        _maneja_multiprecios: false,
      };
      const id_producto_nuevo = await insertarProductos(p);
      if (stateInventarios) {
        const pstock = {
          id_almacen: almacenSelelctItem.id,
          id_producto: id_producto_nuevo,
          stock: parseFloat(data.stock),
          stock_minimo: parseFloat(data.stock_minimo),
          ubicacion: data.ubicacion,
        };
        await insertarStock(pstock);
      }
    }
  }
  //#region validar vacios
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
  //#endregion
  //#region generarcodigo
  const [randomCodeInterno, setRandomCodeInterno] = useState("");
  const [randomCodeBarras, setRandomCodeBarras] = useState("");
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
  //#endregion
  //#region validar accion
  useEffect(() => {
    if (accion != "Editar") {
      generarCodigoInterno();
    } else {
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
  //#endregion
  //#region validar check
  function checkUseInventarios() {
    if (accion === "Editar") {
      if (dataalmacen) {
        if (stateInventarios) {
          Swal.fire({
            title: "¿Estás seguro(a)?",
            text: "Si desactiva esta opción se elimina el stock",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              setStateInventarios(false);
              await eliminarAlmacen({ id: dataalmacen.id });
              await edi;
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
  //#endregion
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
              <BtnClose
                funcion={() => {
                  onClose();
                  refetchs();
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
                    {...register("nombre", {
                      required: true,
                    })}
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
                    type="text"
                    placeholder="codigo de barras"
                    // {...register("codigo_barra", {})}
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
                    // {...register("codigo_interno", {})}
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
                <Selector
                  state={stateCategoriasLista}
                  funcion={() => setStateCategoriasLista(!stateCategoriasLista)}
                  color="#fc6027"
                  texto1="🏬"
                  texto2={categoriaItemSelect?.nombre}
                ></Selector>
                <ListaDesplegable
                  funcion={selectCategoria}
                  state={stateCategoriasLista}
                  data={datacategorias}
                  top="4rem"
                  setState={() =>
                    setStateCategoriasLista(!stateCategoriasLista)
                  }
                ></ListaDesplegable>
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
                      💀 Para poder editar el stock, te toca en el modulo
                      'Inventario' 💀 XD
                    </ContainerMensajeStock>
                  )}
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={!!dataStockXAlamacenYProducto}
                        className="form__field"
                        value={
                          accion === "Editar"
                            ? dataStockXAlamacenYProducto?.stock
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
                          accion === "Editar"
                            ? dataStockXAlamacenYProducto?.stock_minimo
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
                          accion === "Editar"
                            ? dataStockXAlamacenYProducto?.ubicacion
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
  backdrop-filter: blur(5px);

  .sub-contenedor {
    position: relative;
    max-width: 90%;
    max-height: 90vh; /* 👈 limite de altura */
    overflow-y: auto;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    border-radius: 8px;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 25px;
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
const ContainerBtnGenerar = styled.div`
  position: absolute;
  right: 0px;
  top: 10%;
`;
const ContainerMensajeStock = styled.div`
  text-align: center;
  color: #f9184c;
  background-color: rgba(249, 24, 35, 0.2);
  border-radius: 10px;
  padding: 5px;
  margin: 10px;
`;
