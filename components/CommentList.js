import React, {useContext} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useLoadComments} from '../hooks/ApiHooks';
import CommentListItem from './CommentListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {MainProvider} from '../contexts/MainContext';

const CommentList = ({navigation, route}) => {
  // const {file} = route.params;
  const {isLoggedIn, user} = useContext(MainContext);
  const {mediaArray} = useLoadComments(route.file_id);

  if (isLoggedIn) {
    return (
      <FlatList
        style={{width: '100%', height: '80%'}}
        data={mediaArray.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <CommentListItem
            navigation={navigation}
            singleMedia={item}
            isMyComment={item.user_id === user.user_id}
          />
        )}
      />
    );
  } else {
    return (
      <FlatList
        data={mediaArray.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <CommentListItem
            navigation={navigation}
            singleMedia={item}
          />
        )}
      />
    );
  }
};
CommentList.propTypes = {
  navigation: PropTypes.object,
};

export default CommentList;
