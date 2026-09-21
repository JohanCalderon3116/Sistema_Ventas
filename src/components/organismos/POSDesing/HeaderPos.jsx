import styled from "styled-components";
import {
  Btn1,
  InputText2,
  ListaDesplegable,
  Reloj,
  useCierreCajaStore,
  useEmpresaStore,
  useInsertarVentasConDetalleVentasMutationStack,
  useMostrarProductosQueryStack,
  useProductosStore,
  useUsuariosStore,
  useVentasStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { Device } from "../../../styles/breakpoints";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { abrirCaja } from "../../atomos/AbrirCajaImpresora";

export const HeaderPos = () => {
  const [stateListaProductos, setStateListaProductos] = useState(false);
  const [montoManual, setMontoManual] = useState("");
  const [nombreManual, setNombreManual] = useState("");
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
  const { dataempresa } = useEmpresaStore();
  const buscadorRef = useRef(null);
  const montoManualRef = useRef(null);
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

  const productoManualDeEmpresa = useMemo(() => {
    return dataProductos?.find(
      (p) =>
        p.nombre?.trim().toUpperCase() === "VENTA_MANUAL" &&
        p.id_empresa === dataempresa?.id,
    );
  }, [dataProductos, dataempresa?.id]);

  const handleAgregarVentaManual = () => {
    const precio = parseFloat(montoManual);
    if (isNaN(precio) || precio <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (!productoManualDeEmpresa) {
      toast.error(
        "No existe un producto de venta manual configurado para esta empresa",
      );
      return;
    }
    const productoManual = {
      id: productoManualDeEmpresa.id,
      nombre: nombreManual.trim() || "Ítem manual",
      precio_venta: precio,
      precio_compra: 0,
    };
    selectProductos(productoManual);
    mutateInsertarVentas();
    setMontoManual("");
    setNombreManual("");
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
          <InputText2 className="inputBuscador">
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
          <Btn1
            titulo={"Abrir caja registradora"}
            funcion={async () => {
              try {
                await abrirCaja();
                toast.success("Abriendo caja registradora...")
              } catch (e) {
                console.error(e);
                alert("No se pudo abrir la caja");
              }
            }}
          />
        </article>
        <article className="area2">
          <ContentVentaManual>
            <InputText2 className="nombreManual">
              <input
                value={nombreManual}
                onChange={(e) => setNombreManual(e.target.value)}
                className="form__field"
                type="text"
                placeholder="Nombre (opcional)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    montoManualRef.current?.focus();
                  }
                }}
              ></input>
            </InputText2>
            <InputText2 className="montoManual">
              <input
                ref={montoManualRef}
                value={montoManual}
                onChange={(e) => setMontoManual(e.target.value)}
                className="form__field"
                type="number"
                min="0"
                placeholder="Precio libre"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAgregarVentaManual();
                  }
                }}
              ></input>
            </InputText2>
            <button
              type="button"
              className="btnAgregarManual"
              onClick={handleAgregarVentaManual}
            >
              +
            </button>
          </ContentVentaManual>
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
      gap: 20px;
      align-items: center;
      .contentCantidad {
        width: 150px;
        flex-shrink: 0;
      }
      .inputBuscador {
        flex: 1;
        min-width: 150px;
      }
    }
    .area2 {
      grid-area: area2;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    @media ${Device.desktop} {
      display: flex;
      gap: 20px;
      .area1 {
        flex: 1 1 40%;
        min-width: 0;
      }
      .area2 {
        flex: 0 0 auto;
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

const ContentVentaManual = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  flex-shrink: 0;

  .nombreManual {
    width: 150px;
  }

  .montoManual {
    width: 120px;
  }

  .btnAgregarManual {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    border: none;
    background-color: #0aca21;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;
