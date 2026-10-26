import styled, { keyframes, useTheme } from "styled-components";
import {
  Btn1,
  Footer,
  InputText2,
  Linea,
  Title,
  useAuthStore,
  VolverBtn,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { CardModos } from "../organismos/LoginDesing/CardModos";
import { EscenaHalloween } from "../organismos/LoginDesing/EscenaHalloween";
import { useContraseñaStore } from "../../store/ContraseñaStore";
import {
  useIniciarSesionConEmailMutationStack,
  useMostrarContraseñaQueryStack,
} from "../../tanstack/LoginStack";
import { useThemeStore } from "../../store/ThemeStore";
import { Dark, Light } from "../../styles/themes";
import { Icon } from "@iconify/react";

const PALETA = {
  dark: {
    superadmin: "#18181D",
    empleado: "#18181D",
    invitado: "#18181D",
  },
  light: {
    superadmin: "#121216",
    empleado: "#121216",
    invitado: "#121216",
  },
};

export const LoginTemplate = () => {
  const [stateModos, setStateModos] = useState(true);
  const [stateModo, setStateModo] = useState(null);
  const [contraseñaOk, setContraseñaOk] = useState(false);
  const [inputContraseña, setInputContraseña] = useState("");
  const { loginGoogle } = useAuthStore();
  const { dataContraseña } = useContraseñaStore();
  const { register, handleSubmit } = useForm();
  useMostrarContraseñaQueryStack();

  const theme = useTheme();
  const { theme: storeTheme, setTheme } = useThemeStore();
  const isDark =
    storeTheme === "dark" ||
    theme?.text === "#FFFFFF" ||
    theme?.bgtotal === "#050505" ||
    theme?.bgtotal === "#000000" ||
    theme?.bgtotal === "#121216" ||
    theme?.bgtotal === "#09090B" ||
    theme?.bgtotal === "#101010";
  const colores = isDark ? PALETA.dark : PALETA.light;

  const toggleTema = () => {
    const nuevoTema = isDark ? "light" : "dark";
    const nuevoStyle = nuevoTema === "light" ? Light : Dark;
    setTheme({
      tema: nuevoTema,
      style: nuevoStyle,
    });
  };

  const validarContraseña = () => {
    const data = dataContraseña;
    const contraseñaReal = data[0]?.contraseña;
    if (Number(inputContraseña) === contraseñaReal) {
      setContraseñaOk(true);
      toast.success("Contraseña correcta, entrando al modo SuperAdmin");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };
  const { mutate } = useIniciarSesionConEmailMutationStack();
  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password });
  };
  const manejadorEmailSesionTester = () => {
    mutate({ email: "tester1@gmail.com", password: "123456" });
  };

  return (
    <Container>
      <EscenaHalloween />
      <Toaster richColors position="top-center"></Toaster>

      <BotonToggleTemaLogin
        type="button"
        onClick={toggleTema}
        title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        aria-label="Cambiar tema de inicio de sesión"
      >
        <Icon icon={isDark ? "lucide:sun" : "lucide:moon"} />
      </BotonToggleTemaLogin>

      <div className="card">
        <ContentLogo>
          <span className="marca">
            <img src={v.logo} alt="SoftCreate POS" />
          </span>
        </ContentLogo>
        <TituloWrap>
          <Title $paddingBottom="8px">Iniciar sesión</Title>
          <p className="subtitulo-login">
            Selecciona tu perfil de acceso para continuar
          </p>
        </TituloWrap>
        {stateModos && (
          <ContentModos>
            <CardModos
              title={"Super Administrador"}
              subtitle={"Crea y gestiona tu empresa."}
              bgcolor={colores.superadmin}
              img={"lucide:shield-check"}
              funcion={() => {
                setStateModo("superadmin");
                setStateModos(!stateModos);
              }}
            ></CardModos>
            <CardModos
              title={"Empleado"}
              subtitle={"Vende y haz crecer tu negocio."}
              bgcolor={colores.empleado}
              img={"lucide:briefcase"}
              funcion={() => {
                setStateModo("empleado");
                setStateModos(!stateModos);
              }}
            ></CardModos>
            <CardModos
              title={"Invitado"}
              subtitle={"Cuenta comunitaria."}
              bgcolor={colores.invitado}
              img={"lucide:users"}
              funcion={() => {
                setStateModo("invitado");
                setStateModos(!stateModos);
              }}
            ></CardModos>
          </ContentModos>
        )}
        {stateModo === "empleado" && stateModos === false && (
          <PanelModo>
            <VolverBtn funcion={() => setStateModos(!stateModos)}></VolverBtn>
            <span>Modo empleado</span>
            <form onSubmit={handleSubmit(manejadorEmailSesion)} action="">
              <InputText2>
                <input
                  className="form__field"
                  placeholder="Correo"
                  type="text"
                  {...register("email", { required: true })}
                ></input>
              </InputText2>
              <InputText2>
                <input
                  className="form__field"
                  placeholder="Contraseña"
                  type="password"
                  {...register("password", { required: true })}
                ></input>
              </InputText2>
              <Btn1
                border="1px"
                titulo="Ingresar"
                bgcolor="#121216"
                color="#FFFFFF"
                width="100%"
              ></Btn1>
            </form>
          </PanelModo>
        )}
        {stateModo === "superadmin" && stateModos === false && (
          <PanelModo>
            <VolverBtn funcion={() => setStateModos(!stateModos)}></VolverBtn>
            <span>Modo Super Admin</span>
            {!contraseñaOk ? (
              <>
                <InputText2>
                  <input
                    className="form__field"
                    placeholder="Contraseña de acceso"
                    type="password"
                    value={inputContraseña}
                    onChange={(e) => setInputContraseña(e.target.value)}
                  />
                </InputText2>
                <Btn1
                  titulo="Verificar"
                  funcion={validarContraseña}
                  bgcolor="#121216"
                  color="#FFFFFF"
                  width="100%"
                />
              </>
            ) : (
              <>
                <Btn1
                  border="1px"
                  funcion={loginGoogle}
                  titulo="Google"
                  bgcolor="#ffffff"
                  color="18,18,22"
                  icono={<v.iconogoogle />}
                />
                <Linea>
                  <span>O</span>
                </Linea>
              </>
            )}
          </PanelModo>
        )}
        {stateModo === "invitado" && stateModos === false && (
          <PanelModo>
            <VolverBtn funcion={() => setStateModos(!stateModos)}></VolverBtn>
            <span>Modo Invitado</span>
            <Btn1
              border="1px"
              funcion={manejadorEmailSesionTester}
              titulo="Invitado"
              bgcolor="#121216"
              color="#FFFFFF"
            />
          </PanelModo>
        )}
      </div>
      <FooterWrap>
        <Footer></Footer>
      </FooterWrap>
    </Container>
  );
};

