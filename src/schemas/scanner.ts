import * as yup from "yup";
import { trpc } from "../utils/trpcVanilla";
import { z } from "zod";

// const scannerSchema = z.object({
//   id: z.number().optional(),
//   name: z.string(),
//   purgeEveryDays: z.number().min(1).max(60).optional(),
//   scannerSecret: z.string(),
// });

const scannerSchema = yup.object().shape({
   id: yup.number().optional(),
   name: yup
      .string()
      .required("must have a scanner name")
      .max(16, "scanner name is too long")
      .test("is-unique", "scanner name is already taken", async (value) => {
         if (typeof window === "undefined") {
            return true;
         }
         if (value === undefined) {
            return false;
         }
         const answer = await trpc
            .query("misc.check-scanner-name", { name: value })
            .then((res: "available" | "taken") => res !== "available");
         console.log(answer);
         return answer;
      }),
   purgeEveryDays: yup
      .number()
      .min(1, "Too Short!")
      .max(60, "Too Long!")
      .optional(),
   scannerSecret: yup
      .string()
      .required("must have a scanner secret")
      .max(16, "scanner secret is too long"),
});

export default scannerSchema;
