from logging import error
from flask import Flask, jsonify, request, render_template

from .activity import studying, heart, location, sleep, social
from .user import user, login, webpage



app = Flask(__name__)

app.jinja_env.filters['zip'] = zip

#control panel
@app.route("/")
def home_view():
        user_list, email_list = webpage.get_lists()
        location_list = location.get_locations()

        kwargs = {
            'users':user_list,
            'emails': email_list,
            'locations': location_list
        }

        return render_template('index.html.j2', **kwargs)


#location

@app.route("/location")
def location_view():
        location_list = location.get_locations()
        return render_template('location.html.j2', location_list = location_list)

@app.route("/getlocation", methods=['POST'], strict_slashes=False)
def get_location():
    if request.method == 'POST':
        query = request.json
        return location.query_location(query)

@app.route("/addlocation", methods=['POST'], strict_slashes=False)
def add_location():
    if request.method == 'POST':
        query = request.json
        return location.store_locations(query)

@app.route("/simulatelocation", methods=['POST'], strict_slashes=False)
def simulate_location():
    if request.method == 'POST':
        query = request.json
        return location.sim_location(location, query)


#login 

@app.route("/getuseronlogin", methods=['POST'], strict_slashes=False)
def get_user_on_login(): #verify login for log in page
    if request.method == 'POST':
        req = request.json
        return login.get_user(req)

@app.route("/newuser", methods=['POST'], strict_slashes=False)
def new_user(): #check if user exists in db - else create db entry & return True
    if request.method == 'POST':
        req = request.json
        return login.first_time(req)

@app.route("/updatebasic", methods=['POST'], strict_slashes=False)
def update_basic(): #update user data 
    if request.method == 'POST':
        req = request.json
        return login.update_basic(req)

@app.route("/updatetimetable", methods=['POST'], strict_slashes=False)
def update_timetable(): #update user data 
    if request.method == 'POST':
        req = request.json
        return login.update_timetable(req)

@app.route("/getcourses", methods=['POST'], strict_slashes=False)
def courses(): #update user data 
    if request.method == 'POST':
        course = request.json
        mods = login.get_modules(course)
        return mods


#homepage 

@app.route("/getuser", methods=['POST'], strict_slashes=False)
def get_user(): #generate homescreen for existing user
    if request.method == 'POST':
        req = request.json
        return user.find_email(req)

        
@app.route("/submitacc", methods=['POST'], strict_slashes=False)
def submitacc():
    if request.method == 'POST':
        req = request.json #{"time" : String(hourHand) + String(minuteHand), "data": data, "email":email}
        return studying.submit_acc(req)

@app.route("/submitheart", methods = ['POST'], strict_slashes=False)
def get_heartrate():
    if request.method == 'POST':
        req = request.json
        return heart.read_heart(req)

@app.route("/submitsleep", methods = ['POST'], strict_slashes=False)
def get_sleep():
    if request.method == 'POST':
        req = request.json
        return sleep.submit_sleep(req)

@app.route("/queryfriend", methods = ['POST'], strict_slashes=False)
def query_friend():
    if request.method == 'POST':
        req = request.json
        return social.query_friend(req)

@app.route("/submittask", methods = ['POST'], strict_slashes=False)
def get_task():
    if request.method == 'POST':
        req = request.json
        return social.verify_task(req)
