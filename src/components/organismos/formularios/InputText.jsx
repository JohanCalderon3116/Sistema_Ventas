import styled from "styled-components";

export function InputText({ children, icono, textaling }) {
  return (
    <Container $textaling={textaling}>
      <span>{icono}</span>

      <div className="form__group field">{children}</div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  p {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
  }
  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${(props) => props.theme.text};
    transition: background-color 5000s ease-in-out 0s;
  }
  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    border-bottom: 2px solid ${({ theme }) => theme.color2 || "#71717a"};
    outline: 0;
    font-size: 16px;
    color: ${(props) => props.theme.text};
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s ease;
    text-align: ${(props) => props.$textaling};
    &.disabled {
      color: #71717a;
      background: ${({ theme }) => theme.bgAlpha};
      border-radius: 8px;
      margin-top: 8px;
      border-bottom: 1px dashed #71717a;
    }
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 15px;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 14px;
    color: ${({ theme }) => theme.colorSubtitle || "#71717a"};
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 600;
    border-bottom: 2px solid ${(props) => props.theme.text};
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 14px;
    color: ${(props) => props.theme.text};
    font-weight: 600;
  }

  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }
`;
