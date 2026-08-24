import styled from "styled-components";
import { LandingPagesWelcome } from "../organismos/LandingPages/LandingPagesWelcome";
export const HomeTemplate = () => {
  return (
    <Container>
      <LandingPagesWelcome></LandingPagesWelcome>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
`;
