from .db_setup import get_db 
import json 
import time

class webpage:
    def __init__(self):
        pass
    def get_lists():
        users = get_db()["userData"]

        user_list = []
        email_list = []

        for u in users.find({},{"user":1, "email":1}):
            try:
                email = u["email"]
                username = u["user"]
                
                if email != "" and username != "":
                    email_list.append(email)
                    user_list.append(username)

            except:
                print(f'{u["_id"]} has no username')

        return user_list, email_list


class user:
    def __init__(self, email):
        self.email = email

    def find_email(creds):
        start = time.time()
        users = get_db()["userData"]

        query = {"email":creds["email"]}

        try:
            user = users.find(query)
            u = user[0] #unique emails

            if u["sleep"][1] == True:
                sleep_time = round(float(u["sleep"][0])) 
            else:
                sleep_time = round(float(u["sleep"][0])) + 12

            end = time.time()
            print(end-start)

            return {"user":u["user"].upper(), 
                    "timetable":{
                        "Mon": u["Mon"],
                        "Tues": u["Tues"],
                        "Wed": u["Wed"],
                        "Thurs": u["Thurs"],
                        "Fri": u["Fri"]},
                    "sleep": sleep_time,
                    "study":u["study"],
                    "inSchool": u["inSchool"],
                    "location": u["location"],
                    "friends":u["friends"],
                    "task":u["task"]
                    }

        except:
            return {"Failed":"Email does not exist"}

    def timetable():
        #compare with time to see if user is in any class 
        pass

    def sensor_data():
        pass


class login:
    def __init__():
        pass

    def first_time(creds):
        #initialise db to userData
        users = get_db()["userData"]

        #check creds - Unique Username? Valid Email?
        email = creds["email"]
        #loop through documents in db to comapre email
        for u in users.find({},{"email":1}):
            if u['email'] == email:
                return {"Error": "Email Address Exists"}

        #create user
        users.insert_one(creds)
        return {"success": creds['user'], "email": creds['email']}

    def get_user(creds):
        #initialise db to userData
        users = get_db()["userData"]

        #check creds
        email = creds["email"]
        password = creds["password"]

        #loop through documents in db to compare email
        for u in users.find({},{"email":1, "password":1}):

            if u['email'] == email and u['password'] == password:
                return {"success": email}

            elif u['email'] == email and u['password'] != password:
                return {"error": "password is incorrect"}

        return {"error": "user cannot be found"}

    def update_timetable(req):
        #initialise db to userData
        users = get_db()["userData"]

        #unpack items
        email = req["email"]
        days = req["days"]

        #params
        query = {"email": email}
        newvalues = {"$set": days}

        users.update_one(query, newvalues, upsert=True)

        return {"success": email}


    def update_basic(req):
        #initialise db to userData
        users = get_db()["userData"]

        #unpack items
        email = req["email"]                                                                                                                       

        query = {"email": email}
        newvalues = {"$set": req}

        users.update_one(query, newvalues, upsert=True)

        return {"success": email}

    def get_modules(user_course):
        course_file = open("app/static/courses_sorted.txt", "r").read()
        load_cf = json.loads(course_file)

        #cor mods
        cor = load_cf["COR"] + load_cf["COR-MGMT"] + load_cf["COR-STAT"] + load_cf["SMT"]

        for course, course_ls in load_cf.items():

            if user_course["course"] == course:
                return course_ls + cor

    def create_courses():
        f = open("app/static/courses.txt", "r")
        items = f.read()
        new = items.split("\n")
        course_json = {}
        temp_ls = []
        temp_json = {}
        temp_str = ""
        temp_val = ""
        course = "IS"
        for i in range(len(new)):
            if new[i] == "#":
                course_json[course] = temp_ls
                temp_ls = []
                course = new[i+1].rstrip()
            elif new[i] == course or new[i] == "":
                continue
            else:
                if new[i] == 'View Class Sections':
                    temp_json['label'] = temp_str
                    temp_json['value'] = temp_val
                    temp_ls.append(temp_json)
                    temp_json = {}
                    temp_str = ""
                    temp_val = ""
                elif new[i][1].isdigit():
                    temp_str += course.rstrip() + new[i].rstrip() + " "
                    temp_val += course.rstrip() + new[i].rstrip()
                else:
                    temp_str += new[i]

        writeFile = open("./static/courses_sorted.txt", "w")
        writeFile.write(json.dumps(course_json))
        writeFile.close()


if __name__ == '__main__':
    pass
