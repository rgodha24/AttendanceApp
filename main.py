import pyrebase
import time
import datetime


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
		while(1):
			try:
				id_num = int(self.get_input())
				self.post_data(id_num)
			except ValueError:
				print("Error: Not valid num")
			


	def get_input(self):
		return input("Input:")

	def post_data(self, id):

		data = {
		    "id": id,
		    "time": time.time()
		}

		# Pass the user's idToken to the push method
		results = self.db.child("sign-in").child(time.strftime("%Y/%m/%d")).push(data)

if __name__ == "__main__":
	AttendanceSystem().main()
