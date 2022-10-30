import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Navbar from "../components/Navbar";
import { trpc } from "../utils/trpc";
import * as Yup from "yup";
import useClassStore from "../utils/hooks/useClassStore";

type FormValues = {
  name: string;
  people: number[];
};

const schema = Yup.object({
  name: Yup.string().required(),
  people: Yup.array(Yup.number().required()),
});

export default function AddClass() {
  const mutation = trpc.useMutation("class.create-class");
  const allClasses = trpc.useQuery(["class.get-all-classes-by-user"]);
  const classStore = useClassStore();

  const initialValues: FormValues = {
    name: "className",
    people: [0],
  };
  function randomStudentId(array: number[]): number {
    function randomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min) + min);
    }

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
          }}>
          {({ isSubmitting, resetForm, values, submitForm, setErrors }) => (
            <Form>
              <label htmlFor='name'>Class Name: </label>
              <Field type='text' name='name' />
              <ErrorMessage name='name' component='div' className='text-red-500' />
              <br className='mt-2' />
              <FieldArray name='people'>
                {({ remove, push }) => (
                  <>
                    {values.people.map((person, index) => {
                      const InputComponent = () => {
                        return (
                          <>
                            <label htmlFor={`people.${index}`} className='mr-4'>
                              Student Id:
                            </label>
                            <Field name={`people.${index}`} type='number' />
                            <ErrorMessage name={`people.${index}`} className='text-red-500' />
                            <button className='p-4' onClick={() => remove(index)}>
                              Remove
                            </button>
                          </>
                        );
                      };
                      if (!classStore.map.has(person)) {
                        return (
                          <div key={person}>
                            <InputComponent />
                            <p>
                              This person{"'"}s info is not currently downloaded.
                              <button type='button' onClick={() => classStore.addId(person)}>
                                Click here to download it
                              </button>
                            </p>
                          </div>
                        );
                      } else {
                        // we can assert this is non null because this code only runs if classStore.map.has(person) is true
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const data = classStore.map.get(person)!;

                        if (data.exists) {
                          return (
                            <div key={person}>
                              <InputComponent />
                              <div>
                                First Name: {data.firstName}, Last Name: {data.lastName}
                              </div>
                            </div>
                          );
                        } else {
                          setErrors({ people: "at least one student doesn't exist" });
                          return (
                            <div key={person}>
                              <InputComponent />
                              <div>This student does not exist in our database</div>
                            </div>
                          );
                        }
                      }
                    })}
                    <button
                      type='button'
                      onClick={() => {
                        console.log("adding a student");
                        push(randomStudentId(values.people));
                      }}>
                      Add Student
                    </button>
                  </>
                )}
              </FieldArray>
              <br />
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-red-500 text-2xl p-2 mt-4'
                onClick={() => submitForm()}>
                Submit
              </button>
              <br />
              <button
                type='button'
                onClick={() => {
                  const ids: number[] = [];
                  for (const x of classStore.map.keys()) {
                    ids.push(x);
                  }
                  classStore.getIds(ids);
                }}>
                Refetch all data about students
              </button>
              {classStore.isFetching && <div>Fetching data about students...</div>}
              <br />
              {isSubmitting && <div>Submitting...</div>}
              {/* {JSON.stringify(values)} */}
              {/* {mutation.status} */}
              {mutation.isError && <div>{mutation.error.message}</div>}
              {mutation.isSuccess && (
                <button type='reset' onClick={() => resetForm()}>
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
        {allClasses.isSuccess && allClasses.data.map((c) => <div key={c.id}>{c.name}</div>)}
        <button onClick={() => allClasses.refetch()}>click here to refetch this data</button>
        {allClasses.isRefetching && <div>Refetching...</div>}
      </div>
    </>
  );
}
