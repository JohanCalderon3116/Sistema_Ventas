import React from "react";
import styled from "styled-components";

export const Check = ({ checked, onChange }) => {
  return (
    <Container>
      <Input type="checkbox" checked={checked} onChange={onChange} />
      <Checkmark />
    </Container>
  );
};

const Container = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const Checkmark = styled.div`
  width: 22px;
  height: 22px;
  position: relative;
  border: 1.5px solid ${({ theme }) => theme.color2 || "rgba(161, 161, 170, 0.45)"};
  border-radius: 6px;
  background-color: ${({ theme }) =>
    theme?.text === "#FFFFFF" ? "rgba(255, 255, 255, 0.05)" : "#E6E6EA"};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  ${Input}:checked ~ & {
    background-color: #10b981;
    border-color: #10b981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.28);
  }

  &:after {
    content: "";
    width: 5px;
    height: 10px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    margin-bottom: 2px;
    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${Input}:checked ~ &:after {
    transform: rotate(45deg) scale(1);
  }
`;
