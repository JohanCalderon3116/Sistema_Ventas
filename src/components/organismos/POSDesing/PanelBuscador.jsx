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
          width="28"
          height="28"
          onClick={setStateBuscador}
        />
        <Buscador setBuscador={setBuscador}></Buscador>
        <div className="lista-items">
          {data?.map((item, index) => {
            return (
              <Item
                onClick={() => {
                  selector(item);
                  setStateBuscador();
                }}
                key={index}
              >
                <span>👨🏻‍💼</span>
                <span className="nombre">{item[displayField]}</span>
              </Item>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  z-index: 10;
  box-sizing: border-box;
  .subcontent {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    box-sizing: border-box;
    .icono {
      cursor: pointer;
      color: ${({ theme }) => theme.text};
      transition: transform 0.2s ease;
      &:hover {
        transform: translateX(-3px);
      }
    }
    .lista-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      max-height: calc(100% - 80px);
      padding-right: 4px;
    }
  }
`;

const Item = styled.div`
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) =>
    theme.body === "#fff"
      ? "rgba(0, 0, 0, 0.03)"
      : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${({ theme }) =>
      theme.body === "#fff"
        ? "rgba(0, 0, 0, 0.05)"
        : "rgba(255, 255, 255, 0.08)"};
  transition: all 0.2s ease;

  .nombre {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }

  &:hover {
    background-color: ${({ theme }) =>
      theme.body === "#fff"
        ? "rgba(0, 0, 0, 0.08)"
        : "rgba(255, 255, 255, 0.12)"};
    cursor: pointer;
    transform: translateY(-1px);
  }
`;
