import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LegacyRef } from "react";
import {
   Control,
   FieldErrorsImpl,
   useFieldArray,
   UseFormRegister,
} from "react-hook-form";
import type { FormValues } from "./AddClassFileInput";
import AddClassFileInput from "./AddClassFileInput";

interface AddClassFieldArrayProps {
   control: Control<FormValues>;
   errors: Partial<FieldErrorsImpl<FormValues>>;
   register: UseFormRegister<FormValues>;
}

const AddClassFieldArray: React.FC<AddClassFieldArrayProps> = ({
   control,
   errors,
   register,
}) => {
   const { fields, append, remove } = useFieldArray({
      control,
      name: "people",
   });
   const [animationParent] = useAutoAnimate();

   return (
      <div>
         <ul ref={animationParent as LegacyRef<HTMLUListElement>}>
            {fields.map((field, index) => {
               return (
                  <li key={field.id} className="flex flex-row ">
                     <div>
                        <label htmlFor={`people.${index}.studentId`}>
                           Student Id:{" "}
                        </label>
                        <input
                           type="number"
                           id={`people.${index}.studentId`}
                           {...register(`people.${index}.studentId`, {
                              required: true,
                              valueAsNumber: true,
                           })}
                           className="ml-4"
                           placeholder="24000"
                        />
                        {errors.people?.[index]?.studentId && (
                           <p className="text-red-500">
                              {errors?.people?.[index]?.studentId?.message}
                           </p>
                        )}
                     </div>
                     <div>
                        <label htmlFor={`people.${index}.firstName`}>
                           First Name:{" "}
                        </label>
                        <input
                           className="ml-4"
                           type="text"
                           id={`people.${index}.firstName`}
                           {...register(`people.${index}.firstName`, {
                              required: true,
                           })}
                           placeholder="John"
                        />
                        {errors.people?.[index]?.firstName && (
                           <p className="text-red-500">
                              {errors?.people?.[index]?.firstName?.message}
                           </p>
                        )}
                     </div>
                     <div>
                        <label htmlFor={`people.${index}.lastName`}>
                           Last Name:{" "}
                        </label>
                        <input
                           className="ml-4"
                           type="text"
                           id={`people.${index}.lastName`}
                           {...register(`people.${index}.lastName`, {
                              required: true,
                           })}
                           placeholder="Doe"
                        />
                        {errors.people?.[index]?.lastName && (
                           <p className="text-red-500">
                              {errors?.people?.[index]?.lastName?.message}
                           </p>
                        )}
                     </div>
                     <div>
                        <button type="button" onClick={() => remove(index)}>
                           Remove Student
                        </button>
                     </div>
                  </li>
               );
            })}
         </ul>
         <button
            type="button"
            onClick={() =>
               append({
                  studentId: 0,
                  lastName: "",
                  firstName: "",
               })
            }
         >
            Add Student
         </button>
         <AddClassFileInput {...{append}}/> 
         {errors.people?.message && (
            <p className="text-red-500">{errors.people.message}</p>
         )}
      </div>
   );
};

export default AddClassFieldArray;
