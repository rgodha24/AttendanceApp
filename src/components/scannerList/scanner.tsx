import { inferQueryOutput } from "~/trpc";
import Link from "next/link";
import DeleteScannerModal from "./modal";
import { useState } from "react";

const Scanner: React.FC<ScannerProps> = (props) => {
   const [show, setShow] = useState(false);
   return (
      <div className="flex justify-between w-full">
         <h3 className="flex-1">{props.name}:</h3>
         <Link
            key={props.id}
            href={`/scanners/${props.name}`}
            className="flex-1"
         >
            <p className="cursor-pointer flex-1">
               Go to {props.name + "'"}s signin page
            </p>
         </Link>
         <Link
            href={`/api/scanners/${props.name}/code?secret=${encodeURI(
               props.scannerSecret
            )}`}
         >
            <p className="cursor-pointer flex-1">
               Go to the code to run this scanner
            </p>
         </Link>
         <button type="reset" onClick={() => setShow(true)} className=" w-fit">
            Delete ❌
         </button>
         {show && (
            <DeleteScannerModal
               {...{ scannerId: props.id, setShow, scannerName: props.name }}
            />
         )}
      </div>
   );
};

type ScannerProps =
   inferQueryOutput<"scanner.get-all-scanners-by-user">[number];

export default Scanner;
