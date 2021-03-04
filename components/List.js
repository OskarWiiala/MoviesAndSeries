import React, {useContext} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {MainProvider} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly, searchOnly, inputs}) => {
  const {isLoggedIn, user} = useContext(MainContext);
  const {mediaArray} = useLoadMedia(myFilesOnly, user.user_id, searchOnly, inputs);

  if (isLoggedIn) {
    return (
      <FlatList
        style={{width: '100%', height: '80%'}}
        data={mediaArray.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ListItem
            navigation={navigation}
            singleMedia={item}
            isMyFile={item.user_id === user.user_id}
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
          <ListItem
            navigation={navigation}
            singleMedia={item}
          />
        )}
      />
    );
  }
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
