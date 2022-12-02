import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Navbar from "../components/Navbar";
import { prisma } from "../server/db/client";
import { Scanner } from "@prisma/client";
import Link from "next/link";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
   props
) => {
   return (
      <div>
         <Navbar title="Home" />
         <div className="flex-col  ">
            <h2 className="flex justify-center text-4xl mt-4"> Scanners: </h2>
            {(props.scanners || []).map((scanner) => (
               <div
                  key={scanner.id}
                  className="flex justify-center mt-4 text-xl"
               >
                  <Link href={"/scanners/" + scanner.name} legacyBehavior>{scanner.name}</Link>
               </div>
            )) || <div className="flex justify-center mt-4 text-xl ">None</div>}
         </div>
      </div>
   );
};

export const getStaticProps: GetStaticProps<{
   scanners: Scanner[];
}> = async () => {
   const scanners = await prisma.scanner.findMany();

   return {
      props: {
         scanners,
      },
      revalidate: 60,
   };
};

export default Home;
