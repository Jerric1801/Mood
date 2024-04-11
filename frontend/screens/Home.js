import React, {  useState, useEffect}  from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, StyleSheet, Dimensions, TextInput, Modal } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Brightness from 'expo-brightness';
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

function HomeScreen({route, navigation}) {
    const isFocused = useIsFocused();
    const {email} = route.params;

//load user page
    const [pageloaded, setpageloaded] = useState(null);

    //name
    const [name, setName] = useState("")

    //timetable
    const [timetable, settimetable] = useState("No classes today, have a good rest! 😎")
    const [checktime, setchecktime] = useState(null)
    const [userinClass, setuserinClass] = useState(false)

    //location
    const [userinSchool, setuserinSchool] = useState(true)
    const [currentLocation, setCurrentLocation] = useState("MRT East West Line (EW) Lorong Sidin")

    //dashboard
    const [hoursinSchool, sethoursinSchool] = useState(0)

    //clock
    const [hourHand, sethourHand] = useState(7)
    const [minuteHand, setMinuteHand] = useState(0)
    const [showZero, setShowZero] = useState("")
    const [daycount, setdaycount] = useState(1)
    const [weekcount, setweekcount] = useState(0)

    const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]
    const daysFull = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

    //navigation
    const [showHome, setshowHome] = useState(true)
    const [showTask, setshowTask] = useState(false)
    const [showFriends, setshowFriends] = useState(false)

    //notfication container
    const [showNotif, setshowNotif] = useState(false)
    const [notifMessage, setnotifMessage] = useState("")

    //sleep
    const [SleepTime, setSleepTime] = useState(1)

    //heart
    const [collectHeart, setcollectHeart] = useState(true)
    const [userWatch, setuserWatch] = useState(false)

    //accelerometer
    Accelerometer.setUpdateInterval(1000) //interval for phone to collect data
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
        });

    const [collectData, setCollectData] = useState([])
    const [collectAcc, setCollectAcc] = useState(true)

    const [subscription, setSubscription] = useState(null);

    //social 
    const [friends, setFriends] = useState([])
    var friendsLoop = []
    const [searchFriends, setSearchFriends] = useState("")

    const [currentTask, setCurrentTask] = useState(0)
    const [taskStarted, setTaskStarted] = useState(false)
    const [taskTimer, setTasktimer] = useState(0)

    try{
        for (let i = 0; i < friends.length; i++) {
            friendsLoop.push(
                <View key={i} style = {styles.friendTextContainer}>
                <Text style = {styles.friendText}>{friends[i]}</Text>
                </View>
            );
        }
    }
    catch(e){
        //error 
    }



        //handle retrieving data
    const getData = async(link, data) => {
        let flaskApp = "https://eflask-app-mood.herokuapp.com/" + link
        await fetch(flaskApp, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response=>response.text())
        .then(res => {
            setName(JSON.parse(res)["user"])
            setchecktime(JSON.parse(res)["timetable"])
            setuserinSchool(JSON.parse(res)["inSchool"])
            setSleepTime(JSON.parse(res)["sleep"])
            setCurrentLocation(JSON.parse(res)["location"])
            setCurrentTask(JSON.parse(res)["task"])
            setFriends(JSON.parse(res)["friends"])
  
            if(email == "jerric.chan.2022@scis.smu.edu.sg"){
                setuserWatch(true)
            }
        
        },[])
        .catch(error =>{
            console.error(error.message)
        })
        }
        
        //handle submitting sensor data
    const submitData = async(link, data) => {
        console.log("✈ Sending Data to Server: ", data)
        let flaskApp = "https://eflask-app-mood.herokuapp.com/" + link
        await fetch(flaskApp, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response=>response.text())
        .then(res => {
            if (res != ""){
                console.log("✅ Sending Notification: ", res)
                if (res.includes("Take a break & head to")){
                    console.log("🏁 User has started the task")
                    setTaskStarted(true)
                    setCollectAcc(false) 
                }
                else if(res.includes("hope you had a good break!")){
                    console.log("🏆 User has completed the task")
                    setTasktimer(0)
                    setTaskStarted(false)
                }
                else if(res.includes("Stand up, stretch, and take a walk!")){
                    setCollectAcc(false)
                }
                setcollectHeart(false)
                setnotifMessage(res)
                setshowNotif(true)
                //adds hours to count check why
            }
        })
        .catch(error =>{
            console.error(error.message)
        })
        }
    


    const pageload = () => {
            setpageloaded(
                //exception for heartrate data
                getData("getuser", {"email": email})
            )  
    }

    const unloadpage = () => {
        setpageloaded(null);
    }

    useEffect(() => {
        if(isFocused){
        pageload() // mount
        return () => unloadpage() // unmount
        }
    }, [])


    //Accelerometer Stuff

    const _subscribe = () => {
        setSubscription(
          Accelerometer.addListener(accelerometerData => {
            setData(accelerometerData);
          })
        );
      };
  
    const _unsubscribe = () => {
      subscription && subscription.remove();
      setSubscription(null);
    };


    useEffect(() => {
        _subscribe(); //mount
        return () => _unsubscribe(); //unmount
    }, []);


    useEffect(() => {
        const interval = setInterval(()=>{
            setMinuteHand(minuteHand + 5)
        }, 900) //35 hours simulate 1 1/2 days in 7 mins of presentation
        return () => clearInterval(interval)

    })

    const [timeofDay, settimeofDay] = useState('MORNING')
    const [timeEmoji, settimeEmoji] = useState('🌤')

    useEffect(() => {
    //handle clock
        if(minuteHand == 5 || minuteHand == 0){
            setShowZero(0)
        }
        else{
            setShowZero("")
        }
        
        if (minuteHand == 60) {
            setMinuteHand(0)
            sethourHand(hourHand + 1)
        }
        else if (hourHand == 24) {
            sethourHand(0)
            setCollectAcc(true)
            if (daycount == 6){
                setdaycount(0)
                setweekcount(weekcount + 1)
                sethoursinSchool(0)
            }
            else {
                setdaycount(daycount + 1)
            }
        }

        
    //time of day
        if (hourHand < 12 && hourHand > 0) {
            settimeofDay("MORNING")
            settimeEmoji("🌤")
        }
        else if (hourHand > 11 && hourHand < 18){
            settimeofDay("AFTERNOON")
            settimeEmoji("☀️")
        }
        else {
            settimeofDay("EVENING")
            settimeEmoji("😴")
        }

    }, [minuteHand, hourHand])

    useEffect(() => {
    //handle events

        //get heartrate
        if (userinClass && (minuteHand % 5 == 0 || minuteHand == 0) && collectHeart && userWatch){
            console.log("❤️ Submitting Heartrate Data...")
            submitData("/submitheart", {"time" : String(hourHand) + String(minuteHand), "day": days[daycount], "email":email, "name":name})
        } 
        
        //start collecting accelerometer data
        if (userinSchool && (minuteHand % 5 == 0 || minuteHand == 0) && collectAcc && !userinClass){
            console.log("📚 Collecting Accelerometer Data...")
            setCollectData(collectData => [...collectData, data])
        }
        //collect accelerometer data for sleep - 1 hour after sleep time 
        if (hourHand == SleepTime && (minuteHand % 5 == 0 || minuteHand == 0)){
            console.log("💤 Collecting Accelerometer Data...")
            setCollectData(collectData => [...collectData, data])
        }

        //check location once taskStarted, send notif if task complete, add task index; design UI
        if (taskStarted && (minuteHand % 15 == 0)){
            //access db get location check if location meets location in index of currentTask 
            //if location equals send task complete - modify taskStarted 
            console.log("🎨 Checking if user at task location...")
            submitData("/submittask", {"email":email, "name":name, "task":currentTask})
            setTasktimer(taskTimer + 1)

            if (taskTimer > 23) { //2 hours time limit
                setTaskStarted(false)
                setTasktimer(0)
            }
        }
        //check heart & accelerometer to send notif
        if (minuteHand == 55){
            //check if user in school
            getData("getuser", {"email": email})
            if (userinSchool){
                if (!(userinClass) && !(taskStarted) && collectAcc){ //collect once per day
                    //get accelerometer & check friends location
                    console.log("Accelerometer Data 📚...")
                    submitData("/submitacc", {"data": collectData, "name":name , "location":currentLocation, "email":email})
                    setCollectData([])
                }
                sethoursinSchool(hoursinSchool + 1)
            }
            else if (!(userinSchool) && (hourHand == SleepTime || SleepTime + 1 == 25)){
                submitData("/submitsleep", {"data":collectData, "name":name})//submit sleep data
                setCollectData([])
            }
        }
        //check before slots everyday if there are classes that day
        if ((hourHand == 8 && minuteHand == 15) || (hourHand == 11 && minuteHand == 30) || (hourHand == 15 && minuteHand == 30) || (hourHand == 18 && minuteHand == 45) || (hourHand == 21 && minuteHand == 15) ) {
            try{
                let timetableToday = checktime[days[daycount]]
                if(timetableToday == "" || timetableToday.join() == ",,,"){
                    settimetable("No classes today, have a good rest! 😎")
                    setuserinClass(false)
                }
                else if (hourHand == 21){
                    settimetable("No more classes today, have a good rest! 😎")
                }
                else {
                    let chooseClass = [8, 11, 15, 18]
                    let slots = ["0815-1130", "1200-1515", "1530-1845", "1900-2100"]
                    for (let c in chooseClass){
                        if (hourHand == chooseClass[c]){
                            if(timetableToday[c] != ""){
                                setuserinClass(true)
                                settimetable(timetableToday[c] + " | " + slots[c])
                                setcollectHeart(true)
                                if (chooseClass[c] == 8){
                                    //send notif at start of the day
                                    setnotifMessage( "Good Morning! Slow progress is still progress! Remember to take breaks and pace yourself.")
                                    setshowNotif(true)
                                }
                                break
                            }
                            else{
                                setuserinClass(false)
                                settimetable("Have a good break 🤪")
                            }
                        }
                    }
                }
            }
            catch(e){
                //sat & sun
                settimetable("No classes today, have a good rest! 😎")
            }
        }

    }, [minuteHand, hourHand]) //dependencies
    
    //Tasks page

    //Increase Screen Height
    const [taskHeight, settaskHeight] = useState(true)

    //Task Dropdown 1
    const [taskDrop, settaskDrop] = useState(false)

    //Task Dropdown 2
    const [taskDrop1, settaskDrop1] = useState(false)

    //Task Dropdown 3
    const [taskDrop2, settaskDrop2] = useState(false)

    const showtaskDrop = () => {
        settaskHeight(taskDrop)
        settaskDrop(!taskDrop)
        settaskDrop1(false)
        settaskDrop2(false)
    }
    const showtaskDrop1 = () => { 
        settaskHeight(taskDrop1)  
        settaskDrop1(!taskDrop1)
        settaskDrop(false)
        settaskDrop2(false)
    }
    const showtaskDrop2 = () => {
        settaskHeight(taskDrop2)
        settaskDrop2(!taskDrop2)
        settaskDrop(false)
        settaskDrop1(false)
    }



    return (

        
        <SafeAreaView>
        <StatusBar hidden/>

        <View style = {styles.clockContainer}>
            <Text style = {{paddingLeft:40}}>
            {hourHand}:{showZero}{minuteHand}
            </Text>
        </View> 
    

        <View style={styles.body}>

            <View style={styles.greetingsContainer}>

                <Text style = {styles.greetings}> 

                    GOOD {timeofDay}, {name} {timeEmoji}

                </Text>

            </View>


            <View style={styles.navbarContainer}>

                <TouchableOpacity onPress ={() => {setshowFriends(false), setshowTask(false), setshowHome(true)}}>
                    <Text style = {[styles.navbar,{color: !showHome? "#9B9B9B":"#82ADE1"}]} >
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress ={() => {setshowFriends(false), setshowTask(true), setshowHome(false)}}>
                    <Text style = {[styles.navbar,{color: !showTask? "#9B9B9B":"#82ADE1"}]}> 
                        Tasks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress ={() => {setshowFriends(true), setshowTask(false), setshowHome(false)}}>
                    <Text style = {[styles.navbar,{color: !showFriends? "#9B9B9B":"#82ADE1"}]} > 
                        Friends
                    </Text>
                </TouchableOpacity>

            </View>

    
            <Modal
                animationType="slide"
                transparent = {true}
                visible={showNotif}
                onRequestClose={() => {
                setshowNotif(!showNotif);
                }}
            >
            <View style = {styles.notifCentered}>
                <View style = {styles.notifContainer}>
                    <View style = {styles.notifInfo}>
                        <Text style = {styles.notifInfo_text}>{notifMessage}</Text>
                    </View>
                    <TouchableOpacity onPress = {()=> setshowNotif(false)} style = {styles.notifClose}>
                        <Text style = {styles.notifClose_text}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </Modal>
         

            { showHome ?

            <View style = {styles.infoContainer}>
            
            <ScrollView contentContainerStyle={{ flexGrow: 1, height: screenHeight * 1 }}>   

            <View style={styles.modsContainer}>

                <Text style = {styles.mods} onPress = {()=> setshowNotif(true)}> 
                    📓 NEXT CLASS
                </Text>

                <Text style = {styles.mods}> 
                    {timetable}
                </Text>


            </View>

            
            <View style = {{
                height: screenHeight * 0.6,
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}>

                <Text style = {styles.mods}>
                    🔥 HIGHLIGHTS
                </Text>

                <View style = {styles.infobox_box}>
                
                    <View style = {styles.infoboxes}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                            You have spent  {'\n'}<Text style = {styles.infotext_var}>{hoursinSchool} HOURS</Text>{'\n'}in school this week
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Highlights_1.png')} />
                        </View>
                    </View>

                    <View style = {styles.infoboxes}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                        Have a good {'\n'}<Text style = {styles.infotext_var}>{daysFull[daycount]}</Text>{'\n'}you're doing well!
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Highlights_2.png')} />
                        </View>
                    </View>

                    <View style = {styles.infoboxes}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                        Your Apple Watch is {'\n'}<Text style = {styles.infotext_var}>{userWatch? <Text>ACTIVE</Text>:<Text>NOT ACTIVE</Text>}</Text>{'\n'}{userWatch? <Text>collecting heartrate!</Text>:<Text>heartrate not detected!</Text>}
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Highlights_3.png')} />
                        </View>
                    </View>


                </View>

            </View>

            </ScrollView>  
            </View>
            :null} 


            {showTask?
            <View style = {styles.infoContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <View style={[styles.modsContainer,{height: 0.08 * screenHeight}]}>

                <Text style = {styles.mods}> 
                    Hope you had a productive study session!
                </Text>

            </View>
                
            
            <View style = {[styles.infobox_box,{height: taskHeight? screenHeight * 0.48: screenHeight * 0.59, paddingTop:0}]}>
     
                <TouchableOpacity style = {styles.infoboxes} onPress = {() => showtaskDrop()}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                            Head down to{'\n'}<Text style = {styles.infotext_var}>FORT CANNING</Text> {'\n'}for a break!
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Tasks_1.png')} />
                    </View>
            
                </TouchableOpacity>
                {taskDrop ? 
                    <View style = {styles.taskDropdown}>
                        <View style = {styles.taskDropdown_textContainer}>
                            <Text style = {styles.taskDropdown_header}>My First Study Session</Text>
                            <Text style = {styles.taskDropdown_content}>Receive a $5 Subway Voucher when you take a walk to the Fort Canning Spice Garden 🌳</Text>
                            <Text style = {styles.taskDropdown_footer}>{(taskStarted && currentTask == 0)? <Text>active: {120-taskTimer*5} mins left</Text>:<Text>not active</Text>}</Text>
                        </View>
                    </View>
                :null}
           
                <TouchableOpacity style = {styles.infoboxes} onPress = {() => showtaskDrop1()}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                        Take a breather at{'\n'}<Text style = {styles.infotext_var}>NATIONAL MUSEUM</Text> {'\n'}with your friends!
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Tasks_2.png')} />
                    </View>
                </TouchableOpacity>

                {taskDrop1 ? 
                    <View style = {styles.taskDropdown}>
                        <View style = {styles.taskDropdown_textContainer}>
                            <Text style = {styles.taskDropdown_header}>My Second Study Session</Text>
                            <Text style = {styles.taskDropdown_content}>Head down to the National Museum to get free tickets to the newest exhibition: The Doraemon Exhibit 🎨</Text>
                            <Text style = {styles.taskDropdown_footer}>{(taskStarted && currentTask == 1)? <Text>active: {120-taskTimer*5} mins left</Text>:<Text>not active</Text>}</Text>
                        </View>
                    </View>
                :null}


                <TouchableOpacity style = {styles.infoboxes} onPress = {() => showtaskDrop2()}>
                    <View style = {styles.infoboxesContainer}>
                        <Text style = {styles.infotext}>
                        Grab a bite at{'\n'}<Text style = {styles.infotext_var}>GR.ID SINGAPORE</Text> {'\n'}and fill your tummies!
                        </Text>
                        <Image style = {styles.info_img} source={require('./img/Tasks_3.png')} />
                    </View>
                </TouchableOpacity>
                {taskDrop2 ? 
                    <View style = {styles.taskDropdown}>
                        <View style = {styles.taskDropdown_textContainer}>
                            <Text style = {styles.taskDropdown_header}>My Third Study Session</Text>
                            <Text style = {styles.taskDropdown_content}>Have a chill @ GR.ID mall with a friend and receive a 10% Kung Fu Tea discount voucher! 🧋</Text>
                            <Text style = {styles.taskDropdown_footer}>{(taskStarted && currentTask == 2)? <Text>active: {120-taskTimer*5} mins left</Text>:<Text>not active</Text>}</Text>
                        </View>
                    </View>
                :null}


            </View>


            </ScrollView>
            </View>
            :null}


            {showFriends?
            <View style = {styles.infoContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <View style={styles.modsContainer}>
            
                <View style = {styles.addFriendContainer}>
                    <TextInput 
                        style = {styles.addFriendInput}
                        placeholder = "  Add Friends by Username" 
                        maxLength={15}
                        value = {searchFriends}
                        onChangeText = {setSearchFriends}
                    ></TextInput>
                    <TouchableOpacity style = {styles.addFriendButton} 
                    onPress = {() => {submitData("/queryfriend",{"friend":searchFriends, "email":email, "user":name}), setSearchFriends("")}}>
                        <Text>
                            Add
                        </Text> 
                    </TouchableOpacity>
                </View>

                <View style  = {styles.friendContainer}>
                    <View style = {styles.innerfriendContainer}>
                        {friendsLoop}
                    </View>
                </View>

                <View style = {styles.friendsImageContainer}>
                    <Image style = {styles.info_img} source={require('./img/Friends_1.png')} />
                </View>

            </View>
                


            </ScrollView>
            </View>
            :null}
            
            
    
          </View>
          </SafeAreaView>
    );
  }

export default HomeScreen;


const styles = StyleSheet.create({
    clockContainer:{
        height: screenHeight* 0.03
    },
    body: {
        flexDirection : 'column',
        backgroundColor: 'white',
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center'
    },
    greetingsContainer:{
        backgroundColor : 'transparent',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: screenHeight * 0.05,
        justifyContent:'flex-start'
    },
    greetings:{
        color: 'black',
        fontSize: 20,
        paddingLeft : 30,
        fontWeight: 'bold'
    },
    navbarContainer:{ 
        height: screenHeight * 0.05,
        backgroundColor : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomColor: '#82ADE1',
        borderBottomWidth: 1,
        width: '100%',
    },
    navbar: {
        fontSize: 15,
        fontWeight: 'bold'
    },

    notifCentered:{
        alignItems: 'center',
        justifyContent: 'center', 
        opacity: 0.98,
        marginTop: 100,
    },

    notifContainer:{
        borderRadius: 10,
        backgroundColor:'#ffffff',
        shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 200,
        height: screenHeight * 0.2,
        width: screenWidth * 0.75
    },
    notifInfo: {
        height: '70%',
        width: '87.5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifInfo_text:{
        textAlign:'center',
        color: 'black',
        fontSize: 15,
    },
    notifClose: {
        height: '30%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1.5,
        borderTopColor: "#f2f2f2"
    },
    notifClose_text:{
        color: '#82ADE1',
        fontSize: 15,
    },

    infoContainer:{
        height: screenHeight * 0.8
    },  
    modsContainer: { 
        backgroundColor : 'transparent',
        height: screenHeight * 0.1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20
    },
    mods :{
        color: 'black',
        fontSize: 15,
        paddingLeft : 25,
        alignItems: 'flex-start'
    },
    infobox_box:{
        height: screenHeight * 0.5,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'column',
        paddingTop:15,
    },
    infoboxes: {
        color: 'white',
        paddingTop:10,
        paddingBottom:10,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
        borderColor: '#f2f2f2',
        backgroundColor:'#ffffff',
        shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
        elevation: 5,
        borderRadius:10,
        width: '87.5%',
        height: screenHeight * 0.14
    },
    infoboxesContainer:{
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        height: '100%',
        width:'85%'
    },
    infotext:{
        fontSize: 15,
    },
    infotext_var:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#82ADE1',
        paddingTop:2,
        paddingBottom:2
    },
    info_img:{
        resizeMode: "contain",
    },
    taskDropdown:{
        height : screenHeight * 0.14,
        width: '87%',
        backgroundColor: "#F5F5F5",
        justifyContent:"center",
        alignItems:"center",
    },
    taskDropdown_textContainer:{
        width: "80%",
        backgroundColor: "transparent"
    },
    taskDropdown_header:{
        fontWeight: "bold",
        fontSize:  13,
        alignItems: "flex-start",
        justifyContent: "center"
    },
    taskDropdown_content: {
        paddingTop: 10,
        fontSize: 13
    },
    taskDropdown_footer: {
        textAlign: 'right',
        fontSize: 10
    },
    friendContainer: {
        height: screenHeight * 0.5,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems:"center",
        flexDirection:'column',
    },
    innerfriendContainer: {
        height: "95%",
        width: "87.5%",
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingTop: 15
    },
    friendTextContainer: {
        height: screenHeight * 0.061,
        width: "98%",
        borderBottomColor:'#82ADE1',
        borderBottomWidth:0.6
    },
    friendText:{
        paddingTop: 15,
        paddingLeft: 5,
        fontSize: 18,
    },
    friendsImageContainer:{
        height: screenHeight * 0.2,
        justifyContent: 'center',
        alignItems:'center',
    },
    addFriendContainer:{
        width: "100%",
        height: screenHeight * 0.05,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    addFriendInput: {
        width: "68%",
        height: "90%",
        borderColor: '#f2f2f2',
        backgroundColor:'#ffffff',
        shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
    },
    addFriendButton:{
        width: "19.5%",
        height: "90%",
        backgroundColor: "white",
        backgroundColor:'#F4F4F4',
        shadowColor: "#000000",
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        },
        justifyContent: "center",
        alignItems: "center"
    },
})