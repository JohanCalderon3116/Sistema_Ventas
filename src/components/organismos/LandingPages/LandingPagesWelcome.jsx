import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { UserAvatarBadge } from "../../../pages/Perfil";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { v } from "../../../styles/variables";

export const Telarana = () => null;
export const AranaSvg = () => null;
export const MurcielagoSvg = () => null;
export const CementerioSvg = () => null;

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

const FLOATING_EMOJIS = [
  { emoji: "⚡", x: "6%", y: "14%", size: "26px", dur: "5.2s", delay: "0s" },
  { emoji: "⚔️", x: "92%", y: "18%", size: "28px", dur: "6.4s", delay: "0.8s" },
  { emoji: "🔥", x: "14%", y: "72%", size: "26px", dur: "5.8s", delay: "1.3s" },
  { emoji: "👑", x: "86%", y: "66%", size: "28px", dur: "6.1s", delay: "0.4s" },
  { emoji: "🗡️", x: "48%", y: "10%", size: "24px", dur: "7.0s", delay: "1.9s" },
  { emoji: "💎", x: "78%", y: "86%", size: "24px", dur: "5.5s", delay: "2.2s" },
  { emoji: "🚀", x: "26%", y: "88%", size: "25px", dur: "6.7s", delay: "1.1s" },
  { emoji: "🛡️", x: "4%", y: "44%", size: "24px", dur: "6.3s", delay: "1.6s" },
];

const SKILLS_MONARCA = [
  {
    rank: "SKILL RANGO S+",
    emoji: "⚡",
    titulo: "Corte Relámpago en Caja",
    subtitulo: "VELOCIDAD DE COBRO 0.2 SEGUNDOS",
    descripcion:
      "Despacha filas enteras sin parpadear. Escaneo letal por código de barras, venta libre instantánea, cálculo exacto de vuelto y disparo inmediato de cajón.",
    stat: "99.9% Más Rápido",
    color: "#10B981",
  },
  {
    rank: "SKILL DOMINIO",
    emoji: "👑",
    titulo: "Autoridad del Soberano",
    subtitulo: "PRECISIÓN FINANCIERA ABSOLUTA",
    descripcion:
      "Ningún centavo escapa a tu vista. Monitoreo en vivo de ganancias netas, entradas, salidas y cortes de turno auditables con comprobantes PDF impecables.",
    stat: "0% Margen de Error",
    color: "#8B5CF6",
  },
  {
    rank: "SKILL INVOCACIÓN",
    emoji: "🗡️",
    titulo: "Ejército de Sombras Multi-Almacén",
    subtitulo: "CONTROL TOTAL DE INVENTARIO",
    descripcion:
      "Tus productos custodiados 24/7. Alertas automáticas cuando el stock baja al límite crítico, kardex sincronizado y gestión multi-sucursal en tiempo real.",
    stat: "Sincronización < 15ms",
    color: "#3B82F6",
  },
  {
    rank: "SKILL PACTO",
    emoji: "🔥",
    titulo: "Cadenas del Monarca en Cartera",
    subtitulo: "CRÉDITOS Y ABONOS SIN FUGAS",
    descripcion:
      "Domina las cuentas por cobrar por cliente. Cada abono entra directo al flujo de caja activo y genera su propio historial y factura individual al instante.",
    stat: "Control 100% Blindado",
    color: "#F59E0B",
  },
];

const COMBAT_LOGS = [
  { text: "⚡ ¡CORTE RELÁMPAGO! Venta procesada en 0.18s", dmg: "CRÍTICO +9,999" },
  { text: "⚔️ ¡SURGE! Arqueo de caja ejecutado con 0 errores", dmg: "PERFECTO x100" },
  { text: "🔥 ¡IRA DE KAMISH! 50 productos sincronizados al instante", dmg: "VELOCIDAD S+" },
  { text: "👑 ¡AUTORIDAD DEL MONARCA! Ganancias protegidas en vivo", dmg: "DOMINIO TOTAL" },
];

