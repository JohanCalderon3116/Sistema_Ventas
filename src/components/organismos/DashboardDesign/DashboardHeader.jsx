import styled, { keyframes, css } from "styled-components";
import { Device } from "../../../styles/breakpoints";
import { DateRangeFilter } from "./DateRangeFilter";
import { Icon } from "@iconify/react";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { UserAvatarBadge } from "../../../pages/Perfil";

const entrar = keyframes`
  from {
    opacity: 0;
    filter: blur(4px);
    transform: translate(var(--dx), var(--dy)) scale(0.85);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translate(0, 0) scale(1);
  }
`;

const salir = keyframes`
  from {
    opacity: 1;
    filter: blur(0);
    transform: translate(0, 0) scale(1);
  }
  to {
    opacity: 0;
    filter: blur(4px);
    transform: translate(var(--dx), var(--dy)) scale(0.85);
  }
`;

const saludos = [
  "¡Bienvenido",
  "Welcome",
  "Bienvenue",
  "Benvenuto",
  "Bem-vindo",
  "Willkommen",
  "Welkom",
  "ようこそ",
  "환영합니다",
  "欢迎",
];

const LAYOUTS = [
  [
    [1, 1, 4, 3],
    [5, 1, 4, 2],
    [5, 3, 2, 1],
    [7, 3, 2, 1],
  ],
  [
    [1, 3, 2, 1],
    [3, 2, 2, 2],
    [5, 1, 2, 3],
    [7, 1, 2, 3],
  ],
  [
    [1, 1, 2, 3],
    [3, 1, 2, 3],
    [5, 1, 2, 2],
    [7, 1, 2, 1],
  ],
  [
    [3, 1, 4, 1],
    [2, 2, 6, 1],
    [1, 3, 4, 1],
    [5, 3, 4, 1],
  ],
  [
    [1, 1, 8, 1],
    [3, 2, 2, 2],
    [5, 2, 2, 1],
    [5, 3, 2, 1],
  ],
  [
    [1, 1, 3, 3],
    [4, 3, 3, 1],
    [7, 3, 2, 1],
    [4, 2, 2, 1],
  ],
  [
    [3, 1, 4, 1],
    [1, 2, 4, 1],
    [5, 2, 4, 1],
    [3, 3, 4, 1],
  ],
  [
    [1, 1, 2, 3],
    [3, 3, 2, 1],
    [5, 3, 2, 1],
    [7, 1, 2, 3],
  ],
  [
    [1, 1, 8, 1],
    [1, 2, 2, 1],
    [7, 2, 2, 1],
    [1, 3, 8, 1],
  ],
  [
    [1, 1, 2, 1],
    [3, 1, 2, 1],
    [2, 2, 2, 1],
    [4, 2, 2, 1],
    [3, 3, 2, 1],
    [5, 3, 2, 1],
  ],
];

const azar = (rango) => (Math.random() - 0.5) * rango;

const peso = (texto) =>
  [...texto].reduce(
    (total, c) => total + (c.charCodeAt(0) > 0x2e80 ? 1.8 : 1),
    0,
  );

const generarCiclo = (previo) => {
  let idx = Math.floor(Math.random() * LAYOUTS.length);
  if (idx === previo.idx) idx = (idx + 1) % LAYOUTS.length;
  const tiles = LAYOUTS[idx];
  const orden = tiles
    .map((_, i) => i)
    .sort((a, b) => tiles[b][2] * tiles[b][3] - tiles[a][2] * tiles[a][3]);
  const anim = tiles.map((t) => ({
    dx: azar(20),
    dy: -(30 + Math.random() * 15),
    rot: 0,
    delay: (t[1] - 1) * 70 + Math.random() * 70,
  }));
  return { idx, orden, anim, key: previo.key + 1 };
};

const getPalabras = (nombre) => {
  const p = nombre.trim().split(/\s+/).filter(Boolean);
  if (p.length <= 4) return p;
  return [...p.slice(0, 3), p.slice(3).join(" ")];
};

