import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

function Login({navigation}) {

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
            paddingTop: 100,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: {width: 1, height: 3},
            textShadowRadius: 2
        },
        welcomeText_mood: {
            fontSize:60,
            textAlign:'center',
            fontWeight:'bold',
            color:'#82ADE1',
        },
        outer_input_container:{
            height: screenHeight * 0.32,
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
            height: screenHeight * 0.1,
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
            justifyContent:'center',
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

        buttonContainer:{
            height: screenHeight * 0.28,
            alignItems:'center',
            justifyContent:'flex-end',
            paddingBottom:20,
        },
        continuebutton:{
            backgroundColor:'white',
            borderRadius:100,
            width: 50,
            height: 50,
            textAlign:'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
        continuebuttonText:{
            fontSize:30,
            color:'#9B9B9B',
        },
        existingAccount: {
            flex: 0.1,
            alignItems:'center',
            justifyContent:'flex-end'
        },

        existingAccount_text:{
            fontSize:11,
        },

    }

    //for input fields
    //email
    const [email, setEmail] = React.useState("");
    //password
    const [password, setPassword] = React.useState("");

    const userData = {"email": email, "password": password}

    //invoke error if password does not match 
    const submitUser = () => {
        console.log("✈ Sending Data to Server:", userData)
        fetch("https://eflask-app-mood.herokuapp.com/getuseronlogin", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: "POST",
            body: JSON.stringify(userData)
        })
        .then(response=>response.text())
        .then(res => {
            const item = JSON.parse(res) 
            if (Object.keys(item)[0] === "success") {
                console.log("💻 Server response:",res)
                navigation.navigate('Home', {email: email});
            }
        //function to handle results
        //if success enter to personalisation page with name json
        })
        .catch(error =>{
        console.error(error.message)
        })
        }

    //Send user to Login page if account exists
    const gotoUser = () => {
        navigation.navigate('User');
    }

    return (
        <View style = {styles.body}>

            <View style = {styles.welcomeText}>

            <Text style = {styles.welcomeText_text}>
                <Text style = {styles.welcomeText_mood}>mood</Text>
            </Text>

            </View>
            <View style = {styles.outer_input_container}>

            <View style = {styles.input_container}>

                <Text style =  {{
                    paddingLeft:20,
                    paddingTop:15,
                    fontSize:15,
                    color:'#82ADE1',
                    fontWeight:'bold',
                }}>Login Here</Text>

                <View style = {styles.inner_input_container}>

                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Email Address</Text>
                            <TextInput style = {styles.inputContainer_input} placeholder = "Please Enter Here..."  onChangeText={newEmail => setEmail(newEmail)} val = {email} autoCapitalize='none' autoCorrect = {false}/>
                        </View>
                        <View style = {styles.inputContainer}>
                            <Text style = {styles.inputContainer_title}>Password</Text>
                            <TextInput style = {styles.inputContainer_input} secureTextEntry={true} placeholder = "Please Enter Here..."  onChangeText={newPassword => setPassword(newPassword)} val = {password} autoCapitalize='none'  autoCorrect = {false}/>
                        </View>

                </View>
                    </View>
                        </View>

             <View style = {styles.buttonContainer}>   
                <TouchableOpacity onPress={submitUser}>
                    <View style = {styles.continuebutton}>
                        <Text style = {styles.continuebuttonText}> {'>'} </Text>
                    </View>
                </TouchableOpacity>
            </View>  
            

            <View style = {styles.existingAccount}>
                <Text style = {styles.existingAccount_text} onPress = {gotoUser}>First Time Here? Create An Account!</Text>
            </View>
            

        </View>
    );
  }

  //onPress = {() => navigation.navigate('Home')}
  
  export default Login;