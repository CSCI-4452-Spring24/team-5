import React from 'react';
import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context) => [context.user];

const SignOutButton = () => {
    const { signOut } = useAuthenticator(userSelector);
    return (
        <TouchableOpacity onPress={signOut} style={styles.button}>
            <Text style={styles.buttonText}>
                Sign Out
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        elevation: 5,
        borderColor: '#888',
        borderRadius: 20,
        paddingVertical: '3%',
        paddingHorizontal: '2.5%',
        width: '25%',
        fontSize: 18,
        color: '#333',
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
});

export default SignOutButton;
