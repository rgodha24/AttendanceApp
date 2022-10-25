/* eslint-disable react/jsx-key */
import { db } from "../firebase";
import { useEffect, useMemo, useState } from "react";
import { ref, endAt, query, startAt, orderByChild } from "firebase/database";
import { useTable } from "react-table";

import { useListVals } from "react-firebase-hooks/database";

export default function SignedInPeople({
   scannerName,
   startTime,
   endTime,
}: {
   scannerName: string;
   startTime: Date;
   endTime: Date;
}) {
   const signInsRef = query(
      ref(db, `sign-in/${scannerName || "aewiufhaiwsudha"}`),
      orderByChild("time"),
      startAt(startTime.getTime(), "time"),
      endAt(endTime.getTime(), "time")
   );

   const [valuesOriginal, loading, error] = useListVals<{
      time: number;
      id: string;
   }>(signInsRef);

   let values = valuesOriginal
      .filter((item, position) => valuesOriginal.map(i => i.id).indexOf(item.id) === position)
      .map((a) => {
         let time = new Date();
         time.setTime(a.time);
         return { time: time.toLocaleString(), id: a.id };
      }).sort((a, b) => a.time.localeCompare(b.time));

   const columns: Array<{ Header: string; accessor: "id" | "time" }> = useMemo(
      () => [
         {
            Header: "id",
            accessor: "id", // accessor is the "key" in the data
         },
         {
            Header: "time",
            accessor: "time",
         },
      ],
      []
   );

   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({
         columns,
         data: values,
      });

   if (loading) return <>Loading..</>;

   return (
      <>
         <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
            <thead>
               {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map((column) => (
                        <th
                           {...column.getHeaderProps()}
                           style={{
                              borderBottom: "solid 3px red",
                              background: "aliceblue",
                              color: "black",
                              fontWeight: "bold",
                           }}
                        >
                           {column.render("Header")}
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody {...getTableBodyProps()}>
               {rows.map((row) => {
                  prepareRow(row);
                  return (
                     <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                           return (
                              <td
                                 {...cell.getCellProps()}
                                 style={{
                                    padding: "10px",
                                    border: "solid 1px gray",
                                    background: "papayawhip",
                                 }}
                              >
                                 {cell.render("Cell")}
                              </td>
                           );
                        })}
                     </tr>
                  );
               })}
            </tbody>
         </table>
         <br />
         {JSON.stringify(values)}
         <br />
         {JSON.stringify(valuesOriginal)}
      </>
   );
}
