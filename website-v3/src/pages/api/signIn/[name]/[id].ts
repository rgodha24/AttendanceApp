import { NextApiHandler } from "next";
import { z } from "zod";
import scannerNameSchema from "../../../../schemas/scannerName";
import { prisma } from "../../../../server/db/client";
import { SignIn } from "@prisma/client";
import pusher from "../../../../utils/pusherServer";

const handler: NextApiHandler<SignIn | { error: string }> = async (req, res) => {
  let scannerName: string;
  let studentId: number;
  let scannerSecret: string;
  try {
    // console.log(req.query.name);
    scannerName = await scannerNameSchema.parseAsync(req.query.name);
  } catch {
    res.status(400).json({ error: "Invalid scanner name" });
    return;
  }
  try {
    studentId = z.number().parse(Number(req.query.id));
  } catch {
    res.status(400).json({ error: "Invalid person id" });
    return;
  }
  try {
    scannerSecret = z.string().parse(req.query.secret);
  } catch {
    res.status(400).json({ error: "Invalid secret" });
    return;
  }
  const scanner = await prisma.scanner.findFirst({ where: { name: scannerName } });
  if (scanner === null) {
    res.status(400).json({ error: "Scanner not found" });
    return;
  }
  if (scanner.scannerSecret !== scannerSecret) {
    res.status(400).json({ error: "wrong secret" });
  }

  const signIn = await prisma.signIn.create({
    data: {
      Scanner: { connect: { id: scanner.id } },
      studentId,
    },
  });

  pusher.trigger(`scanner-${scannerName}`, "sign-in", signIn);
  res.send(signIn);
};

export default handler;
