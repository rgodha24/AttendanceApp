import pyrebase

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
                    if len(str(code)) == 5:
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
            results = self.db.child("debug").push(data)
        else:
            results = self.db.child("sign-in").push(data)

if __name__ == "__main__":
    AttendanceSystem().main()

