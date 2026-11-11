import styled, { keyframes } from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useAsignacionCajaSucursalesStore } from "../../../store/AsignacionCajaSucursales";
import { v } from "../../../styles/variables";

export const Telarana = () => null;
export const AranaSvg = () => null;
export const MurcielagoSvg = () => null;
export const CementerioSvg = () => null;

const AVATAR_DEFAULT =
  "https://i.ibb.co/KjJmzQYz/persona-de-libre-dedicacion.png";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulseDot = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
  }
  50% {
    transform: scale(1.06);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
  }
`;

const formatearNombre = (nombre = "") =>
  nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

const MAIN_MODULES = [
  {
    title: "Punto de Venta (POS)",
    category: "Facturación y Cobro",
    description:
      "Realiza ventas rápidas con lector de código de barras, cobro con múltiples métodos de pago, cálculo de vuelto y emisión de tickets.",
    to: "/pos",
    icon: "lucide:shopping-cart",
    color: "#10B981",
    badge: "Operación Principal",
  },
  {
    title: "Dashboard y Métricas",
    category: "Análisis Financiero",
    description:
      "Consulta el resumen de ventas, ganancias netas, flujo de caja en vivo y los productos con mayor rotación del negocio.",
    to: "/dashboard",
    icon: "lucide:bar-chart-3",
    color: "#3B82F6",
    badge: "Tiempo Real",
  },
  {
    title: "Inventario y Kardex",
    category: "Control de Stock",
    description:
      "Supervisa las existencias por almacén, registra ingresos o ajustes de mercadería y revisa alertas de stock mínimo.",
    to: "/inventario",
    icon: "lucide:package-search",
    color: "#8B5CF6",
    badge: "Multi-Almacén",
  },
  {
    title: "Catálogo de Productos",
    category: "Comercial",
    description:
      "Administra tu lista de productos, precios de compra y venta, códigos internos, códigos de barra y categorías.",
    to: "/configuracion/productos",
    icon: "lucide:tags",
    color: "#F59E0B",
    badge: "Catálogo",
  },
  {
    title: "Movimientos de Caja",
    category: "Tesorería y Turnos",
    description:
      "Controla las entradas y salidas de efectivo, aperturas, arqueos y cierres de turno con historial detallado.",
    to: "/configuracion/movimientoscaja",
    icon: "lucide:wallet",
    color: "#06B6D4",
    badge: "Control de Caja",
  },
  {
    title: "Créditos y Cobranzas",
    category: "Cartera de Clientes",
    description:
      "Gestiona las ventas al crédito, registra abonos parciales o totales de clientes y emite comprobantes de pago.",
    to: "/configuracion/creditos",
    icon: "lucide:credit-card",
    color: "#EC4899",
    badge: "Cuentas por Cobrar",
  },
];

const ADMIN_SHORTCUTS = [
  {
    label: "Clientes",
    sub: "Directorio de compradores",
    to: "/configuracion/clientes",
    icon: "lucide:users",
  },
  {
    label: "Proveedores",
    sub: "Abastecimiento y compras",
    to: "/configuracion/proveedores",
    icon: "lucide:truck",
  },
  {
    label: "Categorías",
    sub: "Clasificación de ítems",
    to: "/configuracion/categorias",
    icon: "lucide:layers",
  },
  {
    label: "Almacenes",
    sub: "Depósitos y bodegas",
    to: "/configuracion/almacenes",
    icon: "lucide:warehouse",
  },
  {
    label: "Sucursales y Cajas",
    sub: "Puntos de atención",
    to: "/configuracion/sucursales-cajas",
    icon: "lucide:store",
  },
  {
    label: "Usuarios y Permisos",
    sub: "Roles y accesos del personal",
    to: "/configuracion/usuarios",
    icon: "lucide:user-check",
  },
];

const SYSTEM_SETTINGS_LINKS = [
  {
    label: "Configuración de Ticket",
    sub: "Encabezado, pie y formato de impresión",
    to: "/configuracion/ticket",
    icon: "lucide:receipt",
  },
  {
    label: "Métodos de Pago",
    sub: "Efectivo, tarjetas, transferencias",
    to: "/configuracion/metodospago",
    icon: "lucide:banknote",
  },
  {
    label: "Serialización de Comprobantes",
    sub: "Series y correlativos de tickets/facturas",
    to: "/configuracion/serealizacion",
    icon: "lucide:file-text",
  },
];

const LiveDateBadge = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);
    } catch {
      return now.toLocaleDateString();
    }
  }, [now]);

  const formattedTime = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
    } catch {
      return "";
    }
  }, [now]);

  return (
    <DatePill>
      <Icon icon="lucide:calendar-clock" />
      <span className="date-text">{formattedDate}</span>
      {formattedTime && <span className="time-sep">•</span>}
      {formattedTime && <strong className="time-text">{formattedTime}</strong>}
    </DatePill>
  );
};

export const LandingPagesWelcome = () => {
  const { datausuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalesStore();

  const greetingByHour = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 19) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  }, []);

  const saludos = useMemo(
    () => [
      greetingByHour,
      "¡Bienvenido de nuevo!",
      "Welcome back!",
      "Bem-vindo de volta!",
      "Bienvenue !",
      "Benvenuto!",
      "Willkommen!",
    ],
    [greetingByHour],
  );

  const [textoSaludo, setTextoSaludo] = useState("");
  const [idioma, setIdioma] = useState(0);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const mensajeActual = saludos[idioma];
    let timeout;

    if (!borrando) {
      if (textoSaludo.length < mensajeActual.length) {
        timeout = setTimeout(() => {
          setTextoSaludo(mensajeActual.slice(0, textoSaludo.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setBorrando(true), 2200);
      }
    } else if (textoSaludo.length > 0) {
      timeout = setTimeout(() => {
        setTextoSaludo(mensajeActual.slice(0, textoSaludo.length - 1));
      }, 28);
    } else {
      timeout = setTimeout(() => {
        setBorrando(false);
        setIdioma((prev) => (prev + 1) % saludos.length);
      }, 350);
    }

    return () => clearTimeout(timeout);
  }, [textoSaludo, idioma, borrando, saludos]);

  const userName = formatearNombre(datausuarios?.nombres || "Usuario");
  const userRole = datausuarios?.roles?.nombre || "Administrador";
  const logoUsuario =
    !datausuarios?.logo || datausuarios.logo === "-"
      ? AVATAR_DEFAULT
      : datausuarios.logo;
  const companyName = dataempresa?.nombre || "SoftCreate POS";
  const currencySymbol = dataempresa?.simbolo_moneda || "$";
  const currencyIso = dataempresa?.iso || "Moneda local";
  const branchName =
    sucursalesItemSelectAsignadas?.sucursales?.nombre || "Sucursal Principal";
  const cashRegisterName =
    sucursalesItemSelectAsignadas?.caja?.descripcion || "Caja Principal";

  return (
    <Container>
      <ContentWrapper>
        <TopBar>
          <WelcomeUserBlock>
            <AvatarWrapper>
              <Avatar
                src={logoUsuario}
                alt={userName}
                onError={(e) => {
                  e.currentTarget.src = AVATAR_DEFAULT;
                }}
              />
              <StatusDot title="En línea" />
            </AvatarWrapper>

            <div className="user-Copy">
              <div className="greeting-top">
                <span className="greeting-badge">
                  <Icon icon="lucide:sparkles" />
                  <span>{textoSaludo}</span>
                  <Cursor aria-hidden="true">|</Cursor>
                </span>
                <span className="role-badge">{userRole}</span>
                <span className="dot">•</span>
                <span className="company-label">{companyName}</span>
              </div>
              <h1 title={userName}>{userName}</h1>
            </div>
          </WelcomeUserBlock>

          <TopBarRight>
            <StatusBadge>
              <span className="status-dot" />
              <span>Sistema en línea</span>
            </StatusBadge>
            <LiveDateBadge />
          </TopBarRight>
        </TopBar>

        <HeroSection>
          <MainPosBanner>
            <div className="banner-top">
              <img
                src={v.logoFull}
                alt="Logo Sistema POS"
                className="brand-logo brand-logo--light"
              />
              <img
                src={v.logoFullDark}
                alt="Logo Sistema POS"
                className="brand-logo brand-logo--dark"
              />
              <span className="pos-tag">Punto de Venta Integrado</span>
            </div>

            <h2>Centro de Operaciones y Gestión Comercial</h2>
            <p>
              Inicia tu jornada desde la terminal de facturación, consulta el
              cierre de caja en tiempo real o administra tu inventario y
              cartera de clientes desde un solo lugar.
            </p>

            <HeroActions>
              <PrimaryActionBtn to="/pos">
                <Icon icon="lucide:shopping-cart" />
                <span>Abrir Terminal POS</span>
                <Icon icon="lucide:arrow-right" className="arrow" />
              </PrimaryActionBtn>

              <SecondaryActionBtn to="/dashboard">
                <Icon icon="lucide:pie-chart" />
                <span>Ver Dashboard</span>
              </SecondaryActionBtn>

              <SecondaryActionBtn to="/configuracion/movimientoscaja">
                <Icon icon="lucide:wallet" />
                <span>Flujo de Caja</span>
              </SecondaryActionBtn>
            </HeroActions>

            <HighlightsStrip>
              <div className="h-item">
                <Icon icon="lucide:zap" />
                <span>Facturación ágil con código de barras</span>
              </div>
              <div className="h-item">
                <Icon icon="lucide:check-circle-2" />
                <span>Descuento automático de stock</span>
              </div>
              <div className="h-item">
                <Icon icon="lucide:printer" />
                <span>Impresión de tickets y PDF</span>
              </div>
            </HighlightsStrip>
          </MainPosBanner>

          <WorkstationCard>
            <div className="card-header">
              <div>
                <span className="eyebrow">ESTACIÓN DE TRABAJO</span>
                <h3>Información de Sesión</h3>
              </div>
              <NavLink to="/miperfil" className="profile-link">
                <Icon icon="lucide:user-cog" />
                <span>Mi Perfil</span>
              </NavLink>
            </div>

            <StationInfoList>
              <div className="info-row">
                <div className="icon-box">
                  <Icon icon="lucide:building-2" />
                </div>
                <div className="info-text">
                  <span>Empresa Activa</span>
                  <strong>{companyName}</strong>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-box">
                  <Icon icon="lucide:store" />
                </div>
                <div className="info-text">
                  <span>Sucursal Asignada</span>
                  <strong>{branchName}</strong>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-box">
                  <Icon icon="lucide:monitor" />
                </div>
                <div className="info-text">
                  <span>Terminal / Caja</span>
                  <strong>{cashRegisterName}</strong>
                </div>
              </div>

              <div className="info-row">
                <div className="icon-box">
                  <Icon icon="lucide:coins" />
                </div>
                <div className="info-text">
                  <span>Moneda Configurada</span>
                  <strong>
                    {currencySymbol} ({currencyIso})
                  </strong>
                </div>
              </div>
            </StationInfoList>

            <StationFooter>
              <NavLink
                to="/configuracion/empresa"
                className="config-company-link"
              >
                <Icon icon="lucide:settings" />
                <span>Configurar datos de empresa y moneda</span>
              </NavLink>
            </StationFooter>
          </WorkstationCard>
        </HeroSection>

        <SectionHeading>
          <div>
            <h2>Módulos Principales</h2>
            <p>Acceso directo a las áreas operativas de uso diario</p>
          </div>
          <NavLink to="/configuracion" className="view-all-link">
            <span>Ver todos los módulos</span>
            <Icon icon="lucide:chevron-right" />
          </NavLink>
        </SectionHeading>

        <ModulesGrid>
          {MAIN_MODULES.map((mod) => (
            <ModuleCard key={mod.to} to={mod.to}>
              <div className="mod-top">
                <div
                  className="mod-icon"
                  style={{
                    color: mod.color,
                    background: `${mod.color}15`,
                    borderColor: `${mod.color}30`,
                  }}
                >
                  <Icon icon={mod.icon} />
                </div>
                <span className="mod-badge">{mod.badge}</span>
              </div>

              <div className="mod-body">
                <span className="mod-category">{mod.category}</span>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
              </div>

              <div className="mod-footer">
                <span>Ingresar al módulo</span>
                <Icon icon="lucide:arrow-up-right" />
              </div>
            </ModuleCard>
          ))}
        </ModulesGrid>

        <BottomPanelsGrid>
          <AdminPanelCard>
            <div className="panel-head">
              <div>
                <h3>Administración y Directorios</h3>
                <p>Gestiona clientes, proveedores, almacenes y personal</p>
              </div>
              <Icon icon="lucide:briefcase" className="head-icon" />
            </div>

            <ShortcutsGrid>
              {ADMIN_SHORTCUTS.map((item) => (
                <ShortcutItem key={item.to} to={item.to}>
                  <div className="s-icon">
                    <Icon icon={item.icon} />
                  </div>
                  <div className="s-info">
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </div>
                  <Icon icon="lucide:chevron-right" className="s-arrow" />
                </ShortcutItem>
              ))}
            </ShortcutsGrid>
          </AdminPanelCard>

          <AdminPanelCard>
            <div className="panel-head">
              <div>
                <h3>Facturación e Impresión</h3>
                <p>Configura tickets térmicos, impresoras y métodos de pago</p>
              </div>
              <Icon icon="lucide:sliders-horizontal" className="head-icon" />
            </div>

            <SettingsList>
              {SYSTEM_SETTINGS_LINKS.map((item) => (
                <SettingRowLink key={item.to} to={item.to}>
                  <div className="s-icon">
                    <Icon icon={item.icon} />
                  </div>
                  <div className="s-info">
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </div>
                  <Icon icon="lucide:arrow-right" className="s-arrow" />
                </SettingRowLink>
              ))}
            </SettingsList>
          </AdminPanelCard>
        </BottomPanelsGrid>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  padding: 24px 0 64px;
`;

