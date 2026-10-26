import styled from "styled-components";
import { v } from "../../styles/variables";

export const Buscador = ({ setBuscador }) => {
  function buscar(e) {
    setBuscador(e.target.value);
  }
  return (
    <Container>
      <section className="content">
        <v.iconoBuscar className="icono"></v.iconoBuscar>
        <input placeholder="Buscar..." onChange={buscar}></input>
      </section>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 10px;
  height: 46px;
  min-width: 260px;
  align-items: center;
  display: flex;
  background: ${({ theme }) => theme.bgcards};
  color: ${({ theme }) => theme.colorSubtitle};
  border: 1px solid ${({ theme }) => theme.color2};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.text};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.bgAlpha};
  }

  .content {
    padding: 0 14px;
    gap: 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    .icono {
      font-size: 16px;
      color: ${({ theme }) => theme.colorSubtitle};
    }
    input {
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      width: 100%;
      outline: none;
      background: none;
      border: 0;
      color: ${(props) => props.theme.text};
      &::placeholder {
        color: ${({ theme }) => theme.colorSubtitle};
        opacity: 0.7;
      }
    }
  }
`;
