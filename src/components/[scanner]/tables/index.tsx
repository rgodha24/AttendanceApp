import { People } from "@prisma/client";
import {
   createColumnHelper,
   useReactTable,
   getCoreRowModel,
   SortingState,
   getSortedRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import TableInner from "./inner";

const SignedInTable: React.FC<
   TableProps<SignedInTableUnit> & { dedup?: boolean }
> = (props) => {
   const columnHelper = createColumnHelper<SignedInTableUnit>();
   const [sorting, setSorting] = useState<SortingState>([]);

   const columns = [
      columnHelper.accessor("firstName", {
         cell: (info) => info.getValue(),
         header: "First Name",
      }),
      columnHelper.accessor((row) => row.lastName, {
         id: "lastName",
         cell: (info) => info.getValue(),
         header: "Last Name",
      }),
      columnHelper.accessor("studentId", {
         cell: (info) => info.getValue(),
         header: "Student ID",
      }),
      columnHelper.accessor("timestamp", {
         cell: (info) => info.getValue().toLocaleString(),
      }),
   ];

   const data = useMemo(
      () =>
         props.dedup || false
            ? ([...new Set(props.data.map((a) => a.studentId)).values()]
                 .map((id) => props.data.find((a) => a.studentId === id))
                 .filter((a) => a !== undefined) as SignedInTableUnit[])
            : props.data,
      [props.data, props.dedup]
   );

   const table = useReactTable<SignedInTableUnit>({
      data,
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

   return <TableInner table={table} />;
};

const UnknownSignedInTable: React.FC<TableProps<UnknownSignedInTableUnit>> = (
   props
) => {
   const columnHelper = createColumnHelper<UnknownSignedInTableUnit>();
   const [sorting, setSorting] = useState<SortingState>([]);

   const columns = [
      columnHelper.accessor("studentId", {
         cell: (info) => info.getValue(),
         header: "Student ID",
      }),
      columnHelper.accessor("timestamp", {
         cell: (info) => info.getValue().toLocaleString(),
      }),
   ];

   const table = useReactTable<UnknownSignedInTableUnit>({
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

   return <TableInner table={table} />;
};

const NotSignedInTable: React.FC<TableProps<NotSignedInTableUnit>> = (
   props
) => {
   const columnHelper = createColumnHelper<NotSignedInTableUnit>();
   const [sorting, setSorting] = useState<SortingState>([]);

   const columns = [
      columnHelper.accessor("firstName", {
         cell: (info) => info.getValue(),
         header: "First Name",
      }),
      columnHelper.accessor((row) => row.lastName, {
         id: "lastName",
         cell: (info) => info.getValue(),
         header: "Last Name",
      }),
      columnHelper.accessor("studentId", {
         cell: (info) => info.getValue(),
         header: "Student ID",
      }),
   ];

   const table = useReactTable<NotSignedInTableUnit>({
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

   return <TableInner table={table} />;
};

export type SignedInTableUnit = Omit<
   People & {
      timestamp: Date;
   },
   "id"
>;

export type UnknownSignedInTableUnit = {
   timestamp: Date;
   studentId: number;
};

export type NotSignedInTableUnit = People | Omit<People, "id">;

export type TableProps<T> = {
   data: T[];
   isLoading?: boolean;
};

export { SignedInTable, UnknownSignedInTable, NotSignedInTable };
