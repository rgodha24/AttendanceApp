from time import sleep
import random
import time
import requests
import urllib.parse

scannerName = "randomScanner"
scannerSecret = "gtq7yq"


while True:
    url = f"http://localhost:3000/api/signIn/{urllib.parse.quote(scannerName)}/{random.randint(20,24)*1000 + random.randint(1,300)}?secret={scannerSecret}"
    print("posting data\n", url)
    r =  requests.post(
        f"http://localhost:3000/api/signIn/{urllib.parse.quote(scannerName)}/{random.randint(20,24)*1000 + random.randint(1,300)}?secret={scannerSecret}", )
    # print(r.text)
    
    time.sleep(1)
