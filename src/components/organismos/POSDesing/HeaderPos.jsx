import styled from "styled-components";
import {
  InputText2,
  ListaDesplegable,
  Reloj,
  useCierreCajaStore,
  useInsertarVentasConDetalleVentasMutationStack,
  useMostrarProductosQueryStack,
  useProductosStore,
  useUsuariosStore,
  useVentasStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { Device } from "../../../styles/breakpoints";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
export const HeaderPos = () => {
  const [stateListaProductos, setStateListaProductos] = useState(false);
  const {
    setBuscador,
    dataProductos,
    selectProductos,
    buscador,
    resultadosBusqueda,
  } = useProductosStore();
  const { catidadInput, setCantidadInput } = useVentasStore();
  const { dataCierreCaja } = useCierreCajaStore();
  const { datausuarios } = useUsuariosStore();
  const buscadorRef = useRef(null);
  useMostrarProductosQueryStack();
  function buscar(e) {
    setBuscador(e.target.value);
  }
  const { mutate: mutateInsertarVentas } =
    useInsertarVentasConDetalleVentasMutationStack(buscadorRef);
  const ValidarCantidad = (e) => {
    const value = Math.max(0, parseFloat(e.target.value));
    setCantidadInput(value);
  };

  useEffect(() => {
    buscadorRef.current.focus();
  }, []);
  useEffect(() => {
    const texto = buscador.trim();
    const isCodigoDeBarras = /^[0-9]{3,}$/.test(texto);
    const timeout = setTimeout(
      () => {
        if (isCodigoDeBarras) {
          setStateListaProductos(false);
          const productoEncontrado = dataProductos?.find(
            (p) => String(p.codigo_barra).trim() === texto,
          );
          if (productoEncontrado) {
            selectProductos(productoEncontrado);
            mutateInsertarVentas();
            setBuscador("");
          } else {
            toast.error("Producto no encontrado");
            setBuscador("");
          }
        } else {
          setStateListaProductos(texto.length > 0);
        }
      },
      texto.length > 0 && isCodigoDeBarras ? 100 : 200,
    );

    return () => clearTimeout(timeout);
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
              id="input-buscador-pos"
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
              data={resultadosBusqueda}
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
