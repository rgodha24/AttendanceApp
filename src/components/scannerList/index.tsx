import { inferQueryOutput, trpc } from "~/trpc";
import Scanner from "./scanner";

const ScannerList: React.FC<ScannerListProps> = (props) => {
   const query = trpc.useQuery(["scanner.get-all-scanners-by-user"], {
      initialData: props.scanners,
   });

   return (
      <div>
         All your scanners:
         {query.isLoading && <div>Loading...</div>}
         {query.isError && (
            <button onClick={() => query.refetch()}>
               Error: {query.error.message}. click here to try again{" "}
            </button>
         )}
         {query.isSuccess &&
            query.data.map((s) => <Scanner {...s} key={s.id} />)}
         <br />
         <button onClick={() => query.refetch()}>
            click here to refetch this data
         </button>
         {query.isRefetching && <div>Refetching...</div>}
      </div>
   );
};

interface ScannerListProps {
   scanners?: inferQueryOutput<"scanner.get-all-scanners-by-user">;
}

export default ScannerList;
