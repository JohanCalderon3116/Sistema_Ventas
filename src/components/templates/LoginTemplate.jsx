import styled from "styled-components";
import {
  Btn1,
  Footer,
  InputText2,
  Linea,
  Title,
  useAuthStore,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
export const LoginTemplate = () => {
  const { loginGoogle } = useAuthStore();
  return (
    <Container>
      <div className="card">
        <ContentLogo>
          <img src={v.logo} alt="" />
          <span>SoftCreate POS v1.0</span>
        </ContentLogo>
        <Title $paddingBottom="20px">Iniciar sesión</Title>
        <form action="">
          <InputText2>
            <input
              className="form__field"
              placeholder="Correo"
              type="text"
            ></input>
          </InputText2>
          <InputText2>
            <input
              className="form__field"
              placeholder="Contraseña"
              type="password"
            ></input>
          </InputText2>
          <Btn1
            titulo="Ingresar"
            bgcolor="#1cb0f6"
            color="255,255,255"
            width="100%"
          ></Btn1>
        </form>
        <Linea>
          <span>0</span>
        </Linea>
        <Btn1
          funcion={loginGoogle}
          titulo="Google"
          color="#fff"
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
