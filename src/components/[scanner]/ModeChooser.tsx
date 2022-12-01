import { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

const ModeChooser: React.FC<ModeChooserProps> = ({
   setMode,
   setEndDate,
   date,
}) => {
   return (
      <div>
         <p>Choose your mode: </p>
         <Select
            className=" text-palette-black "
            options={[
               {
                  label: "Realtime (only sign ins that happen while you are on this page, default)",
                  value: "realtime" as const,
               },
               {
                  label: "Date to Realtime (starting at a date to this exact moment)",
                  value: "date-to-realtime" as const,
               },
               {
                  label: "Date to Date (starting at a date and ending at a date)",
                  value: "date-to-date" as const,
               },
            ]}
            onChange={(value) => {
               if (value !== null) {
                  setMode(value.value);
                  if (value.value !== "date-to-date") {
                     setEndDate(parseAbsoluteToLocal(date.toISOString()));
                  }
               }
            }}
            defaultValue={{
               label: "Realtime (only sign ins that happen while you are on this page)",
               value: "realtime" as
                  | "realtime"
                  | "date-to-realtime"
                  | "date-to-date",
            }}
         />
      </div>
   );
};

export interface ModeChooserProps {
   setMode: Dispatch<
      SetStateAction<"realtime" | "date-to-realtime" | "date-to-date">
   >;
   setEndDate: Dispatch<SetStateAction<ZonedDateTime>>;
   date: Date;
}

export default ModeChooser;
