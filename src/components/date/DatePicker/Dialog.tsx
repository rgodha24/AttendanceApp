import { createRef } from "react";
import { AriaDialogProps, useDialog } from "react-aria";

export function Dialog({ title, children, ...props }: DialogProps) {
   const ref = createRef<HTMLDivElement>();
   const { dialogProps, titleProps } = useDialog(props, ref);

   return (
      <div {...dialogProps} ref={ref} style={{ padding: 30 }}>
         <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
         </h3>
         {children}
      </div>
   );
}

export type DialogProps = {
   title: string;
   children: React.ReactNode;
} & AriaDialogProps;
