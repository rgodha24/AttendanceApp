import { GetServerSidePropsContext } from "next";
import SignedInPeople from "../../components/SignedInPeople";
import Navbar from "../../components/Navbar";
import { useEffect, useState, useMemo } from "react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
   return {
      props: {
         scannerName: ctx.params.scanner as string,
      },
   };
}

export default function ScannerPage(props: { scannerName: string }) {
   const startTime = new Date();
   const endTime = new Date();

   startTime.setHours(0, 0, 0, 0);
   endTime.setHours(24, 0, 0, 0);
   

   return (
      <>
         <Navbar />
         <SignedInPeople
            scannerName={props.scannerName}
            startTime={startTime}
            endTime={endTime}
         />
      </>
   );
}
