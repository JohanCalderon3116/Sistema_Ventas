import styled from "styled-components";

export const Switch = ({ state, setState }) => {
  return (
    <SwitchLabel>
      <ToggleInput type="checkbox" checked={state} onClick={setState} readOnly />
      <Slider />
    </SwitchLabel>
  );
};

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  inset: 0;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme?.text === "#FFFFFF" ? "#1A1A1A" : "#D4D4D8"};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: 999px;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  &:before {
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

  ${ToggleInput}:checked + & {
    background-color: #10b981;
    border-color: #10b981;
  }

  ${ToggleInput}:checked + &:before {
    transform: translateX(20px);
  }
`;
