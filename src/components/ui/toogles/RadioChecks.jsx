import styled from "styled-components";
import { useMovStockStore } from "../../../store/MovStockStore";

export const RadioChecks = () => {
  const { setTipo, tipo } = useMovStockStore();

  return (
    <Container>
      <div className="radio-inputs">
        <label className="radio ingreso">
          <input
            type="radio"
            name="radio"
            value="ingreso"
            checked={tipo === "ingreso"}
            onChange={() => setTipo("ingreso")}
          />
          <span className="name">Ingreso</span>
        </label>

        <label className="radio salida">
          <input
            type="radio"
            name="radio"
            value="salida"
            checked={tipo === "salida"}
            onChange={() => setTipo("salida")}
          />
          <span className="name">Salida</span>
        </label>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 10px;
    background-color: ${({ theme }) =>
      theme?.text === "#FFFFFF" ? "#131313" : "#E6E6EA"};
    border: 1px solid ${({ theme }) => theme.color2};
    box-sizing: border-box;
    padding: 4px;
    width: 100%;
    max-width: 300px;
    font-size: 14px;
    gap: 4px;

    .radio {
      flex: 1 1 auto;
      text-align: center;
      input {
        display: none;
      }
      .name {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 7px;
        border: none;
        padding: 8px 0;
        color: ${({ theme }) => theme.colorSubtitle};
        font-weight: 500;
        transition: all 0.18s ease-out;
      }
    }

    .radio.ingreso input:checked + .name {
      background-color: #10b981;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
    }

    .radio.salida input:checked + .name {
      background-color: #ef4444;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
    }
  }
`;
