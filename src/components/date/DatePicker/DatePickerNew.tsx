import type { ZonedDateTime } from "@internationalized/date";
import { createRef } from "react";
import { useDatePicker } from "react-aria";
import { DatePickerStateOptions, useDatePickerState } from "react-stately";
import { DateField } from "./DateField";

export function DatePickerNew(props: DatePickerStateOptions<ZonedDateTime>) {
   const state = useDatePickerState(props);
   const ref = createRef<HTMLDivElement>();
   const { groupProps, labelProps, fieldProps } = useDatePicker(
      props,
      state,
      ref
   );

   return (
      <div className="relative inline-flex flex-row text-left">
         <span className="text-sm mr-4 my-auto " {...labelProps}>
            {props.label}
         </span>
         <div {...groupProps} ref={ref} className="flex group">
            <DateField {...fieldProps} />
         </div>
      </div>
   );
}
