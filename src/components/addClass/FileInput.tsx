import peopleClassSchema, { PeopleType } from "../../schemas/peopleClassSchema";
import Papa from "papaparse";
import { createRef } from "react";
import { useState } from "react";

const AddClassFileInput: React.FC<AddClassFileInputProps> = ({
   setTableData,
}) => {
   const fileInputRef = createRef<HTMLInputElement>();
   const [error, setError] = useState<boolean>(false);
   const [data, setData] = useState<PeopleType>([]);
   const [submitted, setSubmitted] = useState<boolean>(false);
   const [fnName, setFNName] = useState("firstName");
   const [lnName, setLNName] = useState("lastName");
   const [siName, setSIName] = useState("studentId");

   const handleParse = () => {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               const data = results.data;
               console.table(data[0])
               try {
                  const cleanedData = (data as Record<string, unknown>[]).map(
                     (a) => {
                        return {
                           ...a,
                           studentId: Number(a[siName]),
                           firstName: a[fnName],
                           lastName: a[lnName],
                        };
                     }
                  );
                  console.table(cleanedData[0])
                  const parsedData = peopleClassSchema.parse(cleanedData);
                  setError(false);
                  setData(parsedData);
               } catch (e) {
                  setError(true);
                  console.error(e);
               }
            },
         });
      }
   };

   return (
      <div>
         <label htmlFor="fileUpload">
            <div>
               Upload a csv with the titles{" "}
               <input
                  type="text"
                  value={fnName}
                  onChange={(e) => setFNName(e.target.value)}
                  className="w-min"
               />
               <input
                  type="text"
                  value={lnName}
                  onChange={(e) => setLNName(e.target.value)}
                  className="w-fit"
               />
               <input
                  type="text"
                  value={siName}
                  onChange={(e) => setSIName(e.target.value)}
                  className="w-fit"
               />
               for each student you want to add. It will be appended to the
               current list of students in the class
            </div>
         </label>
         <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            ref={fileInputRef}
            accept="text/csv"
         />
         <button type="button" onClick={() => handleParse()}>
            Parse CSV
         </button>
         {error && (
            <p>
               Error parsing
            </p>
         )}
         {data.length > 0 && !error && (
            <div>
               <p>
                  Parsing was a success. Click the button below to add the
                  students to the list
               </p>
               <button
                  type="button"
                  className="border border-1 border-slate-600"
                  onClick={() => {
                     setTableData((a) => [...a, ...data]);
                     setSubmitted(true);
                     setError(false);
                     setSubmitted(false);
                     setData([]);
                  }}
               >
                  Add Students
               </button>
               {submitted && (
                  <div>
                     <p>Students added!</p>
                     <button
                        type="button"
                        onClick={() => {
                           setError(false);
                           setSubmitted(false);
                           setData([]);
                        }}
                     >
                        Click here to reset{" "}
                        {"(does not remove the students you already added)"}
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

interface AddClassFileInputProps {
   setTableData: React.Dispatch<React.SetStateAction<PeopleType>>;
}

export default AddClassFileInput;
