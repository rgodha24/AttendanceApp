// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";
// import { signInWithPopup } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import Link from "next/link";
import Navbar from "../components/Navbar";
// import SignedInPeople from "../components/SignedInPeople";
// import { useState } from "react";
import { firestore } from "../firebase";
import { getDoc, doc, collection } from "firebase/firestore/lite";

export default function Home(props: { scanners: string[] }) {
   return (
      <div>
         <Navbar />
         choose the name of hte scanner
         <br />
         {props.scanners.map((scanner) => {
            return (
               <Link href={`/scanners/${scanner}`} key={scanner}>
                  {scanner}
               </Link>
            );
         })}
      </div>
   );
}

export async function getServerSideProps() {
   return {
      props: {
         scanners: (
            await getDoc(doc(collection(firestore, "scanners"), "all"))
         ).data().scanners as string[],
      },
   };
}
