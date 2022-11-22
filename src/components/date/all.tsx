import { Dispatch, SetStateAction } from "react";
import { DatePickerNew } from "./DatePicker/DatePickerNew";
import { DateValue } from "@internationalized/date";

const AllDates: React.FC<AllDatesProps> = ({
   mode,
   startDate,
   setStartDate,
   endDate,
   setEndDate,
}) => {
   return (
      <div>
         {(mode === "date-to-realtime" || mode === "date-to-date") && (
            <div>
               Choose your start time:{" "}
               <DatePickerNew
                  label="start date and time"
                  granularity="second"
                  value={startDate}
                  onChange={setStartDate}
               />
            </div>
         )}
         {mode === "date-to-date" && (
            <div>
               Choose your end time:{" "}
               <DatePickerNew
                  label="end date and time"
                  granularity="second"
                  value={endDate}
                  onChange={setEndDate}
                  minValue={startDate}
               />
            </div>
         )}
      </div>
   );
};

interface AllDatesProps {
   mode: "realtime" | "date-to-realtime" | "date-to-date";
   startDate: DateValue;
   setStartDate: Dispatch<SetStateAction<DateValue>>;
   endDate: DateValue;
   setEndDate: Dispatch<SetStateAction<DateValue>>;
}

export default AllDates;
