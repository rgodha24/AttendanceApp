import { GetServerSideProps, NextPage } from "next";
import Navbar from "../components/Navbar";
import { Formik, Form, Field, ErrorMessage,  } from "formik";
import scannerSchema from "../schemas/scanner";
import { InferType } from "yup";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { trpc } from "../utils/trpc";
import { getBaseUrl } from "./_app";
import { useQueryClient } from "react-query";


type FormValues = Pick<InferType<typeof scannerSchema>, "name" | "scannerSecret" | "purgeEveryDays">; // idk why but this return type is messed up if i dont do this

const AddScanner: NextPage = () => {
  const initialValues: FormValues = {
    name: "scannerName",
    scannerSecret: "scanner secret ",
    purgeEveryDays: 14,
  };
  const queryClient = useQueryClient();

  const mutation = trpc.useMutation("scanner.create-scanner", {
    onSuccess: () => {
      queryClient.invalidateQueries("scanner.get-all-scanners-by-user");
    },
  });
  const scanners = trpc.useQuery(["scanner.get-all-scanners-by-user"]);

  return (
    <>
      <Navbar />
      <br />
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={scannerSchema}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            await mutation.mutateAsync(values, {
              onSettled() {
                actions.setSubmitting(false);
              },
            });
          }}>
          {({ isSubmitting, setValues, resetForm, values }) => (
            <Form>
              <label htmlFor='name'>Scanner Name: </label>
              <Field type='text' name='name' />
              <ErrorMessage name='name' component='div' className='text-red-500' />
              <br className='mt-2' />
              <label htmlFor='scannerSecret'>Scanner Secret: </label>
              <Field type='text' name='scannerSecret' />
              <button
                type='button'
                onClick={() =>
                  setValues((values) => {
                    return {
                      ...values,
                      scannerSecret:
                        Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5),
                    };
                  })
                }>
                Randomize Scanner Secret
              </button>
              <ErrorMessage name='scannerSecret' component='div' className='text-red-500' />
              <br className='mt-2' />
              <label htmlFor='purgeEveryDays'>How often to delete the data in days, default = 14: </label>
              <Field type='number' name='purgeEveryDays' />
              <ErrorMessage name='purgeEveryDays' component='div' className='text-red-500' />
              <br className='mt-2' />
              <button type='submit' disabled={isSubmitting} className='bg-red-500 text-2xl p-2'>
                Submit
              </button>
              <br />
              {isSubmitting && <div>Submitting...</div>}
              {mutation.isError && <div>{mutation.error.message}</div>}
              {mutation.isSuccess && <button onClick={() => resetForm()}>Success! Click Here to Reset the form</button>}
              {JSON.stringify(values)}
            </Form>
          )}
        </Formik>

        <br />
        <h1>Your Scanners</h1>
        {scanners.isLoading && <div>Loading...</div>}
        {scanners.isError && <div>{scanners.error.message}</div>}
        {scanners.isSuccess &&
          scanners.data.map((scanner) => (
            <p key={scanner.id}>
              name: {scanner.name}, secret: {scanner.scannerSecret}
            </p>
          ))}
      </div>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (session === null) {
    return {
      redirect: {
        destination: getBaseUrl() + "/api/auth/signin?callbackUrl=%2FaddScanner",
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
