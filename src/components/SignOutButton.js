import React from 'react';
import { StyleSheet, Text, Pressable} from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context) => [context.user];

const SignOutButton = () => {

  const { user, signOut } = useAuthenticator(userSelector);

  return (
    <Pressable onPress={signOut} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>
        Hello, {user.username}! Click here to sign out!
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
      },
});

export default SignOutButton;
