import styled, { keyframes, useTheme } from "styled-components";
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
const aparecer = keyframes`
  from { opacity: 0; margin-top: 14px; }
  to { opacity: 1; margin-top: 0; }
`;

export function RegistrarInventario({ onClose }) {
  const theme = useTheme();
  const { tipo, setTipo } = useMovStockStore();
  const { selectProductos, setBuscador, ProductosItemSelect } =
    useProductosStore();
  const { selectSucursal, sucursalesItemSelect } = useSucursalesStore();
  const { almacenSelelctItem, setAlmacenSelelctItem } = useAlmacenesStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { data: dataProductos } = useBuscarProductosQueryStack();
  const { data: dataSucursales, isLoading: isLoadingSucursales } =
    useMostrarSucursalesXEmpresaStack();
  const { data: dataAlmacenes, isLoading: isLoadingAlmacenes } =
    useMostrarAlmacenesXSucursalItemSelectQueryStack();
  const { data: dataStock } = useMostrarStockQueryStack();
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
        <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
      </ConteinerLoader>
    );
  }
  
  return (
    <Container>
      <Toaster richColors />
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.color1 || "#8B5CF6"} size={8} />
        </ConteinerLoader>
      ) : (
        <SubContenedor>
          <RadioChecks />
          <div className="headers">
            <section>
              <h1>
                {tipo === "ingreso" ? "Registrar entrada" : "Registrar salida"}
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
              />
              <InfoRow>
                <span>Producto</span>
                <strong>{ProductosItemSelect?.nombre || "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>Stock actual</span>
                <strong className="stock">
                  {dataStock?.stock ? dataStock.stock : "-"}
                </strong>
              </InfoRow>
              <ContainerSelector>
                <label>Sucursal</label>
                <SelectList
                  data={dataSucursales}
                  itemSelect={sucursalesItemSelect}
                  onSelect={selectSucursal}
                  displayField="nombre"
                />
              </ContainerSelector>
              <ContainerSelector>
                <label>Almacen</label>
                <SelectList
                  data={dataAlmacenes}
                  itemSelect={almacenSelelctItem}
                  onSelect={setAlmacenSelelctItem}
                  displayField="nombre"
                />
              </ContainerSelector>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="number"
                    placeholder="cantidad"
                    {...register("cantidad", { required: true })}
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
                    type="text"
                    placeholder="detalle"
                    {...register("detalle")}
                  />
                  <label className="form__label">
                    Detalle (Puede ir en blanco).
                  </label>
                </InputText>
              </article>
              <div className="button-container">
                <Btn1
                  disabled={!ProductosItemSelect?.nombre}
                  icono={<v.iconoguardar />}
                  titulo="Guardar"
                  bgcolor="#18181B"
                  color="#ffffff"
                />
              </div>
            </section>
          </form>
        </SubContenedor>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(9, 9, 11, 0.55);
  backdrop-filter: blur(6px);
  @media (max-width: 600px) {
    padding: 12px;
  }
`;

const SubContenedor = styled.div`
  position: relative;
  width: 500px;
  max-width: 94vw;
  max-height: 88vh;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 18px 28px 24px;
  background: ${({ theme }) => theme.bgcards || theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
  animation: ${aparecer} 0.3s ease forwards;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colorScroll || "#3F3F46"};
    border-radius: 10px;
  }
  .headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding-top: 20px;
    margin-bottom: 18px;
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.15;
    }
  }
  .formulario {
    .form-subcontainer {
      display: flex;
      flex-direction: column;
      gap: 16px;
      .form__field:focus {
        border-color: rgba(139, 92, 246, 0.45);
      }
    }
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
  }
  @media (max-width: 600px) {
    padding: 16px;
    max-height: 92vh;
    .headers {
      h1 {
        font-size: 20px;
      }
    }
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 10px 12px;
  border-radius: 9px;
  background: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.color2};
  span {
    font-size: 13px;
    opacity: 0.65;
  }
  strong {
    font-size: 14px;
    font-weight: 700;
    text-align: right;
  }
  .stock {
    color: #10B981;
  }
`;

export const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
  label {
    min-width: 70px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.65;
  }
  > *:last-child {
    flex: 1;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    label {
      min-width: auto;
    }
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 250px;
  width: 100%;
  color: ${({ theme }) => theme.text};
  strong {
    opacity: 0.7;
    font-size: 14px;
  }
`;
