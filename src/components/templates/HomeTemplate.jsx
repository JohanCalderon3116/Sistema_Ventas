import styled from "styled-components";
import { useAuthStore } from "../../store/AuthStore";
import { userAuth } from "../../context/AuthContext";

export const HomeTemplate = () => {
  const { cerrarSesion } = useAuthStore();
  const {user} = userAuth()
  return (
    <Container>
      <span>HomeTemplate</span>
      <button onClick={cerrarSesion}>Cerrar</button>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;
