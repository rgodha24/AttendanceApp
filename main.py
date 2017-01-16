
import sqlite3

def create_student_database(c):
	c.execute('''CREATE TABLE IF NOT EXISTS students (
							    id_num int,
							    name text,
							    UNIQUE(id_num)
							);''')

def clear_student_database(c):
	c.execute('''Drop table if exists students''')
	c.execute('''CREATE TABLE IF NOT EXISTS students (
						    id_num int,
						    name text,
						    UNIQUE(id_num)
						);''')

def create_signin_database(c):
	c.execute('''CREATE TABLE IF NOT EXISTS signin (
							    id_num int,
							    date datetime
							);''')

def clear_signin_database(c):
	c.execute('''Drop table if exists signin''')
	c.execute('''CREATE TABLE IF NOT EXISTS signin (
							    id_num int,
							    date datetime
							);''')

def add_students(c, students):
	c.executemany('INSERT OR IGNORE INTO students(name, id_num) VALUES (?,?)', students)

def print_students(c):
	for row in c.execute('SELECT * FROM students ORDER BY id_num'):
		print row

def sign_in_students(c, sign_in):
	c.executemany('INSERT INTO signin(id_num, date) VALUES (?,?)', sign_in)

def print_signin(c):
	for row in c.execute('''SELECT * FROM signin'''):
		print row

def print_signin_date(c, start_date, end_date):
	for row in c.execute('''SELECT * FROM signin WHERE date BETWEEN ? AND ?''', (start_date, end_date)):
		print row

conn = sqlite3.connect('example.db')
c = conn.cursor()


students = [('Jack Venberg', 1720),
             ('John Smith', 17430),
             ('Joe Blo', 17740),
             ('Jack Venberg', 1740),
            ]

sign_in  = [(1720, "12/12/2012 00:00:00.21"),
             (17430, "12/12/2012 00:00:00.21"),
             (17740, "12/12/2012 00:00:00.01"),
             (1740, "12/12/2012 00:00:00.21")
            ]

clear_student_database(c)
clear_signin_database(c)

add_students(c, students)
sign_in_students(c, sign_in)

print_students(c)
print_signin_date(c, "12/12/2012 00:00:00.00", "12/12/2012 23:59:59.999")
# print_signin(c)

conn.commit()

