import Navbar from "../components/Navbar";
import { FormEvent, useState, useRef } from "react";
import {
   getFirestore,
   setDoc,
   doc,
   collection,
   addDoc,
} from "firebase/firestore/lite";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { app } from "../firebase";

export default function AddCoursePage() {
   const [courseNumber, setCourseNumber] = useState(0);
   const [user, loading, error] = useAuthState(auth);
   const [className, setClassName] = useState("");
   const firestore = getFirestore(app);
   const fileInput = useRef<HTMLInputElement>();
   const handleSubmit = async () => {
      const a = (await fileInput?.current?.files[0].text())
         .split("\n")
         .map((line) => line.split(","))
         .map((line) => {
            return {
               id: line[0],
               name: line[1] + " " + line[2],
               firstName: line[1],
               lastName: line[2],
            };
         });

      const data = {
         className,
         students: a,
      };

      await addDoc(collection(firestore, user.uid), data);

      console.log(a);
   };
   return (
      <>
         <Navbar />
         <input
            type="number"
            name="course_number"
            value={courseNumber}
            onChange={(e) => {
               setCourseNumber(e.target.valueAsNumber);
            }}
         />
         <a
            download="class.json"
            href={
               "https://brophyprep.instructure.com/api/v1/courses/" +
               courseNumber +
               "/users?per_page=100"
            }
         >
            Download Course Data
         </a>
         <br />
         the csv should be id, firstName, lastName
         <br />
         <label htmlFor="file">
            CSV:{" "}
            <input
               type="file"
               name="file"
               id="file"
               accept="text/csv"
               ref={fileInput}
            />
            Class Name:{" "}
            <input
               type="text"
               name="class_name"
               onChange={(e) => setClassName(e.target.value)}
               value={className}
            />
         </label>
         <br />
         <button onClick={handleSubmit}>upload</button>
      </>
   );
}
