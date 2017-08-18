import sys
import pyrebase
import time
import datetime
import threading
import subprocess
import ntplib
import time
from time import ctime

time.sleep(10)

c = ntplib.NTPClient()
response = c.request('128.138.140.44', version=3)
current_date = time.strftime("%Y/%m/%d", time.gmtime(response.tx_time))

class AttendanceSystem():
    config = {
        "apiKey": "AIzaSyBWbttyxQRQoha0JqeanWuF4pZgKcFbGXY",
        "authDomain": "brophyattendance.firebaseapp.com",
        "databaseURL": "https://brophyattendance.firebaseio.com",
        "storageBucket": "brophyattendance.appspot.com"
    }

    firebase = pyrebase.initialize_app(config)
    db = firebase.database()

    def __init__(self):
        pass
    
    def main(self):
        code = ""
        try:
            while True:
                try:
                    code = int(raw_input())
                    self.post_data(code)
                except ValueError:
                    print "Invalid Code"
        except KeyboardInterrupt:
            print "Closed"

    def post_data(self, id):
        data = {
            "id": id,
            "time": {".sv": "timestamp"}
        }

        if id == 99999:
            results = self.db.child("debug").child(current_date).push(data)
        else:
            # Pass the user's idToken to the push method
            results = self.db.child("sign-in").child(current_date).child(id).push({".sv": "timestamp"})


if __name__ == "__main__":
    AttendanceSystem().main()

