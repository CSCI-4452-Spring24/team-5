
import React, {useEffect, useState} from "react";
import axios from 'axios';
import { Platform } from 'react-native';

import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import Rain from 'rainy-background-reactnative';


import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import { withAuthenticator,  useAuthenticator  } from '@aws-amplify/ui-react-native';
Amplify.configure(amplifyconfig);

const userSelector = (context) => [context.user];

const SignOutButton = () => {
    const { signOut } = useAuthenticator(userSelector);
    return (
        <TouchableOpacity onPress={signOut} style={[styles.button, {}]}>
            <Text style={styles.buttonText}>
                Sign Out
            </Text>
        </TouchableOpacity>
    );
};

const fetchWeatherData = async (zipCode, authToken) => {
    try {
        const response = await axios.post(
            'http://fargate-container-url/api/weather',
            { zipCode },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};
  

const App = () => {

    const [loaded] = useFonts({
        'FastupScRegular': require('./assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });

    const [zipcode, setZipcode] = useState('');
    const [locked, setLocked] = useState(false);
    const [showWeather, setShowWeather] = useState(false);
    const [weatherData, setWeatherData] = useState(null);

    const { user } = useAuthenticator(userSelector);

    // const handleSubmit = async () => {
        
    //     const zipRegex = /^\d{5}$/;

    //     if (zipRegex.test(zipcode)) {
    //         console.log('Submitted zipcode:', zipcode);

    //         try {
    //             const authToken = user.signInUserSession.accessToken.jwtToken;
    //             const response = await fetchWeatherData(zipcode, authToken);
    //             setLocked(true);
    //             setShowWeather(true);
    //             setWeatherData(response);
    //             console.log('Weather data:', weatherData);
    //           } catch (error) {
    //             console.error('Error fetching weather data:', error);
    //             alert('Error fetching weather data. Please try again later.');
    //             handleReset();
    //             return;
    //           }
    //     } else if (zipcode.trim() !== '' && !zipRegex.test(zipcode)) {
    //         alert('Please enter exactly 5 digits for the zipcode.');
    //         return;
    //     }
    // };

    //For Testing
    //For Testing
    const mockFetchWeatherData = (zipcode) => {
    
        // Sample weather data
        const sampleWeatherData = {
            temperature: '72°F',
            conditions: 'Sunny',
            humidity: '50%',
            windSpeed: '10 mph'
        };

        return sampleWeatherData;
    };


    const validateZipcode = (zipcode) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipcode);
    };
    
    const handleClientError = (message) => {
        console.error('Client-side error:', message);
        alert('Error: ' + message);
        handleReset();
    };
    
    const handleServerError = (error) => {
        console.error('Server-side error:', error);
        alert('Error: ' + error);
    };
    
    const handleSuccess = (response) => {
        setLocked(true);
        setShowWeather(true);
        setWeatherData(response);
        console.log('Weather data:', weatherData);
    };
    
    const handleSubmit = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
            return;
        }
    
        try {
            //const authToken = user.signInUserSession.accessToken.jwtToken;
            //const response = await fetchWeatherData(zipcode, authToken);

            //For Testing
            const response = mockFetchWeatherData(zipcode);
            console.log('Response:', response);
            
            if (response){
                handleSuccess(response);
            }
            
            // if (response.error) { // Check for server-side error
            //     handleServerError(response.error);
            //     return;
            // } 
    
            //handleSuccess(response);
    
        } catch (error) {
            handleClientError('Failed to fetch weather data. Please try again later.');
        }
    };
    

    const handleReset = () => {
        setLocked(false);
        setZipcode('');
        setShowWeather(false);
    };

    const handleFocus = () => {
        setShowWeather(false);
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
                        <Text style={styles.userInfo}>Welcome {user.username}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.button, {marginRight: '1%',width: '50%'}]}
                            placeholder="Enter your zipcode"
                            onChangeText={setZipcode}
                            value={zipcode}
                            keyboardType="number-pad"
                            maxLength={5}
                            editable={!locked}
                            onFocus={handleFocus}
                            onEndEditing={handleSubmit}
                        />
                        {locked ? (
                            <TouchableOpacity style={[styles.button, {width: '20%'}]} onPress={handleReset}>
                                <Text style={styles.submitText}>Reset</Text>
                            </TouchableOpacity>
                            ) : (
                            <TouchableOpacity style={[styles.button, {width: '20%'}]} onPress={handleSubmit}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {showWeather && (
                        <View style={styles.weatherContainer}>
                            <Text style={styles.infoTitle}> Weather</Text>
                            <View style={styles.weatherInfoContainer}>
                                <Text>
                                    {weatherData.temperature}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.signoutContainer}>
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
        flex: .125
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: .15
    },
    weatherContainer: {
        flex: .625,
    },
    weatherInfoContainer: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 20,
        marginHorizontal: '5%',
        flex: 1,
        backgroundColor: 'white'
    },
    signoutContainer: {
        flex: .1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 20,
        paddingVertical: '3%',
        paddingHorizontal: '2.5%',
        fontSize: 18,
        color: '#333',
        backgroundColor: 'white'
    },
    submitText: {
        color: '#333',
        fontSize: 17,
        textAlign: 'center'
    },
    appTitle: {
        fontSize: 48,
        fontFamily: 'FastupScRegular',
        textAlign: 'center'
  },
  userInfo: {
    fontSize: 24,
    textAlign: 'center'
  },
  infoTitle: {
    fontSize: 32,
    fontFamily: 'FastupScRegular',
    textAlign: 'center'
  }
});

export default withAuthenticator(App);