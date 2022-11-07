import peopleClassSchema from "../schemas/peopleClassSchema";
import Papa from "papaparse";
import { z } from "zod";
import { createRef } from "react";
import { useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";

const AddClassFileInput: React.FC<AddClassFileInputProps> = (props) => {
   type PeopleType = z.infer<typeof peopleClassSchema>[number];
   const [error, setError] = useState<boolean>(false);
   const [data, setData] = useState<PeopleType[]>([]);
   const [submitted, setSubmitted] = useState<boolean>(false);
   const fileInputRef = createRef<HTMLInputElement>();

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
         />
         <button type="button" onClick={() => handleParse()}>
            Parse
         </button>
         {error && <p>There was an error parsing the file</p>}
         {data.length > 0 && (
            <div>
               <p>
                  Parsing was a success. Click the button below to add the
                  students to the list
               </p>
               <button
                  type="button"
                  className="border border-1 border-slate-600"
                  onClick={() => {
                     props.append(data);
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

export type FormValues = {
   name: string;
   people: {
      studentId: number;
      firstName: string;
      lastName: string;
   }[];
};
interface AddClassFileInputProps {
   append: UseFieldArrayAppend<FormValues, "people">;
}

export default AddClassFileInput;
