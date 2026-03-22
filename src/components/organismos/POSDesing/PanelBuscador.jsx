import { Icon } from "@iconify/react";
import styled from "styled-components";
import { Buscador } from "../Buscador";

export const PanelBuscador = ({
  setStateBuscador,
  setBuscador,
  displayField,
  data,
  selector,
}) => {
  return (
    <Container>
      <div className="subcontent">
        <Icon
          className="icono"
          icon="line-md:chevron-left"
          width="24"
          height="24"
          onClick={setStateBuscador}
        />
        <Buscador setBuscador={setBuscador}></Buscador>
        {data?.map((item, index) => {
          return (
            <Item
              onClick={() => {
                selector(item);
                setStateBuscador();
              }}
              key={index}
            >
              👨🏻‍💼{item[displayField]}
            </Item>
          );
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  position: absolute;
  height: 100%;
  width: 100%;
  .subcontent {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .icono {
      cursor: pointer;
    }
  }
`;

const Item = styled.div`
  border-radius: 5px;
  font-size: 18px;
  padding: 5px;
  display: flex;
  gap: 8px;
  &:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
`;
