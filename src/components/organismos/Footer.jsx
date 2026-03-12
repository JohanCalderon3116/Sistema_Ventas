import styled from "styled-components";
import { GiPadlock } from "react-icons/gi";
export function Footer() {
  return (
    <Container>
      <section className="lock">
        <GiPadlock />
        <span>
          Esta es una página segura de SoftCreate. Si tienes dudas sobre la
          autenticidad del sistema, comunícate con nuestro equipo de soporte a
          través de nuestros medios digitales.
        </span>
      </section>
      <section className="derechos">
        <span>
          SoftCreate POS v1.0 
        </span>
        <div className="separador"></div>
        <span>Ing: Johan Camilo Calderón Álvarez</span>
        <div className="separador"></div>
        <span>© 2026 Todos los derechos reservados</span>
      </section>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12.2px;
  color: #91a4b7;
  gap: 5px;
  margin: 10px;
  .lock {
    border-bottom: 1px solid rgba(145, 164, 183, 0.3);
    gap: 5px;
    display: flex;
    align-items: center;
  }
  .derechos {
    display: flex;
    justify-content: space-between;

    align-items: center;
    .separador {
      width: 1px;
      background-color: rgba(145, 164, 183, 0.3);
      margin-top: 4px;
      height: 80%;
      align-items: center;
      display: flex;
    }
    span {
      margin-top: 5px;
    }
  }
`;
