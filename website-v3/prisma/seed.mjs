// @ts-check

import { PrismaClient } from "@prisma/client";
import { randFirstName, randLastName } from "@ngneat/falso";


const prisma = new PrismaClient();
async function main() {
  await prisma.people.create({
    data: {
      firstName: "unkown",
      lastName: "unkown",
      id: 0,
    },
  });

  await prisma.people.createMany({
    data: [...new Array(300 * 5)].map((_, index) => {
      const year = Math.floor(index / 300) + 20;
      const number = (index % 300) + 1;
      const person = {
        id: year * 1000 + number,
        firstName: randFirstName(),
        lastName: randLastName(),
      };
      return person;
    }),
  });
}

main();