const surgir = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const entrar = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

const Container = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 24px;
  overflow-x: hidden;
  color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  background-color: ${({ theme }) =>
    isDarkTheme(theme) ? "#050505" : "#EEEEF0"};
  transition:
    background-color 0.25s ease,
    color 0.25s ease;

  .card {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin: 20px;
    padding: 32px 28px;
    border-radius: 20px;
    background: ${({ theme }) =>
      isDarkTheme(theme) ? "#0D0D0D" : "#F7F7F8"};
    border: 1px solid
      ${({ theme }) =>
        isDarkTheme(theme)
          ? "rgba(255, 255, 255, 0.09)"
          : "rgba(17, 17, 17, 0.10)"};
    box-shadow: ${({ theme }) =>
      isDarkTheme(theme)
        ? "0 24px 48px -12px rgba(0, 0, 0, 0.7)"
        : "0 12px 32px -8px rgba(17, 17, 17, 0.06)"};
    animation: ${surgir} 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards;
    transition:
      background 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;

    @media ${Device.tablet} {
      width: 420px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

const BotonToggleTemaLogin = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid
    ${({ theme }) =>
      isDarkTheme(theme)
        ? "rgba(255, 255, 255, 0.09)"
        : "rgba(17, 17, 17, 0.10)"};
  background: ${({ theme }) => (isDarkTheme(theme) ? "#0D0D0D" : "#F7F7F8")};
  color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-out;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  }
  &:active {
    transform: scale(0.96);
  }
  svg {
    font-size: 18px;
  }
`;

const ContentLogo = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 0 18px;
  .marca {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  img {
    width: 190px;
    height: auto;
    object-fit: contain;
    filter: ${({ theme }) =>
      isDarkTheme(theme)
        ? "drop-shadow(0 0 12px rgba(139, 92, 246, 0.28))"
        : "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))"};
  }
  .nombre {
    font-family: "Poppins", sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  }
`;

const TituloWrap = styled.div`
  margin-bottom: 22px;
  && h1,
  && span {
    font-family: "Poppins", sans-serif;
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  }
  .subtitulo-login {
    margin: 4px 0 0;
    font-size: 0.85rem;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#A1A1AA" : "#52525B")};
    font-weight: 400;
  }
`;

const ContentModos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > * {
    animation: ${entrar} 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  }
  > *:nth-child(1) {
    animation-delay: 0.08s;
  }
  > *:nth-child(2) {
    animation-delay: 0.16s;
  }
  > *:nth-child(3) {
    animation-delay: 0.24s;
  }
`;

const PanelModo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${entrar} 0.35s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  > span {
    font-family: "Poppins", sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
  }
  .form__field {
    color: ${({ theme }) =>
      isDarkTheme(theme) ? "#FFFFFF !important" : "#111111 !important"};
    background: ${({ theme }) =>
      isDarkTheme(theme) ? "#050505 !important" : "#EEEEF0 !important"};
    border: 1px solid
      ${({ theme }) =>
        isDarkTheme(theme)
          ? "rgba(255, 255, 255, 0.12) !important"
          : "rgba(17, 17, 17, 0.14) !important"};
    border-radius: 10px;
    transition: all 0.2s ease-out;
    &::placeholder {
      color: ${({ theme }) => (isDarkTheme(theme) ? "#71717A" : "#71717A")};
    }
    &:focus {
      outline: none;
      border-color: ${({ theme }) =>
        isDarkTheme(theme) ? "#FFFFFF !important" : "#111111 !important"};
    }
  }
`;

const FooterWrap = styled.div`
  position: relative;
  z-index: 2;
  color: ${({ theme }) => (isDarkTheme(theme) ? "#A1A1AA" : "#52525B")};
  opacity: 0.85;
  a {
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
