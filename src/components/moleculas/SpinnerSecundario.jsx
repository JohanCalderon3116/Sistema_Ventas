import styled from "styled-components";
import { ClockLoader } from "react-spinners";

export const SpinnerSecundario = ({texto}) => {
  return (
    <Container>
      <ClockLoader color="#7f3ceb" size={20}></ClockLoader>
      <span> {texto} </span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
