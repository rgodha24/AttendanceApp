import { NextFont } from "@next/font/dist/types";

export default function TeamSignIns({
   team,
   data,
   titleFont,
}: {
   team: string;
   data: {
      timestamp: Date;
      id: string;
      firstName: string;
      lastName: string;
      studentId: number;
   }[];
   titleFont: NextFont;
}) {
   return (
      <div className="flex-col w-full md:w-1/2 lg:w-1/4 text-center mt-4  ">
         <h3 className={`text-2xl  ${titleFont.className}`}>{team}</h3>
         <p>
            Signed In:{" "}
            {data.filter((value) => value.firstName.startsWith(team)).length}
         </p>
      </div>
   );
}