const ContentWrapper = styled.div`
  width: min(1320px, calc(100% - 40px));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 640px) {
    width: calc(100% - 24px);
    gap: 18px;
  }
`;

const TopBar = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 22px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: ${({ theme }) => theme.text};
    opacity: 0.85;
  }
`;

const WelcomeUserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;

  .user-Copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .greeting-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 22px;
    font-size: 12.5px;
    color: ${({ theme }) => theme.colorSubtitle};

    .greeting-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.colorSubtitle};

      svg {
        font-size: 14px;
        color: #10b981;
        flex-shrink: 0;
      }
    }

    .role-badge {
      padding: 2px 8px;
      border-radius: 999px;
      background-color: ${({ theme }) => theme.bg2};
      border: 1px solid ${({ theme }) => theme.color2};
      color: ${({ theme }) => theme.text};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .company-label {
      font-weight: 500;
    }
  }

  h1 {
    margin: 0;
    font-size: clamp(18px, 1.9vw, 24px);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.2;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  padding: 2px;
  background: ${({ theme }) => theme.bg2};
  border: 1.5px solid ${({ theme }) => theme.color2};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 46px;
    height: 46px;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

const StatusDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2px solid ${({ theme }) => theme.bgcards};
  animation: ${pulseDot} 2.4s infinite ease-in-out;
`;

