import styled from "styled-components";
import { Paginacion } from "../../../index";
import { v } from "../../../styles/variables";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaArrowsAltV } from "react-icons/fa";
import { Icon } from "@iconify/react";
import { FormatearNumeroDinero } from "../../../utils/Conversiones";

export function TablaMovimientosCaja({ data, onVerVenta, dataempresa }) {
  if (data == null) return;
  const [pagina, setPagina] = useState(1);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      accessorKey: "fecha_movimiento",
      header: "Fecha",
      cell: (info) => (
        <td data-title="Fecha" className="ContentCell">
          {info.getValue()}
        </td>
      ),
    },
    {
      accessorKey: "tipo_movimiento",
      header: "Tipo",
      cell: (info) => (
        <td data-title="Tipo" className="ContentCell">
          <span className={`badge ${info.getValue()}`}>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: (info) => (
        <td data-title="Monto" className="ContentCell">
          {FormatearNumeroDinero(
            info.getValue(),
            dataempresa?.currency,
            dataempresa?.iso,
          )}
        </td>
      ),
    },
    {
      accessorKey: "metodo_pago",
      header: "Método de pago",
      cell: (info) => (
        <td data-title="Método de pago" className="ContentCell">
          {info.getValue() ?? "-"}
        </td>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => (
        <td data-title="Descripción" className="ContentCell">
          {info.getValue()}
        </td>
      ),
    },
    {
      accessorKey: "usuario_nombre",
      header: "Usuario",
      cell: (info) => (
        <td data-title="Usuario" className="ContentCell">
          {info.getValue()}
        </td>
      ),
    },
    {
      accessorKey: "sucursal_nombre",
      header: "Sucursal",
      cell: (info) => (
        <td data-title="Sucursal" className="ContentCell">
          {info.getValue()}
        </td>
      ),
    },
    {
      accessorKey: "caja_nombre",
      header: "Caja",
      cell: (info) => (
        <td data-title="Caja" className="ContentCell">
          {info.getValue()}
        </td>
      ),
    },
    {
      accessorKey: "acciones",
      header: "",
      enableSorting: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <td data-title="" className="ContentCell">
            {row.tipo_movimiento === "venta" && row.id_venta ? (
              <BtnVerVenta
                type="button"
                onClick={() => onVerVenta(row.id_venta)}
                title="Ver venta"
              >
                <Icon icon="mdi:receipt-text-outline" width="20" height="20" />
              </BtnVerVenta>
            ) : null}
          </td>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <Container>
      <table className="responsive-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <FaArrowsAltV />
                    </span>
                  )}
                  {
                    {
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()]
                  }
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((item) => (
            <tr key={item.id}>
              {item.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        setPagina={setPagina}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  margin: 5% 3%;
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
  }
  .badge {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.85em;
    font-weight: 600;
    text-transform: capitalize;
    &.venta {
      background-color: rgba(10, 202, 33, 0.15);
      color: #0aca21;
    }
    &.ingreso {
      background-color: rgba(52, 152, 219, 0.15);
      color: #3498db;
    }
    &.salida {
      background-color: rgba(231, 76, 60, 0.15);
      color: #e74c3c;
    }
    &.apertura {
      background-color: rgba(155, 89, 182, 0.15);
      color: #9b59b6;
    }
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;
      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid ${({ theme }) => theme.color2};
        font-weight: 700;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }
    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .ContentCell {
        text-align: center; 
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${v.bpbart}) {
          text-align: center;
        }
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`;

const BtnVerVenta = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(10, 202, 33, 0.15);
    color: #0aca21;
  }
`;
