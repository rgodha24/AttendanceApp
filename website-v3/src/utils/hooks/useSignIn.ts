import pusher from "../pusherClient";
import { useState } from "react";
import { signInEvent } from "../../types/sign-in-event";

const useSignIn = (channelName: string) => {
  const [signIns, setSignIns] = useState<Array<signInEvent>>([]);
  const channel = pusher.subscribe(channelName);

  channel.bind("sign-in", (data: signInEvent) => {
    setSignIns((prev) => [...prev, data]);
  });

  return [
    signIns,
    () => {
      channel.disconnect();
      pusher.disconnect();
    },
  ] as const; 
};

export default useSignIn;
