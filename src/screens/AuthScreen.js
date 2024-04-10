import React, {useState} from "react";
import { StyleSheet, SafeAreaView, View, Text, ImageBackground, Image, TextInput,  KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const AuthScreen = () => {

    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <SafeAreaView style={styles.screenContainer}>
            
            
        
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.loginContainer}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Sign In</Text>
                </View>
                
                <View style={styles.inputContainer}> 
                    <TextInput 
                        style={styles.inputUsername}
                        placeholder="Email*"
                        onChangeText={setUsername}
                        value={username}
                        selectionColor='black'
                    />

                    <TextInput 
                        style={styles.inputPassword}
                        placeholder="Password*"
                        onChangeText={setPassword}
                        value={password}
                        selectionColor='black'
                    />
                </View>

            </KeyboardAvoidingView>

            

        </SafeAreaView>    
    ); 
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    loginContainer: {
        height: 250,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: '10%',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: .2,
        alignSelf: 'center',
    },
    inputContainer: {
        flex: .8,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
    },
    inputUsername: {
        textDecorationLine: 'underline',
        fontSize: 30,
        marginBottom: '5%',
        marginLeft: '5%'
    },
    inputPassword: {
        textDecorationLine: 'underline',
        fontSize: 30,
        marginLeft: '5%'
    },
});

export default AuthScreen;