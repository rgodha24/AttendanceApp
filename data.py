import urllib.parse
from urllib.request import Request, urlopen
BASE_URL = "http://localhost:3000"
SCANNER_NAME = "GreatHall"
SCANNER_SECRET = "abcde"


def postData(id: int):
    url = f"{BASE_URL}/api/signIn/{urllib.parse.quote(SCANNER_NAME)}/{id}?secret={urllib.parse.quote(SCANNER_SECRET)}"
    print(url)
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