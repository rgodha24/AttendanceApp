import {
   GetServerSideProps,
   InferGetServerSidePropsType,
   NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { getBaseUrl } from "./_app";
import { prisma } from "../server/db/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import peopleClassSchema from "../schemas/peopleClassSchema";
import { NotSignedInTable } from "../components/[scanner]/tables";
import ClassList from "../components/classList";
import Navbar from "../components/Navbar";
import AddClassFileInput from "../components/addClass/FileInput";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "react-query";

const AddClassFiles: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
   type PeopleType = z.infer<typeof peopleClassSchema>[number];

   const [tableData, setTableData] = useState<PeopleType[]>([]);
   const [className, setClassName] = useState<string>("");
   const [validationError, setValidationError] = useState<string | null>(null);
   const [validated, setValidated] = useState<boolean>(false);
   const mutation = trpc.useMutation("class.create-class");
   const queryClient = useQueryClient();
   const allClasses = trpc.useQuery(["class.get-all-classes-by-user"], {
      initialData: props.classes,
   });

   useEffect(() => {
      setValidated(false);
   }, [className, tableData]);

   const schema = z.object({
      name: z
         .string()
         .refine(
            (name) => {
               return !allClasses.data?.some((c) => c.name === name);
            },
            {
               message: "Class name already exists",
            }
         )
         .refine(
            (data) => {
               // return false if data.name has any spaces in it
               return !data.includes(" ");
            },
            { message: "class name shouldn't have spaces" }
         ),
      people: peopleClassSchema,
   });
   const handleValidate = () => {
      const data = {
         people: tableData,
         name: className,
      };

      const a = schema.safeParse(data);

      if (a.success) {
         setValidated(true);
         setValidationError(null);
      } else {
         setValidationError(a.error.message);
         setValidated(false);
      }
   };

   const handleSubmit = async () => {
      const data = {
         people: tableData,
         name: className,
      };

      const a = schema.safeParse(data);

      if (a.success) {
         await mutation.mutateAsync(data);
         queryClient.invalidateQueries(["class.get-all-classes-by-user"]);
      } else {
         setValidationError(a.error.message);
         setValidated(false);
      }
   };

   const handleReset = () => {
      setClassName("");
      setTableData([]);
      setValidated(false);
      setValidationError(null);
      mutation.reset();
   };

   return (
      <div>
         <Navbar title="Add Class File" />
         <label htmlFor="className">Input the class name</label>
         <input
            type="text"
            name="className"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
         />

         <AddClassFileInput {...{ setTableData }} />
         <button onClick={() => handleValidate()}>Validate</button>
         {!!validationError && (
            <p>Error Validating data, try again. Error: {validationError}</p>
         )}
         {validated && !!!validationError && (
            <button
               onClick={async () => {
                  return await handleSubmit();
               }}
            >
               Add Class
            </button>
         )}
         {mutation.isLoading && <p>Adding class...</p>}
         {mutation.isSuccess && (
            <div>
               <p>Class added successfully!</p>
               <button type="reset" onClick={() => handleReset()}>
                  Click here to reset
               </button>
            </div>
         )}
         <NotSignedInTable data={tableData} isLoading={false} />
         <ClassList classes={props.classes} />
      </div>
   );
};

export const getServerSideProps: GetServerSideProps<{
   classes: { id: number; name: string }[];
}> = async (context) => {
   const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
   );

   if (session === null || session.user === undefined) {
      return {
         redirect: {
            destination:
               getBaseUrl() + "/api/auth/signin?callbackUrl=%2FaddClassFile",
            permanent: false,
         },
      };
   } else {
      return {
         props: {
            classes: await prisma.class.findMany({
               where: {
                  userId: session.user.id,
               },
               select: {
                  id: true,
                  name: true,
               },
            }),
         },
      };
   }
};

export default AddClassFiles;
