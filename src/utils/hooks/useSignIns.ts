import { useMemo } from "react";
import { ScannerModes } from "~/types/scannerModes";
import { trpc } from "../trpc";
import useRealtimeSignIns from "./useRealtimeSignIns";

interface UseSignInsParams {
   scannerName: string;
   mode: ScannerModes;
   startDate: Date;
   endDate?: Date;
}

export const useSignIns = ({
   scannerName,
   mode,
   startDate,
   endDate,
}: UseSignInsParams) => {
   const [realtimeSignins, connectionDate, reset] = useRealtimeSignIns(
      `scanner-${scannerName}`
   );
   const utils = trpc.useContext();

   const dateSignins = trpc.useQuery(
      [
         "signIn.all-signins-by-date",
         {
            startDate,
            endDate: endDate || connectionDate,
            scannerName,
         },
      ],
      {
         refetchInterval: 1000 * 60 * 5,
      }
   );

   const {
      signIns,
      error = false,
      isLoading = false,
      isPlaceholder = false,
   } = useMemo(() => {
      if (mode === "realtime") {
         return { signIns: realtimeSignins };
      }

      if (dateSignins.isSuccess) {
         if (mode === "date-to-realtime") {
            return { signIns: [...realtimeSignins, ...dateSignins.data] };
         }
         if (mode === "date-to-date") {
            return { signIns: dateSignins.data };
         }
      } else {
         if (mode === "date-to-realtime") {
            return {
               signIns: realtimeSignins,
               isLoading: true,
               isPlaceholder: true,
            };
         } else if (mode === "date-to-date") {
            return { signIns: [], isLoading: true, isPlaceholder: true };
         }
      }
      return { signIns: [] as typeof realtimeSignins, error: true };
   }, [realtimeSignins, mode, dateSignins.data, dateSignins.isSuccess]);

   return {
      signIns,
      connectionDate,
      reset: () => {
         reset();
         utils.invalidateQueries("signIn.all-signins-by-date");
      },
      error: error || dateSignins.isError,
      isLoading,
      isPlaceholder,
   };
};
