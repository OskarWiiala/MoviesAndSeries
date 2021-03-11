import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsURL} from '../utils/Variables';
import {
  Avatar,
  Icon,
  ListItem as RNEListItem,
  Button,
} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useUser, useRating} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import Single from '../views/Single';
import {Text} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  // console.log(props);
  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);
  const [owner, setOwner] = useState({username: 'somebody'});
  const [rating, setRating] = useState({rating: 'unrated'});
  const {getUser} = useUser();
  const {requestRatingByFileId} = useRating();
  const isFocused = useIsFocused();

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
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchRating = async () => {
    // console.log(
    // 'ListItem.js fetchRating singleMedia.fileId: ' + singleMedia.file_id);
    const ratingData = await requestRatingByFileId(singleMedia.file_id);
    setRating(ratingData);
    // console.log('ListItem.js fetchRating ratingData:', ratingData);
  };

  const fetchAll = async () => {
    console.log('ListItem.js fetchAll isFocused:', isFocused)
    await fetchOwner();
    await fetchRating();
  };

  useFocusEffect(React.useCallback(() => {
    fetchOwner();
    fetchRating();
    console.log('Listitem.js isFocused', isFocused);
  }, [isFocused]));
  return (
    <RNEListItem>
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

        </RNEListItem.Subtitle>

        <RNEListItem.Subtitle style={styles.reviewBy}>
          <Text>reviewed by:</Text>
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle style={styles.reviewUser}>
          {owner.username}
        </RNEListItem.Subtitle>
        <RNEListItem style={styles.line}/>
        <RNEListItem.Subtitle numberOfLines={3} style={styles.desc}>
          {singleMedia.description}
        </RNEListItem.Subtitle>

        <RNEListItem style={styles.reviewButtonContainer}>
          <Button buttonStyle={styles.reviewButton}
                  containerStyle={{elevation: 6}}
                  titleStyle={{fontSize: 22}}
                  title='See review'
                  onPress={() => {
                    navigation.navigate('Single', {file: singleMedia});
                  }}
          />
        </RNEListItem>
        {isMyFile && (
          <RNEListItem style={styles.ownerButtons}>
            <>
              <Button
                buttonStyle={styles.ownerButtonStyle}
                titleStyle={{color: 'dodgerblue'}}
                title="Modify"
                onPress={() => navigation.push('Modify',
                  {navigation, file: singleMedia})}
              />
              <Button
                buttonStyle={styles.ownerButtonStyle}
                titleStyle={{color: 'dodgerblue'}}
                title="Delete"
                onPress={doDelete}
              />
            </>
          </RNEListItem>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron/>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  ownerButtons: {
    alignItems: 'center',
  },
  ownerButtonStyle: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
  },
  Content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    borderColor: 'grey',
  },
  reviewButtonContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',

  },
  reviewButton: {
    backgroundColor: '#F54029',
    width: '100%',
    height: 60,
  },
  rating: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: 'black',
    marginLeft: 20,
    elevation: 12,
    marginTop: 10,
    marginBottom: 15,
    // backgroundColor: 'none',
  },
  Image: {
    marginTop: 15,
    marginBottom: 15,
    width: 300,
    height: 100,
    flex: 2,
  },
  Title: {
    backgroundColor: '#F54029',
    color: 'white',
    height: 'auto',
    width: '100%',
    fontSize: 25,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    // paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  desc: {
    fontSize: 22,
    color: 'black',
    paddingTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  reviewBy: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontSize: 14,
    color: 'grey',
  },
  reviewUser: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontSize: 17,
    color: 'black',
  },
  line: {
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    width: '90%',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
