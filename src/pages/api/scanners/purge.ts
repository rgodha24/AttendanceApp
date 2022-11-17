import type { NextApiHandler } from "next";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import dayjs from "dayjs";

const handler: NextApiHandler = async (req, res) => {
   const secret = z.literal(env.PURGE_SECRET).safeParse(req.query.secret);

   if (!secret.success) {
      res.status(400).json({ error: "Unauthorized, wrong secret" });
      return;
   }

   const scanners = await prisma.scanner.findMany({});

   const deleted = (
      await Promise.all(
         scanners.map(async (scanner) => {
            return prisma.signIn.deleteMany({
               where: {
                  AND: {
                     scannerId: scanner.id,
                     timestamp: {
                        lt: dayjs()
                           .subtract(scanner.purgeEveryDays, "days")
                           .toDate(),
                     },
                  },
               },
            });
         })
      )
   )
      .map((a) => a.count)
      .reduce((acc, cur) => acc + cur, 0);

   res.status(200).json({ deleted });
};

export default handler;
