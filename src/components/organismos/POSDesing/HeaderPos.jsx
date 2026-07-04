import styled from "styled-components";
import {
  Btn1,
  InputText2,
  ListaDesplegable,
  Reloj,
  SelectList,
  useAlmacenesStore,
  useCierreCajaStore,
  useDetalleVentasStore,
  useEmpresaStore,
  useFormattedDate,
  useProductosStore,
  useStockStore,
  useSucursalesStore,
  useUsuariosStore,
  useVentasStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEliminarVentasIncompletasMutateStack } from "../../../tanstack/VentasStack";
export const HeaderPos = () => {
  const queryClien = useQueryClient();
  const [stateListaProductos, setStateListaProductos] = useState(false);
  const [stateTeclado, setStateTeclado] = useState(false);
  const [stateLector, setStateLector] = useState(true);
  const [catidadInput, setCantidadInput] = useState(1);
  const { setBuscador, dataProductos, selectProductos, buscador } =
    useProductosStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalesStore();
  const { idventa, insertarVentas } = useVentasStore();
  const { dataempresa } = useEmpresaStore();
  const fechaActual = useFormattedDate();
  const { dataCierreCaja } = useCierreCajaStore();
  const { almacenSelelctItem, dataAlmacenesXSucursa, setAlmacenSelelctItem } =
    useAlmacenesStore();
  const { insertarDetalleVentas } = useDetalleVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { dataStockXAlmacenesYProducto, setStateModal } = useStockStore();
  const buscadorRef = useRef(null);
  function focusclick() {
    buscadorRef.current.focus();
    if (buscadorRef.current.value.trim() === "") {
      setStateListaProductos(false);
    } else {
      setStateListaProductos(true);
    }
  }
  function buscar(e) {
    setBuscador(e.target.value);
    let texto = e.target.value;
    if (texto.trim() === "" || stateLector) {
      setStateListaProductos(false);
    } else {
      setStateListaProductos(true);
    }
  }
  async function insertarventa() {
    if (idventa === 0) {
      const pventas = {
        fecha: fechaActual,
        id_usuario: datausuarios?.id,
        id_sucursal: dataCierreCaja?.caja?.id_sucursal,
        id_empresa: dataempresa?.id,
        id_cierre_caja: dataCierreCaja?.id,
      };
      const result = await insertarVentas(pventas);
      if (result?.id > 0) {
        await insertarDVentas(result?.id);
      }
    } else {
      await insertarDVentas(idventa);
    }
    setBuscador("");
    buscadorRef.current.focus();
    setCantidadInput(1);
  }
  async function insertarDVentas(p) {
    const ProductosItemSelect =
      useProductosStore.getState().ProductosItemSelect;
    const pDetalleventas = {
      _id_venta: p,
      _cantidad: parseFloat(catidadInput) || 1,
      _precio_venta: ProductosItemSelect.precio_venta,
      _descripcion: ProductosItemSelect.nombre,
      _id_producto: ProductosItemSelect.id,
      _precio_compra: ProductosItemSelect.precio_compra,
      _id_sucursal: dataCierreCaja?.caja?.id_sucursal,
      _id_almacen: almacenSelelctItem?.id,
    };
    await insertarDetalleVentas(pDetalleventas);
  }

  const { mutate: mutateInsertarVentas } = useMutation({
    mutationKey: ["insertar ventas"],
    mutationFn: insertarventa,
    onError: (error) => {
      toast.error(`Error al insertar la venta ${error.message}`);
      queryClien.invalidateQueries(["mostrar Stock Almacenes y Producto"]);
      if (dataStockXAlmacenesYProducto) {
        setStateModal(true);
      }
    },
    onSuccess: () => {
      queryClien.invalidateQueries(["mostrar detalle venta"]);
    },
  });
  //validar cantidad
  const ValidarCantidad = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setCantidadInput(value);
  };
  const { mutate, isPending } = useEliminarVentasIncompletasMutateStack();
  useEffect(() => {
    buscadorRef.current.focus();
    mutate();
  }, []);
  useEffect(() => {
    let timeout;
    const texto = buscador.trim();
    const isCodigoDeBarras = /^[0-9]{3,}$/.test(texto);
    if (isCodigoDeBarras) {
      setStateListaProductos(false);
      timeout = setTimeout(() => {
        const productoEncontrado = dataProductos?.find(
          (p) => p.codigo_barra === texto,
        );
        if (productoEncontrado) {
          selectProductos(productoEncontrado);
          mutateInsertarVentas();
          setBuscador("");
        } else {
          toast.error("Producto no encontrado");
          setBuscador("");
        }
      }, 100);
    } else {
      if (texto.length > 0) {
        timeout = setTimeout(() => {
          setStateListaProductos(true);
        }, 200);
      } else {
        setStateListaProductos(false);
      }
    }
  }, [buscador]);
  return (
    <Header>
      <ContentSucursal>
        <div>
          <strong>Sucursal:&nbsp;</strong>
          {dataCierreCaja?.caja?.sucursales?.nombre}
        </div>
        <div>
          <strong>Caja:&nbsp;</strong>
          {dataCierreCaja?.caja?.descripcion}
        </div>
      </ContentSucursal>
      <section className="contentprincipal">
        <Contentuser className="area1">
          <div className="textos">
            <span className="usuario"> {datausuarios?.nombres} </span>
            <span> {datausuarios?.roles.nombre} </span>
          </div>
        </Contentuser>
        <article className="contentlogo area2">
          <img src={v.logo}></img>
          <span>SoftCreate POS</span>
        </article>
        <article className="contentfecha area3">
          <Reloj></Reloj>
        </article>
      </section>
      <section className="contentbuscador">
        <article className="area1">
          <div className="contentCantidad">
            <InputText2>
              <input
                value={catidadInput}
                onChange={ValidarCantidad}
                className="form__field"
                type="number"
                min="1"
                placeholder="Cantidad..."
              ></input>
            </InputText2>
          </div>
          <InputText2>
            <input
              value={buscador}
              ref={buscadorRef}
              onChange={buscar}
              className="form__field"
              type="search"
              placeholder="Buscar"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && stateListaProductos) {
                  e.preventDefault();
                  document.querySelector("[tabindex = '0'").focus();
                }
              }}
            ></input>
            <ListaDesplegable
              funcioncrud={mutateInsertarVentas}
              funcion={selectProductos}
              setState={() => setStateListaProductos(!stateListaProductos)}
              data={dataProductos}
              state={stateListaProductos}
            ></ListaDesplegable>
          </InputText2>
        </article>
        <article className="area2"></article>
      </section>
    </Header>
  );
};

