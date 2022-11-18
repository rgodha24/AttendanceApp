import { z } from "zod";
import { trpc } from "../utils/trpcVanilla";

const scannerSchema = z.object({
   name: z.string().refine(async (scannerName) => {
      return await trpc
         .query("misc.check-scanner-name", { name: scannerName })
         .then((res) => res !== "available");
   }).refine(
      (data) => {
         // return false if data.name has any spaces in it
         return !data.includes(" ");
      },
      { message: "class name shouldn't have spaces" }
   ),
   scannerSecret: z.string().refine(
      (data) => {
         // return false if data.name has any spaces in it
         return !data.includes(" ");
      },
      { message: "class name shouldn't have spaces" }
   ),
});

export default scannerSchema;
