import { createRef } from "react";
import {
   AriaPopoverProps,
   DismissButton,
   Overlay,
   usePopover,
} from "react-aria";
import { OverlayTriggerState } from "react-stately";

export function Popover({
   children,
   state,
   offset = 8,
   ...props
}: PopoverProps) {
   const popoverRef = createRef<HTMLDivElement>();
   const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
      {
         ...props,
         offset,
         popoverRef,
      },
      state
   );

   return (
      <Overlay>
         <div {...underlayProps} className="underlay" />
         <div {...popoverProps} ref={popoverRef} className="popover">
            <svg {...arrowProps} className="arrow" data-placement={placement}>
               <path d="M0 0,L6 6,L12 0" />
            </svg>
            <DismissButton onDismiss={state.close} />
            {children}
            <DismissButton onDismiss={state.close} />
         </div>
      </Overlay>
   );
}

export type PopoverProps = {
   children: React.ReactNode;
   state: OverlayTriggerState;
} & Omit<AriaPopoverProps, "popoverRef">;
