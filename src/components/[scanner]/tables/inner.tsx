import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import type {
   NotSignedInTableUnit,
   SignedInTableUnit,
   UnknownSignedInTableUnit,
} from ".";

function TableInner<T extends TableUnit>({
   table,
}: TableInnerProps<T>): React.ReactElement {
   return (
      <div className="p-2">
         <table className=" ">
            <thead>
               {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border border-palette-teal p-2">
                     {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border border-palette-teal">
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
            <tbody>
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
}

export type TableInner<T extends TableUnit> = (
   props: TableInnerProps<T>
) => React.ReactElement;

export type TableInnerProps<T extends TableUnit> = {
   table: Table<T>;
};

export type TableUnit =
   | NotSignedInTableUnit
   | SignedInTableUnit
   | UnknownSignedInTableUnit;

export default TableInner;
