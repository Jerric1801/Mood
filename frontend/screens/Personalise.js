import React, { useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

function Personalise({route, navigation}) {

    //styles for new user page
    const styles = {
        body: {
            backgroundColor: '#D5E4F5',
            width: '100%',
            height:'100%',
            flex: 1,
        },
        titleContainer:{
            height: 0.2 * screenHeight,
            flexDirection:'column',
            alignItems: 'flex-start',
            justifyContent:'flex-end'
        },
        titleContainer_text:{
            fontSize: 20,
            paddingLeft: 30,
            paddingBottom:10
        },

        timetableContainer:{
            height: 0.63 * screenHeight,
            alignItems:'center',
            justifyContent:'flex-start',
        },

        timetable:{
            height:'100%',
            backgroundColor:'white',
            width:'87.5%',
            borderRadius:10
        },

        weekbarContainer:{
            height: 0.07 * screenHeight,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        weekbar:{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'space-evenly',
            height:'35%',
            width: '90%',
            borderRadius:5,
            backgroundColor:'#F5F5F5',
        },
        weekbar_text:{
            fontSize:12,
            height:"90%",
            width: "15%",
            textAlign:'center',
            verticalAlign:'center'
        },
        classContainer: {
            height: 0.4 * screenHeight,
            flexDirection: 'column',
            alignItems:'center',
            justifyContent:'space-evenly',
        },
        classSlots:{
            width: '87.5%',
            height: 0.0875 * screenHeight,
            alignItems:'flex-start',
            justifyContent: 'space-between',
            backgroundColor:'#ffffff',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 0.5,
              width: 1
            },
        },
        classSlots_text:{
            fontSize: 17,
            color:'#82ADE1',
            fontWeight:'bold',
            paddingLeft:10,
            paddingTop:3,
        },
        classSlots_dropDown:{
            zIndex:1,
            heigth: '50%',
            borderWidth:0,
        },
        dropDownContainerStyle:{
            borderWidth:0.2,
            backgroundColor:'#ffffff',
            shadowColor: "#000000",
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
        },
        imgContainer:{
            height: 0.2 * screenHeight,
            alignItems:'center',
            justifyContent:'flex-start',
            zIndex:-5,
            paddingTop:5
        },
        reading_img:{
            resizeMode:"contain"
        },
        buttonContainer:{
            height: 0.1 * screenHeight,
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

    useEffect(() => {
        let ignore = false;
        
        if (!ignore)  submitData()
        return () => { ignore = true; }
        },[]);


    const {course, name, email} = route.params;
    const data = {"course": course}

    const submitData = async() => {
        fetch("https://eflask-app-mood.herokuapp.com/getcourses", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response=>response.text())
        .then(modules => {
            var def = [{label: "Select...", value: null}]
            setItems(def.concat(JSON.parse(modules)))
        })
        .catch(error =>{
        console.error(error.message)
        })
        }

    
    //Dropdown 1 SLOT 1
    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState(null);
    const onOpen1 = useCallback(() => {
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
      }, []);

    //Dropdown 2 SLOT 2
    const [open2, setOpen2] = useState(false);
    const [value2, setValue2] = useState(null);
    const onOpen2 = useCallback(() => {
        setOpen1(false);
        setOpen3(false);
        setOpen4(false);
        }, []);

    //Dropdown 3 SLOT 3
    const [open3, setOpen3] = useState(false);
    const [value3, setValue3] = useState(null);
    const onOpen3 = useCallback(() => {
        setOpen1(false);
        setOpen2(false);
        setOpen4(false);
        }, []);

    //Dropdown 4 SLOT 4
    const [open4, setOpen4] = useState(false);
    const [value4, setValue4] = useState(null);
    const onOpen4 = useCallback(() => {
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        }, []);

    //List of Mods
    const [items, setItems] = useState([{label: "Select...", value: null}])
    
    const [day, setDay] = useState("Mon")

    //change background color
    const [dayChosen, setdayChosen] = useState(true);
    const [dayChosen1, setdayChosen1] = useState(false);
    const [dayChosen2, setdayChosen2] = useState(false);
    const [dayChosen3, setdayChosen3] = useState(false);
    const [dayChosen4, setdayChosen4] = useState(false);

    //reset dropdowns & change day
    const changeDay = async(event) => {
        const setdays = {"Mon":setdayChosen, "Tues":setdayChosen1, "Wed":setdayChosen2, "Thurs":setdayChosen3, "Fri":setdayChosen4}

        for (const key in setdays) {
            setdays[key](false)
            if (key == event) {
                setdays[key](true)
             }
        }
        var vals = [value1, value2, value3, value4]
        //store values to session stogare
        try{
            await AsyncStorage.setItem(day, JSON.stringify(vals))
             //get values that were selected
            const _vals = await AsyncStorage.getItem(event)
            const get_vals = JSON.parse(_vals)
            setValue1(get_vals[0])
            setValue2(get_vals[1])
            setValue3(get_vals[2])
            setValue4(get_vals[3])
        }
        catch {
            setValue1(null)
            setValue2(null)
            setValue3(null)
            setValue4(null)
        }


        //get day clicked
        setDay(event)

        //get values that were selected
        
    }   

    //if have time account for duplicates & for no of mods 
    const getTimeTable = async() => {
        changeDay("Mon")
        const finalDays = ["Mon", "Tues", "Wed", "Thurs", "Fri"]
        let values
        try {
            values = await AsyncStorage.multiGet(finalDays)
        } catch(e) {
            console.log(e)
        }

        let mergedDays = {}
        for (const i in values){
            tempDays = JSON.parse(values[i][1])
            let checktempDays = []
            if (tempDays == null){
                checktempDays = ""
            }
            else {
                for (const i in tempDays){
                    if (tempDays[i] == null){
                        checktempDays[i] = ""
                    }
                    else{
                        checktempDays[i] = tempDays[i]
                    }
                }
            }
            mergedDays[values[i][0]] = checktempDays
            let tempDays
        }

        let taggedMergeddays = {}

        taggedMergeddays["email"] = email
        taggedMergeddays["days"] = mergedDays

        return taggedMergeddays
        
    }


    const updateDB = async(mergedDays) => {
        console.log("💿 Storing Data in Mongo:", mergedDays)
        await fetch("https://eflask-app-mood.herokuapp.com/updatetimetable", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: "POST",
            body: JSON.stringify(mergedDays)
        })
        .then(response=>response.text())
        .then(res => {
            console.log("💻 Server response:",res)
        })
        .catch(error =>{
        console.error(error.message)
        })
    }
    

    const goToHome = async() => {
        mergedDays = await getTimeTable()
        try{
            updateDB(mergedDays)
        }   
        catch(error){
            console.log(error)
        }
        AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        navigation.navigate('Home', {email: email})
    }
        
    

    return (
        <View style = {styles.body}>

            <View style = {styles.titleContainer}>
                <Text style = {styles.titleContainer_text}>WELCOME, {name} 😊 </Text>
                <Text style = {[styles.titleContainer_text, {fontSize:15, paddingBottom: 17.5,}]}>
                Tell us more about your timetable so we may{'\n'}personalise your experience!</Text>
            </View>


            <View style = {styles.timetableContainer}>
                <View style = {styles.timetable}>

                    <View style = {styles.weekbarContainer}>
                        <View style = {styles.weekbar}>
                            <Text style = {[styles.weekbar_text, {backgroundColor: dayChosen? 'white': "#F5F5F5"}]} onPress = {() => changeDay("Mon")}>Mon</Text>
                            <Text style = {[styles.weekbar_text, {backgroundColor: dayChosen1? 'white': "#F5F5F5"}]} onPress = {() => changeDay("Tues")}>Tues</Text>
                            <Text style = {[styles.weekbar_text, {backgroundColor: dayChosen2? 'white': "#F5F5F5"}]} onPress = {() => changeDay("Wed")}>Wed</Text>
                            <Text style = {[styles.weekbar_text, {backgroundColor: dayChosen3? 'white': "#F5F5F5"}]} onPress = {() => changeDay("Thurs")}>Thurs</Text>
                            <Text style = {[styles.weekbar_text, {backgroundColor: dayChosen4? 'white': "#F5F5F5"}]} onPress = {() => changeDay("Fri")}>Fri</Text>
                        </View>
                    </View>

                    <View style = {styles.classContainer}>
                        <View style = {styles.classSlots} >
                            <Text style = {styles.classSlots_text}>SLOT 1 : 0815-1130</Text>
                                <DropDownPicker
                                placeholder="Select..."
                                placeholderStyle={{
                                color: "grey",
                                }}
                                searchable = {true}
                                dropDownContainerStyle={styles.dropDownContainerStyle}
                                showArrowIcon={false}
                                style = {styles.classSlots_dropDown}
                                open={open1}
                                value={value1}
                                items={items}
                                onOpen= {onOpen1}
                                setOpen={setOpen1}
                                setValue={setValue1}
                                setItems={setItems}/>
                        </View>
                        <View style = {[styles.classSlots, {zIndex: -1}]}>
                            <Text style = {styles.classSlots_text}>SLOT 2 : 1200-1530</Text>
                          
                                <DropDownPicker
                                placeholder="Select..."
                                placeholderStyle={{
                                color: "grey",
                                }}
                                searchable = {true}
                                dropDownContainerStyle={styles.dropDownContainerStyle}
                                showArrowIcon={false}
                                style = {styles.classSlots_dropDown}
                                open={open2}
                                value={value2}
                                items={items}
                                onOpen= {onOpen2}
                                setOpen={setOpen2}
                                setValue={setValue2}
                                setItems={setItems}/>
           
                        </View>
                        <View style = {[styles.classSlots, {zIndex: -2}]}>
                            <Text style = {styles.classSlots_text}>SLOT 3 : 1530-1845</Text>
                            
                                <DropDownPicker
                                placeholder="Select..."
                                placeholderStyle={{
                                color: "grey",
                                }}
                                searchable = {true}
                                dropDownContainerStyle={styles.dropDownContainerStyle}
                                showArrowIcon={false}
                                style = {styles.classSlots_dropDown}
                                open={open3}
                                value={value3}
                                items={items}
                                onOpen= {onOpen3}
                                setOpen={setOpen3}
                                setValue={setValue3}
                                setItems={setItems}/>
                   
                        </View>
                        <View style = {[styles.classSlots, {zIndex: -3}]}>
                            <Text style = {styles.classSlots_text}>SLOT 4 : 1900-2100</Text>
                            
                                <DropDownPicker
                                placeholder="Select..."
                                placeholderStyle={{
                                color: "grey",
                                }}
                                searchable = {true}
                                dropDownContainerStyle={styles.dropDownContainerStyle}
                                showArrowIcon={false}
                                style = {styles.classSlots_dropDown}
                                open={open4}
                                value={value4}
                                items={items}
                                onOpen= {onOpen4}
                                setOpen={setOpen4}
                                setValue={setValue4}
                                setItems={setItems}/>
            
                        </View>

        
                    </View>
                    <View style = {styles.imgContainer}>
                        <Image style = {styles.reading_img} source={require('./img/reading.png')} />
                    </View>
                </View>
                
            </View>

             <View style = {styles.buttonContainer}>  
             <TouchableOpacity onPress = {goToHome}>
                <View style = {styles.continuebutton} >
                    <Text style = {styles.continuebuttonText}> {'>'} </Text>
                </View>
            </TouchableOpacity> 
            </View>  

        </View>
    );
  }

  
  export default Personalise;