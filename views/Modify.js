import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Dropdown} from 'react-native-material-dropdown-v2';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  let data = [
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
    {value: 5}];

  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, inputs.title, inputs.description, inputs.rating, userToken);
      console.log('update response', resp);
      Alert.alert(
        'Update',
        'File updated',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset(false);
              navigation.pop();
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error('Modify.js update error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setInputs({
      title: file.title,
      description: file.description,
    });
  }, []);

  const doReset = (check) => {
    if(check === true) {
      Alert.alert(
        'Reset',
        'this review?',
        [
          {text: 'Cancel'},
          {
            title: 'Ok',
            onPress: async () => {
              try {
                reset();
                setUpdate(update + 1);
              } catch (error) {
                // notify user here?
                console.error(error);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      reset();
      setUpdate(update + 1);
    }
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text style={{alignSelf: 'center', marginBottom: 10,}} h4>Modify your review</Text>
          {/* TODO: add similar media view than Single.js */}
          <Dropdown
            style={{width: 'auto', marginLeft: 10, marginRight: 10, marginBottom: 25,}}
            label='Rate the movie/series/episode 1 - 5 stars:'
            data={data}
            onChangeText={(txt) => handleInputChange('rating', txt)}
            errorMessage={uploadErrors.rating}
          />
          <Input
            placeholder="name of the movie/series/episode"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            inputContainerStyle={{backgroundColor: '#EEEEEE'}}
            inputStyle={{paddingLeft: 10}}
            errorMessage={uploadErrors.title}
          />
          <Input
            placeholder="Your new review"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            inputContainerStyle={{backgroundColor: '#EEEEEE', marginBottom: -20,}}
            inputStyle={{paddingLeft: 10}}
            multiline={true}
            errorMessage={uploadErrors.description}
          />
          <Button titleStyle={{color: 'dodgerblue'}} buttonStyle={styles.buttonReset} title="reset" onPress={() => doReset(true)}/>
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button buttonStyle={styles.buttonUpload}
                  title="Update review"
                  onPress={doUpdate}
                  disabled={
                    uploadErrors.title !== null ||
                    uploadErrors.description !== null
                  } />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonReset: {
    alignSelf: 'flex-end',
    marginRight: 10,
    backgroundColor: 'white',
    width: 'auto',
    height: 'auto',
  },
  buttonChoose: {
    marginBottom: 25,
    backgroundColor: '#F54029',
    width: 150,
    alignSelf: 'center',
    height: 50,
  },
  buttonUpload: {
    marginRight: 10,
    backgroundColor: '#F54029',
    height: 50,
    marginLeft: 12,
  },

});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