export const LandingPagesWelcome = () => {
  const { datausuarios } = useUsuariosStore();
  const [combo, setCombo] = useState(128);
  const [isSlashing, setIsSlashing] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [bossHp, setBossHp] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % COMBAT_LOGS.length);
      setIsSlashing(true);
      const t = setTimeout(() => setIsSlashing(false), 600);
      return () => clearTimeout(t);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const triggerMonarchAttack = () => {
    setIsSlashing(true);
    setCombo((prev) => prev + 7);
    setLogIndex((prev) => (prev + 1) % COMBAT_LOGS.length);
    setBossHp((prev) => (prev <= 5 ? 100 : prev - 14));
    setTimeout(() => setIsSlashing(false), 650);
  };

  const currentLog = COMBAT_LOGS[logIndex];

  return (
    <Container>
      {/* PARTÍCULAS Y EMOJIS REALES EN MOVIMIENTO */}
      <AmbientLayer aria-hidden="true">
        {FLOATING_EMOJIS.map((item, i) => (
          <FloatingEmoji
            key={i}
            style={{
              left: item.x,
              top: item.y,
              fontSize: item.size,
              animationDuration: item.dur,
              animationDelay: item.delay,
            }}
          >
            {item.emoji}
          </FloatingEmoji>
        ))}
      </AmbientLayer>

      <Content>
        {/* ================= HERO SOLO LEVELING & EFICIENCIA ================= */}
        <HeroGrid>
          <HeroLeft>
            <SystemQuestBanner>
              <span className="sys-icon">ǃ</span>
              <span className="sys-text">
                SISTEMA: MODO EFICIENCIA RANGO S-MONARCA ACTIVADO
              </span>
              <span className="sys-emoji">⚡</span>
            </SystemQuestBanner>

            <LogoShowcaseBox>
              <img
                src={v.logoFull || v.logo}
                alt="SoftCreate POS Solo Leveling"
                className="monarch-logo"
              />
              <div className="aura-ring" />
            </LogoShowcaseBox>

            <HeroTitle>
              <span>¡SURGE!</span> Domina tu Negocio con{" "}
              <em className="gradient-stroke">Eficiencia Letal</em> ⚡
            </HeroTitle>

            <HeroSubtitle>
              Mientras otros sistemas se congelan, tú ya cobraste, abriste el
              cajón, descontaste inventario y multiplicaste tu rentabilidad.{" "}
              <strong>SoftCreate POS</strong> convierte cada segundo en pura
              potencia comercial. 🔥
            </HeroSubtitle>

            <ActionButtons>
              <PrimaryBattleBtn to="/pos">
                <span className="emoji-btn">⚔️</span>
                <span>Entrar al POS Ahora</span>
                <Icon icon="lucide:zap" />
              </PrimaryBattleBtn>

              <SecondaryBattleBtn to="/dashboard">
                <span className="emoji-btn">👑</span>
                <span>Trono Financiero</span>
              </SecondaryBattleBtn>

              <SecondaryBattleBtn to="/inventario">
                <span className="emoji-btn">🗡️</span>
                <span>Arsenal de Stock</span>
              </SecondaryBattleBtn>
            </ActionButtons>

            <EfficiencyMetricsRow>
              <MetricPill>
                <span className="m-emoji">⚡</span>
                <div>
                  <strong>0.2 Segundos</strong>
                  <span>Tiempo de respuesta en cobro</span>
                </div>
              </MetricPill>

              <MetricPill>
                <span className="m-emoji">🔥</span>
                <div>
                  <strong>99.99% Precisión</strong>
                  <span>En arqueos y cortes de caja</span>
                </div>
              </MetricPill>

              <MetricPill>
                <span className="m-emoji">💎</span>
                <div>
                  <strong>Nivel Monarca</strong>
                  <span>Rendimiento sin límites</span>
                </div>
              </MetricPill>
            </EfficiencyMetricsRow>
          </HeroLeft>

          {/* ================= VENTANA DE ESTADO DEL CAZADOR (DERECHA) ================= */}
          <StatusWindowCard>
            <StatusHeader>
              <div className="sys-title">
                <span className="sys-bracket">[</span>
                ESTADO DEL OPERADOR
                <span className="sys-bracket">]</span>
              </div>
              <span className="s-rank-badge">👑 RANGO S+</span>
            </StatusHeader>

            <HunterProfileRow>
              <div className="avatar-orb">
                <UserAvatarBadge size={62} />
                <span className="level-tag">NV. 999</span>
              </div>
              <div className="hunter-info">
                <span className="hunter-class">
                  ⚔️ MONARCA DE LAS VENTAS • ACTIVO
                </span>
                <strong className="hunter-name">
                  {datausuarios?.nombres || "Cazador Principal"}
                </strong>
                <span className="hunter-role">
                  Rol: {datausuarios?.roles?.nombre || "Super Administrador"}
                </span>
              </div>
              <NavLink to="/miperfil" className="avatar-switch-btn">
                <span>🎭 Avatar</span>
              </NavLink>
            </HunterProfileRow>

            <StatsList>
              <StatRow>
                <div className="stat-label">
                  <span>⚡ VELOCIDAD DE FACTURACIÓN</span>
                  <strong>999 / 999 (MÁX)</strong>
                </div>
                <StatBarTrack>
                  <StatBarFill $width="100%" $color="#10B981" />
                </StatBarTrack>
              </StatRow>

              <StatRow>
                <div className="stat-label">
                  <span>🗡️ PRECISIÓN DE ARQUEO Y CAJA</span>
                  <strong>999 / 999 (MÁX)</strong>
                </div>
                <StatBarTrack>
                  <StatBarFill $width="100%" $color="#8B5CF6" />
                </StatBarTrack>
              </StatRow>

              <StatRow>
                <div className="stat-label">
                  <span>🔥 CONTROL DE STOCK Y CRÉDITOS</span>
                  <strong>999 / 999 (MÁX)</strong>
                </div>
                <StatBarTrack>
                  <StatBarFill $width="98%" $color="#3B82F6" />
                </StatBarTrack>
              </StatRow>

              <StatRow>
                <div className="stat-label">
                  <span>🛡️ SEGURIDAD DEL SISTEMA</span>
                  <strong>INQUEBRANTABLE</strong>
                </div>
                <StatBarTrack>
                  <StatBarFill $width="100%" $color="#10B981" />
                </StatBarTrack>
              </StatRow>
            </StatsList>

            <PassiveBuffBox>
              <span className="buff-emoji">🚀</span>
              <div className="buff-copy">
                <strong>BENDICIÓN DEL MONARCA ACTIVA:</strong>
                <span>
                  Tu negocio opera a máxima eficiencia con sincronización en
                  tiempo real.
                </span>
              </div>
            </PassiveBuffBox>
          </StatusWindowCard>
        </HeroGrid>

        {/* ================= ARENA DE BATALLA ANIME: SOLO LEVELING ================= */}
        <BattleArenaSection $slashing={isSlashing}>
          <ArenaTopBar>
            <div className="arena-title">
              <span className="live-indicator" />
              <span>
                ARENA DE COMBATE EN VIVO: SUNG JIN-WOO (SOFTCREATE POS) VS. LA
                LENTITUD COMERCIAL
              </span>
            </div>
            <div className="combo-counter">
              🔥 COMBO DE EFICIENCIA: <strong>x{combo} HIT!</strong>
            </div>
          </ArenaTopBar>

          <BattleStage>
            {/* LUCHADOR IZQUIERDO: MONARCA DE LAS SOMBRAS */}
            <FighterCard>
              <div className="fighter-header">
                <span className="tag-ally">⚔️ MONARCA DE LAS SOMBRAS</span>
                <strong>SoftCreate POS</strong>
              </div>

              <MonarchFighterVisual $slashing={isSlashing}>
                <svg viewBox="0 0 220 190" fill="none">
                  {/* Aura de Sombra */}
                  <circle
                    cx="110"
                    cy="98"
                    r="64"
                    fill="url(#shadowAura)"
                    className="aura-pulse"
                  />
                  {/* Soldados de Sombra detrás */}
                  <path
                    d="M42 165 L52 105 L68 92 L82 115 L78 165 Z"
                    fill="rgba(139, 92, 246, 0.22)"
                    stroke="#8B5CF6"
                    strokeWidth="1.2"
                  />
                  <circle cx="64" cy="104" r="2.2" fill="#A855F7" />
                  {/* Silueta Sung Jin-Woo con Dagas Gemelas */}
                  <path
                    d="M72 172 L86 102 L110 88 L136 102 L152 172 Z"
                    fill="#0B0B10"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                  />
                  {/* Cuello alto de gabardina */}
                  <path
                    d="M84 102 L74 76 L98 86 L110 82 L124 86 L146 74 L136 102 Z"
                    fill="#111118"
                    stroke="#A855F7"
                    strokeWidth="1.8"
                  />
                  {/* Cabeza y cabello puntiagudo */}
                  <path
                    d="M92 78 L86 58 L95 60 L98 44 L108 54 L118 42 L122 56 L134 52 L128 70 L132 78 L110 86 Z"
                    fill="#09090E"
                    stroke="#8B5CF6"
                    strokeWidth="1.6"
                  />
                  {/* Ojos brillantes de Monarca */}
                  <path
                    d="M104 68 L113 70 L106 73 Z"
                    fill="#C084FC"
                    className="glowing-eye"
                  />
                  <path
                    d="M118 68 L125 69 L120 72 Z"
                    fill="#38BDF8"
                    className="glowing-eye"
                  />
                  {/* Daga Derecha (Ira de Kamish) */}
                  <g className="dagger-slash">
                    <path
                      d="M132 112 L198 68 L178 96 L140 122 Z"
                      fill="#A855F7"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M120 120 L208 58"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                  {/* Daga Izquierda (Colmillo de Kasaka) */}
                  <g className="dagger-slash-alt">
                    <path
                      d="M90 124 L172 116 L154 134 L94 134 Z"
                      fill="#10B981"
                      stroke="#FFFFFF"
                      strokeWidth="1.4"
                    />
                  </g>
                  <defs>
                    <radialGradient id="shadowAura" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 98) scale(68)">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
                <div className="floating-badge">⚡ VELOCIDAD RANGO S</div>
              </MonarchFighterVisual>
            </FighterCard>

            {/* CENTRO: EFECTOS DE PELEA, CORTES Y EMOJIS EN ACCIÓN */}
            <CombatCenterZone>
              <SlashEffectBox $slashing={isSlashing}>
                <svg viewBox="0 0 260 140" className="slash-svg">
                  <path
                    d="M15 120 Q 130 15 245 25"
                    stroke="#A855F7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    className="slash-arc-1"
                  />
                  <path
                    d="M25 25 Q 130 125 235 110"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    className="slash-arc-2"
                  />
                  <path
                    d="M50 70 L110 50 L95 82 L155 62 L135 92 L220 68"
                    stroke="#38BDF8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="lightning-bolt"
                  />
                </svg>
                <div className="clash-emojis">
                  <span className="e1">⚔️</span>
                  <span className="e2">⚡</span>
                  <span className="e3">💥</span>
                  <span className="e4">🔥</span>
                </div>
              </SlashEffectBox>

              <DamagePopup key={logIndex + "-" + combo}>
                <span className="dmg-badge">{currentLog.dmg}</span>
                <p className="dmg-text">{currentLog.text}</p>
              </DamagePopup>

              <AttackActionBtn type="button" onClick={triggerMonarchAttack}>
                <span>⚡ ¡DESATAR ATAQUE DE EFICIENCIA!</span>
                <span className="btn-emoji">🗡️🔥</span>
              </AttackActionBtn>
            </CombatCenterZone>

            {/* JEFE ENEMIGO: EL CAOS Y LA LENTITUD (DERROTADO POR SOFTCREATE POS) */}
            <BossCard $slashing={isSlashing}>
              <div className="boss-header">
                <span className="tag-boss">💀 JEFE DE MAZMORRA DERROTADO</span>
                <strong>Caos, Filas y Lentitud</strong>
              </div>

              <div className="hp-bar-wrap">
                <div className="hp-top">
                  <span>HP DEL CAOS COMERCIAL</span>
                  <strong>{bossHp}% (CRÍTICO)</strong>
                </div>
                <div className="hp-track">
                  <div className="hp-fill" style={{ width: `${bossHp}%` }} />
                </div>
              </div>

              <BossVisual $slashing={isSlashing}>
                <div className="boss-hit-marks">
                  <span>💥 -9,999</span>
                  <span>⚡ DESTRUIDO</span>
                </div>
                <div className="defeated-list">
                  <div className="defeated-item">
                    <span>❌ Filas lentas en caja</span>
                    <strong>ELIMINADO ⚡</strong>
                  </div>
                  <div className="defeated-item">
                    <span>❌ Descuadres de dinero</span>
                    <strong>ELIMINADO 🗡️</strong>
                  </div>
                  <div className="defeated-item">
                    <span>❌ Pérdida de inventario</span>
                    <strong>ELIMINADO 🔥</strong>
                  </div>
                </div>
              </BossVisual>
            </BossCard>
          </BattleStage>
        </BattleArenaSection>

        {/* ================= HABILIDADES DE RANGO S (EFICIENCIA PURA) ================= */}
        <SkillsSectionHeader>
          <div className="left">
            <span className="eyebrow">⚡ GRIMORIO DE PODER EMPRESARIAL</span>
            <h2>Habilidades de Eficiencia Rango S</h2>
          </div>
          <p className="right-sub">
            Cada módulo de <strong>SoftCreate POS</strong> está forjado para
            multiplicar tu velocidad operativa y eliminar el trabajo manual.
          </p>
        </SkillsSectionHeader>

        <SkillsGrid>
          {SKILLS_MONARCA.map((skill, idx) => (
            <SkillCard key={idx}>
              <div className="skill-top">
                <div className="emoji-orb">{skill.emoji}</div>
                <div className="skill-meta">
                  <span className="skill-rank" style={{ color: skill.color }}>
                    {skill.rank}
                  </span>
                  <span className="skill-sub">{skill.subtitulo}</span>
                </div>
              </div>
              <h3>{skill.titulo}</h3>
              <p>{skill.descripcion}</p>
              <div className="skill-footer">
                <span
                  className="power-dot"
                  style={{ background: skill.color }}
                />
                <strong>{skill.stat}</strong>
              </div>
            </SkillCard>
          ))}
        </SkillsGrid>
      </Content>
    </Container>
  );
};

