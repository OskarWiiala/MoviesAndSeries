import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert, StatusBar, SafeAreaView,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment} from '../hooks/ApiHooks';
import {Card, ListItem, Text, Button, Input} from 'react-native-elements';
import useCommentForm from '../hooks/CommentHooks';



const Comment = ({navigation, route}) => {
  const {file} = route.params;
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useCommentForm();
  const {postComment} = useComment();
  const {update, setUpdate} = useContext(MainContext);

  const doComment = async (inputs) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await postComment(file.file_id, inputs, userToken);
      Alert.alert(
        'Comment',
        `${response.message}`,
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Single');
            },
          },
        ],
        {cancelable: false},
      );

    } catch (error) {
      console.error('Comment.js doComment error', error.message);
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="Write your comment here..."
        onChangeText={(txt) => handleInputChange('comment', txt)}
        inputContainerStyle={{backgroundColor: '#EEEEEE', marginTop: 100,}}
        // placeholderTextColor={''}
        inputStyle={{paddingLeft: 10}}
        multiline={true}
      />

      <Button title="Send" buttonStyle={{
        backgroundColor: '#F54029',
        width: 100,
        alignSelf: 'center',
      }} onPress={() => doComment(inputs)}/>
    </View>
  );
};

export default Comment;
