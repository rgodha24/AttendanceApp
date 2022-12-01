import { useQueryClient } from "react-query";
import { trpc } from "~/trpc";
import type { ModalProps } from "../modal";
import Modal from "../modal";

const DeleteScannerModal: React.FC<DeleteScannerModalProps> = (props) => {
   const mutation = trpc.useMutation("scanner.delete-scanner");
   const queryClient = useQueryClient();

   const modalProps: ModalProps = {
      title: `Delete Scanner ${props.scannerName}?`,
      description: `Are you sure you want to delete ${props.scannerName}?`,
      deleteDescription: `${mutation.isLoading ? "Deleting" : "Delete"} ${
         props.scannerName
      }${mutation.isLoading ? "...." : ""}`,
      isDeleting: mutation.isLoading,
      setShow: props.setShow,
      handleDelete: async (e) => {
         e.preventDefault();
         mutation.mutate(props.scannerName, {
            onSettled: () =>
               queryClient.invalidateQueries([
                  "scanner.get-all-scanners-by-user",
               ]),
         });
      },
   };

   return <Modal {...modalProps} />;
};

export interface DeleteScannerModalProps {
   scannerId: number;
   scannerName: string;
   setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export default DeleteScannerModal;
