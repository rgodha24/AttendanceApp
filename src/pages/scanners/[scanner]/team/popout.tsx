import { GetServerSideProps } from "next";
import PopoutTeamSignIns, {
   PopoutTeamSignInsProps,
} from "~/components/[scanner]/PopoutTeamSignIns";
import scannerNameSchema from "~/schemas/scannerName";
import { z } from "zod";
import { env } from "~/env/client";
import withUsePusher from "~/utils/withUsePusher";

export const getServerSideProps: GetServerSideProps<
   PopoutTeamSignInsProps
> = async (context) => {
   const scannerNameCheck = await scannerNameSchema.safeParseAsync(
      context?.params?.scanner
   );

   if (!scannerNameCheck.success) {
      return {
         notFound: true,
      };
   }

   const scannerName = scannerNameCheck.data;

   const schema = z.discriminatedUnion("mode", [
      z.object({
         mode: z.literal("realtime"),
         classId: z.number(),
         title: z.string(),
      }),
      z.object({
         mode: z.literal("date-to-date"),
         startDate: z.date(),
         endDate: z.date(),
         classId: z.number(),
         title: z.string(),
      }),
      z.object({
         mode: z.literal("date-to-realtime"),
         startDate: z.date(),
         classId: z.number(),
         title: z.string(),
      }),
   ]);

   try {
      // console.table(context.query)
      const data = schema.parse({
         title: context?.query?.title,
         classId: Number(context?.query?.classId),
         mode: context?.query?.mode || "realtime",
         startDate: new Date(Number(context?.query?.startDate as string)),
         endDate: new Date(Number(context?.query?.endDate as string)),
      });

      return {
         props: {
            scannerName,
            ...data,
         },
      };
   } catch (e) {
      console.error(e);
      return {
         notFound: true,
      };
   }
};

export default withUsePusher({
   clientKey: env.NEXT_PUBLIC_PUSHER_KEY,
   cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
})(PopoutTeamSignIns);
