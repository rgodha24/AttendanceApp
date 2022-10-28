import { getBaseUrl } from "../pages/_app";
import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "../server/router";
import superjson from "superjson";

const trpc = createTRPCClient<AppRouter>({
  url: getBaseUrl() + "/api/trpc",
  transformer: superjson,
});

export { trpc};
