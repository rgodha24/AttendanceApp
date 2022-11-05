import { createRouter } from "./context";
import { z } from "zod";
import type { SignIn } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const signInRouter = createRouter().query("all-signins-by-date", {
  input: z.object({
    scannerName: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  }),
  resolve: async ({ ctx, input }) => {
    const scanner = await ctx.prisma.scanner.findUnique({ where: { name: input.scannerName } });
    // console.log(input.startDate.toISOString());
    // console.table(scanner)
    // console.log()
    if (scanner === null) {
      return new TRPCError({ code: "BAD_REQUEST", message: "Scanner not found" });
    }
    const answer: SignIn[] = (
      await ctx.prisma.signIn.findMany({
        where: {
          Scanner: {
            name: input.scannerName,
          },
          timestamp: {
            gte: new Date(input.startDate.toISOString()),
            lte: new Date(input.endDate.toISOString()),
            // lte: input.startDate,
            // gte: input.endDate,
          },
        },
      })
    ).map((a) => {
      return { ...a, Scanner: scanner };
    });
    // console.log("length of signIn.all-signins-by-date: ", answer.length);
    return answer;
  },
});
