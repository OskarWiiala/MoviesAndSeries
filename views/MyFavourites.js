import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../GlobalStyles';
import PropTypes from 'prop-types';

const MyFavourites = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} myFilesOnly={false} myFavouritesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

MyFavourites.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavourites;
