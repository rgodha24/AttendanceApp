import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import DatePicker from "./DatePicker";

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
               <DatePicker time={startDate} setTime={setStartDate} />
            </div>
         )}
         {mode === "date-to-date" && (
            <div>
               Choose your end time:{" "}
               <DatePicker time={endDate} setTime={setEndDate} />
            </div>
         )}
      </div>
   );
};

interface AllDatesProps {
   mode: "realtime" | "date-to-realtime" | "date-to-date";
   startDate: dayjs.Dayjs;
   setStartDate: Dispatch<SetStateAction<dayjs.Dayjs>>;
   endDate: dayjs.Dayjs;
   setEndDate: Dispatch<SetStateAction<dayjs.Dayjs>>;
}

export default AllDates;
