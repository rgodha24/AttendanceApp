import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

export const scannerRouter = createProtectedRouter()
  .mutation("create-scanner", {
    input: z.object({
      name: z.string().max(16),
      purgeEveryDays: z.number().min(1).max(60).optional().default(14),
      scannerSecret: z.string().max(16),
    }),
    async resolve({ input, ctx }) {
      //   console.table(input);

      const scanner = await ctx.prisma.scanner.findFirst({
        where: {
          name: input.name,
        },
      });
      if (scanner !== null) {
        return new TRPCError({ code: "BAD_REQUEST", message: "scanner name is already taken" });
      }
      return await ctx.prisma.scanner.create({
        data: {
          name: input.name,
          purgeEveryDays: input.purgeEveryDays,
          scannerSecret: input.scannerSecret,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      //   console.table(answer);
      //   return answer;
    },
  })
  .query("generate-scanner-secret", {
    async resolve() {
      return crypto.randomBytes(3).toString("hex");
    },
  })
  .query("get-all-scanners-by-user", {
    async resolve({ ctx }) {
      return await ctx.prisma.scanner.findMany({
        where: {
          createdBy: {
            id: ctx.session.user.id,
          },
        },
      });
    },
  })
  .query("get-all-scanner-names", {
    async resolve({ ctx }) {
      return await ctx.prisma.scanner.findMany({ select: { name: true } });
    },
  });
