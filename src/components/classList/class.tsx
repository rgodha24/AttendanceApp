import Link from "next/link";
import { useQueryClient } from "react-query";
import { useState } from "react";
import DeleteModal from "./modal";

const Class: React.FC<ClassProps> = (props) => {
   const [show, setShow] = useState(false);

   return (
      <div className="flex justify-between">
         <Link key={props.id} href={`/class/${props.id}`}>
            <p className="cursor-pointer">{props.name}</p>
         </Link>
         <button type="reset" onClick={() => setShow(true)}>
            Delete ❌
         </button>
         {show && <DeleteModal {...{ classId: props.id, setShow, className: props.name }} />}
      </div>
   );
};

interface ClassProps {
   id: number;
   name: string;
}

export default Class;