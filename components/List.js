import React, {useContext, useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {MainProvider} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../views/Home';

/** Makes the review list for home page */
const List = ({navigation, myFilesOnly, searchOnly, inputs, myFavouritesOnly}) => {
  const {isLoggedIn, user} = useContext(MainContext);
  const {mediaArray} = useLoadMedia(myFilesOnly, user.user_id, searchOnly, inputs, myFavouritesOnly,);

  if (isLoggedIn) {
    return (
      <FlatList
        style={{width: '100%', height: '80%'}}
        data={mediaArray}
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
        data={mediaArray}
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
  }
};



List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
