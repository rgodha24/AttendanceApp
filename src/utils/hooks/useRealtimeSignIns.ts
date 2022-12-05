import { useState, useMemo, useCallback } from "react";
import { SignIn } from "@prisma/client";

import { useChannel, useEvent } from "@rgodha24/use-pusher";

const useRealtimeSignIns = (channelName: `scanner-${string}`) => {
   const [signIns, setSignIns] = useState<Array<SignIn>>([]);
   const [dateState, setDateState] = useState(1);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const date = useMemo(() => new Date(), [dateState]);
   const channel = useChannel(channelName);

   useEvent<SignIn>(channel, "sign-in", (dataOriginal) => {
      if (dataOriginal !== undefined) {
         const data = {
            ...dataOriginal,
            timestamp: new Date(dataOriginal.timestamp),
         };
         setSignIns((prev) => [...prev, data]);
      }
   });

   const reset = useCallback( () => {
      console.log("reset")
      setSignIns([]);
      setDateState((a) => a + 1);
   }, []);

   return [signIns, date, reset] as const;
};

export default useRealtimeSignIns;
