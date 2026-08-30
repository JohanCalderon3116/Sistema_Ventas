import styled, { useTheme } from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  useProductosStore,
  SelectList,
  useSucursalesStore,
  useAlmacenesStore,
  useBuscarProductosQueryStack,
  useMostrarSucursalesXEmpresaStack,
  useMostrarAlmacenesXSucursalItemSelectQueryStack,
  useMostrarStockQueryStack,
  useInsertarMovStcoMutationStack,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { Toaster } from "sonner";
import { useMovStockStore } from "../../../store/MovStockStore";
import { BuscadorList } from "../../ui/lists/Buscador";
import { BeatLoader } from "react-spinners";
import { RadioChecks } from "../../ui/toogles/RadioChecks";
export function RegistrarInventario({ onClose }) {
  const theme = useTheme();
  const { tipo, setTipo } = useMovStockStore();
  const {
    selectProductos,
    setBuscador,
    ProductosItemSelect,
  } = useProductosStore();
  const { selectSucursal, sucursalesItemSelect } =
    useSucursalesStore();
  const {
    almacenSelelctItem,
    setAlmacenSelelctItem,
  } = useAlmacenesStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { data: dataProductos } =
    useBuscarProductosQueryStack();
  const {
    data: dataSucursales,
    isLoading: isLoadingSucursales,
  } = useMostrarSucursalesXEmpresaStack();
  const {
    data: dataAlmacenes,
    isLoading: isLoadingAlmacenes,
  } = useMostrarAlmacenesXSucursalItemSelectQueryStack();
  const {
    data: dataStock,
  } = useMostrarStockQueryStack();
  const { isPending, mutate: doInsertar } = useInsertarMovStcoMutationStack({
    onClose,
    resetFuction,
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  function resetFuction() {
    reset();
    setTipo("ingreso");
  }
  const isLoading = isLoadingSucursales || isLoadingAlmacenes;
  if (isLoading) {
    return (
      <ConteinerLoader>
        <span>
          <strong>Cargando</strong>
        </span>
        <BeatLoader color={theme.text} size={8} />
      </ConteinerLoader>
    );
  }
  return (
    <Container>
      <Toaster richColors></Toaster>
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
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
                  <label className="form__label">
                    Detalle (Puede ir en blanco).
                  </label>
                </InputText>
              </article>
              <Btn1
                disabled={!ProductosItemSelect?.nombre}
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#3300E3"
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
const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
