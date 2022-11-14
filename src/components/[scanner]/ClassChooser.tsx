import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useSession, signIn } from "next-auth/react";
import Select from "react-select";
import { trpc } from "../../utils/trpc";

const ClassChooser: React.FC<ClassChooserProps> = ({
   setSelectedClass,
   selectedClass,
}) => {
   const classes = trpc.useQuery(["class.get-all-classes-by-user"]);
   const session = useSession();

   if (session.status === "unauthenticated") {
      return <button onClick={() => signIn()}>Sign In</button>;
   }

   return (
      <div>
         Choose a class{selectedClass === undefined && " before continuing"}:{" "}
         {classes.isLoading && "Loading..."}
         {classes.isError && (
            <button
               onClick={() => {
                  classes.refetch();
               }}
            >
               Error. Click here to retry
            </button>
         )}
         {classes.isSuccess &&
            (classes.data.length === 0 ? (
               <Link href="/addCourse">
                  {"You don't have any classes. Click here to make one."}
               </Link>
            ) : (
               <Select
                  className=" text-palette-black "
                  options={classes.data.map((a) => {
                     return { value: a.id, label: a.name };
                  })}
                  onChange={(value) => {
                     setSelectedClass(value?.value);
                  }}
                  value={
                     classes.data
                        .map((a) => {
                           return { value: a.id, label: a.name };
                        })
                        .filter((a) => a.value === selectedClass)[0]
                  }
               />
            ))}
      </div>
   );
};

interface ClassChooserProps {
   selectedClass: number | undefined;
   setSelectedClass: Dispatch<SetStateAction<number | undefined>>;
}

export default ClassChooser;
