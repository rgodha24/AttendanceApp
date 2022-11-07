import { randFirstName, randLastName } from "@ngneat/falso";
import type { PeopleType } from "../schemas/peopleClassSchema";

export function randomStudentId(ids?: number[]): number {
   if (ids === undefined) {
      return randomNumber(20, 24) * 1000 + randomNumber(1, 350);
   } else {
      const id = randomNumber(20, 24) * 1000 + randomNumber(1, 350);
      if (ids.includes(id)) {
         return randomStudentId(ids);
      } else {
         return id;
      }
   }
}
export function randomFirstName(firstNames?: string[]): string {
   if (firstNames === undefined) {
      return randFirstName();
   } else {
      const firstName = randFirstName();
      if (firstNames.includes(firstName)) {
         return randomFirstName(firstNames);
      } else {
         return firstName;
      }
   }
}

export function randomLastName(lastNames?: string[]): string {
   if (lastNames === undefined) {
      return randLastName();
   } else {
      const lastName = randLastName();
      if (lastNames.includes(lastName)) {
         return randomLastName(lastNames);
      } else {
         return lastName;
      }
   }
}

export function randomNumber(min: number, max: number) {
   return Math.floor(Math.random() * (max - min) + min);
}
export default function randomStudent({
   ids,
   firstNames,
   lastNames,
}: {
   ids?: number[];
   firstNames?: string[];
   lastNames?: string[];
}): PeopleType[number] {
   return {
      studentId: randomStudentId(ids),
      firstName: randomFirstName(firstNames),
      lastName: randomLastName(lastNames),
   };
}

export function randomStudents({
   ids,
   firstNames,
   lastNames,
   length,
}: {
   ids?: number[];
   firstNames?: string[];
   lastNames?: string[];
   length: number;
}): PeopleType {
   const people: PeopleType = [];

   for (let i = 0; i < length; i++) {
      const student = randomStudent({ ids, firstNames, lastNames });
      ids?.push(student.studentId);
      firstNames?.push(student.firstName);
      lastNames?.push(student.lastName);
      people.push(student);
   }

   return people;
}
