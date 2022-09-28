import pyrebase


class AttendanceSystem():
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
    firebase

    def __init__(self):
        pass

    def main(self):
        code = ""
        try:
            while True:
                try:
                    code = int(input())
                    if len(str(code)) == 5:
                        self.post_data(code)
                except ValueError:
                    print("Invalid Code")
        except KeyboardInterrupt:
            print("Closed")

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
