import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsURL} from '../utils/Variables';
import {
  Avatar,
  Button,
  Card,
  ListItem,
  Text,
  Icon, ListItem as RNEListItem,
} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser, useFavourite, useRating} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import CommentList from '../components/CommentList';

const Single = ({navigation, route}) => {
  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getFilesByTag} = useTag();
  const {getUser, checkToken} = useUser();
  const {checkFavourite, postFavourite, deleteFavourite} = useFavourite();
  const [rating, setRating] = useState({rating: 'unrated'});
  const {requestRatingByFileId} = useRating();
  const [videoRef, setVideoRef] = useState(null);

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsURL + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchRating = async () => {
    console.log(
      'ListItem.js fetchRating singleMedia.fileId: ' + file.file_id);
    const ratingData = await requestRatingByFileId(file.file_id);
    setRating(ratingData);
    console.log('ListItem.js fetchRating ratingData:', ratingData);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };
  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();
    fetchRating();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  const doCheckFavourite = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const currentUserData = await checkToken(userToken);
    const userId = currentUserData.user_id;
    const checkIsAlreadyFavourited = await checkFavourite(file.file_id, userId);
    await doFavourite(checkIsAlreadyFavourited);
  };

  const doFavourite = async (checkIsAlreadyFavourited) => {
    if (checkIsAlreadyFavourited === false) {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await postFavourite(file.file_id, userToken);
        alert(response.message);
      } catch (error) {
        console.error('Singles.js doFavourite error', error.message);
      }
    } else {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await deleteFavourite(file.file_id, userToken);
        alert(response.message);
      } catch (error) {
        console.error('Singles.js doFavourite error', error.message);
      }
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title style={styles.singleTitle}>{file.title}</Card.Title>

        <Card.Divider/>
        {file.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsURL + file.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator/>}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: uploadsURL + file.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onError={(err) => {
              console.error('video', err);
            }}
            posterSource={{uri: uploadsURL + file.screenshot}}
          />
        )}
        <Card.Divider/>
        <Card.Title style={styles.timeAdded}>{moment(file.time_added).
          format('LLL')}</Card.Title>
        <Text>{rating.rating === undefined && (
          <> <Text>
            Unrated
          </Text>
          </>
        )}
          {rating.rating === 1 && (
            <>
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
            </>
          )}
          {rating.rating === 2 && (
            <>
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
            </>
          )}
          {rating.rating === 3 && (
            <>
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />
            </>
          )}
          {rating.rating === 4 && (
            <>
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="staro"
                type="antdesign"
                size={25}
                color="#bfbfbf"
              />

            </>
          )}
          {rating.rating === 5 && (
            <>
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />
              <Icon
                name="star"
                type="antdesign"
                size={25}
                color="#FFB800"
              />

            </>
          )}</Text>
        <ListItem>
          <Text style={styles.owner}>By: {owner.username}</Text>
          {/*<Avatar source={{uri: avatar}}/>*/}
        </ListItem>
        <Text style={styles.description}>{file.description}</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Button
              buttonStyle={{
                backgroundColor: 'white',
                width: 75,
                alignSelf: 'flex-start',
              }}
              icon={
                <Icon
                  name="heart"
                  type="font-awesome"
                  size={50}
                  color="red"
                />
              }
              onPress={() => doCheckFavourite()}/>
          </View>
          <View style={{flex: 1}}>
            <Button
              buttonStyle={{
                backgroundColor: 'white',
                width: 75,
                alignSelf: 'flex-end',
              }}
              icon={
                <Icon
                  name="comment-o"
                  type="font-awesome"
                  size={50}
                  color="grey"
                />
              }
              onPress={() => navigation.push('Comment', {navigation, file})}/>
          </View>
        </View>
      </Card>

      <CommentList navigation={navigation} route={file}/>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
  singleTitle: {
    backgroundColor: '#F54029',
    color: 'white',
    // fontWeight: 'normal',
    fontSize: 18,
    marginLeft: -16,
    marginRight: -16,
  },
  timeAdded: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  owner: {
    textDecorationLine: 'underline',
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
