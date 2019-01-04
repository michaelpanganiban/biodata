import pymysql
db = pymysql.connect("localhost","root","","fluffy" )
cursor = db.cursor()
class Connection():
    def authenticateUser(self, username, password):
        cursor.execute("SELECT USER_ID, USERNAME, FULLNAME, EMAIL, PROFILE_PIC FROM users WHERE USERNAME ='"+ username+"' AND PASSWORD = '"+password+"'")
        result = cursor.fetchall()
        return result
