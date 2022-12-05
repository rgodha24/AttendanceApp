import { createRouter } from "./context";
import { z } from "zod";
import type { SignIn } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import scannerNameSchema from "~/schemas/scannerName";

const signInByDateSchema = z.discriminatedUnion("mode", [
   z.object({
      mode: z.literal("date-to-realtime"),
      scannerName: scannerNameSchema,
      startDate: z.date(),
      connectionDate: z.date(),
   }),
   z.object({
      mode: z.literal("date-to-date"),
      startDate: z.date(),
      scannerName: scannerNameSchema,
      endDate: z.date(),
      connectionDate: z.date().optional(),
   }),
   z.object({
      mode: z.literal("realtime"),
      scannerName: scannerNameSchema,
      connectionDate: z.date(),
   }),
]);

export type SignInByDateInput = z.infer<typeof signInByDateSchema>;

export const signInRouter = createRouter().query("all-signins-by-date", {
   input: signInByDateSchema,
   resolve: async ({ ctx, input }): Promise<SignIn[]> => {
      const scanner = await ctx.prisma.scanner.findUnique({
         where: { name: input.scannerName },
      });

      if (!scanner) {
         throw new TRPCError({
            code: "NOT_FOUND",
            message: "Scanner not found",
         });
      }

      let answer: Omit<SignIn, "Scanner">[] = [];
      switch (input.mode) {
         case "realtime": {
            answer = [];
            break;
         }
         case "date-to-realtime": {
            answer = await ctx.prisma.signIn.findMany({
               where: {
                  timestamp: {
                     gte: input.startDate,
                     lte: input.connectionDate,
                  },
                  Scanner: {
                     name: input.scannerName,
                  },
               },
            });
            break;
         }
         case "date-to-date": {
            answer = await ctx.prisma.signIn.findMany({
               where: {
                  timestamp: {
                     gte: input.startDate,
                     lte: input.endDate,
                  },
                  Scanner: {
                     name: input.scannerName,
                  },
               },
            });
            break;
         }
      }

      // console.log("length of signIn.all-signins-by-date: ", answer.length);
      return answer.map((a) => {
         return { ...a, Scanner: scanner };
      });
   },
});
