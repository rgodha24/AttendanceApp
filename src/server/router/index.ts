// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { signInRouter } from "./signIn";
import { classRouter } from "./class";
import { miscRouter } from "./misc";
import { scannerRouter } from "./scanner";

export const appRouter = createRouter()
   .transformer(superjson)
   .merge("signIn.", signInRouter)
   .merge("class.", classRouter)
   .merge("misc.", miscRouter)
   .merge("scanner.", scannerRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
