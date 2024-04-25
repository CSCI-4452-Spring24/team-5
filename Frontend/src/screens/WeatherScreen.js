import React, {useEffect, useState} from "react";
import { StyleSheet, SafeAreaView, View, Text, ActivityIndicator, TextInput, Image} from 'react-native';

import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import SignOutButton from "../components/SignOutButton";
import HourlyForecast from "../components/HourlyForecast";
import useWeatherData from "../hooks/useWeatherData";  

const WeatherScreen = () => {

    const [loaded] = useFonts({
        'FastupScRegular': require('../../assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });

    const getGradientColors = (condition) => {
        switch (condition) {
            case 'Sunny':
                return ['#ffecd2', '#fcb69f']; // Softer orange gradient
            case 'Cloudy':
                return ['#d3cce3', '#e9e4f0']; // Light purple to soft gray
            case 'Rain':
                return ['#a1c4fd', '#c2e9fb']; // Soft blue gradient
            case 'Snow':
                return ['#e6e9f0', '#eef1f5']; // Light gray to white
            case 'Thunderstorm':
                return ['#616161', '#9bc5c3']; // Dark gray to muted teal
            case 'Fog':
                return ['#a7a6cb', '#8989ba']; // Foggy gray to light violet
            default:
                return ['#ffffff', '#ffffff'];
        }
    };

    const [zipcode, setZipcode] = useState('70125');
    const [gradientColors, setGradientColors] = useState(getGradientColors('Default'));
    const [fetchWeatherData, response, errorMessage] = useWeatherData();
    const [isLoading, setIsLoading] = useState(true); 

    const handleInputSubmission = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
        } else {
            setIsLoading(true);
            await fetchWeatherData(zipcode);
            setIsLoading(false);
        }
    };

    //load default zip
    useEffect(() => {
        handleInputSubmission();
    }, []);

    
    useEffect(() => {
        if (response && response.forecast && response.forecast[0]) {
            const currentCondition = response.forecast[0].condition_text;
            setGradientColors(getGradientColors(currentCondition));
        } else if (errorMessage) {
            alert(errorMessage);
        }
    }, [response, errorMessage]);

    const validateZipcode = (zipcode) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipcode);
    };

    if (!loaded) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.screenContainer}>
                <LinearGradient
                    colors={gradientColors}
                    style={styles.mainContainer}
                >

                    <View style={styles.inputContainer}>
                        <View style={styles.inputBox}>
                            <Entypo name="location-pin" style={{marginLeft: 10}} size={24} color="rgba(0, 0, 0, 0.5)" />
                            <TextInput
                                style={{fontSize: 20, marginLeft: '2.5%', flex: 1}}
                                placeholder="zipcode"
                                onChangeText={setZipcode}
                                value={zipcode}
                                keyboardType="number-pad"
                                maxLength={5}
                                onEndEditing={handleInputSubmission}
                                />
                        </View>
                    </View>

                    {!isLoading &&
                        <View style={styles.titleContainer}>
                            <Text style={[styles.appTitle, {fontSize: 20}]}>{response.location.city}, {response.location.state}</Text>
                        </View>
                    }

                    {isLoading ? (
                        <ActivityIndicator size={64} color="#fff" />
                    ) : (
                        <View style={styles.weatherContainer}>
                            <View style={styles.currentContainer}>
                                <Text style={[styles.headerText, {marginBottom: '1%'}]}>Current</Text>
                                <View style={styles.currentRow}>
                                    <View style={styles.currentSquare}>
                                        <Text style={styles.dataHeaderText}>Rain</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                            <Ionicons name="water-sharp" size={24} style={{color: 'rgba(0, 0, 0, 0.5)',}} />
                                            <Text style={styles.dataText}>{response.forecast[0].chance_of_rain}%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.currentSquare}>
                                        <Text style={[styles.dataText, {fontSize:36}]}> {Math.round(response.forecast[0].avg_temp_c)}°C</Text>
                                    </View>
                                    <View style={styles.currentSquare}>
                                        <Text style={styles.dataHeaderText}>{response.forecast[0].condition_text}</Text>
                                        <Image
                                            style={{width: '75%', height: '50%'}}
                                            source={{ uri: `https:${response.forecast[0].condition_icon}` }}
                                        />
                                    </View>
                                </View>

                                <View style={styles.currentRow}>
                                    <View style={styles.currentSquare}>
                                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                            <MaterialCommunityIcons name="water-percent" size={20} style={[styles.icons]} />
                                            <Text style={styles.dataHeaderText}>Humidity</Text>
                                        </View>
                                        <Text style={styles.dataText}>{response.forecast[0].humidity}%</Text>
                                    </View>
                                    <View style={styles.currentSquare}>
                                        <Text style={styles.dataHeaderText}>High / Low</Text>
                                        <Text style={styles.dataText}>{Math.round(response.forecast[0].max_temp_c)}° / {Math.round(response.forecast[0].min_temp_c)}°</Text>
                                    </View>
                                    <View style={styles.currentSquare}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: '15%'}}>
                                            <Feather name="wind" size={16} style={styles.icons} />
                                            <Text style={[styles.dataHeaderText, {marginLeft: '2.5%'}]}>Wind</Text>
                                        </View>
                                        <Text style={styles.dataText}>{Math.round(response.forecast[0].max_wind_mph)} mph</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.forecastContainer}>
                                <Text style={[styles.headerText, {marginLeft: '3%', marginTop: '1.5%'}]}>Forecast</Text>
                                <HourlyForecast hourlyForecasts={response.forecast[0].hourly_forecasts} />
                            </View>
                        </View>
                    )}
                    
                    

                    <View style={styles.actionsContainer}>
                        <SignOutButton />
                    </View> 

                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE',
        padding: '2.25%',
    },
    weatherContainer: {
        flex: .775,
    },
    inputContainer: {
        flex: .1,
        alignItems: 'center',
    },
    titleContainer: {
        flex: .05,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    currentContainer: {
        flex: .5,
        flexDirection: 'column',
        borderColor: '#888',
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5,
        marginHorizontal: '5%',
        marginVertical: '2.5%',
        padding: '1%',
        justifyContent: 'center',
    },
    forecastContainer: {
        flex: .5,
        borderColor: '#888',
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5,
        marginHorizontal: '5%',
        marginVertical: '4%',
        overflow: 'hidden',
        justifyContent: 'center'
    },
    actionsContainer: {
        flex: .075, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    currentRow: {
        flex: 1, 
        flexDirection: 'row', 
    },
    currentSquare: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        margin: '1.5%',
        alignItems: 'center',
        borderRadius: 20,
        elevation: 1,
        justifyContent: 'space-evenly'
    },
    button: {
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
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'white',
        width: '70%',
        paddingVertical: '3%',
        //paddingHorizontal: '2.5%',
        borderRadius: 20,
    },
    dataText: {
        fontSize: 24
    },
    dataHeaderText: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
    },
    headerText: {
        fontSize: 18,
        color: 'rgba(0, 0, 0, 0.5)',
        marginLeft: '2%',
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    appTitle: {
        fontSize: 48,
        color: '#333',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    icons: {
        color: 'rgba(0, 0, 0, 0.5)',
    }   
});

export default WeatherScreen;
    