const Cursor = styled.span`
  display: inline-block;
  font-weight: 400;
  opacity: 0.7;
  margin-left: -3px;
  animation: ${blink} 0.9s step-end infinite;
`;

const TopBarRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.28);
  color: #10b981;
  font-size: 12px;
  font-weight: 600;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    animation: ${pulseDot} 2.4s infinite ease-in-out;
  }
`;

const DatePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  font-size: 12.5px;
  color: ${({ theme }) => theme.colorSubtitle};

  svg {
    font-size: 15px;
    color: ${({ theme }) => theme.text};
  }

  .date-text {
    text-transform: capitalize;
  }

  .time-text {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 20px;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const MainPosBanner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)"
      : "0 4px 20px -6px rgba(17, 17, 17, 0.05)"};

  .banner-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;

    .brand-logo {
      height: 46px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
    }
    .brand-logo--light {
      display: ${({ theme }) => (isDarkTheme(theme) ? "none" : "block")};
    }
    .brand-logo--dark {
      display: ${({ theme }) => (isDarkTheme(theme) ? "block" : "none")};
    }

    .pos-tag {
      padding: 4px 11px;
      border-radius: 999px;
      background-color: ${({ theme }) => theme.bgAlpha};
      border: 1px solid ${({ theme }) => theme.color2};
      font-size: 11.5px;
      font-weight: 600;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  h2 {
    margin: 0 0 10px;
    font-size: clamp(22px, 2.6vw, 30px);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.2;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 22px;
    font-size: 14.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colorSubtitle};
    max-width: 640px;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

const PrimaryActionBtn = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  border-radius: 12px;
  background-color: #10b981;
  color: #ffffff !important;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;

  svg {
    font-size: 17px;
  }

  .arrow {
    transition: transform 0.18s ease;
  }

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);

    .arrow {
      transform: translateX(3px);
    }
  }
`;

