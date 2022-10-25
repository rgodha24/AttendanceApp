import { NextApiHandler } from "next";
import { z } from "zod";
import { db } from "../../../../firebase";
import { ref, push } from "firebase/database";

const handler: NextApiHandler = async (req, res) => {
   console.log(new Date().getTime());

   const idSchema = z.number().min(19999);
   const scannerSchema = z.string();

   const id = idSchema.safeParse(Number(req.query.id));
   const scanner = scannerSchema.safeParse(req.query.scanner);

   if (!id.success) {
      res.status(400).send("Invalid ID");
      return;
   }
   if (!scanner.success) {
      res.status(400).send("Invalid Scanner");
      return;
   }

   const dbRef = ref(db, `sign-in/${scanner.data}`);
   console.log({
      id: id.data,
      scanner: scanner.data,
   });
   await push(dbRef, { id: id.data, time: { ".sv": "timestamp" } });
   console.log(new Date().getTime());
   res.send({ finished: true });
};

export default handler;
