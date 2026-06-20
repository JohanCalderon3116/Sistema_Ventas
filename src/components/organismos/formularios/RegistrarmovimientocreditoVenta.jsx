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
  useVentasStore,
  useDetalleVentasStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { BtnClose } from "../../ui/buttons/BtnClose";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useMovStockStore } from "../../../store/MovStockStore";
import { BuscadorList } from "../../ui/lists/Buscador";
import { BarLoader } from "react-spinners";
import { RadioChecks } from "../../ui/toogles/RadioChecks";
import { useCreditosStore } from "../../../store/CreditosStore";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";
import { useMovimientosCreditosStore } from "../../../store/MovimientosCreditosStore";
export function RegistrarmovimientocreditoVenta({ onClose }) {
  const queryClient = useQueryClient();
  const fechaactual = useFormattedDate();
  const { dataempresa } = useEmpresaStore();
  const { insertarMovStock, tipo, setTipo } = useMovStockStore();
  const {
    creditosItemSelect,
    setCreditosItemSelect,
    mostrarCreditos,
    setBuscador: setBuscadorCategorias,
    buscarCreditos,
    buscador: buscadorCreditos,
    datacreditos,
  } = useCreditosStore();
  const {} = useCreditosStore();
  const fecha = useFormattedDate();
  const { insertarMovimientosCreditos } = useMovimientosCreditosStore();
  const {
    buscador,
    buscarProductos,
    selectProductos,
    setBuscador,
    ProductosItemSelect,
  } = useProductosStore();
  const { idventa } = useVentasStore();
  const { total } = useDetalleVentasStore();
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
  const { data: dataCreditos, error } = useQuery({
    queryKey: [
      "mostrar creditos",
      {
        id_empresa: dataempresa?.id,
      },
    ],
    queryFn: () =>
      mostrarCreditos({
        id_empresa: dataempresa?.id,
      }),
  });
  useQuery({
    queryKey: ["buscar creditos", buscadorCreditos],
    queryFn: () =>
      buscarCreditos({
        id_empresa: dataempresa?.id,
        nombres: buscadorCreditos,
      }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });

  const insertar = async (data) => {
    const p = {
      id_credito: creditosItemSelect?.id,
      id_venta: idventa,
      tipo_movimiento: "venta",
      valor: total,
      observacion: data.observacion,
      fecha_movimiento: fecha,
    };
    await insertarMovimientosCreditos(p);
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["insertar movimiento creditos"],
    mutationFn: insertar,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Registro guardado correctamente...");
      resetFuction();
      onClose();
    },
  });

  const handlesub = (data) => {
    doInsertar(data);
  };
  const resetFuction = () => {
    reset();
  };
  if (error) {
    toast.error(`error: ${error.message}`);
  }
  return (
    <Container>
      {isPending ? (
        <span>Guardando...</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>Registrar fiado</h1>
            </section>

            <section>
              <BtnClose funcion={onClose} />
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="form-subcontainer">
              <BuscadorList
                data={datacreditos}
                onSelect={setCreditosItemSelect}
                itemSelect={creditosItemSelect}
                setBuscador={setBuscadorCategorias}
                displayField="nombres"
              ></BuscadorList>
              <span>
                Nombre:{" "}
                <strong>
                  {" "}
                  {creditosItemSelect?.nombres
                    ? creditosItemSelect?.nombres
                    : "-"}{" "}
                </strong>
              </span>
              <span>
                Credito máximo aprobado:{" "}
                <strong>
                  {" "}
                  {creditosItemSelect?.cupo_maximo
                    ? FormatearNumeroDinero(
                        creditosItemSelect?.cupo_maximo,
                        "COP",
                        "CO",
                      )
                    : "-"}{" "}
                </strong>
              </span>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    type="text"
                    placeholder="Observacion"
                    {...register("observacion", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Observacion</label>
                  {errors.cantidad?.type === "required" && (
                    <p>Campo requerido</p>
                  )}
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
