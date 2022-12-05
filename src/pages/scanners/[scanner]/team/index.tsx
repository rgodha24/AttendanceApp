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
import { useState, Suspense } from "react";
import dayjs from "dayjs";
import withUsePusher from "~/utils/withUsePusher";
import { env } from "~/env/client";
import ClassChooser from "~/components/[scanner]/ClassChooser";
import ModeChooser from "~/components/[scanner]/ModeChooser";
import { parseAbsoluteToLocal } from "@internationalized/date";
import dynamic from "next/dynamic";
import { type ScannerModes } from "~/types/scannerModes";
import { useSignIns } from "~/hooks/useSignIns";
import PopoutTeamSignIns from "~/components/[scanner]/PopoutTeamSignIns";
import Link from "next/link";

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

   const [title, setTitle] = useState("");

   return (
      <div>
         <ClassChooser {...{ selectedClass, setSelectedClass }} />
         {selectedClass !== undefined && (
            <>
               <ModeChooser
                  {...{
                     setMode,
                     setEndDate,
                     date: new Date(),
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
               <input
                  type="text"
                  name="Title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <Link
                  href={`/scanners/${
                     props.scanner.name
                  }/team/popout?${new URLSearchParams({
                     title,
                     classId: selectedClass.toString(),
                     mode,
                     startDate: startDate.toDate().getTime().toString(),
                     endDate: endDate?.toDate().getTime().toString(),
                  }).toString()}`}
               >
                  Popout Link
               </Link>
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

const ScannerPage = ScannerPageInner;

export { ScannerPage as default, getStaticPaths, getStaticProps };