/* =========================================================
   KEYFRAMES & ANIMACIONES
========================================================= */
const floatEmojiAnim = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
  }
  33% {
    transform: translate3d(12px, -18px, 0) rotate(8deg) scale(1.12);
  }
  66% {
    transform: translate3d(-10px, -8px, 0) rotate(-6deg) scale(0.96);
  }
`;

const pulseAura = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.85;
  }
`;

const slashDash = keyframes`
  0% {
    stroke-dashoffset: 320;
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.2;
  }
`;

const daggerSwing = keyframes`
  0%, 100% {
    transform: rotate(0deg) translate(0, 0);
  }
  50% {
    transform: rotate(-14deg) translate(6px, -6px);
  }
`;

const popInDamage = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const shakeHit = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px) rotate(-1deg); }
  40% { transform: translateX(5px) rotate(1deg); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

/* =========================================================
   ESTILOS GENERALES Y CAPA DE EMOJIS EN MOVIMIENTO
========================================================= */
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  transition:
    background 0.25s ease,
    color 0.25s ease;
`;

const AmbientLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingEmoji = styled.span`
  position: absolute;
  user-select: none;
  opacity: ${({ theme }) => (isDarkTheme(theme) ? 0.55 : 0.45)};
  filter: drop-shadow(0 6px 14px rgba(139, 92, 246, 0.35));
  animation: ${floatEmojiAnim} 6s ease-in-out infinite;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: min(1260px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 90px;

  @media (max-width: 640px) {
    width: calc(100% - 24px);
    padding-top: 18px;
  }
`;

/* =========================================================
   HERO IZQUIERDO + LOGO SOLO LEVELING
========================================================= */
const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: stretch;
  margin-bottom: 32px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SystemQuestBanner = styled.div`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 10px;
  padding: 7px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid rgba(139, 92, 246, 0.45);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.18);
  margin-bottom: 14px;

  .sys-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #8b5cf6;
    color: #ffffff;
    font-weight: 800;
    font-size: 12px;
  }

  .sys-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.text};
  }

  .sys-emoji {
    font-size: 14px;
  }
