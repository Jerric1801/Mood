import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Dimensions} from 'react-native';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


function User({navigation}) {

    //styles for new user page
    const styles = {
        body: {
            backgroundColor: '#D5E4F5',
            width: '100%',
            height:'100%',
            flex: 1,
        },
        welcomeText: {
            height: screenHeight * 0.25,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        welcomeText_text: {
            fontSize:22,
            textAlign:'center',
            fontWeight:'bold',
            paddingTop: 110
        },
        welcomeText_mood: {
            fontSize:50,
            textAlign:'center',
            fontWeight:'bold',
            color:'#E69D0B',
        },
        outer_input_container:{
            height: screenHeight * 0.45,
            paddingTop:20,
            alignItems: 'center',
            justifyContent: 'center'
        },
        input_container: {
            flex:1,
            backgroundColor:'white',
            width:'87.5%',
            borderRadius:10,
        },
        inner_input_container: {
            flex: 1,
            flexDirection:'column',
            alignItems:'center',
            justifyContent: 'space-evenly',
        },
        inputContainer:{
            backgroundColor:'white',
            height: screenHeight * 0.075,
            width:'90%',
            backgroundColor:'#ffffff',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
            borderColor:"black",
            borderRadius:10,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent:'center'
        },
        inputContainer_title: {
            color:'#82ADE1',
            fontWeight:'bold',
            fontSize:15,
            paddingLeft:7.5,
        },
        inputContainer_input:{
            color:'#9B9B9B',
            fontSize:13,
            paddingLeft:7.5,
            paddingTop:5,
            width:'100%'
        },

        passwordReq:{
            height:15,
            width: '100%',
            flexDirection:'row',
            alignItems:'flex-start',
            justifyContent:'flex-start',
        },
        passwordReq_text:{
            paddingLeft: 25,
            fontSize:10,
            color:'#E69D0B'
        },

        buttonContainer:{
            alignItems:'center',
            paddingTop:40,
            height: screenHeight * 0.13,
            justifyContent:'flex-end',
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

        existingAccount: {
            height: screenHeight * 0.1,
            paddingTop:15,
            alignItems:'center',
            justifyContent:'flex-start'
        },

        existingAccount_text:{
            fontSize:11,
        },

    }

    //redirect to Questions page
    const redirect = async(res) => {
        const item = JSON.parse(res) 
        if (Object.keys(item)[1] === "success") {
            navigation.navigate('Questions', item)
        }
        else {
            //set text to error json
            setemailExist(true)
        }
    }

    //for input fields
    //username
    const [username, setUser] = useState("");
    //email
    const [email, setEmail] = useState("");
    //password
    const [password, setPassword] = useState("");
    //checkpassword
    const [checkPassword, setCheckpassword] = useState("");

    //passReq show & hide
    const [passReq, setPassreq] = useState(null);
    const [emailExist, setemailExist] = useState(false)

    //invoke error if password does not match 
    useEffect(()=> {
        if (checkPassword != password && checkPassword != ""){
            setemailExist(false)
            setPassreq("Your Passwords are not the same!")
        }
        else{
            setPassreq(null)
        }
        
        if (username.length > 10 && username != ""){
            setemailExist(false)
            setPassreq("Username has to be 1-12 characters")
        }

        if (emailExist) {
            setPassreq("Email address exists, please try again")
        }

        if (!(email.includes("@")) && email != ""){
            setemailExist(false)
            setPassreq("Invalid email")
        }

    })

    const userData = {"user": username, "email": email, "password": password}

    //collect & send input data to server
    const submitNewUser = async() => {
        console.log("✈ Sending Data to Server:", userData)
        fetch("https://eflask-app-mood.herokuapp.com/newuser", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: "POST",
            body: JSON.stringify(userData)
        })
        .then(response=>response.text())
        .then(res => {
            console.log("💻 Server response:",res)
            redirect(res)
        //function to handle results
        //if success enter to personalisation page with name json
        })
        .catch(error =>{
        console.error(error.message)
        })
        }

    
    //Send user to Login page if account exists
    const gotoLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <View style = {styles.body}>

            <View style = {styles.welcomeText}>

                <Text style = {styles.welcomeText_text}>
                    HI THERE, WELCOME TO 
                    {'\n'} <Text style = {styles.welcomeText_mood}>mood</Text>{'\n'} 
                    <Text style = {{fontSize:15}}>We’re excited to have you here! 🥳</Text>
                </Text>

            </View>

            <View style = {styles.outer_input_container}>

                <View style = {styles.input_container}>

                    <Text style = {{
                        paddingLeft:20,
                        paddingTop:15,
                        fontSize:15
                    }}>Let's set up your account:</Text>

                    <View style = {styles.inner_input_container}>

                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Username</Text>
                            <TextInput style = {styles.inputContainer_input} placeholder = "Please Enter Here..." onChangeText={newUser => setUser(newUser)} val = {username} autoCapitalize='none' autoCorrect = {false}/>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Email Address</Text>
                            <TextInput style = {styles.inputContainer_input} placeholder = "Please Enter Here..."  onChangeText={newEmail => setEmail(newEmail)} val = {email} autoCapitalize='none'  autoCorrect = {false}/>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Password</Text>
                            <TextInput style = {styles.inputContainer_input} secureTextEntry={true} placeholder = "Please Enter Here..."  onChangeText={newPassword => setPassword(newPassword)} val = {password} autoCapitalize='none' autoCorrect = {false}/>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Confirm Password</Text>
                            <TextInput style = {styles.inputContainer_input} 
                            secureTextEntry={true} 
                            placeholder = "Please Enter Here..."  
                            onChangeText={newCheckpassword => setCheckpassword(newCheckpassword)} 
                            val = {checkPassword} 
                            autoCapitalize='none'
                            autoCorrect = {false}
                            />
                        </View>

                        <View style = {styles.passwordReq}>

                            <Text style = {styles.passwordReq_text}>{passReq}</Text>

                        </View>
                    </View>

                </View>
            </View>

             <View style = {styles.buttonContainer}>   
             <TouchableOpacity onPress = {submitNewUser}>
                <View style = {styles.continuebutton} >
                    <Text style = {styles.continuebuttonText}> {'>'} </Text>
                </View>
            </TouchableOpacity> 
            </View>  

            <View style = {styles.existingAccount}>
                <Text style = {styles.existingAccount_text} onPress = {gotoLogin}>Already have an account? Log in Here</Text>
            </View>
            

        </View>
    );
  }

  //onPress = {() => navigation.navigate('Home')}
  
  export default User;