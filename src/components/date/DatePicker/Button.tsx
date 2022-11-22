import { AriaButtonProps, useButton } from "react-aria";
import { createRef } from "react";

const Button = (
   props: AriaButtonProps<"button"> & {
      children: React.ReactNode;
      className: string;
   }
) => {
   const ref = createRef<HTMLButtonElement>();
   const { buttonProps } = useButton(props, ref);
   const { children } = props;

   return (
      <button {...buttonProps} ref={ref} className={props.className}>
         {children}
      </button>
   );
};

export { Button };