`;

const LogoShowcaseBox = styled.div`
  position: relative;
  display: inline-flex;
  align-self: flex-start;
  margin-bottom: 10px;

  .monarch-logo {
    width: clamp(220px, 28vw, 310px);
    height: auto;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 8px 24px rgba(139, 92, 246, 0.35));
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.03) translateY(-2px);
    }
  }

  .aura-ring {
    position: absolute;
    inset: 10% 15%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(139, 92, 246, 0.28) 0%,
      transparent 70%
    );
    filter: blur(18px);
    z-index: 1;
    animation: ${pulseAura} 3.5s ease-in-out infinite;
  }
`;

const HeroTitle = styled.h1`
  margin: 4px 0 0;
  font-size: clamp(28px, 3.6vw, 42px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};

  span {
    color: #8b5cf6;
  }

  .gradient-stroke {
    font-style: normal;
    text-decoration: underline;
    text-decoration-color: #10b981;
    text-underline-offset: 6px;
  }
`;

const HeroSubtitle = styled.p`
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colorSubtitle};
  max-width: 600px;

  strong {
    color: ${({ theme }) => theme.text};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const PrimaryBattleBtn = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  background: #10b981;
  color: #ffffff !important;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 22px -4px rgba(16, 185, 129, 0.45);
  transition: all 0.2s ease-out;

  .emoji-btn {
    font-size: 16px;
  }

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -4px rgba(16, 185, 129, 0.6);
  }
