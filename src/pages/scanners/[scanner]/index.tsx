import type {
   GetStaticPaths,
   GetStaticProps,
   InferGetStaticPropsType,
   NextPage,
} from "next";
import { prisma } from "~/db";
import type { Scanner } from "@prisma/client";
import scannerNameSchema from "~/schemas/scannerName";
import { trpc } from "~/trpc";
import AllTables from "~/components/[scanner]/tables/all";
import { useState, Suspense, useEffect } from "react";
import dayjs from "dayjs";
import withUsePusher from "~/utils/withUsePusher";
import Navbar from "~/components/Navbar";
import { env } from "~/env/client";
import ClassChooser from "~/components/[scanner]/ClassChooser";
import ModeChooser from "~/components/[scanner]/ModeChooser";
import { parseAbsoluteToLocal } from "@internationalized/date";
import dynamic from "next/dynamic";
import { type ScannerModes } from "~/types/scannerModes";
import { useSignIns } from "~/hooks/useSignIns";
import { ReactQueryDevtools } from "react-query/devtools";

const AllDates = dynamic(() => import("~/components/date/all"), {
   suspense: true,
});

const ScannerPageInner: NextPage<
   InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
   const [mode, setMode] = useState<ScannerModes>("realtime");
   const [endDate, setEndDate] = useState(
      parseAbsoluteToLocal(dayjs().subtract(5, "seconds").toISOString())
   );
   const [startDate, setStartDate] = useState(
      parseAbsoluteToLocal(dayjs().subtract(1, "hour").toISOString())
   );
   const [selectedClass, setSelectedClass] = useState<number>();

   const people = trpc.useQuery([
      "class.get-people-by-class",
      {
         classId: selectedClass as number,
      },
   ]);
   const { signIns, connectionDate, reset, ...signInData } = useSignIns({
      scannerName: props.scanner.name,
      startDate: startDate.toDate(),
      endDate: endDate?.toDate(),
      mode,
   });

   useEffect(() => () => reset(), [reset]);

   const isLoading =
      signInData.isLoading || people.isLoading || !people.isSuccess;

   return (
      <div>
         <Navbar title={`Scanner - ${props.scanner.name}`} />
         <ClassChooser {...{ selectedClass, setSelectedClass }} />
         {selectedClass !== undefined && (
            <>
               <ModeChooser
                  {...{
                     connectionDate,
                     setMode,
                     setEndDate,
                     date: connectionDate,
                  }}
               />
               <Suspense fallback={"Loading..."}>
                  <AllDates
                     {...{
                        mode,
                        startDate,
                        setStartDate,
                        endDate,
                        setEndDate,
                     }}
                  />
               </Suspense>
               {isLoading ? (
                  <p>Loading...</p>
               ) : (
                  <AllTables
                     {...{
                        people: people.data,
                        signIns,
                     }}
                  />
               )}
               length of signedIn: {signIns.length}
               {signInData.error && "Error"}
            </>
         )}
         {process.env.NODE_ENV !== "production" && (
            <ReactQueryDevtools initialIsOpen={false} />
         )}
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
