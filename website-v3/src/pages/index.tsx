import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { prisma } from "../server/db/client";
import { Scanner } from "@prisma/client";
import Link from "next/link";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return (
    <>
      <Navbar />
      Scanners:{" "}
      {(props.scanners || []).map((scanner) => (
        <div key={scanner.id}>
          <Link href={"/scanners/" + scanner.name}>{scanner.name}</Link>
        </div>
      )) || <div>None</div>}
    </>
  );
};

export const getStaticProps: GetStaticProps<{ scanners: Scanner[] }> = async () => {
  const scanners = await prisma.scanner.findMany();

  return {
    props: {
      scanners,
    },
    revalidate: 60,
  };
};

export default Home;
