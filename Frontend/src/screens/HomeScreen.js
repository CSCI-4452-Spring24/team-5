import React, {useEffect, useState} from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';


import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

import SignOutButton from "../components/SignOutButton";
import useWeatherData from "../hooks/useWeatherData";

const HomeScreen = () => {

    const [loaded] = useFonts({
        'FastupScRegular': require('../../assets/fonts/FastupScRegular-Yzjgv.ttf'),
    });

    const navigation = useNavigation();
    const route = useRoute();

    const [zipcode, setZipcode] = useState('');
    const [fetchWeatherData, response, errorMessage] = useWeatherData();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    //TODO fix double API call bug
    useEffect(() => {
        if (route.params?.reset) {
            setZipcode('');
            setIsSubmitDisabled(false);
        }
    }, [route.params]);

    const validateZipcode = (zipcode) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipcode);
    };

    useEffect(() => {
        if (!errorMessage && response) {
            navigation.navigate('Weather', { weatherData: response, zipcode: zipcode });
            setIsSubmitDisabled(false);
        } else if (errorMessage) {
            alert(errorMessage);
            setIsSubmitDisabled(false);
        }
    }, [response, errorMessage]);

    const handleInputSubmission = async () => {
        if (!validateZipcode(zipcode)) {
            alert('Please enter exactly 5 digits for the zipcode.');
        } else {
            setIsSubmitDisabled(true);
            await fetchWeatherData(zipcode);
        }
    };

    if (!loaded) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.screenContainer}>
                <LinearGradient
                    colors={['#F0F0F0', '#B0C4DE']}
                    style={styles.mainContainer}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.appTitle}>STORM SENTRY</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.button, {marginRight: '1%',width: '50%'}]}
                            placeholder="Enter your zipcode"
                            onChangeText={setZipcode}
                            value={zipcode}
                            keyboardType="number-pad"
                            maxLength={5}
                            //editable={!isSubmitDisabled}
                            //onEndEditing={handleInputSubmission}
                        />
                        <TouchableOpacity 
                            style={[styles.button, {width: '22.5%'}]} 
                            onPress={handleInputSubmission}
                            disabled={isSubmitDisabled}
                        >
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

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
        padding: '2.5%',
    },
    titleContainer: {
        flex: .2,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: .6,
    },
    actionsContainer: {
        flex: .2, 
        justifyContent: 'center',
        alignItems: 'center'
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
});

export default HomeScreen;
    
