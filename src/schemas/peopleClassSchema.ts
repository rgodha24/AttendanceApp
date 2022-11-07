import { z } from "zod";

const peopleClassSchema = z
   .array(
      z.object({
         firstName: z.string().min(1),
         lastName: z.string().min(1),
         studentId: z.number(),
      })
   )
   .min(1, "Must have at least one student")
   .refine(
      (people) => {
         // check people for duplicate studentIds
         const studentIds = people.map((p) => p.studentId);
         const uniqueStudentIds = new Set(studentIds);
         const data = studentIds.length === uniqueStudentIds.size;

         console.table({
            data,
            studentIds: studentIds.length,
            uniqueStudentIds: uniqueStudentIds.size,
         });

         return data;
      },
      (people) => {
         // find which student id is a duplicate
         const studentIds = people.map((p) => p.studentId);
         const uniqueStudentIds = new Set(studentIds);

         // we can assert non null because if this function is called, we know that there is a duplicate
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         const duplicateStudentId = [...uniqueStudentIds].find(
            (id) => studentIds.filter((i) => i === id).length > 1
         )!;

         return {
            message: `Duplicate student id: ${duplicateStudentId}`,
         };
      }
   );

export type PeopleType = z.infer<typeof peopleClassSchema>;
export default peopleClassSchema;
