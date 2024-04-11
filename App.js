
import React from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput} from 'react-native';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import { withAuthenticator,  useAuthenticator  } from '@aws-amplify/ui-react-native';

const userSelector = (context) => [context.user];

const SignOutButton = () => {
  const { user, signOut } = useAuthenticator(userSelector);
  return (
    <TouchableOpacity onPress={signOut} style={[styles.button, {}]}>
      <Text style={styles.buttonText}>
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};

const App = () => {

  const [zipcode, setZipcode] = React.useState('');
  const [locked, setLocked] = React.useState(false);

  const handleSubmit = () => {
    if (zipcode.length === 5) {
      // Lock the input and perform submission logic here
      setLocked(true);
      console.log('Submitted zipcode:', zipcode);
    } else {
      alert('Please enter exactly 5 digits for the zipcode.');
    }
  };

  const handleReset = () => {
    setLocked(false);
    setZipcode('');
  };


  return <SafeAreaView style={styles.screenContainer}>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.button, {marginRight: '1%',width: '50%'}]}
          placeholder="Enter your zipcode"
          onChangeText={setZipcode}
          value={zipcode}
          keyboardType="numeric"
          maxLength={5}
          editable={!locked}
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
      <SignOutButton />
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: '2.5%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingVertical: '3%',
    paddingHorizontal: '2.5%',
    fontSize: 18,
    color: '#333',
  },
  submitText: {
    color: '#333',
    fontSize: 17,
    textAlign: 'center'
  }
});

export default withAuthenticator(App);