import styled from "styled-components";

export function Switch1({ state, setState }) {
  return (
    <Container>
      <label className="switch">
        <input
          checked={state}
          className="toggle"
          type="checkbox"
          onClick={setState}
          readOnly
        />
        <span className="slider"></span>
        <span className="card-side"></span>
      </label>
    </Container>
  );
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    cursor: pointer;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    inset: 0;
    cursor: pointer;
    background-color: ${({ theme }) =>
      theme.bgtotal === "#121216" ? "#27272F" : "#D4D4D8"};
    border: 1px solid ${({ theme }) => theme.color2};
    border-radius: 999px;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toggle:checked + .slider {
    background-color: #10b981;
    border-color: #10b981;
  }

  .toggle:checked + .slider:before {
    transform: translateX(20px);
  }
`;
