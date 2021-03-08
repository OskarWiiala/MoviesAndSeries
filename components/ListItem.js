import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsURL} from '../utils/Variables';
import {Avatar, Icon, ListItem as RNEListItem} from 'react-native-elements';
import {Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useUser, useRating} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import Single from '../views/Single';
import {Text} from 'react-native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  // console.log(props);
  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);
  const [owner, setOwner] = useState({username: 'somebody'});
  const [rating, setRating] = useState({rating: 'unrated'});
  const {getUser} = useUser();
  const {requestRatingByFileId} = useRating();

  const doDelete = () => {
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
              await deleteFile(singleMedia.file_id, userToken);
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
  };

  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(singleMedia.user_id, userToken);
      console.log('ismyFile: ' + isMyFile);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchRating = async () => {
    console.log(
      'ListItem.js fetchRating singleMedia.fileId: ' + singleMedia.file_id);
    const ratingData = await requestRatingByFileId(singleMedia.file_id);
    setRating(ratingData);
    console.log('ListItem.js fetchRating ratingData:', ratingData);
  };

  useEffect(() => {
    fetchOwner();
    fetchRating();
  }, []);
  return (
    <RNEListItem style={styles.Item}>
      <RNEListItem.Content style={styles.Content}>
        <RNEListItem.Title style={styles.Title}>
          {singleMedia.title}
        </RNEListItem.Title>
        <Avatar
          style={styles.Image}
          size="large"
          square
          source={{uri: uploadsURL + singleMedia.thumbnails.w160}}
        />
        <RNEListItem.Subtitle style={styles.rating}>
          {rating.rating === undefined && (
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
          )}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle style={styles.ReviewUser}>
          <Text>Reviewed by: </Text>
          {owner.username}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle numberOfLines={3} style={styles.desc}>
          {singleMedia.description}
        </RNEListItem.Subtitle>

        <RNEListItem style={styles.reviewButton}>
          <Button
            color="#F54029"
            title="See review"
            onPress={() => {
              navigation.navigate('Single', {file: singleMedia});
            }}
          />
        </RNEListItem>
        <RNEListItem style={styles.ownerButtons}>
          {isMyFile && (
            <>
              <Button
                paddingRight="100"
                title="Modify"
                onPress={() => navigation.push('Modify',
                  {navigation, file: singleMedia})}
              />
              <Button
                // style={styles.buttonD}
                title="Delete"
                color="red"
                onPress={doDelete}
              />
            </>
          )}
        </RNEListItem>
      </RNEListItem.Content>
      <RNEListItem.Chevron/>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  ownerButtons: {
    alignSelf: 'flex-start',
  },
  Content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',

    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 0,
  },
  reviewButton: {
    paddingBottom: 20,
    elevation: 12,
  },
  rating: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: 'black',
    marginLeft: 20,
    elevation: 12,
  },
  Image: {
    width: 300,
    height: 100,
    flex: 2,
  },
  Title: {
    color: 'black',
    fontSize: 25,
    justifyContent: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  desc: {
    fontSize: 17,
    color: 'black',
    paddingTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  ReviewUser: {
    fontSize: 17,
    color: 'black',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
