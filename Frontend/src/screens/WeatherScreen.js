import React, {useEffect, useState} from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SignOutButton from "../components/SignOutButton";
import HourlyForecast from "../components/HourlyForecast";

const WeatherScreen = ({route}) => {

    const handleReset = () => {
        navigation.navigate('Home', { reset: true });
    };
{/* <WeatherInfo
                            label=""
                            value={`${weatherData.forecast[0].avg_temp_c}°C`}
                            <Text style={styles.dataText}></Text>


                                                            
                        /> */}
    const navigation = useNavigation();
    const { weatherData, zipcode } = route.params;
    return (
        <SafeAreaView style={styles.screenContainer}>
            <LinearGradient
                colors={['#F0F0F0', '#B0C4DE']}
                style={styles.mainContainer}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.appTitle}>WEATHER</Text>
                    <Text style={[styles.appTitle, {fontSize: 20}]}>{weatherData.location.city}, {weatherData.location.state}</Text>
                    <Text style={[styles.appTitle, {fontSize: 18, fontFamily: 'roboto'}]}>{zipcode}</Text>
                </View>

                <View style={styles.weatherContainer}>
                    <View style={styles.currentContainer}>
                        <View style={styles.currentRow}>
                            <View style={styles.currentSquare}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="water-sharp" size={24} style={styles.icons} />
                                    <Text style={styles.dataText}>{weatherData.forecast[0].chance_of_rain}%</Text>
                                </View>
                            </View>
                            <View style={styles.currentSquare}>
                                <Text style={[styles.dataText, {fontSize:36}]}>{Math.round(weatherData.forecast[0].avg_temp_c)}°</Text>
                            </View>
                            <View style={styles.currentSquare}>
                                
                            </View>
                        </View>

                        <View style={styles.currentRow}>
                            <View style={styles.currentSquare}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="water-percent" size={20} style={styles.icons} />
                                    <Text style={[styles.dataText, {fontSize: 16, color: 'rgba(0, 0, 0, 0.5)'}]}>Humidity</Text>
                                </View>
                                <Text style={styles.dataText}>{weatherData.forecast[0].humidity}%</Text>
                            </View>
                            <View style={styles.currentSquare}>
                                <Text style={[styles.dataText, {fontSize: 16, color: 'rgba(0, 0, 0, 0.5)'}]}>High / Low</Text>
                                <Text style={styles.dataText}>{Math.round(weatherData.forecast[0].max_temp_c)}° / {Math.round(weatherData.forecast[0].min_temp_c)}°</Text>
                            </View>
                            <View style={styles.currentSquare}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Feather name="wind" size={18} style={styles.icons} />
                                    <Text style={[styles.dataText, {marginLeft: '2.5%', fontSize: 16, color: 'rgba(0, 0, 0, 0.5)'}]}>Wind</Text>
                                </View>
                                <Text style={styles.dataText}>{Math.round(weatherData.forecast[0].max_wind_mph)} mph</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.forecastContainer}>
                        <HourlyForecast hourlyForecasts={weatherData.forecast[0].hourly_forecasts} />
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.button, {marginRight: 50}]} onPress={handleReset}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <SignOutButton />
                </View> 

            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE',
        padding: '2.5%',
    },
    weatherContainer: {
        flex: .75,
    },
    titleContainer: {
        flex: .15,
        justifyContent: 'flex-end',
    },
    currentContainer: {
        flex: .5,
        flexDirection: 'column',
        borderColor: '#888',
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5,
        margin: '5%',
        padding: '1%'
    },
    forecastContainer: {
        flex: .5,
        borderColor: '#888',
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5,
        margin: '5%',
        overflow: 'hidden'
    },
    actionsContainer: {
        flex: .1, 
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
        justifyContent: 'center',
        borderRadius: 20,
        elevation: 1
    },
    button: {
        //borderWidth: 1,
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
    dataText: {
        fontSize: 24
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
    appTitle: {
        fontSize: 48,
        color: '#333',
        fontFamily: 'FastupScRegular',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    icons: {
        size: 24,
        color: 'rgba(0, 0, 0, 0.5)'
    }
    
});

export default WeatherScreen;
    
