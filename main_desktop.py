import sys
import pyrebase
import time
import datetime
import threading
import subprocess
import ntplib
import time
from time import ctime

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
            results = self.db.child("sign-in-test").push({
                                                            "time": {".sv": "timestamp"},
                                                            "id": id
                                                            })

if __name__ == "__main__":
    AttendanceSystem().main()

