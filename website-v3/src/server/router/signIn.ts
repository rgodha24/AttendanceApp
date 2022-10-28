import { createRouter } from "./context";
import { z } from "zod";

export const signInRouter = createRouter().query("all-signins-by-date", {
  input: z.object({
    scannerName: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
  }),
  resolve: async ({ ctx, input }) => {
    return await ctx.prisma.signIn.findMany({
      where: {
        Scanner: {
          name: input.scannerName,
        },
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
      },
      include: {
        people: true,
      },
    });
  },
});
