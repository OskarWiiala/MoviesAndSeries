import React, {useState} from 'react';
import {StatusBar, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Input, Button} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useSearchForm();

  return (
    <View>
      <View style={{flexDirection: 'row', backgroundColor: '#212121'}}>
        <View style={{flex: 1}}>
          <Input
            style={{alignSelf: 'flex-start'}}
            autoCapitalize="none"
            placeholder="Search titles..."
            onChangeText={(txt) => handleInputChange('title', txt)}
            inputContainerStyle={{
              backgroundColor: 'white',
              width: '150%',
              alignSelf: 'flex-start',
              marginTop: 10,
            }}
            // placeholderTextColor={''}
            inputStyle={{paddingLeft: 10}}
          />
        </View>
        <View style={{flex: 1}}>
          <Button
            title="Go"
            buttonStyle={{
              backgroundColor: '#F54029',
              width: 100,
              marginRight: 10,
              marginTop: 10,
              alignSelf: 'flex-end',
            }}
            onPress={() =>
              navigation.push('SearchFiles', {
                paramKey: inputs,
              })
            }
          />
        </View>
      </View>
      <List navigation={navigation} myFilesOnly={false} searchOnly={false} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    // placeholder: 'search'
  },
  Title: {},

  picker: {
      color: 'white',
      backgroundColor: '#F54029',
      alignSelf: 'flex-end',
      marginRight: 10,
      marginTop: 10,
      marginBottom: 5,
      width: 125,
  }
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