const Header = styled.div`
  grid-area: header;
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 10px;
  @media ${Device.desktop} {
    border-bottom: 2px solid ${({ theme }) => theme.color2};
  }
  .contentprincipal {
    width: 100%;
    display: grid;
    grid-template:
      "area1 area2"
      "area3 area3";
    .area1 {
      grid-area: area1;
    }
    .area2 {
      grid-area: area2;
    }
    .area3 {
      grid-area: area3;
    }
    @media ${Device.desktop} {
      display: flex;
      justify-content: space-between;
    }
    .contentlogo {
      @media ${Device.desktop} {
        display: flex;
      }
      display: none;
      align-items: center;
      font-weight: 700;
      img {
        width: 30px;
        object-fit: contain;
      }
    }
    .contentlogo1 {
      display: flex;
      align-items: center;
      font-weight: 700;
      gap: 5px;
      img {
        width: 30px;
        object-fit: contain;
      }
    }
  }
  .contentbuscador {
    display: grid;
    grid-template:
      "area2 area2"
      "area1 area1";
    gap: 10px;
    height: 100%;
    align-items: center;
    position: relative;
    .area1 {
      grid-area: area1;
      display: flex;
      gap: 30px;
      .contentCantidad {
        width: 150px;
      }
    }
    .area2 {
      grid-area: area2;
      display: flex;
      gap: 10px;
    }
    @media ${Device.desktop} {
      display: flex;
      gap: 10px;
      .area1 {
        width: 40vw;
      }
    }
  }
`;
const Contentuser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  grid-area: area1;
  .contentimg {
    display: flex;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .textos {
    display: none;
    flex-direction: column;
    .usuario {
      font-weight: 700;
    }
    @media ${Device.laptop} {
      display: flex;
      flex-direction: column;
    }
  }
`;
const ContentSucursal = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  height: 45px;
  border-bottom: 2px solid ${({ theme }) => theme.color2};
  gap: 8px;
`;