const SecondaryActionBtn = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.text} !important;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;

  svg {
    font-size: 16px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255,255,255,0.28)" : "rgba(17,17,17,0.28)"};
  }
`;

const HighlightsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.color2};

  .h-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 500;
    color: ${({ theme }) => theme.colorSubtitle};

    svg {
      font-size: 16px;
      color: #10b981;
      flex-shrink: 0;
    }
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const WorkstationCard = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 16px;

    .eyebrow {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: ${({ theme }) => theme.colorSubtitle};
    }

    h3 {
      margin: 3px 0 0;
      font-size: 17px;
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }

    .profile-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 8px;
      background-color: ${({ theme }) => theme.bgAlpha};
      border: 1px solid ${({ theme }) => theme.color2};
      color: ${({ theme }) => theme.text} !important;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: border-color 0.18s ease;

      &:hover {
        border-color: #3b82f6;
      }
    }
  }
`;

const StationInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.bgAlpha};
    border: 1px solid ${({ theme }) => theme.color2};

    .icon-box {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background-color: ${({ theme }) => theme.bgcards};
      border: 1px solid ${({ theme }) => theme.color2};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      color: ${({ theme }) => theme.text};
      flex-shrink: 0;
    }

    .info-text {
      display: flex;
      flex-direction: column;
      min-width: 0;

      span {
        font-size: 11px;
        color: ${({ theme }) => theme.colorSubtitle};
      }

      strong {
        font-size: 13.5px;
        font-weight: 600;
        color: ${({ theme }) => theme.text};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const StationFooter = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.color2};

  .config-company-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colorSubtitle};
    text-decoration: none;
    transition: color 0.18s ease;

    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const SectionHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 4px 0 0;
    font-size: 13.5px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .view-all-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    opacity: 0.85;

    &:hover {
      opacity: 1;
    }
  }
