import { People, SignIn } from "@prisma/client";
import { useState } from "react";
import { NotSignedInTable, SignedInTable, UnknownSignedInTable } from ".";
import Toggle from "../Toggle";

const AllTables: React.FC<AllTableProps> = ({
   signedInD,
   mode,
   signedIn,
   people,
}) => {
   const [dedup, setDedup] = useState(false);
   return (
      <div className="flex-col">
         <div>
            <Toggle enabled={dedup} setEnabled={setDedup} />
         </div>
         <div className="flex flex-row space-between justify-between ">
            <div className="">
               <SignedInTable
                  isLoading={
                     (mode !== "realtime" ? signedInD.isLoading : false) ||
                     people.isLoading
                  }
                  dedup={dedup}
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
            </div>
            <div>
               <UnknownSignedInTable
                  isLoading={
                     (mode !== "realtime" ? signedInD.isLoading : false) ||
                     people.isLoading
                  }
                  data={signedIn.filter((value) => {
                     return !people.data.has(value.studentId);
                  })}
               />
            </div>
            <div>
               <NotSignedInTable
                  isLoading={
                     (mode !== "realtime" ? signedInD.isLoading : false) ||
                     people.isLoading
                  }
                  data={[...people.data.values()].filter((value) => {
                     return !signedIn.some(
                        (a) => a.studentId === value.studentId
                     );
                  })}
               />
            </div>
         </div>
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
