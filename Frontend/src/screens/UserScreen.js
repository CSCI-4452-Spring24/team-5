import React, {useEffect, useState} from "react";
import axios from 'axios';

import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
//import Rain from 'rainy-background-reactnative';

import SignOutButton from "../components/SignOutButton";
import useWeatherData from "../hooks/useWeatherData";

const UserScreen = () => {

    const [loaded] = useFonts({
        'FastupScRegular': require('../../assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });
    const [zipcode, setZipcode] = useState('');
    const [showWeather, setShowWeather] = useState(false);
    const [fetchWeatherData, response, errorMessage] = useWeatherData();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    // const { user } = useAuthenticator(userSelector)
    
    
    const validateZipcode = (zipcode) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipcode);
    };
    
    const handleResponseSuccessful = () => {
        setShowWeather(true);
    };
    
    const handleInputSubmission = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
        } else {
            setIsSubmitDisabled(true);
            
            await fetchWeatherData(zipcode);
            if (errorMessage) {
                alert(errorMessage);
                setIsSubmitDisabled(false);
            } else {
                console.log(response);
                handleResponseSuccessful();
            }
        }
    };
    
    const handleReset = () => {
        setZipcode('');
        setShowWeather(false);
        setIsSubmitDisabled(false);
    };
    
    if (!loaded) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.screenContainer}>
                <LinearGradient
                    colors={['#F0F0F0', '#B0C4DE']}
                    style={styles.container}
                    >
                    {/* <Rain fullScreen={false} rainCount={25} fallSpeed="medium" /> */}

                    <View style={styles.titleContainer}>
                        <Text style={styles.appTitle}>STORM SENTRY</Text>
                        {/* <Text style={styles.userInfo}>Welcome {user.username}</Text> */}
                    </View>

                    {!showWeather ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.button, {marginRight: '1%',width: '50%'}]}
                                placeholder="Enter your zipcode"
                                onChangeText={setZipcode}
                                value={zipcode}
                                keyboardType="number-pad"
                                maxLength={5}
                                editable={!showWeather}
                                onEndEditing={handleInputSubmission}
                            />
                            <TouchableOpacity 
                                style={[styles.button, {width: '22.5%'}]} 
                                onPress={handleInputSubmission}
                                disabled={isSubmitDisabled}
                            >
                                    <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <Text style={[styles.infoTitle, {fontFamily: 'default'}]}>{zipcode}</Text>
                        </View>
                    )}
                    
                    {showWeather && (
                        <View style={styles.weatherContainer}>
                            <Text style={styles.infoTitle}>Daily Forecast</Text>
                            <View style={styles.weatherInfoContainer}>
                                <Text>
                                    {/* {weatherData.temperature} */}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.actionsContainer}>
                        {showWeather && ( 
                            <TouchableOpacity style={[styles.button, {marginRight: 50}]} onPress={handleReset}>
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        )}
                        <SignOutButton />
                    </View>
                        
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE',
        padding: '2.5%'
    },
    titleContainer: {
        flex: .125,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: .1
    },
    weatherContainer: {
        flex: .675,
    },
    weatherInfoContainer: {
        //borderWidth: 1,
        borderColor: '#888',
        borderRadius: 20,
        marginHorizontal: '5%',
        flex: 1,
        backgroundColor: 'white',
        elevation: 5
    },
    actionsContainer: {
        flex: .1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 20,
        elevation: 5,
        paddingVertical: '3%',
        paddingHorizontal: '2.5%',
        fontSize: 18,
        color: '#333',
        backgroundColor: 'white',
        width: '25%',
    },
    submitText: {
        color: '#333',
        fontSize: 18,
        textAlign: 'center'
    },
    appTitle: {
        fontSize: 48,
        color: '#333',
        fontFamily: 'FastupScRegular',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Text shadow color
        textShadowOffset: { width: 2, height: 2 }, // Text shadow offset
        textShadowRadius: 5, // Text shadow radius
    },
    userInfo: {
        fontSize: 24,
        textAlign: 'center'
    },
    infoTitle: {
        fontSize: 32,
        fontFamily: 'FastupScRegular',
        textAlign: 'center',
        color: '#333',
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
});

export default UserScreen;