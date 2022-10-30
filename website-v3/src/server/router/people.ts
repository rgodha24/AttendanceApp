import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

export const peopleRouter = createProtectedRouter()
  .query("get-people-by-id", {
    input: z.array(z.number()),
    resolve: async ({ ctx, input }) => {
      const map = new Map<number, { exists: false } | { exists: true; firstName: string; lastName: string }>();

      (
        await Promise.all(
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
        )
      ).forEach((person) => {
        if (person.exists) {
          map.set(person.id, { exists: person.exists, firstName: person.firstName, lastName: person.lastName });
        } else {
          map.set(person.id, { exists: person.exists });
        }
      });

      return map;
    },
  })
  .query("get-person-by-id", {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      const a = await ctx.prisma.people.findUnique({
        where: {
          id: input,
        },
      });
      if (a == null) {
        return {
          exists: false as const,
        };
      } else {
        return {
          exists: true as const,
          firstName: a.firstName,
          lastName: a.lastName,
        };
      }
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
