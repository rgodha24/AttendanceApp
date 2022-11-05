// @ts-check

import { PrismaClient } from "@prisma/client";
import { randFirstName, randLastName } from "@ngneat/falso";

const prisma = new PrismaClient();
async function main() {
  await Promise.all(
    [...new Array(300 * 5)]
      .map((_, index) => {
        const year = Math.floor(index / 300) + 20;
        const number = (index % 300) + 1;
        const person = {
          studentId: year * 1000 + number,
          firstName: randFirstName(),
          lastName: randLastName(),
        };
        return person;
      })
      .map(async (person) => await prisma.people.create({ data: person }))
  );
}

main();
