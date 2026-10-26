import styled from "styled-components";

export function InputText2({ children }) {
  return (
    <Container>
      <div className="form__group field">{children}</div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  .form__group {
    position: relative;
    width: 100%;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${({ theme }) => theme.text};
    transition: background-color 5000s ease-in-out 0s;
  }

  .form__field {
    border: 1px solid ${({ theme }) => theme.color2};
    border-radius: 10px;
    font-family: inherit;
    outline: 0;
    font-size: 15px;
    color: ${({ theme }) => theme.text};
    padding: 11px 14px;
    background: ${({ theme }) => theme.bgcards};
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;

    &.disabled {
      color: #71717a;
      background: ${({ theme }) => theme.bgAlpha};
      border-radius: 8px;
      margin-top: 8px;
      border-bottom: 1px dashed #71717a;
    }
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 15px;
    cursor: text;
  }

  .form__field:focus {
    font-weight: 600;
    border: 1px solid
      ${({ theme }) =>
        theme.text === "#FFFFFF"
          ? "rgba(255, 255, 255, 0.48)"
          : "rgba(17, 17, 17, 0.45)"};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.text === "#FFFFFF"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(17, 17, 17, 0.07)"};
    background: ${({ theme }) => theme.bgcards};
  }

  .form__field:hover:not(:focus) {
    border-color: ${({ theme }) =>
      theme.text === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.22)"
        : "rgba(17, 17, 17, 0.22)"};
  }

  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }

  .form__field::placeholder {
    color: ${({ theme }) => theme.colorSubtitle};
    opacity: 0.7;
  }
`;
