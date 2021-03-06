import React, { useEffect, useState } from 'react';
import {Alert, View} from 'react-native';
import PropTypes from 'prop-types';
import {useLogin, useUser} from '../hooks/ApiHooks';
import useSignUpForm from '../hooks/RegisterHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Input, Button} from 'react-native-elements';

/** Makes the register form */
const RegisterForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    validateOnSend,
    checkUserAvailable,
    registerErrors,
    checkPasswordMatch,
  } = useSignUpForm();
  const {postRegister} = useUser();
  const {postLogin} = useLogin();

  const doRegister = async () => {
    if(!validateOnSend()) {
      Alert.alert('input validation failed')
      console.log('RegisterForm.js validateOnSend failed')
    }else {
    delete inputs.confirmPassword;
    try {
      const result = await postRegister(inputs);
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      // do automatic login after registering
      const userData = await postLogin(inputs);
      await AsyncStorage.setItem('userToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (error) {
      console.log('registration error', error);
      Alert.alert(error.message);
    }
  }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          // console.log(event.nativeEvent.text);
          checkUserAvailable(event);
          handleInputEnd('username', event.nativeEvent.text)
        }}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
        errorMessage={registerErrors.username}
      />
      <Input
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) => handleInputEnd('password', event.nativeEvent.text)}
        secureTextEntry={true}
        errorMessage={registerErrors.password}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
      />
      <Input
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={(event) => handleInputEnd('confirmPassword', event.nativeEvent.text)}
        onEndEditing={(event) => checkPasswordMatch('confirmPassword', event.nativeEvent.text)}
        secureTextEntry={true}
        errorMessage={registerErrors.confirmPassword}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
      />
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => handleInputEnd('email', event.nativeEvent.text)}
        errorMessage={registerErrors.email}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
      />
      <Input
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) => handleInputEnd('full_name', event.nativeEvent.text)}
        errorMessage={registerErrors.full_name}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
      />
      <Button title="Register!" buttonStyle={{backgroundColor: '#F54029', width: 100, alignSelf: 'center', marginRight: 10}} onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object
};

export default RegisterForm;
