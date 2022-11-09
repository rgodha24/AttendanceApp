from time import sleep
import random
import time
import requests
import urllib.parse

scannerName = "randomScanner"
scanner2Name = "randomScanner2"
scannerSecret = "gtq7yq"


while True:
    url1 = f"http://localhost:3000/api/signIn/{urllib.parse.quote(scannerName)}/{1000*random.randint(20,24)+ random.randint(1,350)}?secret={scannerSecret}"
    url2 = f"http://localhost:3000/api/signIn/{urllib.parse.quote(scanner2Name)}/{1000*random.randint(20,24)+ random.randint(1,350)}?secret={scannerSecret}"
    print("posting data\n", url1, "\n", url2)
    r1 = requests.post(url1)
    r2 = requests.post(url2)
    # print(r.text)

    time.sleep(2)
