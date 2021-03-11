import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View, Text} from 'react-native';
import List, { selectedFromHome } from '../components/List';
import PropTypes from 'prop-types';
import {Input, Button} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({itemvalue: ''});
  const {inputs, handleInputChange} = useSearchForm();
  console.log(selected);

  const setSelectedForList = async () => {
    try {
      console.log("home", selected);
      await AsyncStorage.setItem('selected', selected);
    }catch (error) {
      console.error(error.message);
    }
  }

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
          <Picker onPress={setSelectedForList()} style={styles.picker}
            selectedValue={selected}
            onValueChange={(itemvalue) =>
              setSelected(itemvalue)
            }
          >
            <Picker.Item label="Newest" value="newest" />
            <Picker.Item label="Oldest" value="oldest" />
          </Picker>
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
