import {
   AriaCalendarProps,
   useCalendar,
   useLocale,
   useCalendarCell,
   useCalendarGrid,
   AriaCalendarGridProps,
   AriaCalendarCellProps,
} from "react-aria";
import {
   CalendarState,
   RangeCalendarState,
   useCalendarState,
} from "react-stately";
import { createCalendar } from "@internationalized/date";
import { createRef } from "react";
import { DateValue } from "@react-types/calendar";
import { getWeeksInMonth } from "@internationalized/date";

// Reuse the Button from your component library. See below for details.

export function Calendar(props: AriaCalendarProps<DateValue>) {
   const { locale } = useLocale();
   const state = useCalendarState({
      ...props,
      locale,
      createCalendar,
   });

   const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(props, state);

   return (
      <div {...calendarProps} className="calendar">
         <div className="header">
            <h2>{title}</h2>
            <button {...prevButtonProps}>&lt;</button>
            <button {...nextButtonProps}>&gt;</button>
         </div>
         <CalendarGrid state={state} />
      </div>
   );
}

export function CalendarGrid({ state, ...props }: CalendarGridProps) {
   const { locale } = useLocale();
   const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

   // Get the number of weeks in the month so we can render the proper number of rows.
   const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

   return (
      <table {...gridProps}>
         <thead {...headerProps}>
            <tr>
               {weekDays.map((day, index) => (
                  <th key={index}>{day}</th>
               ))}
            </tr>
         </thead>
         <tbody>
            {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
               <tr key={weekIndex}>
                  {state
                     .getDatesInWeek(weekIndex)
                     .map((date, i) =>
                        date ? (
                           <CalendarCell key={i} state={state} date={date} />
                        ) : (
                           <td key={i} />
                        )
                     )}
               </tr>
            ))}
         </tbody>
      </table>
   );
}

export type CalendarGridProps = {
   state: CalendarState | RangeCalendarState;
} & AriaCalendarGridProps;

function CalendarCell({ state, date }: {date: AriaCalendarCellProps["date"], state: CalendarState | RangeCalendarState}) {
   const ref = createRef<HTMLDivElement>();
   const {
      cellProps,
      buttonProps,
      isSelected,
      isOutsideVisibleRange,
      isDisabled,
      isUnavailable,
      formattedDate,
   } = useCalendarCell({ date }, state, ref);

   return (
      <td {...cellProps}>
         <div
            {...buttonProps}
            ref={ref}
            hidden={isOutsideVisibleRange}
            className={`cell ${isSelected ? "selected" : ""} ${
               isDisabled ? "disabled" : ""
            } ${isUnavailable ? "unavailable" : ""}`}
         >
            {formattedDate}
         </div>
      </td>
   );
}
