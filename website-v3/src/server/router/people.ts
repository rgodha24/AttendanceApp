import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

export const peopleRouter = createProtectedRouter()
  .query("get-people-by-id", {
    input: z.array(z.number()),
    resolve: async ({ ctx, input }) => {
      return await Promise.all(
        input.map(async (id) => {
          return await ctx.prisma.people
            .findUnique({
              where: {
                id: id,
              },
            })
            .then((person) => {
              if (person) {
                return { ...person, exists: true as const, id };
              } else {
                return { exists: false as const, id };
              }
            });
        })
      );
    },
  })
  .query("get-person-by-id", {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.people.findUnique({
        where: {
          id: input,
        },
      });
    },
  })
  .query("get-people-by-first-name", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.people.findMany({
        where: {
          firstName: input,
        },
      });
    },
  })
  .query("get-people-by-last-name", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.people.findMany({
        where: {
          lastName: input,
        },
      });
    },
  })
  .query("get-people-by-full-name", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.people.findMany({
        where: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
    },
  });
