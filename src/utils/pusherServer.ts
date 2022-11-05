import Pusher from "pusher";
import { env } from "../env/server.mjs";

const pusher = new Pusher({
   appId: env.PUSHER_APP_ID,
   key: env.NEXT_PUBLIC_PUSHER_KEY,
   secret: env.PUSHER_SECRET,
   cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export default pusher;
