from geopy.geocoders import Nominatim
from .db_setup import get_db 
import json 
import os
import random

class location:
    #to change & implement elsewhere 
    def __init__():
        pass

    def check_smu(coords):
        lat = float(coords.split(",")[0])
        long = float(coords.split(",")[1])

        smu_lat_range = [1.2935001,1.299000]
        smu_long_range = [103.846400, 103.853000]

        if lat > smu_lat_range[0] and lat < smu_lat_range[1] and long > smu_long_range[0]  and long < smu_long_range[1]:
            return True
        else:
            return False


    def get_locations():

        loc = get_db()["location"]

        location_list = []

        for l in loc.find({}, {"location": 1}):
            location_list.append(l["location"])

        return location_list
                

    def query_location(query):

        loc = query["location"]
        geolocator = Nominatim(user_agent="geoapiExercises") #initialize
        print(type(loc))
        try:
            location = geolocator.geocode(loc)
            print(location)
            return {"location" : str(location), "coords": [location.latitude, location.longitude]}

        except:
            return {"location" : "Cannot be found"}

    def store_locations(query):

        loc = get_db()["location"]

        address_split = query["location"].split(",")

        address = str(address_split[0] + address_split[1])

        q = {"location":address}

        if loc.count_documents(q) == 0:
            loc.insert_one({"location":address, "coords":query["coords"], "full":query["location"]})
            return {"location":address}

        else:
            return {"error": "Item already exists"}

    def sim_location(self, query):

        try:

            #get coordinates
            loc = get_db()["location"]

            q = {"location":query["location"]}

            item = loc.find(q)

            #test if location in school
            e = {"email":query["email"]}

            if self.check_smu(item[0]["coords"]):
                inSchool = True
                newvalues = {"$set": {"location":query["location"], "inSchool":inSchool}}
            else:
                inSchool = False
                newvalues = {"$set": {"location":query["location"], "inSchool":inSchool}}

            users = get_db()["userData"]

            print(users)

            print(users.find(e)[0])
            
            users.update_one(e, newvalues)


            return {"success": "Location Updated", "location": query["location"], "inSchool":inSchool}
        
        except:

            return {"error": "Update Failed"}



class heart:
    def __init__():
        pass

    def read_heart(res):
        document_path = os.path.abspath(os.path.dirname(__file__)) + '/heart.txt'

        time = res["time"]
        day = res["day"]

        with open(document_path) as f:
            for line in f:
                items = line.split(",")
                if items[-2] == time and items[0] == day:
                    heartrate = items[-1].rstrip("\n")
                    if float(heartrate) > 120:
                        return f"Hey {res['name'].capitalize()}, we noticed that your heartrate spiked to {heartrate}"

        return ""

#pertaining to grades portion
class studying:
    def __init__():
        pass

    def submit_acc(acc):
        try:
            result = 0
            for item in acc["data"]:
                for coor, val in item.items():
                    if (val >= 0.9 or val <= -0.9) and coor == "z":
                        result += 1
                    elif coor == "z":
                        result -= 1

            list_of_locations = ["Li Ka Shing Library SMU Concourse","School of Law & Kwa Geok Choo Library 60",]

            if result > 0 and acc["location"] in list_of_locations:
                #receive email
                users = get_db()["userData"]
                query = {"email":acc["email"]}

                #get friends from user - list
                friend_list = users.find(query)[0]["friends"]
                user_task = users.find(query)[0]["task"]

                #query friends in users to check location
                friend_query = {"user": {"$in": friend_list}}

                for doc in users.find(friend_query):
                    if doc["location"] == acc["location"]:

                        if user_task > 2 or doc['task'] > 2: #if either friend or user has completed all tasks
                            return f"Hey {acc['name'].capitalize()}, seems like you’ve been studying without a break. Stand up, stretch, and take a walk!"

                        task_toDo = int(user_task)
                        task_list = ["Fort Canning Spice Garden", "Singapore National Museum", "GR.ID Singapore"]
                        return f"Hey {acc['name'].capitalize()}, {doc['user'].capitalize()} is at {acc['location']} too! Take a break & head to {task_list[task_toDo]} together!"


                return f"Hey {acc['name'].capitalize()}, seems like you’ve been studying without a break. Stand up, stretch, and take a walk!"
            else:
                return ""
        except:
            return ""


#sleep portion
class sleep:
    def __init__():
        pass

    def submit_sleep(acc):
        result = 0
        for item in acc["data"]:
            for coor, val in item.items():
                if (val >= 0.9 or val <= -0.9) and coor == "z":
                    result -= 1
                elif coor == "z":
                    result += 1

        msgs = ["sleep and productivity go hand in hand, get a good nights rest!", 
        "If you're having trouble sleeping, spritzing lavender or having a warm cup of milk may help!"]

        if result > 0:
            return f"Hey {acc['name'].capitalize()}, {msgs[random.randrange(0,1)]}"
        else:
            return ""


#social portion
class social:
    def __init__():
        pass

    def query_friend(query):
        if query["user"] == query["friend"]:
            return "You are not allowed to add yourself"

        users = get_db()["userData"]

        q = {"user":query["friend"]}

        q_email = {"email":query["email"]}

        #account for existing user in friends list 

        if users.count_documents(q) > 0:
            try:
                users.update_one(q_email, {"$push":{"friends":query["friend"]}})

                return f"{query['friend'].capitalize()} has been added as a friend"

            except:
                return "Something went wrong"

        else:
            return "User cannot be found"

    def verify_task(req):
        try:
            users = get_db()["userData"]
            
            q = {"email":req["email"]}

            user = users.find(q)[0]

            task_locations = ["Fort Canning Park Museum", "National Museum of Singapore 93", "GR.ID 1"]

            rewards = ["$10 Subway voucher", "Free Ticket", "10% Discount Voucher"]

            task = req["task"]

            if user["location"] == task_locations[task]:
                if req["task"] < 3:
                    users.update_one(q, {"$set": {"task":(req["task"]+1)}}) #set user to next task
                return f"Hey {req['name'].capitalize()}, hope you had a good break! Here's a {rewards[req['task']]} as a reward!"

            else:
                return ""

        except: 
            return ""
        
        

if __name__ == '__main__':
    test = {"x": 0.1249237060546875, "y": -0.9434967041015625, "z": -0.1854705810546875}
    coords = {"coords":{"altitude":0,"altitudeAccuracy":-1,"latitude":37.785834,"accuracy":5,"longitude":-122.406417,"heading":-1,"speed":-1},"timestamp":1663893123888.897}
    res = studying.calcidle(test)   
    get_loc = location.check_smu(coords)
    print(get_loc)