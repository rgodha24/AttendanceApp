import { useState, useMemo } from "react";
import { SignIn } from "@prisma/client";

import { useChannel, useEvent } from "@rgodha24/use-pusher";

const useSignIn = (channelName: string) => {
  const date = useMemo(() => new Date(), []);

  const [signIns, setSignIns] = useState<Array<SignIn>>([]);
  const channel = useChannel(channelName);

  useEvent<SignIn>(channel, "sign-in", (dataOriginal) => {
    if (dataOriginal !== undefined) {
      const data = { ...dataOriginal, timestamp: new Date(dataOriginal.timestamp) };
      setSignIns((prev) => [...prev, data]);
    }
  });

  return [signIns, date] as const;
};

export default useSignIn;
