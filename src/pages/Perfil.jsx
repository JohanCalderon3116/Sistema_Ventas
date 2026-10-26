import styled, { keyframes, useTheme } from "styled-components";
import { InputText2 } from "../components/organismos/formularios/InputText2";
import { Btn1 } from "../components/moleculas/Btn1";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useEditarUsuarioMutationStack } from "../tanstack/UsuariosStack";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";

const STORAGE_KEY = "softcreate_user_avatar_id";

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(1.5deg); }
`;

const blinkAnim = keyframes`
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.1); }
`;

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.25); }
`;

export const AVATAR_CATALOG = [
  { id: "cyber", label: "Ejecutivo" },
  { id: "bot", label: "AI Bot" },
  { id: "astro", label: "Astro" },
  { id: "ninja", label: "Sigilo" },
  { id: "crown", label: "VIP" },
  { id: "orbital", label: "Orbital" },
];

export function renderAnimatedAvatarSvg(avatarId = "cyber") {
  switch (avatarId) {
    case "bot":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-float">
            <line x1="32" y1="8" x2="32" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle className="avatar-pulse" cx="32" cy="7" r="3.5" fill="#10B981" />
            <rect x="14" y="16" width="36" height="30" rx="10" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
            <g className="avatar-blink" style={{ transformOrigin: "32px 30px" }}>
              <rect x="21" y="26" width="7" height="7" rx="2.5" fill="currentColor" />
              <rect x="36" y="26" width="7" height="7" rx="2.5" fill="currentColor" />
            </g>
            <path d="M25 39H39" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 54C20 49.5 25.5 47 32 47C38.5 47 44 49.5 44 54" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "astro":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-float">
            <circle cx="32" cy="30" r="18" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.2" />
            <rect x="19" y="21" width="26" height="16" rx="8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
            <g className="avatar-blink" style={{ transformOrigin: "32px 29px" }}>
              <circle cx="26" cy="29" r="2.2" fill="currentColor" />
              <circle cx="38" cy="29" r="2.2" fill="currentColor" />
            </g>
            <circle className="avatar-pulse" cx="23" cy="25" r="1.5" fill="#8B5CF6" />
            <path d="M18 55C18 49 24 46 32 46C40 46 46 49 46 55" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "ninja":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-float">
            <circle cx="32" cy="30" r="16" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
            <path d="M16 26C21 23 43 23 48 26" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
            <path d="M48 25C52 23 56 25 58 28" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" />
            <g className="avatar-blink" style={{ transformOrigin: "32px 29px" }}>
              <path d="M23 29L28 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M41 29L36 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <path d="M19 54C19 48.5 25 46 32 46C39 46 45 48.5 45 54" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "crown":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-float">
            <path d="M19 20L24 12L32 18L40 12L45 20H19Z" fill="#8B5CF6" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="32" cy="33" r="11" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
            <g className="avatar-blink" style={{ transformOrigin: "32px 32px" }}>
              <circle cx="28.5" cy="32" r="1.8" fill="currentColor" />
              <circle cx="35.5" cy="32" r="1.8" fill="currentColor" />
            </g>
            <path d="M18 55C18 49 24 46 32 46C40 46 46 49 46 55" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "orbital":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-spin" style={{ transformOrigin: "32px 32px" }}>
            <circle cx="32" cy="32" r="24" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="32" cy="8" r="2.5" fill="#8B5CF6" />
          </g>
          <g className="avatar-float">
            <circle cx="32" cy="27" r="9.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
            <path d="M19 50C19 44.5 24.8 41 32 41C39.2 41 45 44.5 45 50" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "cyber":
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="avatar-float">
            <circle cx="32" cy="25" r="11" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
            <g className="avatar-blink" style={{ transformOrigin: "32px 24px" }}>
              <rect x="25" y="22.5" width="14" height="3.5" rx="1.75" fill="#8B5CF6" />
            </g>
            <path d="M16 53C16 45.8 23.2 41 32 41C40.8 41 48 45.8 48 53" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle className="avatar-pulse" cx="47" cy="16" r="2.5" fill="#10B981" />
          </g>
        </svg>
      );
  }
}

export function useSelectedUserAvatar() {
  const [avatarId, setAvatarId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "cyber";
    } catch {
      return "cyber";
    }
  });

  useEffect(() => {
    const syncAvatar = () => {
      try {
        setAvatarId(localStorage.getItem(STORAGE_KEY) || "cyber");
      } catch {}
    };
    window.addEventListener("softcreate_avatar_change", syncAvatar);
    window.addEventListener("storage", syncAvatar);
    return () => {
      window.removeEventListener("softcreate_avatar_change", syncAvatar);
      window.removeEventListener("storage", syncAvatar);
    };
  }, []);

  const selectAvatar = (id) => {
    setAvatarId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
      window.dispatchEvent(new Event("softcreate_avatar_change"));
    } catch {}
  };

  return { avatarId, selectAvatar };
}

export function UserAvatarBadge({ size = 48, avatarIdOverride }) {
  const { avatarId } = useSelectedUserAvatar();
  const activeId = avatarIdOverride || avatarId;
  return (
    <AvatarBadgeBox $size={size} aria-label="Avatar de usuario">
      {renderAnimatedAvatarSvg(activeId)}
      <span className="online-dot" />
    </AvatarBadgeBox>
  );
}