export const DashboardHeader = () => {
  const { datausuarios } = useUsuariosStore();
  const nombre = datausuarios?.nombres || "";
  const [texto, setTexto] = useState("");
  const [idioma, setIdioma] = useState(0);
  const [borrando, setBorrando] = useState(false);
  const [esLargo, setEsLargo] = useState(false);
  const [ciclo, setCiclo] = useState(() => generarCiclo({ idx: -1, key: 0 }));
  const contenedorRef = useRef(null);
  const medidorRef = useRef(null);
  const bentoRef = useRef(null);

  const fase = borrando ? "out" : "in";
  const palabras = useMemo(() => getPalabras(nombre), [nombre]);
  const tiles = LAYOUTS[ciclo.idx];
  const masLargo = useMemo(
    () => saludos.reduce((a, b) => (peso(b) > peso(a) ? b : a)),
    [],
  );
  const mensajes = useMemo(
    () => saludos.map((s) => (esLargo ? s : `${s} ${nombre}!`)),
    [esLargo, nombre],
  );

  useLayoutEffect(() => {
    const contenedor = contenedorRef.current;
    const medidor = medidorRef.current;
    if (!contenedor || !medidor) return;
    const medir = () =>
      setEsLargo(medidor.offsetWidth > contenedor.clientWidth);
    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(contenedor);
    return () => observer.disconnect();
  }, [nombre]);

  useEffect(() => {
    if (!nombre) return;
    const mensajeActual = mensajes[idioma];
    let timeout;

    if (!borrando) {
      if (texto.length < mensajeActual.length) {
        timeout = setTimeout(() => {
          setTexto(mensajeActual.slice(0, texto.length + 1));
        }, 45);
      } else {
        timeout = setTimeout(() => setBorrando(true), 1700);
      }
    } else if (texto.length > 0) {
      timeout = setTimeout(() => {
        setTexto(mensajeActual.slice(0, texto.length - 1));
      }, 28);
    } else {
      timeout = setTimeout(() => {
        setBorrando(false);
        setIdioma((prev) => (prev + 1) % mensajes.length);
        setCiclo((prev) => generarCiclo(prev));
      }, 450);
    }
    return () => clearTimeout(timeout);
  }, [texto, idioma, borrando, nombre, mensajes]);

  const seguirCursor = (e) => {
    const el = bentoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Container>
      <GreetingRow>
        <UserAvatarBadge size={52} />
        <TextContainer ref={contenedorRef}>
          <Title $medidor ref={medidorRef} aria-hidden="true">
            <span>{`${masLargo} ${nombre}!`}</span>
          </Title>
          <Title $largo={esLargo}>
            <span>{texto}</span>
          </Title>
          {esLargo && (
            <Bento key={ciclo.key} ref={bentoRef} onMouseMove={seguirCursor}>
              {tiles.map(([c, r, w, h], i) => {
                const palabra = palabras[ciclo.orden.indexOf(i)];
                const a = ciclo.anim[i];
                return (
                  <Tile
                    key={i}
                    $c={c}
                    $r={r}
                    $w={w}
                    $h={h}
                    $i={i}
                    $fase={fase}
                    $delay={a.delay}
                    $deco={!palabra}
                    $chars={palabra ? Math.max(palabra.length, 3) : 3}
                    style={{
                      "--dx": `${a.dx}px`,
                      "--dy": `${a.dy}px`,
                    }}
                  >
                    {palabra ? (
                      <span>{palabra}</span>
                    ) : (
                      i % 2 === 0 && <Icon icon="lucide:sparkles" />
                    )}
                  </Tile>
                );
              })}
            </Bento>
          )}
        </TextContainer>
      </GreetingRow>
      <ActionsContainer>
        <DateRangeFilter />
      </ActionsContainer>
    </Container>
  );
};

const Container = styled.div`
  --borde: ${({ theme }) => theme.color2};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  @media ${Device.desktop} {
    flex-direction: row;
  }
`;

const GreetingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
  width: 100%;
`;

const TextContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;
  font-size: ${({ $largo }) => ($largo ? 26 : 34)}px;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 1.2em;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  ${({ $medidor }) =>
    $medidor &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      width: max-content;
      visibility: hidden;
      pointer-events: none;
    `}
  span {
    display: inline-block;
    min-width: 0;
    color: ${({ theme }) => theme.text};
  }
  @media (max-width: 768px) {
    font-size: ${({ $largo }) => ($largo ? 22 : 28)}px;
  }
  @media (max-width: 480px) {
    font-size: ${({ $largo }) => ($largo ? 18 : 22)}px;
  }
`;

const Bento = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 6px;
  height: 92px;
  width: 100%;
  min-width: 0;
  @media (max-width: 480px) {
    height: 80px;
  }
`;

const Tile = styled.div`
  --chars: ${({ $chars }) => $chars};
  grid-column: ${({ $c, $w }) => `${$c} / span ${$w}`};
  grid-row: ${({ $r, $h }) => `${$r} / span ${$h}`};
  container-type: size;
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--borde);
  background: ${({ theme, $deco }) =>
    $deco ? theme.bgAlpha : theme.bgcards};
  color: ${({ theme }) => theme.text};
  animation: ${({ $fase, $delay }) =>
    $fase === "out"
      ? css`
          ${salir} 0.35s ease-in ${$delay * 0.4}ms both
        `
      : css`
          ${entrar} 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${$delay}ms both
        `};
  span {
    position: relative;
    z-index: 2;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    font-size: clamp(
      9px,
      min(calc((100cqw - 12px) / (var(--chars) * 0.6)), 62cqh),
      28px
    );
  }
  svg {
    position: relative;
    z-index: 2;
    font-size: 16px;
    color: ${({ theme }) => theme.colorSubtitle};
    opacity: 0.7;
  }
`;

const ActionsContainer = styled.div`
  flex-shrink: 0;
  border: 1px solid var(--borde);
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgcards};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;
