import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useCajasStore,
  useEmpresaStore,
  useProductosStore,
  SelectList,
  useSucursalesStore,
  useAlmacenesStore,
  useFormattedDate,
  useStockStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useMovStockStore } from "../../../store/MovStockStore";
import { BuscadorList } from "../../ui/lists/Buscador";
import { BarLoader } from "react-spinners";
import { RadioChecks } from "../../ui/toogles/RadioChecks";
export function RegistrarInventario({ onClose }) {
  const queryClient = useQueryClient();
  const fechaactual = useFormattedDate();
  const {
    accion: accionCaja,
    cajaSelelctItem,
    setStateCaja,
    insertarCaja,
    editarCaja,
  } = useCajasStore();
  const { dataempresa } = useEmpresaStore();
  const { insertarMovStock, tipo, setTipo } = useMovStockStore();
  const {
    buscador,
    buscarProductos,
    selectProductos,
    setBuscador,
    ProductosItemSelect,
  } = useProductosStore();
  const { mostrarSucursales, selectSucursal, sucursalesItemSelect } =
    useSucursalesStore();
  const {
    mostrarAlmacenesXSucursal,
    almacenSelelctItem,
    setAlmacenSelelctItem,
  } = useAlmacenesStore();
  const { mostrarStockAlmacenYProduct, editarStock } = useStockStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { data: dataProductos, error: errorBuscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({
        id_empresa: dataempresa?.id,
        buscador: buscador,
      }),
    enabled: !!dataempresa,
  });
  const {
    data: dataSucursales,
    isLoading: isLoadingSucursales,
    error: errorMostrarSucursales,
  } = useQuery({
    queryKey: ["mostrar sucursales", { id_empresa: dataempresa?.id }],
    queryFn: () =>
      mostrarSucursales({
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });
  const {
    data: dataAlmacenes,
    isLoading: isLoadingAlmacenes,
    error: errormostraralmacenesxsucursales,
  } = useQuery({
    queryKey: [
      "mostrar almacenes x sucursales",
      { id_sucursal: sucursalesItemSelect.id },
    ],
    queryFn: () =>
      mostrarAlmacenesXSucursal({
        id_sucursal: sucursalesItemSelect.id,
      }),
    enabled: !!dataSucursales,
  });
  const {
    data: dataStock,
    isLoading: isLoadingStock,
    error: errorMostrarStock,
  } = useQuery({
    queryKey: [
      "mostrar stock",
      {
        id_almacen: almacenSelelctItem?.id,
        id_producto: ProductosItemSelect?.id,
      },
    ],
    queryFn: () =>
      mostrarStockAlmacenYProduct({
        id_almacen: almacenSelelctItem?.id,
        id_producto: ProductosItemSelect?.id,
      }),
    enabled: !!dataSucursales,
  });
  const insertar = async (data) => {
    const pMovimientosStock = {
      id_almacen: almacenSelelctItem?.id,
      id_producto: ProductosItemSelect?.id,
      tipo_movimiento: tipo,
      cantidad: parseFloat(data.cantidad),
      fecha: fechaactual,
      detalle: data.detalle ? data.detalle : "Registro de inventario manual",
      origen: "inventario",
    };
    const pStock = {
      _id: dataStock?.id,
      cantidad: parseFloat(data.cantidad),
    };
    await insertarMovStock(pMovimientosStock);
    await editarStock(pStock, tipo);
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar movimiento stock"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Registro guardado correctamente...");
      queryClient.invalidateQueries(["buscar productos"]);
      resetFuction();
    },
  });

  const handlesub = (data) => {
    doInsertar(data);
  };
  const resetFuction = () => {
    reset();
    setTipo("ingreso");
  };
  const isLoading = isLoadingSucursales || isLoadingAlmacenes;
  const error =
    errorBuscar ||
    errorMostrarStock ||
    errorMostrarSucursales ||
    errormostraralmacenesxsucursales;
  if (isLoading) {
    return <BarLoader color="#6d6d6d"></BarLoader>;
  }
  if (error) {
    toast.error(`error: ${error.message}`);
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {isPending ? (
        <span>Guardando...</span>
      ) : (
        <div className="sub-contenedor">
          <RadioChecks></RadioChecks>
          <div className="headers">
            <section>
              <h1>
                {tipo == "ingreso" ? "Registrar entrada" : "Registrar salida"}
              </h1>
            </section>

            <section>
              <BtnClose funcion={onClose} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <BuscadorList
                data={dataProductos}
                onSelect={selectProductos}
                setBuscador={setBuscador}
              ></BuscadorList>
              <span>
                Producto:{" "}
                <strong>
                  {" "}
                  {ProductosItemSelect?.nombre
                    ? ProductosItemSelect?.nombre
                    : "-"}{" "}
                </strong>
              </span>
              <span>
                Stock:{" "}
                <strong> {dataStock?.stock ? dataStock?.stock : "-"} </strong>
              </span>
              <ContainerSelector>
                <label>Sucursal: </label>
                <SelectList
                  data={dataSucursales}
                  itemSelect={sucursalesItemSelect}
                  onSelect={selectSucursal}
                  displayField="nombre"
                ></SelectList>
              </ContainerSelector>
              <ContainerSelector>
                <label>Almacen: </label>
                <SelectList
                  data={dataAlmacenes}
                  itemSelect={almacenSelelctItem}
                  onSelect={setAlmacenSelelctItem}
                  displayField="nombre"
                ></SelectList>
              </ContainerSelector>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="number"
                    placeholder="cantidad"
                    {...register("cantidad", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Cantidad...</label>
                  {errors.cantidad?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="numeric"
                    placeholder="detalle"
                    {...register("detalle")}
                  />
                  <label className="form__label">Detalle...</label>
                </InputText>
              </article>
              <Btn1
                disabled={!ProductosItemSelect?.nombre}
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

export const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;
