import { People, SignIn } from "@prisma/client";
import { NotSignedInTable, SignedInTable, UnknownSignedInTable } from ".";

const AllTables: React.FC<AllTableProps> = ({
   signedInD,
   mode,
   signedIn,
   people,
}) => {
   return (
      <div className="flex flex-row space-between justify-between ">
         <SignedInTable
            isLoading={
               (mode !== "realtime" ? signedInD.isLoading : false) ||
               people.isLoading
            }
            data={signedIn
               .filter((value) => {
                  return people.data.has(value.studentId);
               })
               .map((value) => {
                  return {
                     // we can assert non null here b/c we just filtered out all studentIds that are not in the map
                     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                     ...people.data.get(value.studentId)!,
                     timestamp: value.timestamp,
                  };
               })}
         />
         <UnknownSignedInTable
            isLoading={
               (mode !== "realtime" ? signedInD.isLoading : false) ||
               people.isLoading
            }
            data={signedIn.filter((value) => {
               return !people.data.has(value.studentId);
            })}
         />
         <NotSignedInTable
            isLoading={
               (mode !== "realtime" ? signedInD.isLoading : false) ||
               people.isLoading
            }
            data={[...people.data.values()].filter((value) => {
               return !signedIn.some((a) => a.studentId === value.studentId);
            })}
         />
      </div>
   );
};

export interface AllTableProps {
   signedInD: {
      isLoading: boolean;
      [key: string]: unknown;
   };
   mode: "realtime" | "date-to-realtime" | "date-to-date";
   signedIn: SignIn[];
   people: {
      data: Map<number, People>;
      isLoading: boolean;
      [key: string]: unknown;
   };
}
export default AllTables;
