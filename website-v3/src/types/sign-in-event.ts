import { People, Scanner, SignIn } from "@prisma/client";

export type signInEvent = SignIn & {
  Scanner: Scanner;
  people: People;
};
