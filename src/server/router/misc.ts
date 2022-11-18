import { createRouter } from "./context";
import { z } from "zod";

export const miscRouter = createRouter().query("check-scanner-name", {
   input: z.object({ name: z.string() }),
   async resolve({ input, ctx }) {
      const scanner = await ctx.prisma.scanner.findFirst({
         where: {
            name: input.name,
         },
      });

      return scanner === null ? ("taken" as const) : ("available" as const);
   },
});
