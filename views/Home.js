import React, {useState} from 'react';
import {Button, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../GlobalStyles';
import PropTypes from 'prop-types';
import {Input} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import {useSearch} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useSearchForm();
  const {postSearch} = useSearch();

  const doSearch = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log(inputs);
      // console.log(userToken)
      const searchData = await postSearch(inputs, userToken);
      console.log('searchData', searchData);
    } catch (error) {
      console.error('doSearch error', error);
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="Search..."
        onChangeText={(txt) => handleInputChange('title', txt)}
        inputContainerStyle={{backgroundColor: '#EEEEEE'}}
        inputStyle={{paddingLeft: 10}}
      />
      <Button title="Go" onPress={doSearch}/>
      <List navigation={navigation} myFilesOnly={false}/>
      <StatusBar style="auto"/>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    // placeholder: 'search'
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
