import styled, { useTheme } from "styled-components";
import { useEditarTemaMutationStack } from "../../tanstack/UsuariosStack";
import { Icon } from "@iconify/react";

export function ToggleTema() {
  const { mutate } = useEditarTemaMutationStack();
  const theme = useTheme();
  const isDark =
    theme?.text === "#FFFFFF" ||
    theme?.bgtotal === "#050505" ||
    theme?.bgtotal === "#000000" ||
    theme?.bgtotal === "#121216" ||
    theme?.bgtotal === "#09090B" ||
    theme?.bgtotal === "#101010";

  return (
    <Container>
      <div className="container">
        <label className="toggle" title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
          <input
            id="switch"
            className="input"
            type="checkbox"
            onClick={mutate}
          />
          <div className="icon-wrapper">
            <Icon
              icon={isDark ? "lucide:sun" : "lucide:moon"}
              width="20"
              height="20"
            />
          </div>
        </label>
      </div>
    </Container>
  );
}

const Container = styled.div`
  justify-content: center;
  display: flex;

  .toggle {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: ${({ theme }) => theme.bgcards};
    border: 1px solid ${({ theme }) => theme.color2};
    color: ${({ theme }) => theme.text};
    transition: all 0.2s ease-out;
    margin-top: 10px;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.text};
    }
  }

  .input {
    display: none;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toggle:hover .icon-wrapper {
    transform: rotate(15deg) scale(1.06);
  }
`;
