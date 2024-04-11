import React, { useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Switch, Image, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';


const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


function Questions({route, navigation}) {

    //styles for new user page
    const styles = {
        body: {
            backgroundColor: '#D5E4F5',
            width: '100%',
            height:'100%',
            flex: 1,
        },

        welcomeContainer:{
            height: 0.25 * screenHeight,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center'
        },

        welcomeContainer_text:{
            height:'100%',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingBottom: 30,
            paddingLeft: 20
        },

        outerContainer: {
            height: 0.43 * screenHeight,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly'
        },
        questionContainer: {
            height: 0.12 * screenHeight,
            width: '87.5%',
            alignItems:'flex-start',
            justifyContent: 'space-evenly',
            backgroundColor:'#ffffff',
            borderRadius: 5,
            zIndex: -1
        },
        questionContainer_text: {
            color:'#82ADE1',
            fontSize: 15,
            paddingLeft: 20,
            fontWeight:'bold'
        },
        questionContainer_Container:{
            width:'90%',
            alignItems:'flex-end',
            justifyContent:'space-between',
            flexDirection:'row',
            paddingLeft:20,
            zIndex: 999,
        },
        questionContainer_dropdowns:{
            width: '90%',
            borderWidth:0,
            backgroundColor:'#ffffff',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
            zIndex: 999
        },
        questionContainer_input:{
            paddingLeft:5,
            borderRadius: 2.5,
            height: 0.05 * screenHeight,
            width:"60%",
            backgroundColor:'white',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
        },
        timeSwitch:{
            height: 30,
            width:100,
            borderRadius:2.5,
            alignItems:'center',
            justifyContent:'space-evenly',
            flexDirection:'row',
            borderWidth:0,
            backgroundColor:'#F4F4F4',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
        },
        timeSwitch_buttonContainer:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius: 2.5,
            width:50,
            height:30
        },
        timeSwitch_button:{
            fontSize: 15,
        },

        dropDownContainerStyle:{
            width: '90%',
            borderWidth:0.2,
            backgroundColor:'#ffffff',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
            zIndex: 999
        },
        buttonContainer:{
            height: 0.33 * screenHeight,
            alignItems:'center',
            paddingTop:40,
            flexDirection:'row',
            justifyContent:'space-around'
        },
        continuebutton:{
            backgroundColor:'white',
            borderRadius:100,
            width: 50,
            height: 50,
            textAlign:'center',
            alignItems: 'center',
            justifyContent: 'center'
        },
        continuebuttonText:{
            fontSize:30,
            color:'#9B9B9B',
        },

    }

    //get params after navigate from user.js
    const {email, success} = route.params;
    
    //Current Course Enrolmment dropdown
    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState(null);


    //Dropdown vals for courses
    //not accurate - will modify accordingly if time permits
    const [items, setItems] = useState(
        [{label: "Information Systems", value: "IS"},
         {label: "Economics", value: "ECON"},
         {label: "Computer Science", value: "CS"},
         {label: "Law", value: "LAW"},
        {label:"Accounting", value: "ACCT"},
        {label:"Business", value: "FNCE"}])

    //TimeSleep
    const [sleepTime, setsleepTime] = useState(null)
    
    //AM PM button for sleep
    const [isAM1, setIsAM1] = useState(false);
    const toggleSwitch1 = () => setIsAM1(previousState => !previousState);

    //study sess
    const [studyTime, setstudyTime] = useState(null)

    //consolidated json 
    const basic = { "email": email,
                    "course": value1,
                    "sleep": [sleepTime,isAM1],
                    "study": studyTime,
                    "inSchool":true,
                    "location":"School of Information Systems SMU Concourse",
                    "friends": [],
                    "task": 0
    }
    
    //submit user data to update mongo
    const submitData = async(basic) => {
        console.log("💿 Storing Data in Mongo:", basic)
        fetch("https://eflask-app-mood.herokuapp.com/updatebasic", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: "POST",
            body: JSON.stringify(basic)
        })
        .then(response=>response.text())
        .then(res => {
            console.log("💻 Server response:",res)
        })
        .catch(error =>{
        console.error(error.message)
        })
        }

    //nav after user finish & check validity (backend validation - if time permits)
    const goToPersonalise = () => {
        submitData(basic)
        navigation.navigate('Personalise', {course: value1, name: success, email: email})
    }
    

    return (

        <View style = {styles.body}>

            <View style = {styles.welcomeContainer}>
                <View style = {styles.welcomeContainer_text}>
                    <Text style = {{fontSize:20, textAlign:'left'}}>
                    WELCOME, {success} 😊 
                    </Text>
                    <Text style = {{fontSize:15, paddingTop:10, textAlign:'left'}}>
                    Let us get to know {'\n'}you a little bit better!
                    </Text>

                </View>
                <Image style = {styles.info_img} source={require('./img/swinging.png')} />
            </View>

            <View style = {styles.outerContainer}>

                <View style = {styles.questionContainer}>
                    <Text style = {styles.questionContainer_text}>1. Current Course Enrolment</Text>
                    <View style = {styles.questionContainer_Container}>
                        <DropDownPicker
                            style = {styles.questionContainer_dropdowns}
                            placeholder="Please select one..."
                            placeholderStyle={{
                            color: "grey",
                            }}
                            dropDownContainerStyle={styles.dropDownContainerStyle}
                            showArrowIcon={false}
                            open={open1}
                            value={value1}
                            items={items}
                            setOpen={setOpen1}
                            setValue={setValue1}
                            setItems={setItems}/>
                    </View>
                </View>
                        <View style = {[styles.questionContainer, {zIndex: -2}]}>
                            <Text style = {styles.questionContainer_text}>2. What time do you usually sleep</Text>
                            <View style = {styles.questionContainer_Container}>
                                <TextInput 
                                    style = {styles.questionContainer_input} 
                                    placeholder = "Please enter here..." 
                                    keyboardType="numeric" 
                                    maxLength={2}
                                    value = {sleepTime}
                                    onChangeText= {newSleep => setsleepTime(newSleep)}
                                ></TextInput>
                                <View style = {styles.timeSwitch}>
                                    <TouchableOpacity onPress = {toggleSwitch1}>
                                    <View style = {[styles.timeSwitch_buttonContainer, {backgroundColor: isAM1? "white":"#F4F4F4"}]} >
                                        <Text style = {[styles.timeSwitch_button, {color:isAM1? "black":"#9B9B9B"}]} >AM</Text> 
                                    </View>   
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress = {toggleSwitch1}>
                                    <View style = {[styles.timeSwitch_buttonContainer, {backgroundColor: isAM1? "#F4F4F4":"white"}]} >
                                        <Text style = {[styles.timeSwitch_button, {color:isAM1? "#9B9B9B":"black"}]}>PM</Text> 
                                    </View>   
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style = {[styles.questionContainer, {zIndex: -2}]}>
                            <Text style = {styles.questionContainer_text}>3. How long are your study sessions? {'(hrs)'}</Text>
                            <View style = {styles.questionContainer_Container}>
                            <TextInput 
                                    style = {[styles.questionContainer_input, {width:'90%'}]} 
                                    placeholder = "Please enter based on average" 
                                 
                                    maxLength={4}
                                    value = {studyTime}
                                    onChangeText = {newStudy => setstudyTime(newStudy)}
                                ></TextInput>
                            </View>
                        </View>

            </View>
            <View style = {styles.buttonContainer}>  
             <TouchableOpacity onPress = {goToPersonalise}>
                <View style = {styles.continuebutton} >
                    <Text style = {styles.continuebuttonText}> {'>'} </Text>
                </View>
            </TouchableOpacity> 
            </View>  

        </View>

    );
  }

  
  export default Questions;