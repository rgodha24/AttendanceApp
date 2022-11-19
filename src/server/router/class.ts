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
         people: z.array(
            z.object({
               studentId: z.number(),
               firstName: z.string(),
               lastName: z.string(),
            })
         ),
      }),
      resolve: async ({ ctx, input }) => {
         const answer = await ctx.prisma.class
            .create({
               data: {
                  name: input.name,
                  User: {
                     connect: {
                        id: ctx.session.user.id,
                     },
                  },
                  people: {
                     create: input.people,
                  },
               },
               include: { people: true },
            })
            .catch(console.log);

         if (!answer) {
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: "Failed to create class",
            });
         }
         return answer;
      },
   })
   .mutation("remove-person", {
      input: z.object({
         personId: z.string(),
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

         if (
            !usersClasses.some((classItem) => classItem.id === input.classId)
         ) {
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
         person: z.object({
            studentId: z.number(),
            firstName: z.string(),
            lastName: z.string(),
         }),
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

         if (
            !usersClasses.some((classItem) => classItem.id === input.classId)
         ) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }

         return await ctx.prisma.class.update({
            where: {
               id: input.classId,
            },
            data: {
               people: {
                  create: input.person,
               },
            },
         });
      },
   })
   .query("get-people-by-class", {
      input: z.object({
         classId: z.number().int(),
      }),
      resolve: async ({ ctx, input }) => {
         const user = await ctx.prisma.user.findUnique({
            where: {
               id: ctx.session.user.id,
            },
         });

         if (!user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }
         const classItem = await ctx.prisma.class.findUnique({
            where: {
               id: input.classId,
            },
         });

         if (!classItem) {
            throw new TRPCError({
               code: "NOT_FOUND",
            });
         }

         if (classItem.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }

         const data = await ctx.prisma.people.findMany({
            where: {
               Class: {
                  every: {
                     id: classItem.id,
                  },
               },
            },
         });

         return new Map(data.map((item) => [item.studentId, item] as const));
      },
   })
   .mutation("delete-class", {
      input: z.object({
         id: z.number(),
      }),
      async resolve({ ctx, input }) {
         const userClasses = await ctx.prisma.class.findMany({
            where: {
               User: {
                  id: ctx.session.user.id,
               },
            },
            select: {
               id: true,
            },
         });

         if (!userClasses.some((classItem) => classItem.id === input.id)) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }

         return await ctx.prisma.class.delete({
            where: {
               id: input.id,
            },
         });
      },
   });
