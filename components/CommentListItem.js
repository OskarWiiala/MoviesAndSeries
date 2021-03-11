import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button, StyleSheet} from 'react-native';
import {useUser, useComment} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import Single from '../views/Single';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItem from './ListItem';

const CommentListItem = ({navigation, singleMedia, isMyComment}) => {
  const {deleteComment} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getUser} = useUser();

  const doDeleteComment = () => {
    Alert.alert(
      'Delete',
      'this comment permanently?',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteComment(singleMedia.comment_id, userToken);

              setUpdate(update + 1);
            } catch (error) {
              // notify user here?
              console.error('CommentListItem.js doDeleteComment:',
                error.message);
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
  useEffect(() => {
    fetchOwner();
  }, []);
  return (
    <RNEListItem>
      <RNEListItem.Content style={styles.Content}>
        <RNEListItem.Subtitle>
          {owner.username}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle>
          {singleMedia.time_added}
        </RNEListItem.Subtitle>
        <RNEListItem.Title>
          {singleMedia.comment}
        </RNEListItem.Title>
        <RNEListItem style={styles.deleteButton}>
          {isMyComment && (
            <>
              <Button
                // style={styles.buttonD}
                title="Delete"
                color="red"
                onPress={doDeleteComment}
              />
            </>
          )}
        </RNEListItem>
      </RNEListItem.Content>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    alignSelf: 'center',
  },
  Content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',

    marginLeft: 5,
    marginRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
});

CommentListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};
export default CommentListItem;
