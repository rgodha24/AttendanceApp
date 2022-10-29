import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { prisma } from "../../server/db/client";
import type { Scanner } from "@prisma/client";
import scannerNameSchema from "../../schemas/scannerName";
import useSignIn from "../../utils/hooks/useSignIn";
import { trpc } from "../../utils/trpc";
import Table from "../../components/Table";
import Select from "react-select";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import DatePicker from "../../components/DatePicker";
import { useQueryClient } from "react-query";

const ScannerPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const [signedInRT, date] = useSignIn("scanner-" + props.scanner.name);
  const [mode, setMode] = useState<"realtime" | "date-to-realtime" | "date-to-date">("realtime");
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "hour"));
  const [endDate, setEndDate] = useState(dayjs(date));
  const [selectedClass, setSelectedClass] = useState<string>();
  const queryClient = useQueryClient();

  const classes = trpc.useQuery(["class.get-all-classes-by-user"]);
  const signedInD = trpc.useQuery([
    "signIn.all-signins-by-date",
    {
      scannerName: props.scanner.name,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    },
  ]);

  const signedIn = useMemo(() => {
    if (signedInD.isSuccess && Array.isArray(signedInD.data)) {
      if (mode === "date-to-realtime") return [...signedInRT, ...signedInD.data];
      else if (mode === "date-to-date") return signedInD.data;
      else return signedInRT;
    } else {
      return signedInRT;
    }
  }, [signedInRT, signedInD.isSuccess, signedInD.data, mode]);

  const onStartDateChange = useCallback(() => {
    if (mode !== "realtime") {
      queryClient.invalidateQueries(["signIn.all-signins-by-date"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onEndDateChange = useCallback(() => {
    if (mode === "date-to-date") {
      queryClient.invalidateQueries(["signIn.all-signins-by-date"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div>
      {/* <h1>Scanner Page</h1> */}
      Choose a class: {classes.isLoading && "Loading..."}
      {classes.isError && "Error"}
      {classes.isSuccess &&
        (classes.data.length === 0 ? (
          <Link href='/addCourse'>{"You don't have any classes. Click here to make one."}</Link>
        ) : (
          <Select
            options={classes.data.map((a) => {
              return { value: a.name, label: a.name };
            })}
            onChange={(value) => {
              setSelectedClass(value?.value);
            }}
          />
        ))}{" "}
      <br />
      Choose a mode:{" "}
      <Select
        options={[
          { label: "Realtime (only sign ins that happen while you are on this page)", value: "realtime" as const },
          { label: "Date to Realtime (starting at a date to this exact moment)", value: "date-to-realtime" as const },
          { label: "Date to Date (starting at a date and ending at a date)", value: "date-to-date" as const },
        ]}
        onChange={(value) => {
          if (value !== null) {
            setMode(value.value);
            if (value?.value !== "date-to-date") {
              setEndDate(dayjs(date));
            }
          }
        }}
      />
      {(mode === "date-to-realtime" || mode === "date-to-date") && (
        <div>
          Choose your start time: <DatePicker time={startDate} setTime={setStartDate} onChange={onStartDateChange} />
        </div>
      )}
      {mode === "date-to-date" && (
        <div>
          Choose your end time: <DatePicker time={endDate} setTime={setEndDate} onChange={onEndDateChange} />
        </div>
      )}
      <Table
        isLoading={mode !== "realtime" ? signedInD.isLoading : false}
        data={signedIn.map((a) => {
          return { ...a.people, timestamp: a.timestamp };
        })}
      />
      length of signedIn: {signedIn.length}
      {/* {date.toLocaleString()} */}
      {signedInD.isError && "Error"}
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
  const scannerNameCheck = await scannerNameSchema.safeParseAsync(context?.params?.scanner);

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
