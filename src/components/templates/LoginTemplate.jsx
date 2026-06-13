import styled from "styled-components";
import {
  Btn1,
  Footer,
  InputText2,
  Linea,
  Lottieanimation,
  Title,
  useAuthStore,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
import cart from "../../assets/add to cart.json";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
export const LoginTemplate = () => {
  const { loginGoogle, loginEmail } = useAuthStore();
  const { register, handleSubmit } = useForm();
  const { mutate } = useMutation({
    mutationKey: ["iniciar sesion con email"],
    mutationFn: loginEmail,
    onError: (error) => {
      toast.error(`Error al iniciar sesión: ${error.message}`);
    },
  });
  const manejadorEmailSesion = (data) => {
    mutate({ email: data.email, password: data.password });
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
        <Lottieanimation
          ancho={220}
          alto={220}
          animacion={cart}
        ></Lottieanimation>
        <Linea>
          <span>0</span>
        </Linea>
        <Btn1
          border="2px"
          funcion={loginGoogle}
          titulo="Google"
          color={(theme) => theme.bgtotal}
          icono={<v.iconogoogle />}
        ></Btn1>
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
