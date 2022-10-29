import { useState , useMemo} from "react";
import { signInEvent } from "../../types/sign-in-event";

import { useChannel, useEvent } from "@rgodha24/use-pusher";

const useSignIn = (channelName: string) => {
  const date = useMemo(() => new Date(), [])

  const [signIns, setSignIns] = useState<Array<signInEvent>>([]);
  const channel = useChannel(channelName);

  useEvent<signInEvent>(channel, "sign-in", (dataOriginal) => {
    if (dataOriginal !== undefined) {
      const data = { ...dataOriginal, timestamp: new Date(dataOriginal.timestamp) };
      setSignIns((prev) => [...prev, data]);
    }
  });

  return [signIns, date]as const;
};

export default useSignIn;
