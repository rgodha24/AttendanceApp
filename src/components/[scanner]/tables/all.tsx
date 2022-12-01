import { People, SignIn } from "@prisma/client";
import { useState } from "react";
import { NotSignedInTable, SignedInTable, UnknownSignedInTable } from ".";
import { useSignInTableData } from "~/utils/hooks/useSignInTableData";
import Toggle from "../Toggle";

const AllTables: React.FC<AllTableProps> = ({ signIns, people }) => {
   const [dedup, setDedup] = useState(false);
   const [signedInTableData, notSignedInTableData, unknownSignedInTableData] =
      useSignInTableData([signIns, people]);
   return (
      <div className="flex-col">
         <div>
            <Toggle enabled={dedup} setEnabled={setDedup} />
         </div>
         <div className="flex flex-row space-between justify-between ">
            <div className="flex-col">
               <h2 className="text-xl">Signed in</h2>
               <SignedInTable dedup={dedup} data={signedInTableData} />
            </div>
            <div className="flex-col">
               <h2 className="text-xl">Not signed in</h2>
               <NotSignedInTable data={notSignedInTableData} />
            </div>
            <div className="flex-col">
               <h2 className="text-xl">Signed in but not in class</h2>
               <UnknownSignedInTable data={unknownSignedInTableData} />
            </div>
         </div>
      </div>
   );
};

export interface AllTableProps {
   signIns: SignIn[];
   people: Map<number, People>;
}
export default AllTables;
