import "../styles/globals.css";

import type React from "react";

function MyApp({
   Component,
   pageProps,
}: {
   Component: React.FC<any>;
   pageProps: any;
}) {
   return <Component {...pageProps} />;
}

export default MyApp;
