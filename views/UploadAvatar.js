import { UserInterfaceIdiom } from 'expo-constants';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Input, Image, Button, Card} from 'react-native-elements';
import { useAvatar, useMedia, useTag } from '../hooks/ApiHooks';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../utils/Variables';
import { Video } from 'expo-av';
import { MainContext } from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile, { fetchAvatar } from '../views/Profile';


const UploadAvatar = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const {updateAvatar} = useAvatar();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const doUpload = async () => {
    const formData = new FormData();
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
      const resp = await updateAvatar(formData, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: 'avatar_' + user.user_id,
        },
        userToken,
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'Avatar uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              fetchAvatar("avatar");
              navigation.navigate('Profile');
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
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          {image && (
            <>
              {filetype === 'image' ? (
                <Image
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1, marginBottom: 25,}}
                />
              ) : (
                <Video
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1, marginBottom: 25,}}
                  useNativeControls={true}
                />
              )}
            </>
          )}
          <Text style={{alignSelf: 'center', marginBottom: 15,}}>Choose image/video from:</Text>
          <View style={{flexDirection: 'row',}}>
            <View style={{flex: 1,}}>
          <Button buttonStyle={styles.buttonChoose} title="Device" onPress={() => pickImage(true)}/>
            </View>
            <View style={{flex: 1}}>
          <Button buttonStyle={styles.buttonChoose} title="Camera" onPress={() => pickImage(false)}/>
            </View>
          </View>
          {isUploading && <ActivityIndicator size="large" color="#0000ff"/>}
          <Button buttonStyle={styles.buttonUpload}
            title="Upload avatar"
            onPress={doUpload}
            disabled={
              image === null
            }
          />

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


UploadAvatar.propTypes = {
  navigation: PropTypes.object,
};

export default UploadAvatar;
