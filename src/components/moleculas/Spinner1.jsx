import styled from "styled-components";
import { RingLoader } from "react-spinners";

export const Spinner1 = () => {
  return (
    <Container>
      <RingLoader color="#7f3ceb" size={80}></RingLoader>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
