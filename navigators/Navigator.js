import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from 'react-native-elements';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import SearchFiles from '../views/SearchFiles';
import MyFavourites from '../views/MyFavourites';
import Modify from '../views/Modify';
import Comment from '../views/Comment';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Image} from 'react-native';
import UploadAvatar from '../views/UploadAvatar';

//** Navigator for different pages */

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'account-box';
              break;
            case 'Upload':
              iconName = 'cloud-upload';
              break;
          }
          return <Icon name={iconName} size={size} color={color}/>;
        },
      })}
      tabBarOptions={{
        style: {backgroundColor: '#212121'},
        activeTintColor: '#F54029',
        inactiveTintColor: 'white',
        showIcon: true,
      }}
    >
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Profile" component={Profile}/>
      <Tab.Screen name="Upload" component={Upload}/>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabScreen}
            options={({route}) => ({
              headerTitle: getFocusedRouteNameFromRoute(route),
              headerShown: false,
            })}
          />
          <Stack.Screen name="Modify" component={Modify}/>
          <Stack.Screen name="My Files" component={MyFiles}/>
          <Stack.Screen name="SearchFiles" component={SearchFiles}/>
          <Stack.Screen name="MyFavourites" component={MyFavourites}/>
          <Stack.Screen name="Comment" component={Comment}/>
          <Stack.Screen name="Single" component={Single}/>
          <Stack.Screen name="UploadAvatar" component={UploadAvatar}/>
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen name="Single" component={Single}/>
          <Tab.Screen name="Home" component={Home}/>
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen/>
    </NavigationContainer>
  );
};

export default Navigator;
