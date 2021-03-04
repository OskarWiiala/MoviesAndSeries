import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../GlobalStyles';
import PropTypes from 'prop-types';

const SearchFiles = ({navigation, route}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} searchOnly={true} inputs={route.params.paramKey} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

SearchFiles.propTypes = {
  navigation: PropTypes.object,
};

export default SearchFiles;
