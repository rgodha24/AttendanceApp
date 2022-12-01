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
      return signIns
         .filter((value) => {
            people.has(value.studentId);
         })
         .map((value) => {
            return {
               // we can assert non null here b/c we just filtered out all studentIds that are not in the map
               // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
               ...people.get(value.studentId)!,
               timestamp: value.timestamp,
            };
         });
   }, [people, signIns]);
   const notSignedInTable = useMemo(
      () =>
         [...people.values()].filter((value) => {
            return !signIns.some((a) => a.studentId === value.studentId);
         }),
      [people, signIns]
   );
   const unknownSignedInTable = useMemo(
      () => signIns.filter((value) => !people.has(value.studentId)),
      [people, signIns]
   );
   return [signedInTable, notSignedInTable, unknownSignedInTable];
};
