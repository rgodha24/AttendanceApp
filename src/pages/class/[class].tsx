import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { prisma } from "~/db";
import { z } from "zod";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getBaseUrl } from "../_app";

const ClassPage: React.FC<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
   return (
      <div>
         <h1>Class Page</h1>
      </div>
   );
};

const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions
   );

   let classId: number;
   try {
      classId = z.number().parse(String(ctx.params?.class));
   } catch {
      return {
         notFound: true,
      };
   }

   if (session === null || session.user === undefined) {
      return {
         redirect: {
            destination:
               getBaseUrl() +
               `/api/auth/signin?callbackUrl=%2Fclass%2F${classId}`,
            permanent: false,
         },
      };
   }

   const classRecord = await prisma.class.findFirst({
      where: {
         id: classId,
      },
   });

   if (classRecord?.userId !== session.user.id) {
      return {
         redirect: {
            destination:
               getBaseUrl() +
               `/api/auth/signin?callbackUrl=%2Fclass%2Funauthorized`,
            permanent: false,
         },
      };
   }

   return {
      props: {
         classRecord,
      },
   };
};

export { getServerSideProps };
export default ClassPage;