export const Perfil = () => {
  const { datausuarios } = useUsuariosStore();
  const { mutate, isPending } = useEditarUsuarioMutationStack();
  const theme = useTheme();
  const { avatarId, selectAvatar } = useSelectedUserAvatar();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombres: datausuarios?.nombres || "",
      nro_doc: datausuarios?.nro_doc || "",
      telefono: datausuarios?.telefono || "",
    },
  });
  return (
    <Container>
      <Toaster richColors position="top-center" />
      {isPending ? (
        <ConteinerLoader>
          <span>
            <strong>Guardando</strong>
          </span>
          <BeatLoader color={theme.text} size={8} />
        </ConteinerLoader>
      ) : (
        <ProfileCard>
          <Title>Mi Perfil</Title>
          <Avatar>
            <ContentRol>
              <span className="dot" />
              <span>{datausuarios?.roles?.nombre}</span>
            </ContentRol>
            <UserAvatarBadge size={76} avatarIdOverride={avatarId} />
            <span className="nombre">{datausuarios?.nombres}</span>
            <span className="sub-email">{datausuarios?.correo}</span>
          </Avatar>

          <AvatarSelectorSection>
            <span className="selector-title">Seleccionar avatar animado</span>
            <div className="avatar-grid">
              {AVATAR_CATALOG.map((item) => (
                <AvatarOptionBtn
                  key={item.id}
                  type="button"
                  $active={avatarId === item.id}
                  onClick={() => {
                    selectAvatar(item.id);
                    toast.success(`Avatar "${item.label}" activado`);
                  }}
                >
                  <div className="svg-preview">
                    {renderAnimatedAvatarSvg(item.id)}
                  </div>
                  <span className="avatar-label">{item.label}</span>
                </AvatarOptionBtn>
              ))}
            </div>
          </AvatarSelectorSection>

          <form onSubmit={handleSubmit(mutate)}>
            <Label>Nombres</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nombres"
                type="text"
                {...register("nombres", {
                  required: true,
                })}
              />
              {errors.nombres?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Número de Identidad</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="nro_doc"
                type="number"
                {...register("nro_doc", {
                  required: true,
                })}
              />
              {errors.nro_doc?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Celular</Label>
            <InputText2>
              <input
                className="form__field"
                placeholder="telefono"
                type="number"
                {...register("telefono", {
                  required: true,
                })}
              />
              {errors.telefono?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Label>Email</Label>
            <InputText2>
              <input
                disabled={true}
                step="0.01"
                defaultValue={datausuarios?.correo}
                className="form__field"
                placeholder="correo"
                type="email"
              />
            </InputText2>
            <div className="submit-wrap">
              <Btn1
                bgcolor="#10B981"
                color="#FFFFFF"
                width="100%"
                titulo="GUARDAR CAMBIOS"
              />
            </div>
          </form>
        </ProfileCard>
      )}
    </Container>
  );
};

const AvatarBadgeBox = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 16px;
  background: ${({ theme }) =>
    theme?.text === "#FFFFFF" ? "#131313" : "#E6E6EA"};
  border: 1px solid ${({ theme }) => theme?.color2 || "rgba(128,128,128,0.2)"};
  color: ${({ theme }) => theme?.text || "#111111"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  svg {
    width: 100%;
    height: 100%;
  }

  .avatar-float {
    animation: ${floatAnim} 3.2s ease-in-out infinite;
  }

  .avatar-blink {
    animation: ${blinkAnim} 4.2s ease-in-out infinite;
  }

  .avatar-spin {
    animation: ${spinSlow} 12s linear infinite;
  }

  .avatar-pulse {
    animation: ${pulseDot} 2.2s ease-in-out infinite;
  }

  .online-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid ${({ theme }) => theme?.bgcards || "#FFFFFF"};
  }
`;

const Container = styled.div`
  padding: 28px 16px;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  p {
    color: #ef4444;
    font-weight: 600;
    font-size: 12px;
    margin: 4px 0 0;
  }
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 20px;
  padding: 26px 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);

  .submit-wrap {
    margin-top: 18px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 18px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
  position: relative;
  width: 100%;
  border-radius: 16px;
  padding: 24px 16px 18px;
  background-color: ${({ theme }) => theme.bgtotal};
  border: 1px solid ${({ theme }) => theme.color2};

  .nombre {
    font-weight: 700;
    text-align: center;
    font-size: 20px;
    color: ${({ theme }) => theme.text};
    margin-top: 4px;
  }

  .sub-email {
    font-size: 13px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;

const ContentRol = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 999px;
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.text};

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }
`;

const AvatarSelectorSection = styled.div`
  margin-bottom: 20px;
  padding: 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.bgtotal};
  border: 1px solid ${({ theme }) => theme.color2};

  .selector-title {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colorSubtitle};
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    @media (max-width: 480px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const AvatarOptionBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.bgcards : "transparent"};
  border: 1.5px solid
    ${({ theme, $active }) => ($active ? "#10B981" : theme.color2)};
  color: ${({ theme }) => theme.text};
  transition: all 0.18s ease-out;

  .svg-preview {
    width: 34px;
    height: 34px;
    svg {
      width: 100%;
      height: 100%;
    }
    .avatar-float {
      animation: ${floatAnim} 3.2s ease-in-out infinite;
    }
    .avatar-blink {
      animation: ${blinkAnim} 4.2s ease-in-out infinite;
    }
    .avatar-spin {
      animation: ${spinSlow} 12s linear infinite;
    }
  }

  .avatar-label {
    font-size: 10px;
    font-weight: 600;
    color: ${({ theme, $active }) =>
      $active ? theme.text : theme.colorSubtitle};
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme, $active }) =>
      $active ? "#10B981" : theme.text};
  }
`;

const ConteinerLoader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  gap: 8px;
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
