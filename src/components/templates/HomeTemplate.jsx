import styled from "styled-components";
import { Welcome } from "../../index";
export const HomeTemplate = () => {
  return (
    <Container>
      <Welcome></Welcome>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;
