import sys
import pyrebase
import time
import datetime
import RPi.GPIO as GPIO
import threading
import subprocess
import ntplib
import time
from time import ctime
# import Adafruit_VCNL40xx

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT)

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
    # vcnl = Adafruit_VCNL40xx.VCNL4010()

    def __init__(self):
        pass
    
    def main(self):
        # self.run_event = threading.Event()
        # self.run_event.set()
        code = ""
        # user = threading.Thread(target=self.check_for_proximity)
        # user.daemon = True
        # user.start()
        try:
            while True:
                try:
                    code = int(raw_input())
                    self.post_data(code)
                except ValueError:
                    print "Invalid Code"
        except KeyboardInterrupt:
            # self.run_event.clear()
            # user.join()
            print "Closed"


    # def check_for_proximity(self):
    #     while self.run_event.is_set():
    #         proximity = self.vcnl.read_proximity()
    #         if proximity > 2500:
    #             # print proximity
    #             GPIO.output(7, 0)
    #         else:
    #             GPIO.output(7, 1)

    def post_data(self, id):
        data = {
            "id": id,
            "time": {".sv": "timestamp"}
        }

        if id == 99999:
            results = self.db.child("debug").child(current_date).push(data)
        else:
            # Pass the user's idToken to the push method
            results = self.db.child("sign-in").child(current_date).push(data)


if __name__ == "__main__":
    AttendanceSystem().main()