`;

const SecondaryBattleBtn = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.text} !important;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease-out;

  .emoji-btn {
    font-size: 15px;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: #8b5cf6;
  }
`;

const EfficiencyMetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 22px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetricPill = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 13px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};

  .m-emoji {
    font-size: 22px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  strong {
    font-size: 13.5px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;

/* =========================================================
   VENTANA DE ESTADO SOLO LEVELING (DERECHA)
========================================================= */
const StatusWindowCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  border-radius: 20px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 20px 48px -12px rgba(0, 0, 0, 0.75)"
      : "0 14px 32px -10px rgba(17, 17, 17, 0.08)"};
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};

  .sys-title {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.text};

    .sys-bracket {
      color: #8b5cf6;
      margin: 0 4px;
    }
  }

  .s-rank-badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(139, 92, 246, 0.14);
    border: 1px solid rgba(139, 92, 246, 0.35);
    color: #a855f7;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
  }
`;

const HunterProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  margin-bottom: 16px;

  .avatar-orb {
    position: relative;
    flex-shrink: 0;

    .level-tag {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      padding: 1px 7px;
      border-radius: 999px;
      background: #10b981;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
    }
  }

  .hunter-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .hunter-class {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #10b981;
  }

  .hunter-name {
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hunter-role {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .avatar-switch-btn {
    padding: 7px 11px;
    border-radius: 9px;
    background: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    color: ${({ theme }) => theme.text} !important;
    font-size: 11.5px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: #8b5cf6;
      transform: translateY(-1px);
    }
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-bottom: 16px;
`;

const StatRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .stat-label {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colorSubtitle};

    strong {
      color: ${({ theme }) => theme.text};
      font-weight: 700;
    }
  }
`;

const StatBarTrack = styled.div`
  width: 100%;
  height: 7px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bgAlpha};
  overflow: hidden;
`;

const StatBarFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width || "100%"};
  background: ${({ $color }) => $color || "#10B981"};
  border-radius: 999px;
`;

const PassiveBuffBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.24);

  .buff-emoji {
    font-size: 20px;
  }

  .buff-copy {
    display: flex;
    flex-direction: column;
    font-size: 11.5px;

    strong {
      color: #10b981;
      font-size: 10.5px;
      letter-spacing: 0.05em;
    }

    span {
      color: ${({ theme }) => theme.text};
    }
  }
`;

/* =========================================================
   ARENA DE BATALLA INTERACTIVA SOLO LEVELING
========================================================= */
const BattleArenaSection = styled.section`
  padding: 22px;
  border-radius: 20px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid
    ${({ $slashing, theme }) =>
      $slashing ? "rgba(139, 92, 246, 0.55)" : theme.color2};
  box-shadow: ${({ theme }) =>
    isDarkTheme(theme)
      ? "0 20px 50px -15px rgba(0, 0, 0, 0.8)"
      : "0 12px 32px -10px rgba(17, 17, 17, 0.07)"};
  margin-bottom: 36px;
  transition: border-color 0.2s ease;
`;

const ArenaTopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 14px;
  margin-bottom: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.color2};

  .arena-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.text};

    .live-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
      animation: ${pulseAura} 1.5s infinite;
    }
  }

  .combo-counter {
    padding: 5px 12px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bgAlpha};
    border: 1px solid ${({ theme }) => theme.color2};
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colorSubtitle};

    strong {
      color: #10b981;
    }
  }
`;

const BattleStage = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 18px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FighterCard = styled.div`
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};

  .fighter-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;

    .tag-ally {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #a855f7;
    }

    strong {
      font-size: 16px;
      font-weight: 800;
      color: ${({ theme }) => theme.text};
    }
  }
`;

