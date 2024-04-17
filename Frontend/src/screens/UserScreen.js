import React, {useEffect, useState} from "react";
import axios from 'axios';

import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
//import Rain from 'rainy-background-reactnative';

import SignOutButton from "../components/SignOutButton";

const UserScreen = () => {
    const [loaded] = useFonts({
        'FastupScRegular': require('../../assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });

    const [zipcode, setZipcode] = useState('');
    const [locked, setLocked] = useState(false);
    const [showWeather, setShowWeather] = useState(false);
    const [weatherData, setWeatherData] = useState(null);

    // const { user } = useAuthenticator(userSelector)
    
    //TODO: Add auth token verification
    const fetchWeatherData = async (zipCode) => {
        try {
            const response = await axios.post(
                '',
                { zip_code: zipCode },
            );

            console.log('Response from server:', response.data);
            return response.data;
        } catch (error) {
            handleServerError(error);
            return null;
        }
    };

    const validateZipcode = (zipcode) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipcode);
    };
    
    // const handleClientError = (message) => {
    //     console.error('Client-side error:', message);
    //     alert('Error: ' + message);
    //     handleReset();
    // };
    
    const handleServerError = (error) => {
        console.error(error); 
        alert(error.response ? error.response.data.error : 'Server error');
    };
    
    
    const handleSubmitSuccessful = (response) => {
        setLocked(true);
        setShowWeather(true);
        setWeatherData(response);
    };
    
    const handleSubmit = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
        } else {
            const response = await fetchWeatherData(zipcode);
            if (response) {
                // const response = {
                //     temperature: '72f',
                // }
                handleSubmitSuccessful(response);
            }
        }
    };
    
    const handleReset = () => {
        setLocked(false);
        setZipcode('');
        setShowWeather(false);
        setWeatherData(null);
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

                    {!locked ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.button, {marginRight: '1%',width: '50%'}]}
                                placeholder="Enter your zipcode"
                                onChangeText={setZipcode}
                                value={zipcode}
                                keyboardType="number-pad"
                                maxLength={5}
                                editable={!locked}
                                onEndEditing={handleSubmit}
                            />
                            <TouchableOpacity style={[styles.button, {width: '22.5%'}]} onPress={handleSubmit}>
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
        borderWidth: 1,
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
