import { z } from "zod";

const personSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
});

export default personSchema;
