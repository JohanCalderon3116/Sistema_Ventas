import styled from "styled-components";
import { Device } from "../../index";
import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

export function ListaDesplegable({
  data,
  setState,
  funcion,
  scroll,
  top,
  state,
  refetch,
  funcioncrud,
}) {
  if (!state) return null;
  const [selectIndex, setSelectIndex] = useState(0);
  const dropdownRef = useRef(null);

  function seleccionar(p) {
    if (!p) return;
    if (refetch) {
      refetch();
    }
    funcion(p);
    setState();
    if (funcioncrud) {
      funcioncrud();
    }
  }

  const handleKeyDown = (e) => {
    if (!data?.length) return;
    if (e.key === "Enter") {
      e.preventDefault();
      seleccionar(data[selectIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectIndex((prevIndex) =>
        prevIndex === 0 ? data.length - 1 : prevIndex - 1,
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };

  return (
    <Container
      scroll={scroll}
      $top={top}
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <section className="contentClose" onClick={setState}>
        ×
      </section>
      <section className="contentItems">
        {data?.map((item, index) => {
          const seleccionado = index === selectIndex;
          return (
            <ItemContainer
              key={index}
              onClick={() => seleccionar(item)}
              $selected={seleccionado}
            >
              <span className="icono">
                <Icon icon="lucide:package" width="16" height="16" />
              </span>
              <span className="nombre">{item?.nombre}</span>
            </ItemContainer>
          );
        })}
      </section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${(props) => props.$top || "calc(100% + 6px)"};
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  gap: 6px;
  border-radius: 12px;
  z-index: 30;
  background: ${({ theme }) => theme.bgcards};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: ${({ theme }) =>
    theme.text === "#FFFFFF"
      ? "0 16px 36px rgba(0, 0, 0, 0.65)"
      : "0 12px 28px rgba(17, 17, 17, 0.12)"};
  &:focus {
    outline: none;
  }
  @media ${() => Device.tablet} {
    width: 100%;
  }
  .contentClose {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 22px;
    padding-right: 4px;
    font-weight: 600;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: ${({ theme }) => theme.colorSubtitle};
    transition:
      opacity 0.2s ease,
      color 0.2s ease;
    &:hover {
      color: #ef4444;
    }
  }
  .contentItems {
    overflow-y: ${(props) => props.scroll || "auto"};
    max-height: 260px;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colorScroll};
      border-radius: 10px;
      transition: background 0.2s ease;
    }
    scrollbar-width: thin;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  cursor: pointer;
  background: ${({ theme, $selected }) =>
    $selected
      ? theme.text === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.10)"
        : "rgba(17, 17, 17, 0.08)"
      : "transparent"};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected
        ? theme.text === "#FFFFFF"
          ? "rgba(255, 255, 255, 0.22)"
          : "rgba(17, 17, 17, 0.18)"
        : "transparent"};
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
  .icono {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme, $selected }) =>
      $selected ? "#10b981" : theme.colorSubtitle};
    transition:
      color 0.18s ease,
      transform 0.18s ease;
  }
  .nombre {
    flex: 1;
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    font-weight: ${({ $selected }) => ($selected ? "600" : "500")};
    opacity: ${({ $selected }) => ($selected ? 1 : 0.88)};
    transition:
      color 0.18s ease,
      opacity 0.18s ease;
  }
  &:hover {
    background: ${({ theme }) =>
      theme.text === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(17, 17, 17, 0.06)"};
    border-color: ${({ theme }) =>
      theme.text === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.16)"
        : "rgba(17, 17, 17, 0.12)"};
    transform: translateX(2px);
    .icono {
      color: #10b981;
      transform: scale(1.05);
    }
    .nombre {
      opacity: 1;
    }
  }
  &:active {
    transform: scale(0.99);
  }
`;
