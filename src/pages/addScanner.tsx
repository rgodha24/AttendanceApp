import { GetServerSideProps, NextPage } from "next";
import Navbar from "../components/Navbar";
import scannerSchema from "../schemas/scanner";
import { z } from "zod";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { trpc } from "~/trpc";
import { getBaseUrl } from "./_app";
import { useQueryClient } from "react-query";
import ScannerList from "../components/scannerList";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormValues = z.infer<typeof scannerSchema>; // idk why but this return type is messed up if i dont do this

const AddScanner: NextPage = () => {
   const queryClient = useQueryClient();

   const mutation = trpc.useMutation("scanner.create-scanner", {
      onSuccess: () => {
         queryClient.invalidateQueries("scanner.get-all-scanners-by-user");
      },
   });

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting, isValidating, isValid },
   } = useForm<FormValues>({
      resolver: zodResolver(scannerSchema),
      reValidateMode: "onChange",
   });
   register("name", { required: true });

   return (
      <div>
         <Navbar title="Add Scanner" />
         <br />
         <div className="px-3">
            <form
               onSubmit={handleSubmit(async (data) => {
                  await mutation.mutateAsync(data);
                  queryClient.invalidateQueries([
                     "scanner.get-all-scanners-by-user",
                     "scanner.get-all-scanner-names",
                  ]);
               })}
            >
               <div>
                  <label htmlFor="name">Scanner Name</label>
                  <input
                     type="text"
                     {...register("name", { required: true })}
                     placeholder="Scanner Name"
                     className="ml-3"
                  />
                  {errors.name && (
                     <p className="text-red-500">{errors.name.message}</p>
                  )}
               </div>
               <div>
                  <label htmlFor="secret">Scanner Secret</label>
                  <input
                     type="text"
                     {...register("scannerSecret", { required: true })}
                     placeholder="Scanner Secret"
                     className="ml-3"
                  />
                  {errors.scannerSecret && (
                     <p className="text-red-500">
                        {errors.scannerSecret.message}
                     </p>
                  )}
               </div>
               <div>
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
               </div>
            </form>
         </div>
         <div className="px-3">
            <ScannerList />
         </div>
      </div>
   );
};

const getServerSideProps: GetServerSideProps = async (context) => {
   const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
   );

   if (session === null) {
      return {
         redirect: {
            destination:
               getBaseUrl() + "/api/auth/signin?callbackUrl=%2FaddScanner",
            permanent: false,
         },
      };
   } else {
      return {
         props: {},
      };
   }
};

export default AddScanner;
export { getServerSideProps };
