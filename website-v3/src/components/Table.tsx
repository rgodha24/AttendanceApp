import { People } from "@prisma/client";
import { useMemo } from "react";
import { useTable, type Column } from "react-table";

/**
 *
 * @param props props.people and props.columns have to be memoized
 * @returns a table with the people in props.people
 */
const Table: React.FC<tableProps> = (props) => {
  const tableInstance = useTable({
    columns: props.columns,
    data: props.people,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {
          headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {
                headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id}>
                    {
                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {
                  row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} key={cell.value}>
                        {
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

interface tableProps {
  people: People[];
  columns: Column<People>[];
}

export default Table;
