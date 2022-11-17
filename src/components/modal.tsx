import { Dialog } from "@headlessui/react";
import { Dispatch, DOMAttributes, SetStateAction } from "react";

const Modal: React.FC<ModalProps> = (props) => {
   return (
      <Dialog
         open={true}
         onClose={() => props.setShow(false)}
         className=" relative z-50 "
      >
         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
         <div className="fixed inset-0 flex justify-center p-4  text-palette-white">
            <Dialog.Panel className="w-full ">
               <Dialog.Title className="flex justify-center items-center m-auto w-full ">
                  <h2 className="text-4xl ">{props.title}</h2>
               </Dialog.Title>
               <Dialog.Description className="flex justify-center items-center m-auto w-full ">
                  <p className="text-xl mt-4">{props.description}</p>
               </Dialog.Description>
               <button
                  className="flex justify-center items-center m-auto p-4 text-xl mt-4 h-10 bg-palette-blue"
                  type="button"
                  onClick={props.handleDelete}
                  disabled={props.isDeleting}
               >
                  {props.deleteDescription}
               </button>
               <button
                  className="flex justify-center items-center m-auto p-4 text-xl mt-4 h-10 bg-palette-crimson"
                  type="button"
                  onClick={async () => props.setShow(false)}
               >
                  Close
               </button>
               {props.isDeleting && (
                  <p className="flex justify-center items-center m-auto p-4 text-xl mt-4 ">Deleting...</p>
               )}
               {/* {JSON.stringify(props)} */}
            </Dialog.Panel>
         </div>
      </Dialog>
   );
};

export interface ModalProps {
   title: string;
   description: string;
   deleteDescription: string;
   isDeleting: boolean;
   setShow: Dispatch<SetStateAction<boolean>>;
   handleDelete: NonNullable<DOMAttributes<HTMLButtonElement>["onClick"]>;
}

export default Modal;
