import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar, Button} from 'react-native-elements';
import {useTag} from '../hooks/ApiHooks';
import {guestUserId, uploadsURL} from '../utils/Variables';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
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

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsURL + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar();
  }, []);

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

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, aspectRatio: 1},
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
