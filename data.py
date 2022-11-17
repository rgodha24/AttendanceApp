import urllib.parse
from urllib.request import Request
BASE_URL = ""
SCANNER_NAME = ""
SCANNER_SECRET = ""


def postData(id: int):
    url = f"{BASE_URL}/api/signIn/{urllib.parse.quote(SCANNER_NAME)}/{id}?secret={urllib.parse.quote(SCANNER_SECRET)}"
    return Request(url) 

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
