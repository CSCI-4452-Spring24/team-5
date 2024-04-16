
import React, {useEffect, useState} from "react";
import axios from 'axios';

import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';
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

const App = () => {

    const [loaded] = useFonts({
        'FastupScRegular': require('./assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });

    const [zipcode, setZipcode] = useState('');
    const [locked, setLocked] = useState(false);
    const [showWeather, setShowWeather] = useState(false);
    const [weatherData, setWeatherData] = useState(null);

    const { user } = useAuthenticator(userSelector)

    const fetchWeatherData = async (zipCode) => {
        try {
            const response = await axios.post(
                'http://192.168.50.154:5000/api/weather',
                { zip_code: zipCode }
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
    
    
    const handleSubmitSuccess = (response) => {
        setLocked(true);
        setShowWeather(true);
        setWeatherData(response);
    };
    
    const handleSubmit = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
            return;
        } else {
            const response = await fetchWeatherData(zipcode);
            if (response) {
                handleSubmitSuccess(response);
            }
        }
    };
    
    const handleReset = () => {
        setLocked(false);
        setZipcode('');
        setShowWeather(false);
        setWeatherData(null);
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
                                    {/* {weatherData.temperature} */}
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