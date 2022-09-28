import Navbar from "../components/Navbar";
import { useState } from "react";

export default function AddCoursePage() {
   const [courseName, setCourseName] = useState("");

   return (
      <>
         <Navbar />
      </>
   );
}
