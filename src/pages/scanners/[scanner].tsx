import type {
   GetStaticPaths,
   GetStaticProps,
   InferGetStaticPropsType,
   NextPage,
} from "next";
import { prisma } from "../../server/db/client";
import type { Scanner } from "@prisma/client";
import scannerNameSchema from "../../schemas/scannerName";
import useSignIn from "../../utils/hooks/useSignIn";
import { trpc } from "../../utils/trpc";
import Table from "../../components/Table";
import Select from "react-select";
import Link from "next/link";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import DatePicker from "../../components/DatePicker";
import { useQueryClient } from "react-query";
import withUsePusher from "../../utils/withUsePusher";
import Navbar from "../../components/Navbar";
import { env } from "../../env/client.mjs";
import NotInClassTable from "../../components/NotInClassTable";

const ScannerPageInner: NextPage<
   InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
   const [signedInRT, date] = useSignIn("scanner-" + props.scanner.name);
   const [mode, setMode] = useState<
      "realtime" | "date-to-realtime" | "date-to-date"
   >("realtime");
   const [startDate, setStartDate] = useState(dayjs().subtract(1, "hour"));
   const [endDate, setEndDate] = useState(dayjs(date));
   const [selectedClass, setSelectedClass] = useState<number>();
   const queryClient = useQueryClient();

   const classes = trpc.useQuery(["class.get-all-classes-by-user"]);
   const people = trpc.useQuery([
      "class.get-people-by-class",
      {
         classId: selectedClass as number,
      },
   ]);
   const signedInD = trpc.useQuery([
      "signIn.all-signins-by-date",
      {
         scannerName: props.scanner.name,
         startDate: startDate.toDate(),
         endDate: endDate.toDate(),
      },
   ]);

   const signedIn = useMemo(() => {
      if (signedInD.isSuccess && Array.isArray(signedInD.data)) {
         if (mode === "date-to-realtime")
            return [...signedInRT, ...signedInD.data];
         else if (mode === "date-to-date") return signedInD.data;
         else return signedInRT;
      } else {
         return signedInRT;
      }
   }, [signedInRT, signedInD.isSuccess, signedInD.data, mode]);

   if (selectedClass === undefined) {
      return (
         <>
            <Navbar></Navbar>
            Choose a class before continuing:{" "}
            {classes.isLoading && "Loading..."}
            {classes.isError && (
               <button
                  onClick={() => {
                     queryClient.invalidateQueries([
                        "signIn.all-signins-by-date",
                     ]);
                  }}
               >
                  Error. Click here to retry
               </button>
            )}
            {classes.isSuccess &&
               (classes.data.length === 0 ? (
                  <Link href="/addCourse">
                     {"You don't have any classes. Click here to make one."}
                  </Link>
               ) : (
                  <Select
                     options={classes.data.map((a) => {
                        return { value: a.id, label: a.name };
                     })}
                     onChange={(value) => {
                        setSelectedClass(value?.value);
                     }}
                  />
               ))}
         </>
      );
   }

   return (
      <div>
         <Navbar></Navbar>
         {/* <h1>Scanner Page</h1> */}
         Choose a class: {classes.isLoading && "Loading..."}
         {classes.isError && (
            <button
               onClick={() => {
                  queryClient.invalidateQueries(["signIn.all-signins-by-date"]);
               }}
            >
               Error. Click here to retry
            </button>
         )}
         {classes.isSuccess &&
            (classes.data.length === 0 ? (
               <Link href="/addCourse">
                  {"You don't have any classes. Click here to make one."}
               </Link>
            ) : (
               <Select
                  options={classes.data.map((a) => {
                     return { value: a.id, label: a.name };
                  })}
                  onChange={(value) => {
                     setSelectedClass(value?.value);
                  }}
                  defaultValue={{
                     // we can assert non null because the same select just chose this value, so we know its in the array.
                     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                     value: classes.data.find((a) => a.id === selectedClass)!
                        .id,
                     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                     label: classes.data.find((a) => a.id === selectedClass)!
                        .name,
                  }}
               />
            ))}
         <br />
         Choose a mode:{" "}
         <Select
            options={[
               {
                  label: "Realtime (only sign ins that happen while you are on this page, default)",
                  value: "realtime" as const,
               },
               {
                  label: "Date to Realtime (starting at a date to this exact moment)",
                  value: "date-to-realtime" as const,
               },
               {
                  label: "Date to Date (starting at a date and ending at a date)",
                  value: "date-to-date" as const,
               },
            ]}
            onChange={(value) => {
               if (value !== null) {
                  setMode(value.value);
                  if (value.value !== "date-to-date") {
                     setEndDate(dayjs(date));
                  }
               }
            }}
            defaultValue={{
               label: "Realtime (only sign ins that happen while you are on this page)",
               value: "realtime" as
                  | "realtime"
                  | "date-to-realtime"
                  | "date-to-date",
            }}
         />
         {(mode === "date-to-realtime" || mode === "date-to-date") && (
            <div>
               Choose your start time:{" "}
               <DatePicker time={startDate} setTime={setStartDate} />
            </div>
         )}
         {mode === "date-to-date" && (
            <div>
               Choose your end time:{" "}
               <DatePicker time={endDate} setTime={setEndDate} />
            </div>
         )}
         {(mode !== "realtime" ? signedInD.isLoading : false) ||
         people.isLoading ? (
            <p>Loading...</p>
         ) : (
            people.isSuccess && (
               <div className="flex flex-row space-between">
                  {/* <h3>People in the class: </h3> */}
                  {/* <br /> */}
                  <Table
                     isLoading={
                        (mode !== "realtime" ? signedInD.isLoading : false) ||
                        people.isLoading
                     }
                     data={signedIn
                        .filter((value) => {
                           return people.data.has(value.studentId);
                        })
                        .map((value) => {
                           // we can assert non null here b/c we just filtered out all studentIds that are not in the map
                           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                           return {
                              ...people.data.get(value.studentId)!,
                              timestamp: value.timestamp,
                           };
                        })}
                  />
                  {/* <h3>Student Ids not in the class</h3><br /> */}
                  <NotInClassTable
                     isLoading={
                        (mode !== "realtime" ? signedInD.isLoading : false) ||
                        people.isLoading
                     }
                     data={signedIn.filter((value) => {
                        return !people.data.has(value.studentId);
                     })}
                  />
               </div>
            )
         )}
         length of signedIn: {signedIn.length}
         {/* {date.toLocaleString()} */}
         {signedInD.isError && "Error"}
      </div>
   );
};

const getStaticPaths: GetStaticPaths = async () => {
   const scanners = await prisma.scanner.findMany();
   const paths = scanners.map((scanner) => ({
      params: { scanner: scanner.name },
   }));
   return { paths, fallback: "blocking" };
};

const getStaticProps: GetStaticProps<{ scanner: Scanner }> = async (
   context
) => {
   const scannerNameCheck = await scannerNameSchema.safeParseAsync(
      context?.params?.scanner
   );

   if (!scannerNameCheck.success) {
      return {
         notFound: true,
      };
   }

   const scannerName = scannerNameCheck.data;

   try {
      return {
         props: {
            scanner: await prisma.scanner.findFirstOrThrow({
               where: { name: scannerName },
            }),
         },
      };
   } catch {
      return {
         notFound: true,
      };
   }
};

const ScannerPage = withUsePusher({
   clientKey: env.NEXT_PUBLIC_PUSHER_KEY,
   cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
})(ScannerPageInner);

export { ScannerPage as default, getStaticPaths, getStaticProps };
