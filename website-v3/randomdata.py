from time import sleep
import random
import time
import requests





scannerName = "random_scanner"

while True:
    print("posting data")
    requests.post(
        f"http://localhost:3000/api/signin/{scannerName}/{random.randint(20,24)*1000 + random.randint(0,300)}")
    time.sleep(10)
