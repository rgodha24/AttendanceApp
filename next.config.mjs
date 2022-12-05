import { env } from "./src/env/server.mjs";
import withBundleAnalyzerImport from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerImport({
   enabled: process.env.ANALYZE === "true",
});
export default withBundleAnalyzer({
   reactStrictMode: true,
   swcMinify: true,
   experimental: {
      swcPlugins: [
         [
            "next-superjson-plugin",
            {
               excluded: [],
            },
         ],
      ],
   },
});
