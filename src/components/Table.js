import React, { useState } from "react";
import {
  useTable,
  useFilters,
  useSortBy,
  useGroupBy,
  useExpanded,
  usePagination
} from "react-table";

export default function Table({ columns, data }) {
  const [filterInput, setFilterInput] = useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setFilter,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 }
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  );
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    //setFilter("name", value);
    setFilter("title", value);
    setFilterInput(value);
  };
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
