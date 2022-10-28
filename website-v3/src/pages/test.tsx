import { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";

export default function Test() {
  const [date1, setDate1] = useState(dayjs());
  const [date2, setDate2] = useState(dayjs().subtract(1, "hour"));
  const [client, setClient] = useState(false);

  useEffect(() => setClient(true), []);

  if (!client) return <>Loading...</>;

  return (
    <div>
      <DatePicker time={date1} setTime={setDate1} />
      <br />
      <DatePicker time={date2} setTime={setDate2} />
    </div>
  );
}
