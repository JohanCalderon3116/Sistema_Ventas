import styled, { useTheme } from "styled-components";
import { RingLoader } from "react-spinners";

export const Spinner1 = () => {
  const theme = useTheme();
  return (
    <Container>
      <RingLoader color={theme.color1} size={80}></RingLoader>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
