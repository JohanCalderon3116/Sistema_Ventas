import styled from "styled-components";

export function Checkbox1({ isChecked, onChange }) {
  return (
    <Container>
      <input checked={isChecked} onChange={onChange} type="checkbox" readOnly={!onChange} />
      <div className="checkmark"></div>
    </Container>
  );
}

const Container = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkmark {
    width: 22px;
    height: 22px;
    position: relative;
    border: 1.5px solid ${({ theme }) => theme.color2 || "rgba(161, 161, 170, 0.45)"};
    border-radius: 6px;
    background-color: ${({ theme }) =>
      theme.bgtotal === "#121216" ? "rgba(255, 255, 255, 0.05)" : "#F4F4F5"};
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover .checkmark {
    border-color: rgba(16, 185, 129, 0.55);
  }

  input:checked ~ .checkmark {
    background-color: #10b981;
    border-color: #10b981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.28);
  }

  .checkmark:after {
    content: "";
    width: 5px;
    height: 10px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    margin-bottom: 2px;
    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  input:checked ~ .checkmark:after {
    transform: rotate(45deg) scale(1);
  }
`;
