import { inferMutationInput, inferMutationOutput } from "./trpc";
import { trpc } from "./trpcVanilla";

export const addClass = async (
   data: inferMutationInput<"class.create-class">,
   splitNumber = 30
) => {
   if (data.people.length < splitNumber) {
      return trpc.mutation("class.create-class", data);
   }

   const classReturn = await trpc.mutation("class.create-class", {
      ...data,
      people: data.people.slice(0, splitNumber),
   });

   const people = data.people.slice(splitNumber, data.people.length);

   const answer: Promise<inferMutationOutput<"class.add-people-to-class">>[] =
      [];
   for (let i = 0; i < people.length; i += splitNumber) {
      answer.push(
         trpc.mutation("class.add-people-to-class", {
            classId: classReturn.id,
            people: people.slice(
               i,
               i + splitNumber < people.length ? i + splitNumber : people.length
            ),
         })
      );
   }
   return Promise.all(answer);
};
