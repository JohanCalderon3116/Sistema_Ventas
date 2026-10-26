import React from "react";
import { v } from "../../../styles/variables";
import styled from "styled-components";
import { Btn1 } from "../../../index";

export const Paginacion = ({ table }) => {
  return (
    <Container>
      <Btn1
        disabled={!table.getCanPreviousPage()}
        funcion={() => table.setPageIndex(0)}
        icono={<v.iconotodos />}
      />

      <Btn1
        disabled={!table.getCanPreviousPage()}
        funcion={() => table.previousPage()}
        icono={<v.iconoflechaizquierda />}
      />

      <PageBadge>
        <strong>{table.getState().pagination.pageIndex + 1}</strong>
        <span>de</span>
        <strong>{table.getPageCount() || 1}</strong>
      </PageBadge>

      <Btn1
        disabled={!table.getCanNextPage()}
        funcion={() => table.nextPage()}
        icono={<v.iconoflechaderecha />}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;

  button {
    padding: 8px 12px !important;
    min-width: 38px;
    height: 38px;
    border-radius: 10px !important;
  }
`;

const PageBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  height: 38px;
  border-radius: 10px;
  background: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.text};
  font-size: 13px;

  span {
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;
