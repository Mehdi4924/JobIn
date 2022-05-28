import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../Screens/MainAuth/SplashScreen';
import Select from '../Screens/MainAuth/Select';
import CustomerNavigation from './Customer/Navigation';
import SPNavigation from './ServiceProvider/SPNavigation';

const MainStack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        <MainStack.Screen name="SplashScreen" component={SplashScreen} />
        <MainStack.Screen name="Select" component={Select} />
        <MainStack.Screen
          name="CustomerNavigation"
          component={CustomerNavigation}
        />
        <MainStack.Screen name="SPNavigation" component={SPNavigation} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
