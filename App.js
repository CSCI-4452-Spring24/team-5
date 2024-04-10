
import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Pressable} from 'react-native';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import { withAuthenticator,  useAuthenticator  } from '@aws-amplify/ui-react-native';

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

const App = () => {
    return <SafeAreaView style={styles.screenContainer}>
        <View style={styles.container}>
            <SignOutButton />
            <Text style={{fontSize: 32, textAlign: 'center'}}>HELLO WORLD</Text>
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
 screenContainer: {
    flex: 1
 },
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
 }
});

export default withAuthenticator(App);
