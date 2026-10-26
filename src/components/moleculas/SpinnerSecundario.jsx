import styled, { useTheme } from "styled-components";
import { RotateLoader } from "react-spinners";

export const SpinnerSecundario = ({ texto }) => {
  const theme = useTheme();
  return (
    <Container>
      <RotateLoader color={theme?.color1 || "#8B5CF6"} size={14}></RotateLoader>
      <span>{texto}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;
