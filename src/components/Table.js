import React, { useState } from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  useGroupBy,
  useExpanded,
  usePagination
} from "react-table";
import "./Table.css";
import { useExportData } from "react-table-plugins";
import Papa from "papaparse";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";
export default function Table({ columns, data }) {
  const [filterInput, setFilterInput] = useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    // for export
    exportData
  } = useTable(
    {
      columns,
      data,
      getExportFileBlob
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useExportData
  );
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    //setFilter("name", value);
    setFilter("alias", value);
    setFilterInput(value);
  };
  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns
        .filter((c) => c.Header != "Action")
        .map((col) => col.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });
      return new Blob([csvString], { type: "text/csv" });
    } else if (fileType === "xlsx") {
      // XLSX example

      const header = columns
        .filter((c) => c.Header != "Action")
        .map((c) => c.exportValue);
      const compatibleData = data.map((row) => {
        const obj = {};
        header.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header
      });
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      // Returning false as downloading of file is already taken care of
      return false;
    }
    //PDF example
    if (fileType === "pdf") {
      const headerNames = columns
        .filter((c) => c.Header != "Action")
        .map((column) => column.exportValue);
      const doc = new JsPDF();
      doc.autoTable({
        head: [headerNames],
        body: data,
        styles: {
          minCellHeight: 9,
          halign: "left",
          valign: "center",
          fontSize: 11
        }
      });
      doc.save(`${fileName}.pdf`);

      return false;
    }

    // Other formats goes here
    return false;
  }
  // Render the UI for your table
  return (
    <>
      <div className="form-group input-group">
        <input
          className="form-control"
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Search name"}
        />
      </div>
      <div className="form-group input-group">
        <button
          class="btn btnexport mr-1"
          onClick={() => {
            exportData("csv", true);
          }}
        >
          <i class="fa fa-file-csv"></i> Export as CSV
        </button>{" "}
        <button
          class="btn btnexport mr-1"
          onClick={() => {
            exportData("xlsx", true);
          }}
        >
          <i class="fa fa-file-excel"></i> Export as xlsx
        </button>{" "}
        <button
          class="btn btnexport mr-1"
          onClick={() => {
            exportData("pdf", true);
          }}
        >
          <i class="fa fa-file-pdf"></i>
          Export as PDF
        </button>
      </div>
      <table
        {...getTableProps()}
        className="table table-bordered table-condensed table-responsive"
        style={{ display: "table" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? "🛑 " : "👊 "}
                    </span>
                  ) : null}
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {" "}
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <form className="inline">
        <div className="form-row">
          <div className="form-group input-group col-md-2">
            <ul className="pagination">
              <li
                class={!canPreviousPage ? "page-item disabled" : "page-item "}
              >
                <a className="page-link" onClick={() => gotoPage(0)}>
                  {"<<"}
                </a>
              </li>
              <li
                class={!canPreviousPage ? "page-item disabled" : "page-item "}
              >
                <a className="page-link" onClick={() => previousPage()}>
                  {"<"}
                </a>
              </li>
              <li class={!canNextPage ? "page-item disabled" : "page-item "}>
                <a className="page-link" onClick={() => nextPage()}>
                  {">"}
                </a>
              </li>
              <li class={!canNextPage ? "page-item disabled" : "page-item "}>
                <a
                  className="page-link"
                  onClick={() => gotoPage(pageCount - 1)}
                >
                  {">>"}
                </a>
              </li>
            </ul>
          </div>
          <div className="form-group input-group col-md-2">
            <input
              className="form-control"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <div className="form-group input-group col-md-2">
            <select
              className="custom-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
            | Go to page:{" "}
          </span>
        </div>
      </form>
    </>
  );
}
