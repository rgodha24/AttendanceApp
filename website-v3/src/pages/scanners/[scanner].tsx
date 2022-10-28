import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { prisma } from "../../server/db/client";
import { Scanner } from "@prisma/client";
import scannerNameSchema from "../../schemas/scannerName";
import useSignIn from "../../utils/hooks/useSignIn";
import { useEffect } from "react";


const ScannerPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {

  

  const [signedIn, disconnect] = useSignIn(props.scanner.name);
  useEffect(() => {
    return () => disconnect();
  }, [props.scanner.name, disconnect]);



  return (
    <div>
      <h1>Scanner Page</h1>
    </div>
  );
};

const getStaticPaths: GetStaticPaths = async () => {
  const scanners = await prisma.scanner.findMany();
  const paths = scanners.map((scanner) => ({
    params: { scanner: scanner.name },
  }));
  return { paths, fallback: false };
};

const getStaticProps: GetStaticProps<{ scanner: Scanner }> = async (context) => {
  const scannerNameCheck = scannerNameSchema.safeParse(context?.params?.scanner);

  if (!scannerNameCheck.success) {
    return {
      notFound: true,
    };
  }

  const scannerName = scannerNameCheck.data;

  try {
    return {
      props: {
        scanner: await prisma.scanner.findFirstOrThrow({ where: { name: scannerName } }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export { ScannerPage as default, getStaticPaths, getStaticProps };
