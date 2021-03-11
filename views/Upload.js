import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, guestUserId} from '../utils/Variables';
import {Video} from 'expo-av';
import {Dropdown} from 'react-native-material-dropdown-v2';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const {upload} = useMedia();
  const {checkToken} = useUser();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  let data = [
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
    {value: 5}];

  const checkUserId = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const userData = await checkToken(userToken);
      setUserId(userData.user_id);
      // console.log('Upload.js isUserId:', isUserId, 'Upload.js isUserId:', isUserId);
    } catch (error) {
      console.error('Navigator.js checkUserId error', error);
    }
  };
  useEffect(() => {
    checkUserId();
  }, []);

  const doUpload = async () => {
    const formData = new FormData();
    // add text to form
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // add image to formData
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, inputs.rating, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken,
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset(false);
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!',
          );
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      // console.log('pickImage result', result);
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = (check) => {
    if (check === true) {
      Alert.alert(
        'Reset',
        'this review?',
        [
          {text: 'Cancel'},
          {
            title: 'Ok',
            onPress: async () => {
              try {
                setImage(null);
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
      setImage(null);
      reset();
      setUpdate(update + 1);
    }
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        {userId !== guestUserId && (
          <Card>
            <Text style={{alignSelf: 'center', marginBottom: 10}} h4>Create a
              review</Text>
            {image && (
              <>
                {filetype === 'image' ? (
                  <Image
                    source={{uri: image}}
                    style={{
                      width: '100%',
                      height: undefined,
                      aspectRatio: 1,
                      marginBottom: 25,
                    }}
                  />
                ) : (
                  <Video
                    source={{uri: image}}
                    style={{
                      width: '100%',
                      height: undefined,
                      aspectRatio: 1,
                      marginBottom: 25,
                    }}
                    useNativeControls={true}
                  />
                )}
              </>
            )}
            <Dropdown
              style={{
                width: 'auto',
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 25,
              }}
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
              placeholder="Your review"
              value={inputs.description}
              onChangeText={(txt) => handleInputChange('description', txt)}
              inputContainerStyle={{
                backgroundColor: '#EEEEEE',
                marginBottom: -20,
              }}
              inputStyle={{paddingLeft: 10}}
              multiline={true}
              errorMessage={uploadErrors.description}
            />
            <Button titleStyle={{color: 'dodgerblue'}}
                    buttonStyle={styles.buttonReset} title="reset"
                    onPress={() => doReset(true)}/>
            <Text style={{alignSelf: 'center', marginBottom: 15}}>Choose
              image/video from:</Text>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={{flex: 1}}>
                <Button buttonStyle={styles.buttonChoose} title="Device"
                        containerStyle={{
                          elevation: 6, width: 150,
                          alignSelf: 'center',
                          height: 50,
                        }}
                        onPress={() => pickImage(true)}/>
              </View>
              <View style={{flex: 1}}>
                <Button buttonStyle={styles.buttonChoose}
                        containerStyle={{
                          elevation: 6, width: 150,
                          alignSelf: 'center',
                          height: 50,
                        }}
                        title="Camera"
                        onPress={() => pickImage(false)}/>
              </View>
            </View>
            {isUploading && <ActivityIndicator size="large" color="#0000ff"/>}
            <Button buttonStyle={styles.buttonUpload}
                    title="Upload review"
                    onPress={doUpload}
                    disabled={
                      uploadErrors.title !== null ||
                      uploadErrors.description !== null ||
                      image === null
                    }
            />

          </Card>
        )}
        {userId === guestUserId && (
          <View style={styles.guestText}>
            <View>
              <Text style={styles.messageBoxTitleText}>Log in</Text>
            </View>
            <View>
              <Text style={styles.messageBoxInfoText}>You are currently using a
                guest account and must make a real account to upload reviews.
                You can log out in the profile page.</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  messageBoxTitleText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  messageBoxInfoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  guestText: {
    backgroundColor: '#F54029',
    width: 300,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '50%',
  },
  buttonReset: {
    alignSelf: 'flex-end',
    marginRight: 10,
    backgroundColor: 'white',
    width: 'auto',
    height: 'auto',
  },
  buttonChoose: {
    // marginBottom: 25,
    backgroundColor: '#F54029',
    width: 150,
    alignSelf: 'center',
    height: 50,
  },
  buttonUpload: {
    width: '93%',
    backgroundColor: '#F54029',
    height: 50,
    marginLeft: 12,
    marginRight: 12,
    alignSelf: 'center',
  },

});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
