import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";

export const classRouter = createProtectedRouter()
  .query("get-all-classes-by-user", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.class.findMany({
        where: {
          User: {
            id: ctx.session.user.id,
          },
        },
        select: {
          name: true,
          id: true,
        },
      });
    },
  })
  .mutation("create-class", {
    input: z.object({
      name: z.string(),
      id: z.number().optional(),
      people: z.array(z.number()),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.class.create({
        data: {
          name: input.name,
          User: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          people: {
            connect: input.people.map((id) => ({ id })),
          },
        },
        include: { people: true },
      });
    },
  })
  .mutation("remove-person", {
    input: z.object({
      personId: z.number(),
      classId: z.number(),
    }),
    resolve: async ({ input, ctx }) => {
      const usersClasses = await ctx.prisma.class.findMany({
        where: {
          User: {
            id: ctx.session.user.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!usersClasses.some((classItem) => classItem.id === input.classId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.class.update({
        where: {
          id: input.classId,
        },
        data: {
          people: {
            disconnect: {
              id: input.personId,
            },
          },
        },
      });
    },
  })
  .mutation("add-person", {
    input: z.object({
      classId: z.number(),
      personId: z.number(),
    }),
    resolve: async ({ input, ctx }) => {
      const usersClasses = await ctx.prisma.class.findMany({
        where: {
          User: {
            id: ctx.session.user.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!usersClasses.some((classItem) => classItem.id === input.classId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.class.update({
        where: {
          id: input.classId,
        },
        data: {
          people: {
            connect: {
              id: input.personId,
            },
          },
        },
      });
    },
  });
