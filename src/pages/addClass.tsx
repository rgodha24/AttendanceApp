import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Navbar from "../components/Navbar";
import { trpc } from "../utils/trpc";
import * as Yup from "yup";
import { unstable_getServerSession } from "next-auth";
import {
   GetServerSideProps,
   InferGetServerSidePropsType,
   NextPage,
} from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getBaseUrl } from "./_app";
import { prisma } from "../server/db/client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { LegacyRef } from "react";

type FormValues = {
   name: string;
   people: { studentId: number; firstName: string; lastName: string }[];
};

const AddClass: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
   const mutation = trpc.useMutation("class.create-class");
   const allClasses = trpc.useQuery(["class.get-all-classes-by-user"], {
      initialData: props.classes,
   });
   const [animationParent] = useAutoAnimate();

   const schema = Yup.object({
      name: Yup.string()
         .notOneOf(
            allClasses.data?.map((a) => a.name) || [""],
            "You have already used this class name"
         )
         .required("class name is required"),
      people: Yup.array(
         Yup.object({
            studentId: Yup.number().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
         })
      ).required(),
   });

   const initialValues: FormValues = {
      name: "className" + randomNumber(0, 1000),
      people: [
         {
            studentId: 0,
            firstName: "firstName",
            lastName: "lastName",
         },
      ],
   };
   function randomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min) + min);
   }

   function randomStudentId(array: number[]): number {
      const number = randomNumber(20, 24) * 1000 + randomNumber(0, 300);

      if (array.includes(number)) {
         return randomStudentId(array);
      } else {
         return number;
      }
   }

   return (
      <>
         <Navbar />
         <br />
         <div>
            <Formik
               initialValues={initialValues}
               validationSchema={schema}
               onSubmit={async (values, actions) => {
                  console.log("submitting ");
                  actions.setSubmitting(true);
                  await mutation.mutateAsync(
                     { name: values.name, people: values.people },
                     {
                        onSettled() {
                           actions.setSubmitting(false);
                        },
                     }
                  );
                  allClasses.refetch();
               }}
            >
               {({
                  isSubmitting,
                  resetForm,
                  values,
                  submitForm,
                  setErrors,
               }) => (
                  <Form>
                     <label htmlFor="name">Class Name: </label>
                     <Field type="text" name="name" />
                     <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500"
                     />
                     <br className="mt-2" />
                     <FieldArray name="people">
                        {({ remove, push }) => (
                           <div>
                              <ul
                                 ref={
                                    animationParent as LegacyRef<HTMLUListElement>
                                 }
                              >
                                 {values.people.map((person, index, array) => {
                                    if (
                                       index !==
                                       array
                                          .map((a) => a.studentId)
                                          .indexOf(person.studentId)
                                    ) {
                                       console.log("detected duplicate");

                                       setErrors({
                                          people: `Student with id ${person.studentId} is duplicated`,
                                       });
                                    }

                                    return (
                                       <li key={index}>
                                          <label
                                             htmlFor={`people.${index}.studentId`}
                                             className="mr-4"
                                          >
                                             Student Id:
                                          </label>
                                          <Field
                                             name={`people.${index}.studentId`}
                                             type="number"
                                          />
                                          <ErrorMessage
                                             name={`people.${index}.studentId`}
                                             className="text-red-500"
                                          />
                                          <label
                                             htmlFor={`people.${index}.firstName`}
                                          >
                                             First Name:{" "}
                                          </label>
                                          <Field
                                             name={`people.${index}.firstName`}
                                             type="text"
                                          />
                                          <ErrorMessage
                                             name={`people.${index}.firstName`}
                                             className="text-red-500"
                                          />
                                          <label
                                             htmlFor={`people.${index}.lastName`}
                                          >
                                             Last Name:{" "}
                                          </label>
                                          <Field
                                             name={`people.${index}.lastName`}
                                             type="text"
                                          />
                                          <ErrorMessage
                                             name={`people.${index}.lastName`}
                                             className="text-red-500"
                                          />
                                          <button
                                             className="p-4"
                                             onClick={() => remove(index)}
                                          >
                                             Remove
                                          </button>
                                       </li>
                                    );
                                 })}
                              </ul>
                              <button
                                 type="button"
                                 onClick={() => {
                                    console.log("adding a student");
                                    push({
                                       studentId: randomStudentId(
                                          values.people.map((a) => a.studentId)
                                       ),
                                       firstName: "firstName",
                                       lastName: "lastName",
                                    });
                                 }}
                              >
                                 Add Student
                              </button>
                           </div>
                        )}
                     </FieldArray>
                     <ErrorMessage name="people" className="text-red-500" />
                     <br />
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-red-500 text-2xl p-2 mt-4"
                     >
                        Submit
                     </button>
                     <br />
                     {isSubmitting && <div>Submitting...</div>}
                     {/* {JSON.stringify(values)} */}
                     {/* {mutation.status} */}
                     {mutation.isError && <div>{mutation.error.message}</div>}
                     {mutation.isSuccess && (
                        <button type="reset" onClick={() => resetForm()}>
                           Success! Click Here to Reset the form
                        </button>
                     )}
                  </Form>
               )}
            </Formik>
            <br />
            All User Classes:
            {allClasses.isLoading && <div>Loading...</div>}
            {allClasses.isError && (
               <button onClick={() => allClasses.refetch()}>
                  Error: {allClasses.error.message}. click here to try again{" "}
               </button>
            )}
            {allClasses.isSuccess &&
               allClasses.data.map((c) => (
                  <Link key={c.id} href={`/class/${c.id}`} passHref>
                     <a>
                        <p>{c.name}</p>
                     </a>
                  </Link>
               ))}
            <br />
            <button onClick={() => allClasses.refetch()}>
               click here to refetch this data
            </button>
            {allClasses.isRefetching && <div>Refetching...</div>}
         </div>
      </>
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
export default AddClass;
