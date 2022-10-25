from time import sleep
import pyrebase
import random
import time
import requests
config = {
    "apiKey": "AIzaSyCsS2X6EmlFI-_RlkAtrAGU2JDrjBWuwc4",
    "authDomain": "brophyattendance-v2.firebaseapp.com",
    "databaseURL": "https://brophyattendance-v2-default-rtdb.firebaseio.com",
    "projectId": "brophyattendance-v2",
    "storageBucket": "brophyattendance-v2.appspot.com",
    "messagingSenderId": "789299971852",
    "appId": "1:789299971852:web:6bdd247aee0a530fcc2b29"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

scannerName = "random_scanner"

while True:
    print("posting data")
    requests.post(
        f"http://localhost:3000/api/{scannerName}/signIn/{random.randint(20,24)*1000 + random.randint(0,300)}")
    time.sleep(10)
