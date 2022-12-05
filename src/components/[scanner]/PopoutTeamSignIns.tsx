import { Quicksand } from "@next/font/google";
import Head from "next/head";
import { useEffect } from "react";
import { useSignIns, UseSignInsParams } from "~/hooks/useSignIns";
import { getSignedIn } from "~/hooks/useSignInTableData";
import { trpc } from "~/trpc";
import TeamSignIns from "./TeamSignIns";

const TEAMS = [
   "Campion",
   "Canisius",
   "Claver",
   "Faber",
   "Gonzaga",
   "Ignatius",
   "Ricci",
   "Xavier",
] as const;
const font = Quicksand({
   weight: "500",
   subsets: ["latin"],
});
export default function PopoutTeamSignIns(props: PopoutTeamSignInsProps) {
   const { signIns, reset } = useSignIns({
      ...props,
   });
   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => () => reset(), []);

   const people = trpc.useQuery([
      "class.get-people-by-class",
      { classId: props.classId },
   ]);

   if (!people.isSuccess) {
      return <p>Loading...</p>;
   }

   const signedIn = getSignedIn([signIns, people.data]);

   return (
      <div className="bg-stone-400 text-black w-full h-full mt-4 ">
         <Head>
            <title>{`Brophy Attendance - Team Page - ${props.title}`}</title>
         </Head>
         <h1 className={`text-center text-6xl ${font.className}  `}>
            {props.title}
         </h1>

         <div className="flex grid-flow-row-dense justify-between flex-wrap first:ml-0 ">
            {TEAMS.map((team) => (
               <TeamSignIns
                  key={team}
                  data={signedIn}
                  team={team}
                  titleFont={font}
               />
            ))}
         </div>
         <style jsx global>{`
            body {
               --tw-bg-opacity: 1;
               background-color: rgb(168 162 158 / var(--tw-bg-opacity));
            }
         `}</style>
      </div>
   );
}

export type PopoutTeamSignInsProps = {
   title: string;
   classId: number;
} & UseSignInsParams;
