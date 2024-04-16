
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import UserScreen from "./src/screens/UserScreen";

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import { withAuthenticator } from '@aws-amplify/ui-react-native';

Amplify.configure(amplifyconfig);

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer> 
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={UserScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default withAuthenticator(App);