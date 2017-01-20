import sqlite3
import time

import SimpleHTTPServer
import SocketServer
import os

from threading import Thread
import thread

import posixpath
import argparse
import urllib
import os

from SimpleHTTPServer import SimpleHTTPRequestHandler
from BaseHTTPServer import HTTPServer


class RootedHTTPServer(HTTPServer):

	def __init__(self, base_path, *args, **kwargs):
		HTTPServer.__init__(self, *args, **kwargs)
		self.RequestHandlerClass.base_path = base_path


class RootedHTTPRequestHandler(SimpleHTTPRequestHandler):

	def translate_path(self, path):
		path = posixpath.normpath(urllib.unquote(path))
		words = path.split('/')
		words = filter(None, words)
		path = self.base_path
		for word in words:
			drive, word = os.path.splitdrive(word)
			head, word = os.path.split(word)
			if word in (os.curdir, os.pardir):
				continue
			path = os.path.join(path, word)
		return path

def run_server(HandlerClass=RootedHTTPRequestHandler, ServerClass=RootedHTTPServer):

	parser = argparse.ArgumentParser()
	parser.add_argument('--port', '-p', default=8000, type=int)
	parser.add_argument('--dir', '-d', default=os.getcwd(), type=str)
	args = parser.parse_args()

	server_address = ('', 8000)

	httpd = ServerClass("website", server_address, HandlerClass)

	sa = httpd.socket.getsockname()
	print "Serving HTTP on", sa[0], "port", sa[1], "..."

	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		print '^C received, shutting down the web server'
		server.socket.close()


def create_student_database():
	global c
	c.execute('''CREATE TABLE IF NOT EXISTS students (
								id_num int,
								name text,
								UNIQUE(id_num)
							);''')

def clear_student_database():
	global c
	c.execute('''Drop table if exists students''')
	c.execute('''CREATE TABLE IF NOT EXISTS students (
							id_num int,
							name text,
							UNIQUE(id_num)
						);''')

def create_signin_database():
	global c
	c.execute('''CREATE TABLE IF NOT EXISTS signin (
								id_num int,
								date datetime
								UNIQUE(id_num, date)
							);''')

def clear_signin_database():
	global c
	c.execute('''Drop table if exists signin''')
	c.execute('''CREATE TABLE IF NOT EXISTS signin (
								id_num int,
								date datetime
							);''')

def add_students( students):
	global c
	c.executemany('INSERT OR IGNORE INTO students(name, id_num) VALUES (?,?)', students)

def print_students():
	global c
	for row in c.execute('SELECT * FROM students ORDER BY id_num'):
		print row

def sign_in_students(sign_in):
	global c
	c.executemany('INSERT INTO signin(id_num, date) VALUES (?,?)', sign_in)

def print_signin():
	global c
	for row in c.execute('''SELECT * FROM signin'''):
		print row

def print_signin_date(start_date, end_date):
	global c
	for row in c.execute('''SELECT * FROM signin WHERE date BETWEEN ? AND ?''', (start_date, end_date)):
		print row


t = thread.start_new_thread(run_server, ())

conn = sqlite3.connect('example.db')
c = conn.cursor()


students = [('Joe Venberg', 17120),
			('John Smith', 17430),
			('Joe Blo', 17740),
			('Jack Venberg', 17410),
			]



sign_in  = [(1720, "12/12/2012 00:00:01"),
			(17430, "12/12/2012 00:00:02"),
			(17740, "12/12/2012 00:00:03"),
			(1720, "12/12/2012 00:00:01")
			]

# clear_student_database()
clear_signin_database()
print time.strftime("%H:%M:%S")
print time.strftime("%d/%m/%Y")

add_students(students)
sign_in_students(sign_in)

print_students()
print_signin_date("12/12/2012 00:00:00.00", "12/12/2012 23:59:59.999")
# print_signin(c)

conn.commit()


while True:
	print "Running"
	time.sleep(1)




