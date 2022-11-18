import { z } from "zod";
import { trpc } from "../utils/trpcVanilla";

const scannerSchema = z.object({
   name: z.string().refine(async (scannerName) => {
      return await trpc
         .query("misc.check-scanner-name", { name: scannerName })
         .then((res) => res !== "available");
   }),
   scannerSecret: z.string(),
});

export default scannerSchema;
