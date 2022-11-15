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

   const handleParse = () => {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               const data = results.data;
               try {
                  const cleanedData = data.map((a) => {
                     return {
                        ...(a as Record<string, unknown>),
                        studentId: Number(
                           (a as Record<string, unknown>).studentId
                        ),
                     } as Record<string, unknown> & { studentId: number };
                  });
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
            <p>
               File Input: Upload a csv with the titles{" "}
               {'"firstName, lastName, studentId'} for each student you want to
               add. It will be appended to the current list of students in the
               class
            </p>
         </label>
         <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            ref={fileInputRef}
            accept="text/csv"
         />
         <button type="button" onClick={() => handleParse()}>
            Parse
         </button>
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
