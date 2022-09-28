import type { NextApiHandler } from "next";
import { app } from "../../firebase";
import { getFirestore, doc, getDoc, collection, setDoc } from "firebase/firestore";

const handler: NextApiHandler = async (req, res) => {
   const firestore = getFirestore(app);

   const docRef = collection(firestore, "scanners");
   const docSnap = await getDoc(doc(docRef, "all"));

   

   //    const { scanner } = req.body;
   res.send(req.body.scanner);
};
export default handler;
