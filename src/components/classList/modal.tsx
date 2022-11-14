import { useQueryClient } from "react-query";
import { trpc } from "../../utils/trpc";
import { Dialog } from "@headlessui/react";

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
   const mutation = trpc.useMutation("class.delete-class");
   const queryClient = useQueryClient();

   return (
      <Dialog
         open={true}
         onClose={() => props.setShow(false)}
         className=" relative z-50 "
      >
         <div className="fixed inset-0 flex justify-center p-4  dark:text-palette-white dark:bg-palette-black text-palette-black bg-palette-white">
            <Dialog.Panel className="w-full ">
               <Dialog.Title className="flex justify-center items-center m-auto w-full ">
                  <h2 className="text-4xl ">Delete Class {props.className}?</h2>
               </Dialog.Title>
               <Dialog.Description className="flex justify-center items-center m-auto w-full ">
                  <p className="text-xl mt-4">
                     Are you sure you want to delete this class? This action
                     cannot be undone.
                  </p>
               </Dialog.Description>
               <button
                  className="flex justify-center items-center m-auto p-4 text-xl mt-4 h-10 bg-palette-blue"
                  onClick={async () => {
                     await mutation.mutateAsync({ id: props.classId });
                     queryClient.invalidateQueries([
                        "class.get-all-classes-by-user",
                     ]);
                  }}
               >
                  <p className=" ">Delete {props.className}</p>
               </button>
            </Dialog.Panel>
         </div>
      </Dialog>
   );
};

export interface DeleteModalProps {
   classId: number;
   className: string;
   setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export default DeleteModal;
