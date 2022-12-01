import { useQueryClient } from "react-query";
import { trpc } from "~/trpc";
import type { ModalProps } from "../modal";
import Modal from "../modal";

const DeleteClassModal: React.FC<DeleteClassModalProps> = (props) => {
   const mutation = trpc.useMutation("class.delete-class");
   const queryClient = useQueryClient();

   const modalProps: ModalProps = {
      title: `Delete Class ${props.className}?`,
      description: `Are you sure you want to delete ${props.className}?`,
      deleteDescription: `Delete ${props.className}`,
      isDeleting: mutation.isLoading,
      setShow: props.setShow,
      handleDelete: async (e) => {
         e.preventDefault();
         mutation.mutate(
            { id: props.classId },
            {
               onSettled: () =>
                  queryClient.invalidateQueries([
                     "class.get-all-classes-by-user",
                  ]),
            }
         );
      },
   };

   return <Modal {...modalProps} />;
};

export interface DeleteClassModalProps {
   classId: number;
   className: string;
   setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export default DeleteClassModal;
