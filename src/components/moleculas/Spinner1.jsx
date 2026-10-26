import styled, { useTheme } from "styled-components";
import { CircleLoader } from "react-spinners";

export const Spinner1 = ({ texto }) => {
  const theme = useTheme();
  return (
    <Container>
      <CircleLoader
        color={theme?.color1 || "#8B5CF6"}
        size={64}
      />
      {texto && <span className="texto">{texto}</span>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  transition: background-color 0.25s ease, color 0.25s ease;

  .texto {
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;