const MonarchFighterVisual = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    width: 100%;
    max-width: 220px;
    height: auto;
  }

  .aura-pulse {
    animation: ${pulseAura} 2.8s ease-in-out infinite;
  }

  .dagger-slash {
    transform-origin: 130px 110px;
    animation: ${daggerSwing} 1.4s ease-in-out infinite;
  }

  .floating-badge {
    margin-top: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.35);
    color: ${({ theme }) => theme.text};
    font-size: 11px;
    font-weight: 700;
  }
`;

const CombatCenterZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
`;

const SlashEffectBox = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  .slash-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .slash-arc-1,
  .slash-arc-2,
  .lightning-bolt {
    stroke-dasharray: 320;
    animation: ${slashDash} 1.6s ease-out infinite;
  }

  .slash-arc-2 {
    animation-delay: 0.35s;
  }

  .lightning-bolt {
    animation-delay: 0.7s;
  }

  .clash-emojis {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    font-size: 28px;
    pointer-events: none;

    span {
      animation: ${floatEmojiAnim} 2.4s ease-in-out infinite;
    }
    .e2 {
      animation-delay: 0.4s;
    }
    .e3 {
      animation-delay: 0.8s;
    }
    .e4 {
      animation-delay: 1.2s;
    }
  }
`;

const DamagePopup = styled.div`
  padding: 10px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  animation: ${popInDamage} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  .dmg-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    background: #10b981;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .dmg-text {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
`;

const AttackActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.45);
  background: ${({ theme }) =>
    isDarkTheme(theme) ? "#FFFFFF" : "#111111"};
  color: ${({ theme }) =>
    isDarkTheme(theme) ? "#050505" : "#FFFFFF"};
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 24px rgba(139, 92, 246, 0.3);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const BossCard = styled.div`
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
  ${({ $slashing }) =>
    $slashing &&
    css`
      animation: ${shakeHit} 0.45s ease;
    `}

  .boss-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .tag-boss {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #ef4444;
    }

    strong {
      font-size: 15.5px;
      font-weight: 800;
      color: ${({ theme }) => theme.text};
    }
  }

  .hp-bar-wrap {
    margin-bottom: 12px;

    .hp-top {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 700;
      color: ${({ theme }) => theme.colorSubtitle};
      margin-bottom: 4px;

      strong {
        color: #ef4444;
      }
    }

    .hp-track {
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: rgba(239, 68, 68, 0.15);
      overflow: hidden;
    }

    .hp-fill {
      height: 100%;
      background: #ef4444;
      border-radius: 999px;
      transition: width 0.3s ease;
    }
  }
`;

const BossVisual = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .boss-hit-marks {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 800;
    color: #ef4444;
  }

  .defeated-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .defeated-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 9px;
    background: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    font-size: 12px;

    span {
      color: ${({ theme }) => theme.colorSubtitle};
      text-decoration: line-through;
    }

    strong {
      color: #10b981;
      font-size: 11px;
      font-weight: 800;
    }
  }
`;

/* =========================================================
   GRID DE HABILIDADES DE EFICIENCIA (SKILLS RANGO S)
========================================================= */
const SkillsSectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;

  .left {
    .eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #10b981;
    }

    h2 {
      margin: 4px 0 0;
      font-size: clamp(22px, 2.6vw, 28px);
      font-weight: 800;
      letter-spacing: -0.025em;
      color: ${({ theme }) => theme.text};
    }
  }

  .right-sub {
    margin: 0;
    max-width: 440px;
    font-size: 13.5px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  transition: all 0.22s ease-out;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) =>
      isDarkTheme(theme) ? "rgba(255, 255, 255, 0.28)" : "rgba(17, 17, 17, 0.28)"};
    box-shadow: ${({ theme }) =>
      isDarkTheme(theme)
        ? "0 16px 32px -10px rgba(0, 0, 0, 0.7)"
        : "0 14px 28px -10px rgba(17, 17, 17, 0.08)"};

    .emoji-orb {
      transform: scale(1.14) rotate(6deg);
    }
  }

  .skill-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;

    .emoji-orb {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: ${({ theme }) => theme.bgAlpha};
      border: 1px solid ${({ theme }) => theme.color2};
      transition: transform 0.25s ease;
    }

    .skill-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .skill-rank {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
    }

    .skill-sub {
      font-size: 10px;
      font-weight: 700;
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 16px;
    font-size: 13px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colorSubtitle};
    flex: 1;
  }

  .skill-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.color2};
    font-size: 12px;

    .power-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    strong {
      color: ${({ theme }) => theme.text};
    }
  }
`;
