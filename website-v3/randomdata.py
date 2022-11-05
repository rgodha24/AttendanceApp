from time import sleep
import random
import time
import requests
import urllib.parse

scannerName = "randomScanner"
scannerSecret = "gtq7yq"


while True:
    url = f"http://localhost:3000/api/signIn/{urllib.parse.quote(scannerName)}/{20000+ random.randint(1,19)}?secret={scannerSecret}"
    print("posting data\n", url)
    r = requests.post(url)
    # print(r.text)

    time.sleep(1)
