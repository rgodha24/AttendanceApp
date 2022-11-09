import {
   createColumnHelper,
   useReactTable,
   getCoreRowModel,
   flexRender,
   SortingState,
   getSortedRowModel,
} from "@tanstack/react-table";
import { LegacyRef, useState } from "react";

/**
 *
 * @param props props.people and props.columns have to be memoized
 * @returns a table with the people in props.people
 */
const Table: React.FC<tableProps> = (props) => {
   const columnHelper = createColumnHelper<OneTableUnit>();
   const [sorting, setSorting] = useState<SortingState>([]);

   // console.log(sorting);
   const columns = [
      columnHelper.accessor("studentId", {
         cell: (info) => info.getValue(),
         header: "Student ID",
         // sortingFn: "basic",
         // enableSorting: true,
      }),
      columnHelper.accessor("timestamp", {
         cell: (info) => info.getValue().toLocaleString(),
         header: "Date",
      }),
   ];

   const table = useReactTable<OneTableUnit>({
      data: props.data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
         sorting,
      },
      onSortingChange: setSorting,
      debugAll: false,
      getSortedRowModel: getSortedRowModel(),
   });

   if (props.isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="p-2">
         <table className=" ">
            <thead>
               {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border border-gray-400">
                     {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border border-gray-400">
                           <div
                              className={
                                 header.column.getCanSort()
                                    ? "cursor-pointer select"
                                    : ""
                              }
                              {...{
                                 onClick:
                                    header.column.getToggleSortingHandler(),
                              }}
                           >
                              {header.isPlaceholder
                                 ? null
                                 : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                   )}
                              {{
                                 asc: " 🔼",
                                 desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                           </div>
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody >
               {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                     {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                           {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                           )}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
            <tfoot>
               {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                     {footerGroup.headers.map((header) => (
                        <th key={header.id}>
                           {header.isPlaceholder
                              ? null
                              : flexRender(
                                   header.column.columnDef.footer,
                                   header.getContext()
                                )}
                        </th>
                     ))}
                  </tr>
               ))}
            </tfoot>
         </table>
         <div className="h-4" />
      </div>
   );
};

type OneTableUnit = { studentId: number; timestamp: Date };

type tableProps = {
   data: OneTableUnit[];
   isLoading: boolean;
};

export default Table;
