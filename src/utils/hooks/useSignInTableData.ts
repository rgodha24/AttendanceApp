import { People, SignIn } from "@prisma/client";
import { useMemo } from "react";
import { inferQueryOutput } from "../trpc";

type UseSignInTableDataParams = [
   inferQueryOutput<"signIn.all-signins-by-date">,
   inferQueryOutput<"class.get-people-by-class">
];
type UseSignInTableDataReturn = [
   (People & { timestamp: Date })[],
   People[],
   SignIn[]
];
type UseSignInTableData = (
   params: UseSignInTableDataParams
) => UseSignInTableDataReturn;

export const useSignInTableData: UseSignInTableData = ([signIns, people]) => {
   const signedInTable = useMemo(() => {
      return getSignedIn([signIns, people]);
   }, [people, signIns]);
   const notSignedInTable = useMemo(() => {
      return getNotSignedIn([signIns, people]);
   }, [people, signIns]);
   const unknownSignedInTable = useMemo(() => {
      return getUnknownSignIns([signIns, people]);
   }, [people, signIns]);
   return [signedInTable, notSignedInTable, unknownSignedInTable];
};

export const getSignedIn = ([signIns, people]: UseSignInTableDataParams) => {
   return signIns
      .map((value) => {
         const a = people.get(value.studentId);
         if (a !== undefined) {
            return {
               ...a,
               timestamp: value.timestamp,
            };
         } else {
            return undefined;
         }
      })
      .filter((a) => a !== undefined) as (People & { timestamp: Date })[];
};

export const getNotSignedIn = ([signIns, people]: UseSignInTableDataParams) => {
   return [...people.values()].filter((value) => {
      return !signIns.some((a) => a.studentId === value.studentId);
   });
};

export const getUnknownSignIns = ([
   signIns,
   people,
]: UseSignInTableDataParams) => {
   return signIns.filter((value) => !people.has(value.studentId));
};
