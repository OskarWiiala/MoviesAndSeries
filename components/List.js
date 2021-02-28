import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {MainProvider} from '../contexts/MainContext'

const List = ({navigation, myFilesOnly}) => {
  const {isLoggedIn, user} = useContext(MainContext);
  const mediaArray = useLoadMedia(myFilesOnly, user.user_id);

  if(isLoggedIn) {
    return (
      <FlatList
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
