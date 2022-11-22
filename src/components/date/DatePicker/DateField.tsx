import { useDateField, useDateSegment, useLocale } from "react-aria";
import {
   DateFieldState,
   DateFieldStateOptions,
   DateSegment,
   useDateFieldState,
} from "react-stately";
import { createCalendar } from "@internationalized/date";
import { createRef } from "react";

export function DateField(
   props: Omit<DateFieldStateOptions, "locale" | "createCalendar">
) {
   const { locale } = useLocale();
   const state = useDateFieldState({
      ...props,
      locale,
      createCalendar,
   });

   const ref = createRef<HTMLDivElement>();
   const { labelProps, fieldProps } = useDateField(props, state, ref);

   return (
      <div>
         <span {...labelProps}>{props.label}</span>
         <div
            {...fieldProps}
            ref={ref}
            className="border border-gray-300 group-hover:border-gray-400 transition-colors rounded-l-md pr-10 group-focus-within:border-violet-600 group-focus-within:group-hover:border-violet-600 p-1 relative flex items-center "
         >
            {state.segments.map((segment, i) => (
               <DateSegment key={i} segment={segment} state={state} />
            ))}
            {state.validationState === "invalid" && (
               <span aria-hidden="true">🚫</span>
            )}
         </div>
      </div>
   );
}

function DateSegment({
   segment,
   state,
}: {
   segment: DateSegment;
   state: DateFieldState;
}) {
   const ref = createRef<HTMLDivElement>();
   const { segmentProps } = useDateSegment(segment, state, ref);

   return (
      <div
         {...segmentProps}
         ref={ref}
         className={`segment mx-1 ${segment.isPlaceholder ? "placeholder" : ""}`}
      >
         {segment.text}
      </div>
   );
}
