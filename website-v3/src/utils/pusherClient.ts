import Pusher from "pusher-js";
import { env } from "../env/client.mjs";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,

})

export default pusher 