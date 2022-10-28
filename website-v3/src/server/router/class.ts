import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";
import personSchema from "../../schemas/person";

export const classRouter = createProtectedRouter()
  .query("get-all-classes", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.class.findMany({
        where: {
          User: {
            id: ctx.session.user.id,
          },
        },
      });
    },
  })
  .mutation("create-class", {
    input: z.object({
      id: z.number().optional(),
      name: z.string(),
      people: z.array(personSchema),
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
            connectOrCreate: input.people.map((person) => ({ where: { id: person.id }, create: { ...person } })),
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
      person: personSchema,
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
            connectOrCreate: {
              where: {
                id: input.person.id,
              },
              create: {
                ...input.person,
              },
            },
          },
        },
      });
    },
  });