`;

const ModulesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ModuleCard = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  .mod-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;

    .mod-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .mod-badge {
      padding: 4px 10px;
      border-radius: 999px;
      background-color: ${({ theme }) => theme.bgAlpha};
      border: 1px solid ${({ theme }) => theme.color2};
      font-size: 11px;
      font-weight: 600;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  .mod-body {
    margin-bottom: 16px;

    .mod-category {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${({ theme }) => theme.colorSubtitle};
    }

    h3 {
      margin: 4px 0 8px;
      font-size: 16.5px;
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }

    p {
      margin: 0;
      font-size: 13px;
      line-height: 1.55;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  .mod-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.color2};
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.text};

    svg {
      font-size: 16px;
      transition: transform 0.18s ease;
    }
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255,255,255,0.24)" : "rgba(17,17,17,0.24)"};
    box-shadow: ${({ theme }) =>
      isDarkTheme(theme)
        ? "0 12px 28px -10px rgba(0, 0, 0, 0.55)"
        : "0 10px 24px -8px rgba(17, 17, 17, 0.07)"};

    .mod-footer svg {
      transform: translate(2px, -2px);
    }
  }
`;

const BottomPanelsGrid = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const AdminPanelCard = styled.div`
  padding: 22px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};

  .panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: ${({ theme }) => theme.text};
    }

    p {
      margin: 4px 0 0;
      font-size: 12.5px;
      color: ${({ theme }) => theme.colorSubtitle};
    }

    .head-icon {
      font-size: 20px;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }
`;

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const ShortcutItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  text-decoration: none;
  transition:
    border-color 0.16s ease,
    transform 0.16s ease;

  .s-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background-color: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    color: ${({ theme }) => theme.text};
    flex-shrink: 0;
  }

  .s-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    strong {
      font-size: 13.5px;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }

    span {
      font-size: 11.5px;
      color: ${({ theme }) => theme.colorSubtitle};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .s-arrow {
    font-size: 16px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255,255,255,0.25)" : "rgba(17,17,17,0.25)"};
  }
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const SettingRowLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  text-decoration: none;
  transition:
    border-color 0.16s ease,
    transform 0.16s ease;

  .s-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    flex-shrink: 0;
  }

  .s-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    strong {
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }

    span {
      font-size: 11.5px;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  .s-arrow {
    font-size: 15px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  &:hover {
    transform: translateX(2px);
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255,255,255,0.25)" : "rgba(17,17,17,0.25)"};
  }
`;
