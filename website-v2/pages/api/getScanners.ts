import type { NextApiHandler } from "next";
import { app } from "../../firebase";
import { getFirestore, doc, getDoc , } from "firebase/firestore";

const handler: NextApiHandler = async (req, res) => {
   const firestore = getFirestore(app);
   const docRef = doc(firestore, "scanners", "scanners");
   const docSnap = await getDoc(docRef);

   res.send(docSnap.data());
};

export default handler;
