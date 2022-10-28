// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { signInRouter } from "./signIn";
import { classRouter } from "./class";
import { peopleRouter } from "./people";
import { miscRouter } from "./misc";
import { scannerRouter } from "./scanner";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", protectedExampleRouter)
  .merge("signIn.", signInRouter)
  .merge("class.", classRouter)
  .merge("people.", peopleRouter)
  .merge("misc.", miscRouter)
  .merge("scanner.", scannerRouter)
  .query("hello", {
    async resolve() {
      return "world";
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
