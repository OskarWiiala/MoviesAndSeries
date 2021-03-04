import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../GlobalStyles';
import PropTypes from 'prop-types';
import {Card, SearchBar} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';

const Home = ({navigation}) => {
  const {inputs, handleInputChange} = useSearchForm();

  const doSearch = async () => {
    try {

    } catch {

    }
  };

  return (
    <View>
      <SearchBar style={styles.searchBar} placeholderTextColor='white'
                 placeholder="Type Here..."
                 onChangeText={(txt) => handleInputChange('text', txt)}
      />

      <List style={styles.Title} navigation={navigation} myFilesOnly={false}/>

      <StatusBar style="auto"/>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    // placeholder: 'search'
  },
  Title: {

  }
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
