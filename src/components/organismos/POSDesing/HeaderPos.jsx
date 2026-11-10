import styled, { keyframes } from "styled-components";
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
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { abrirCaja } from "../../atomos/AbrirCajaImpresora";

const AVATAR_DEFAULT =
  "https://i.ibb.co/KjJmzQYz/persona-de-libre-dedicacion.png";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulseDot = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
  }
`;

const saludosPos = [
  "Terminal activa",
  "¡Bienvenido!",
  "Welcome!",
  "Bem-vindo!",
  "Bienvenue !",
  "Turno en línea",
];

const formatearNombre = (nombre = "") =>
  nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

export const HeaderPos = () => {
  const [stateListaProductos, setStateListaProductos] = useState(false);
  const [montoManual, setMontoManual] = useState("");
  const [nombreManual, setNombreManual] = useState("");
  const [textoSaludo, setTextoSaludo] = useState("");
  const [idxSaludo, setIdxSaludo] = useState(0);
  const [borrandoSaludo, setBorrandoSaludo] = useState(false);

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

  const nombreUsuario = formatearNombre(datausuarios?.nombres || "Usuario");
  const rolUsuario = datausuarios?.roles?.nombre || "";
  const logoUsuario =
    !datausuarios?.logo || datausuarios.logo === "-"
      ? AVATAR_DEFAULT
      : datausuarios.logo;

  useEffect(() => {
    const actual = saludosPos[idxSaludo];
    let timer;

    if (!borrandoSaludo) {
      if (textoSaludo.length < actual.length) {
        timer = setTimeout(() => {
          setTextoSaludo(actual.slice(0, textoSaludo.length + 1));
        }, 50);
      } else {
        timer = setTimeout(() => setBorrandoSaludo(true), 2200);
      }
    } else if (textoSaludo.length > 0) {
      timer = setTimeout(() => {
        setTextoSaludo(actual.slice(0, textoSaludo.length - 1));
      }, 28);
    } else {
      timer = setTimeout(() => {
        setBorrandoSaludo(false);
        setIdxSaludo((prev) => (prev + 1) % saludosPos.length);
      }, 350);
    }

    return () => clearTimeout(timer);
  }, [textoSaludo, idxSaludo, borrandoSaludo]);

  useEffect(() => {
    buscadorRef.current?.focus();
  }, []);

  useEffect(() => {
    const texto = buscador.trim();
    const codigo = dataempresa?.cantidad_codigo;
    const isCodigoDeBarras = new RegExp(`^[0-9]{${codigo},}$`).test(texto);
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
        <div className="sucursal-pill">
          <span className="live-dot" />
          <strong>Sucursal:&nbsp;</strong>
          <span>{dataCierreCaja?.caja?.sucursales?.nombre}</span>
        </div>
        <div className="sucursal-pill">
          <strong>Caja:&nbsp;</strong>
          <span>{dataCierreCaja?.caja?.descripcion}</span>
        </div>
      </ContentSucursal>

      <section className="contentprincipal">
        <Contentuser className="area1">
          <AvatarWrapper>
            <img
              className="avatar"
              src={logoUsuario}
              alt={nombreUsuario}
              onError={(e) => {
                e.currentTarget.src = AVATAR_DEFAULT;
              }}
            />
            <StatusDot title="En línea" />
          </AvatarWrapper>

          <div className="textos">
            <div className="top-row">
              <span className="saludo-animado">
                <Icon icon="lucide:sparkles" />
                <span>{textoSaludo}</span>
                <Cursor aria-hidden="true">|</Cursor>
              </span>
              {rolUsuario && <span className="rol-badge">{rolUsuario}</span>}
            </div>
            <span className="usuario" title={nombreUsuario}>
              {nombreUsuario}
            </span>
          </div>
        </Contentuser>

        <article className="contentlogo area2">
          <img src={v.logo} alt="SoftCreate POS" />
          <span>SoftCreate POS</span>
        </article>

        <article className="contentfecha area3">
          <Reloj />
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
              />
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
              autoComplete="off"
              placeholder="Buscar"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && stateListaProductos) {
                  e.preventDefault();
                  document.querySelector("[tabindex = '0'").focus();
                }
              }}
            />
            <ListaDesplegable
              funcioncrud={mutateInsertarVentas}
              funcion={selectProductos}
              setState={() => setStateListaProductos(!stateListaProductos)}
              data={resultadosBusqueda}
              state={stateListaProductos}
            />
          </InputText2>
          <Btn1
            titulo={"Abrir caja registradora"}
            funcion={async () => {
              try {
                await abrirCaja();
                toast.success("Abriendo caja registradora...");
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
              />
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
              />
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
    border-bottom: 1px solid ${({ theme }) => theme.color2};
  }
  .form__field {
    border: 1px solid ${({ theme }) => theme.color2};
    background: ${({ theme }) => theme.bgcards};
    border-radius: 10px;
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
      align-items: center;
    }
    .contentlogo {
      @media ${Device.desktop} {
        display: flex;
      }
      display: none;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      img {
        width: 64px;
        height: 40px;
        object-fit: contain;
        filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.22));
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
      gap: 14px;
      align-items: center;
      .contentCantidad {
        width: 130px;
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
      gap: 16px;
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  grid-area: area1;
  padding: 6px 14px 6px 8px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  min-width: 0;
  max-width: 100%;

  .textos {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 0;

    .top-row {
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 18px;
    }

    .saludo-animado {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11.5px;
      font-weight: 600;
      color: ${({ theme }) => theme.colorSubtitle};
      white-space: nowrap;

      svg {
        font-size: 12px;
        color: #10b981;
        flex-shrink: 0;
      }
    }

    .rol-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 1px 6px;
      border-radius: 999px;
      background: ${({ theme }) => theme.bg2};
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.color2};
      line-height: 1.3;
    }

    .usuario {
      font-weight: 800;
      font-size: 14.5px;
      letter-spacing: -0.015em;
      color: ${({ theme }) => theme.text};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 240px;
    }

    @media ${Device.laptop} {
      display: flex;
    }
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  padding: 2px;
  background: ${({ theme }) => theme.bg2};
  border: 1.5px solid ${({ theme }) => theme.color2};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
`;

const StatusDot = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2px solid ${({ theme }) => theme.bgcards};
  animation: ${pulseDot} 2.4s infinite ease-in-out;
`;

const Cursor = styled.span`
  display: inline-block;
  font-weight: 400;
  opacity: 0.7;
  margin-left: -2px;
  animation: ${blink} 0.9s step-end infinite;
`;

const ContentSucursal = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};
  font-size: 13px;
  gap: 14px;

  .sucursal-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #10b981;
    margin-right: 4px;
    animation: ${pulseDot} 2.4s infinite ease-in-out;
  }
`;

const ContentVentaManual = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
  .nombreManual {
    width: 150px;
  }
  .montoManual {
    width: 120px;
  }
  .btnAgregarManual {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background-color: #10b981;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.28);
    transition: all 0.18s ease-out;
    &:hover {
      background-color: #059669;
      transform: translateY(-1px);
    }
    &:active {
      transform: scale(0.95);
    }
  }
`;
