import { inferQueryOutput, trpc } from "../../utils/trpc";
import Class from "./class";

/**
 * Only useable when the user is signed in
 * @param props.classes should not be updated
 * @returns
 */
const ClassList: React.FC<ClassListProps> = ({ classes }) => {
   const allClasses = trpc.useQuery(["class.get-all-classes-by-user"], {
      initialData: classes,
   });

   return (
      <div>
         All User Classes:
         {allClasses.isLoading && <div>Loading...</div>}
         {allClasses.isError && (
            <button onClick={() => allClasses.refetch()}>
               Error: {allClasses.error.message}. click here to try again{" "}
            </button>
         )}
         {allClasses.isSuccess &&
            allClasses.data.map((c) => <Class {...c} key={c.id} />)}
         <br />
         <button onClick={() => allClasses.refetch()}>
            click here to refetch this data
         </button>
         {allClasses.isRefetching && <div>Refetching...</div>}
      </div>
   );
};

export interface ClassListProps {
   classes?: inferQueryOutput<"class.get-all-classes-by-user">;
}

export default ClassList;
