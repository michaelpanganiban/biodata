import pymysql
db = pymysql.connect("localhost","root","","fluffy" )
cursor = db.cursor()
class dashBoardModel():
    def getUserList(self):
        result = []
        cursor.execute("SELECT USER_ID, USERNAME, FULLNAME, EMAIL, PROFILE_PIC FROM users")
        x = cursor.fetchall()
        for user in x:
           result.append({'user_id': user[0], 'name': user[1]})
        return result