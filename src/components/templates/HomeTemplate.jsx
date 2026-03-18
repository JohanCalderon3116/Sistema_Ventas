import styled from "styled-components";
import { useAuthStore } from "../../store/AuthStore";
import { userAuth } from "../../context/AuthContext";
import { Welcome } from "../../index";

export const HomeTemplate = () => {
  const { cerrarSesion } = useAuthStore();
  const {user} = userAuth()
  return (
    <Container>
      <Welcome></Welcome>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;
