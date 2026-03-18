import styled from "styled-components";
import {
  Btn1,
  InputText2,
  ListaDesplegable,
  Reloj,
  useDetalleVentasStore,
  useEmpresaStore,
  useProductosStore,
  useUsuariosStore,
  useVentasStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { Device } from "../../../styles/breakpoints";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
export const HeaderPos = () => {
  const [stateListaProductos, setStateListaProductos] = useState(false);
  const [stateTeclado, setStateTeclado] = useState(false);
  const [stateLector, setStateLector] = useState(true);
  const { setBuscador, dataProductos, selectProductos, ProductosItemSelect } =
    useProductosStore();
  const { insertarVentas, idventa, eliminarventasIncompletas } =
    useVentasStore();
  const { datausuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const { insertarDetalleVentas } = useDetalleVentasStore();
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
  async function funcion_insertarventa(itemProducto) {
    const pVentas = {
      id_usuario: datausuarios?.id,
      id_empresa: dataempresa?.id,
    };
    const pDetalleventas = {
      id_venta: idventa,
      precio_venta: ProductosItemSelect.precio_venta,
      total: 1 * ProductosItemSelect.precio_venta,
      descripcion: ProductosItemSelect.nombre,
      id_producto: ProductosItemSelect.id,
      precio_compra: ProductosItemSelect.precio_compra,
      id_sucursal: 139,
    };
    if (idventa == 0) {
      const result = await insertarVentas(pVentas);
    
        pDetalleventas.id_venta= result?.id,
        pDetalleventas.precio_venta= itemProducto.precio_venta,
        pDetalleventas.total= 1 * itemProducto.precio_venta,
        pDetalleventas.descripcion= itemProducto.nombre,
        pDetalleventas.id_producto= itemProducto.id,
        pDetalleventas.precio_compra= itemProducto.precio_compra,

      await insertarDetalleVentas(pDetalleventas);
    } else {
      await insertarDetalleVentas(pDetalleventas);
    }
  } 
  useEffect(() => {
    buscadorRef.current.focus();
    eliminarventasIncompletas({ id_usuario: datausuarios?.id });
  }, []);
  return (
    <Header>
      <section className="contentprincipal">
        <Contentuser className="area1">
          <div className="contentimg">
            <img
              src="https://i.pinimg.com/736x/b1/34/5f/b1345f9c189de15a86a491c821221085.jpg"
              alt=""
            />
          </div>
          <div className="textos">
            <span className="usuario">Johan</span>
            <span>🧑‍💻Programador</span>
          </div>
        </Contentuser>
        <article className="contentlogo area2">
          <img src={v.logo}></img>
          <span>SoftCreate POS v1.0</span>
        </article>
        <article className="contentfecha area3">
          <Reloj></Reloj>
        </article>
      </section>
      <section className="contentbuscador">
        <article className="area1">
          <InputText2>
            <input
              ref={buscadorRef}
              onChange={buscar}
              className="form__field"
              type="text"
              placeholder="Buscar"
            ></input>
            <ListaDesplegable
              funcioncrud={funcion_insertarventa}
              funcion={selectProductos}
              setState={() => setStateListaProductos(!stateListaProductos)}
              data={dataProductos}
              state={stateListaProductos}
            ></ListaDesplegable>
          </InputText2>
        </article>
        <article className="area2">
          <Btn1
            funcion={() => {
              setStateLector(true);
              setStateTeclado(false);
              setStateListaProductos(false);
              focusclick();
            }}
            bgcolor={stateLector ? "#5849fe" : ({ theme }) => theme.bgtotal}
            color={stateLector ? "#fff" : ({ theme }) => theme.text}
            border="2px"
            titulo="Lector"
            icono={
              <Icon
                icon="streamline-cyber-color:barcode-1"
                width="24"
                height="24"
              />
            }
          ></Btn1>
          <Btn1
            funcion={() => {
              setStateLector(false);
              setStateTeclado(true);
              focusclick();
            }}
            bgcolor={stateTeclado ? "#5849fe" : ({ theme }) => theme.bgtotal}
            color={stateTeclado ? "#fff" : ({ theme }) => theme.text}
            border="2px"
            titulo="Teclado"
            icono={<Icon icon="noto-v1:keyboard" width="30" height="30" />}
          ></Btn1>
        </article>
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
      display: flex;
      align-items: center;
      font-weight: 700;
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
    display: flex;
    flex-direction: column;
    .usuario {
      font-weight: 700;
    }
  }
`;
