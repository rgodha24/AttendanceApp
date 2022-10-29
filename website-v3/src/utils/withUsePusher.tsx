/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PusherProvider } from "@rgodha24/use-pusher";
import { NextComponentType, NextPageContext } from "next";
import { AppPropsType } from "next/dist/shared/lib/utils";
import { NextRouter } from "next/router";

export default function withUsePusher({ clientKey, cluster }: { clientKey: string; cluster: string }) {
  return function usePusher(AppOrPage: NextComponentType<any, any, any>): NextComponentType {
    const withUsePusherInnerInner = (props: AppPropsType<NextRouter, any>) => {
      return (
        <PusherProvider clientKey={clientKey} cluster={cluster}>
          <AppOrPage {...props}></AppOrPage>
        </PusherProvider>
      );
    };

    return withUsePusherInnerInner as any;
  };
}
