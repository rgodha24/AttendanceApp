import { NextApiHandler } from "next";
import { z } from "zod";
import scannerNameSchema from "../../../../schemas/scannerName";

const handler: NextApiHandler<string | { error: string }> = async (
   req,
   res
) => {
   const scannerName = await scannerNameSchema.safeParseAsync(
      req.query.scanner
   );
   const scannerSecret = await z.string().safeParseAsync(req.query.secret);
   if (!scannerName.success) {
      res.status(400).json({ error: "Invalid scanner name" });
      return;
   }
   if (!scannerSecret.success) {
      res.status(400).json({ error: "Invalid scanner secret" });
      return;
   }
   const baseUrl =
      process.env.VERCEL_URL || `http://localhost:${process.env.PORT || 3000}`;
   res.status(200).send(
      createCode(baseUrl, scannerName.data, scannerSecret.data)
   );
   return;
};

const createCode = (
   baseUrl: string,
   scannerName: string,
   scannerSecret: string
) => `import urllib.parse
from urllib.request import Request
BASE_URL = "${baseUrl}"
SCANNER_NAME = "${scannerName}"
SCANNER_SECRET = "${scannerSecret}"


def postData(id: int):
    url = f"{BASE_URL}/api/signIn/{urllib.parse.quote(SCANNER_NAME)}/{id}?secret={urllib.parse.quote(SCANNER_SECRET)}"
    return urlopen(Request(url))

def main():
    try:
        while True:
            try:
                id = int(input())
                if len(str(id)) == 5:
                    postData(id)
                print(f"signed in {id}")
            except ValueError:
                print("Invalid Code")
    except KeyboardInterrupt:
        print("stopping...")
        
if __name__ == "__main__": 
   main()
`;

export default handler;
