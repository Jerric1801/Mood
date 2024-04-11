import React, { useState, useEffect } from 'react';
import { View, Text, Button} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import HomeScreen from './screens/Home.js';
import Details from './screens/Details';
import User from './screens/User';
import Personalise from './screens/Personalise';
import Questions from './screens/Questions';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  }
}

function Start({navigation}){
  
  useEffect(() => {
    //Check if user first time or not & navigate accordingly
      setTimeout(() => {
        console.log("🌼 Mood Starting...")
        navigation.navigate('User') 
      }, 2000); 

  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D5E4F5' }}>
      <Text style = {{fontSize: 100}}>🌼</Text>
      <Text onPress = {() => navigation.navigate('Home')} style = {{
        fontSize: 45,
        fontWeight:'bold',
        color: '#E69D0B',
        }} 
        >mood</Text>
    </View>
  )
}

function App() {
  return (
    <NavigationContainer theme={theme}>

      <Stack.Navigator initialRouteName='Start'>

        <Stack.Screen name = "Start" component = {Start} options={{headerShown: false}}/>

        <Stack.Screen name = "Login" component = {Login} options={{headerShown: false}}/>

        <Stack.Screen name = "User" component = {User} options={{headerShown: false}}/>

        <Stack.Screen name = "Questions" component = {Questions} options={{headerShown: false}} initialParams = {{success:"NAME", email:"Email"}}/>

        <Stack.Screen name = "Personalise" component = {Personalise} options={{headerShown: false}} initialParams = {{course:"IS", name:"Name", email:"Email"}}/>

        <Stack.Screen name = "Home" component = {HomeScreen} options={{headerShown: false}} initialParams = {{email:"jerric.chan.2022@scis.smu.edu.sg"}}/>
        
        <Stack.Screen name = "Details" component = {Details}/>

      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App


