import styled from "styled-components";
import {
  Btn1,
  Footer,
  GenerarCodigo,
  InputText2,
  Linea,
  Lottieanimation,
  Title,
  useAuthStore,
  VolverBtn,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
import cart from "../../assets/add to cart.json";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { CardModos } from "../organismos/LoginDesing/CardModos";
import { useContraseñaStore } from "../../store/ContraseñaStore";
export const LoginTemplate = () => {
  const [stateModos, setStateModos] = useState(true);
  const [stateModo, setStateModo] = useState(null);
  const [contraseñaOk, setContraseñaOk] = useState(false);
  const [inputContraseña, setInputContraseña] = useState("");
  const { loginGoogle, loginEmail, crearUserYLogin } = useAuthStore();
  const { mostrarContraseña, dataContraseña } = useContraseñaStore();
  const { register, handleSubmit } = useForm();
  useQuery({
    queryKey: ["mostrar contraseña"],
    queryFn: mostrarContraseña,
  });

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
  const { mutate } = useMutation({
    mutationKey: ["iniciar sesion con email"],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error al iniciar sesión: ${error.message}`);
    },
  });
  const { mutate: mutateTester } = useMutation({
    mutationKey: ["iniciar sesion con email tester"],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error al iniciar sesión: ${error.message}`);
    },
    onSuccess: () => {
      window.location.reload();
    },
  });
  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password });
  };
  const manejadorEmailSesionTester = (data) => {
    mutate({ email: "tester1@gmail.com", password: "123456" });
  };
  const manejarCrearUserTester = () => {
    const response = GenerarCodigo({ id: 2 });
    const email = "@gmail.com";
    const correoCompleto = response.toLowerCase() + email;
    mutateTester({ email: correoCompleto, password: "123456" });
  };
  return (
    <Container>
      <Toaster richColors></Toaster>
      <div className="card">
        <ContentLogo>
          <img src={v.logo} alt="" />
          <span>SoftCreate POS v1.0</span>
        </ContentLogo>
        <Title $paddingBottom="20px">Iniciar sesión</Title>
        <Lottieanimation
          ancho={220}
          alto={220}
          animacion={cart}
        ></Lottieanimation>
        {stateModos && (
          <ContentModos>
            <CardModos
              title={"Super admin"}
              subtitle={"Crea y gestiona tu empresa."}
              bgcolor={"#601dad"}
              img={"https://i.ibb.co/v6c45GD9/admin.png"}
              funcion={() => {
                setStateModo("superadmin");
                setStateModos(!stateModos);
              }}
            ></CardModos>
            <CardModos
              title={"Empleado"}
              subtitle={"Vende y haz crecer tu negocio."}
              bgcolor={"#121b93"}
              img={"https://i.ibb.co/xqyKYrX6/trabajando.png"}
              funcion={() => {
                setStateModo("empleado");
                setStateModos(!stateModos);
              }}
            ></CardModos>
            <CardModos
              title={"Invitado"}
              subtitle={"Obten una prueba de 30 días gratis."}
              bgcolor={"#d30d0d"}
              img={"https://i.ibb.co/SDphqvqL/damas-de-honor.png"}
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
                border="2px"
                titulo="Ingresar"
                bgcolor="#1cb0f6"
                color="255,255,255"
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
                  width="100%"
                />
              </>
            ) : (
              <>
                <Btn1
                  border="2px"
                  funcion={loginGoogle}
                  titulo="Google"
                  color={(theme) => theme.bgtotal}
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
              border="2px"
              funcion={manejadorEmailSesionTester}
              titulo="Invitado"
              bgcolor="#f6ce1c"
            />
          </PanelModo>
        )}
      </div>
      <Footer></Footer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 20px;
  color: ${({ theme }) => theme.text};

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 20px;
    @media ${Device.tablet} {
      width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`;
const ContentLogo = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  span {
    font-weight: 700;
  }
  img {
    width: 10%;
  }
`;
const ContentModos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const PanelModo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
