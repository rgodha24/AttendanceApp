import {
   GetServerSideProps,
   InferGetServerSidePropsType,
   NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { getBaseUrl } from "./_app";
import { prisma } from "../server/db/client";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import peopleClassSchema from "../schemas/peopleClassSchema";
import AddClassFieldArray from "../components/addClass/FieldArray";
import ClassList from "../components/classList/index";
import { useQueryClient } from "react-query";
import Link from "next/link";

const AddClassNew: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
   const mutation = trpc.useMutation("class.create-class");
   const allClasses = trpc.useQuery(["class.get-all-classes-by-user"], {
      initialData: props.classes,
   });
   const queryClient = useQueryClient();

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
   type FormValues = z.infer<typeof schema>;
   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting, isValidating, isValid },
      reset,
   } = useForm<FormValues>({
      resolver: zodResolver(schema),
      reValidateMode: "onChange",
      defaultValues: {
         people: [{}],
      },
   });

   return (
      <div>
         <Navbar title="Add Class" />
         <Link href="/addClassFile">Go here to upload in bulk</Link> <br />
         <div>
            <form
               onSubmit={handleSubmit(async (data) => {
                  await mutation.mutateAsync(data);
                  queryClient.invalidateQueries([
                     "class.get-all-classes-by-user",
                  ]);
               })}
            >
               <div>
                  <label htmlFor="name">Class Name:</label>
                  <input
                     type="text"
                     placeholder="class name"
                     id="name"
                     {...register("name", {
                        required: true,
                     })}
                     className="ml-4"
                  />
                  {errors.name && (
                     <p className="text-red-500">{errors.name.message}</p>
                  )}
               </div>
               <AddClassFieldArray {...{ control, register, errors }} />
               <br />
               {isSubmitting && <p>Submitting....</p>}
               {isValidating && <p>Validating....</p>}
               {isValid ? (
                  <button type="submit" disabled={isSubmitting}>
                     Submit
                  </button>
               ) : (
                  <p className="text-red-500">
                     Form is not valid, can not submit
                  </p>
               )}
               {mutation.isSuccess && (
                  <div>
                     <p>Submitted Successfully</p>
                     <button
                        type="reset"
                        onClick={() => {
                           reset();
                           mutation.reset();
                        }}
                     >
                        Click here to reset the form
                     </button>
                  </div>
               )}
               {mutation.isError && <p>There was an error submitting</p>}
            </form>
         </div>
         <ClassList classes={props.classes} />
      </div>
   );
};

const getServerSideProps: GetServerSideProps<{
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
               getBaseUrl() + "/api/auth/signin?callbackUrl=%2FaddClass",
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

export { getServerSideProps };
export default AddClassNew;
