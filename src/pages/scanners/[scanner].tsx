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
import AllTables from "../../components/[scanner]/tables/all";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import AllDates from "../../components/date/all";
import withUsePusher from "../../utils/withUsePusher";
import Navbar from "../../components/Navbar";
import { env } from "../../env/client.mjs";
import ClassChooser from "../../components/[scanner]/ClassChooser";
import ModeChooser from "../../components/[scanner]/ModeChooser";

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

   return (
      <div>
         <Navbar title={`Scanner - ${props.scanner.name}`} />
         <ClassChooser {...{ selectedClass, setSelectedClass }} />
         {selectedClass !== undefined && (
            <>
               <ModeChooser {...{ date, setMode, setEndDate }} />
               <AllDates
                  {...{ mode, startDate, setStartDate, endDate, setEndDate }}
               />
               {(mode !== "realtime" ? signedInD.isLoading : false) ||
               people.isLoading ? (
                  <p>Loading...</p>
               ) : (
                  people.isSuccess && (
                     <AllTables
                        {...{
                           signedInD: {
                              isLoading: signedInD.isLoading,
                           },
                           signedIn,
                           mode,
                           people: {
                              data: people.data,
                              isLoading: people.isLoading,
                           },
                        }}
                     />
                  )
               )}
               length of signedIn: {signedIn.length}
               {signedInD.isError && "Error"}
            </>
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
