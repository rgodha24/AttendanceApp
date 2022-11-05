import { z } from "zod";
import { prisma } from "../server/db/client";

const scannerNameSchema = z.string().refine(async (scannerName) => {
   const scanner = await prisma.scanner.findUnique({
      where: { name: scannerName },
   });
   return scanner !== null;
});

export default scannerNameSchema;
