import Navbar from "~/components/Navbar";

export default function Unauthorized() {
   return (
      <div>
         <Navbar title="unauthorized" />
         <p>You aren&apos;t authorized to view this class</p>
      </div>
   );
}
