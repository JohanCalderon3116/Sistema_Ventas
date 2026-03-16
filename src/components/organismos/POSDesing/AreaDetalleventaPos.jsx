import styled from "styled-components";

export const AreaDetalleventaPos = () => {
  return (
    <AreaDetalleventa>
      <Itemventa>
        <article className="contentdescripcion">
          <span className="descripcion">Frieren $2.25</span>
          <span>Stock 34 UND</span>
        </article>
        <article>
          <span className="detalle">
            <strong>Cant: </strong> 1 UND <strong>Importe: </strong> $9.99
          </span>
        </article>
      </Itemventa>
    </AreaDetalleventa>
  );
};

const AreaDetalleventa = styled.section`
  display: flex;
  width: 100%;
  margin-top: 10px;
`;
const Itemventa = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  .contentdescripcion {
    display: flex;
    flex-direction: column;
    .descripcion{
      font-weight: 700;
      font-size: 20px;
    }
  }
`;
