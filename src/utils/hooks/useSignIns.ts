import { useMemo, useCallback } from "react";
import { trpc } from "../trpc";
import useRealtimeSignIns from "./useRealtimeSignIns";

export type UseSignInsParams =
   | {
        mode: "date-to-realtime";
        scannerName: string;
        startDate: Date;
     }
   | {
        mode: "date-to-date";
        scannerName: string;
        startDate: Date;
        endDate: Date;
     }
   | {
        mode: "realtime";
        scannerName: string;
     };
export const useSignIns = (data: UseSignInsParams) => {
   const [realtimeSignins, connectionDate, reset] = useRealtimeSignIns(
      `scanner-${data.scannerName}`
   );
   const {invalidateQueries} = trpc.useContext();

   const dateSignins = trpc.useQuery(
      ["signIn.all-signins-by-date", { ...data, connectionDate }],
      {
         // refetchInterval: 1000 * 60 * 5,
         // refetchOnWindowFocus: true,
         // refetchOnReconnect: true,
         cacheTime: 1000 * 60 * 5,
      }
   );

   const {
      signIns,
      error = false,
      isLoading = false,
      isPlaceholder = false,
   } = useMemo(() => {
      console.log("rerun");
      if (data.mode === "realtime") {
         return { signIns: realtimeSignins };
      }

      if (dateSignins.isSuccess) {
         if (data.mode === "date-to-realtime") {
            return { signIns: [...realtimeSignins, ...dateSignins.data] };
         }
         if (data.mode === "date-to-date") {
            return { signIns: dateSignins.data };
         }
      } else {
         if (data.mode === "date-to-realtime") {
            return {
               signIns: realtimeSignins,
               isLoading: true,
               isPlaceholder: true,
            };
         } else if (data.mode === "date-to-date") {
            return { signIns: [], isLoading: true, isPlaceholder: true };
         }
      }
      return { signIns: [] as typeof realtimeSignins, error: true };
   }, [data.mode, dateSignins.isSuccess, dateSignins.data, realtimeSignins]);

   return {
      signIns,
      connectionDate,
      reset: useCallback(() => {
         reset();
         invalidateQueries("signIn.all-signins-by-date");
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [reset]),
      error: error || dateSignins.isError,
      isLoading,
      isPlaceholder,
   };
};
