import { parseAbsoluteToLocal, DateValue } from "@internationalized/date";
import { useState } from "react";
import { DatePickerNew } from "../components/date/DatePicker/DatePickerNew";
import { SSRProvider } from "react-aria";

export default function Test() {
   const [date, setDate] = useState(
      parseAbsoluteToLocal(new Date().toISOString()) as DateValue
   );
   return (
      <SSRProvider>
         <DatePickerNew
            label="Date and time"
            granularity="second"
            value={date}
            onChange={setDate}
         />
      </SSRProvider>
   );
}
