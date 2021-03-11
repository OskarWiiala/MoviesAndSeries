import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar, Button} from 'react-native-elements';
import {useAvatar, useMedia, useTag} from '../hooks/ApiHooks';
import {uploadsURL, guestUserId} from '../utils/Variables';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('https://cdn.discordapp.com/attachments/556437496158879746/818575758016118854/UX_-_Figma_-_Profile.png');
  const {deleteAvatar} = useAvatar();
  const [file_id, setFile_id] = useState('');
  const {setUpdate, update} = useContext(MainContext);
  const [avatarlist, setAvatarlist] = useState("");
  console.log(user.user_id);
  fetchAvatar(setAvatar, setFile_id, setAvatarlist);


  const logout = async () => {
    console.log('we get here 1');
    setIsLoggedIn(false);
    console.log('we get here 2');
    await AsyncStorage.clear();
    console.log('we get here 3');
    navigation.navigate('Login');
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      console.log('we get here 4');
      navigation.navigate('Login');

    }
  };

  const doDelete = () => {
    if (user.user_id !== guestUserId) {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              if (avatarlist.length == 1) {
                avatarlist.pop().clear();
                fetchAvatar();
              } else {
              await deleteAvatar(file_id, userToken);
              setUpdate(update + 1);
            }
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      {cancelable: false},
    );
    } else {
      alert('You must log in to use this feature');
    }
  };

  const enterFavourites = () => {
    try {
      console.log('Profile.js enterFavourites user_id:', user.user_id);
      if (user.user_id === guestUserId) {
        alert(
          'You must be logged in on a real account to access personal favourites');
      } else {
        navigation.push('MyFavourites');
      }
    } catch (error) {
      console.error('Profile.js enterMyFavourites error:', error);
    }
  };

  const enterMyFiles = () => {
    try {
      console.log('Profile.js enterMyFiles user_id:', user.user_id);
      if (user.user_id === guestUserId) {
        alert(
          'You must be logged in on a real account to access personal files');
      } else {
        navigation.push('My Files');
      }
    } catch (error) {
      console.error('Profile.js enterMyFiles error:', error);
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title>
          <Text h1>{user.username}</Text>
        </Card.Title>
        <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator/>}
        />
        <ListItem style={styles.uploadAvatar}>
        <Button color="red" onPress={() => {
          if(user.user_id !== guestUserId) {
          if(avatar != 'https://cdn.discordapp.com/attachments/556437496158879746/818575758016118854/UX_-_Figma_-_Profile.png') {
            Alert.alert("Delete previous avatar first!")
          } else {
              navigation.navigate('UploadAvatar');
            }
            } else {
            alert('You must log in to use this feature')
          }
        }}
            title="Upload avatar"></Button>

        <Button color="red"
                title="Delete avatar"
                onPress={doDelete}
              />
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'email', color: 'black'}}/>
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}}/>
          <Text>{user.full_name}</Text>
        </ListItem>
        <ListItem bottomDivider onPress={enterMyFiles}>
          <Avatar icon={{name: 'perm-media', color: 'black'}}/>
          <ListItem.Content>
            <ListItem.Title>My Files</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron/>
        </ListItem>
        <ListItem bottomDivider onPress={enterFavourites}>
          <Avatar icon={{name: 'heart', type: 'font-awesome', color: 'black'}}/>
          <ListItem.Content>
            <ListItem.Title>My Favourites</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron/>
        </ListItem>
        <ListItem bottomDivider onPress={logout}>
          <Avatar icon={{name: 'logout', color: 'black'}}/>
          <ListItem.Content>
            <ListItem.Title>Logout</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron/>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const fetchAvatar = async (setAvatar, setFile_id, setAvatarlist) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  try {
    const avatarList = await getFilesByTag('avatar_' + user.user_id);
    if (avatarList.length > 1) {
      setAvatar(uploadsURL + avatarList.pop().filename);
      console.log("avatarid", setFile_id);
      setFile_id(avatarList.pop().file_id);
      setAvatarlist(avatarList.length);
    } else if (avatarList.length == 1) {
      setAvatar('https://cdn.discordapp.com/attachments/556437496158879746/818575758016118854/UX_-_Figma_-_Profile.png');
    }
  } catch (error) {
    console.error(error.message);
  }
  console.log("fetch", setAvatar);
  return setAvatar;
};

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, aspectRatio: 1},

  uploadAvatar: {
    alignItems: 'center',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export{fetchAvatar};

export default Profile;
