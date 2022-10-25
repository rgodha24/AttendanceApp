import type { NextApiHandler } from "next";
import { app } from "../../firebase";
import {
   getFirestore,
   doc,
   getDoc,
   collection,
   setDoc,
} from "firebase/firestore";

const handler: NextApiHandler = async (req, res) => {
   const firestore = getFirestore(app);

   const docRef = collection(firestore, "scanners");
   const data = (await (await getDoc(doc(docRef, "all"))).data()
      .scanners) as string[];

   data.push(req.query.scanner as string);

   // deduplicate the array using array.filter
   const unique = data.filter((v, i, a) => a.indexOf(v) === i);

   await setDoc(doc(docRef, "all"), { scanners: unique });
   res.send((await getDoc(doc(docRef, "all"))).data());
   // res.send(unique);
};
export default handler;
