import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert, StatusBar, SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, ListItem, Text, Button} from 'react-native-elements';
import GlobalStyles from '../GlobalStyles';
import List from '../components/List';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        // navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.appTitle}>
            <Text h1>MoviesAndSeries</Text>
          </View>
          <View style={styles.form}>
            <Card>
              {formToggle ? (
                <>
                  <Card.Title h4>Login</Card.Title>
                  <Card.Divider/>
                  <LoginForm navigation={navigation}/>
                </>
              ) : (
                <>
                  <Card.Title h4>Register</Card.Title>
                  <Card.Divider/>
                  <RegisterForm navigation={navigation}/>
                </>
              )}
              <ListItem
                onPress={() => {
                  setFormToggle(!formToggle);
                }}
              >
                <ListItem.Content>
                  <Text style={styles.blueText}>
                    {formToggle
                      ? 'No account? Register here.'
                      : 'Already registered? Login here.'}
                  </Text>
                </ListItem.Content>
                <ListItem.Chevron/>
              </ListItem>
              <Button navigation={navigation}
                      buttonStyle={{backgroundColor: '#F54029'}}
                      title="Continue as Guest"
                      onPress={() => {navigation.navigate('Home')}}/>
            </Card>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  appTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 6,
  },
  text: {
    alignSelf: 'center',
    padding: 20,
  },
  blueText: {
    alignSelf: 'center',
    padding: 20,
    color: 'dodgerblue',
  },

});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
