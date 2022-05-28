import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Image, View, Text } from 'react-native';
import { Icon, SearchBar, Badge } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../Constants/colors';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SPSideBar from './SPDrawer';
import SPAuthNav from './SPAuthNav';

import ServiceProviderDashBoard from '../../Screens/Service Provider/Interface/ServiceProviderDashBoard';
import ServiceProviderAddAddress from '../../Screens/Service Provider/Interface/ServiceProviderAddAddress';
import ServiceProviderAllChats from '../../Screens/Service Provider/Interface/ServiceProviderAllChats';
import ServiceProviderChat from '../../Screens/Service Provider/Interface/ServiceProviderChat';
import ServiceProviderNotifications from '../../Screens/Service Provider/Interface/ServiceProviderNotifications';
import ServiceProviderProfile from '../../Screens/Service Provider/Interface/ServiceProviderProfile';
import DashboardSPChangePass from '../../Screens/Service Provider/Interface/DashboardSPChangePass';
import EditServiceProviderProfile from '../../Screens/Service Provider/Interface/EditServiceProviderProfile';
import ServiceProviderSearchProfessional from '../../Screens/Service Provider/Interface/ServiceProviderSearchProfessional';
import ServiceProviderSearchResults from '../../Screens/Service Provider/Interface/ServiceProviderSearchResults';
import SPDetails from '../../Screens/Service Provider/Interface/SPDetails';
import ServiceProviderWishList from '../../Screens/Service Provider/Interface/ServiceProviderWishList';
import ServiceProviderAllSP from '../../Screens/Service Provider/Interface/ServiceProviderAllSP';
import SPSearchBarResults from '../../Screens/Service Provider/Interface/SPSearchBarResults';
import axios from 'axios';
import Toast from 'react-native-simple-toast'
import URL from '../../Constants/URL';

const Stack = createStackNavigator();
const drawer = createDrawerNavigator();
const MainStack = createStackNavigator();

function Main({ navigation }) {
  const [Count, setCount] = useState(0)
  useEffect(() => {
    getData();
    getNotification()
  }, []);
  const [ID, setID] = useState();

  const getData = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    user != null ? setID(user.id) : null;
  };

  const getNotification = async (lat, lng) => {
    // setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(URL + '/unread-notification', {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All Notification api Response', response);
        setCount(response.data.successData.count)
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        Toast.show(error.response.data.message, Toast.SHORT);
        // setIndicator(false);
      });
  };
  return (
    <MainStack.Navigator>
      {/* ............................. DashBoard Screen....................... */}
      <MainStack.Screen
        name="ServiceProviderDashBoard"
        component={ServiceProviderDashBoard}
        options={({ navigation }) => ({
          headerStyle: {
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            // borderBottomLeftRadius:20,
            // borderBottomRightRadius:20,
            backgroundColor: colors.serviceProvider.white,
          },
          headerTitle: '',
          headerLeft: () => (
            <View>
              <Icon
                name={'filter-variant'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </View>
          ),
          headerRight: () =>
            ID != null ? (
              <View>
                <Icon
                  name={'bell-outline'}
                  type={'material-community'}
                  color={colors.serviceProvider.secondary}
                  size={25}
                  onPress={() =>
                    navigation.navigate('ServiceProviderNotifications')
                  }
                />
                {Count >=1 ?
                <Badge
                  status="success"
                  value={Count}
                  containerStyle={{ position: 'absolute', top: -3, right: -4 }}
                />
                :
                <></>
                }
              </View>
            ) : null,
          headerLeftContainerStyle: {
            // padding: 5,
            // marginVertical: hp(2),
            marginHorizontal: 20,
          },
          headerRightContainerStyle: {
            // marginVertical: hp(2),
            // padding: 5,
            marginHorizontal: 20,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Add Address Screen....................... */}
      <MainStack.Screen
        name="ServiceProviderAddAddress"
        component={ServiceProviderAddAddress}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            // shadowOffset: { width: 1, height: 2 },
            // shadowColor:'black',
            // shadowOpacity: 0.3,
            // shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Address',
          headerLeft: () => (
            <View>
              <Icon
                name={'filter-variant'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),

          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
            elevation: 3,
          },

          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
    </MainStack.Navigator>
  );
}

function SPDrawer(navigation) {
  return (
    <drawer.Navigator drawerContent={props => <SPSideBar {...props} />}>
      <drawer.Screen
        component={Main}
        name="Main"
      // options={{ headerShown: false }}
      />
    </drawer.Navigator>
  );
}

export default function SPNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SPAuthNav"
        component={SPAuthNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SPDrawer"
        component={SPDrawer}
        options={{ headerShown: false }}
      />
      {/* ............................. All Service Providers Screen....................... */}

      <Stack.Screen
        name="ServiceProviderAllSP"
        component={ServiceProviderAllSP}
        options={({ navigation }) => ({
          headerStyle: {
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
            backgroundColor: colors.serviceProvider.primary,
          },
          headerTitle: 'All Service Provider',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // padding: 5,
            // marginVertical: hp(2),
            marginHorizontal: 20,
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />

      {/* ............................. Service Provider All Chat Screen....................... */}
      <Stack.Screen
        name="ServiceProviderAllChats"
        component={ServiceProviderAllChats}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Chat',

          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(1),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(1),
          },
        })}
      />
      {/* ............................. Service Provider Chat Screen....................... */}
      <Stack.Screen
        name="ServiceProviderChat"
        component={ServiceProviderChat}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Chat Person',
          headerLeft: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Customer Notifications Screen....................... */}
      <Stack.Screen
        name="ServiceProviderNotifications"
        component={ServiceProviderNotifications}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Notifications',
          headerLeft: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Search Bar Results Screen....................... */}

      <Stack.Screen
        name="SPSearchBarResults"
        component={SPSearchBarResults}
        // options={{headerShown: false}}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Results',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Customer Profile Screen....................... */}

      <Stack.Screen
        name="ServiceProviderProfile"
        component={ServiceProviderProfile}
        options={({ navigation }) => ({
          headerStyle: {
            height: hp(7),
            elevation: 2,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          headerTitle: 'Profile',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerRight: () => (
            <View>
              <Icon
                name={'pencil-outline'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() =>
                  navigation.navigate('EditServiceProviderProfile')
                }
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // padding: 5,
            // marginVertical: hp(2),
            marginHorizontal: 20,
          },
          headerRightContainerStyle: {
            // marginVertical: hp(2),
            // padding: 5,
            marginHorizontal: 20,
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Change Pass Screen....................... */}
      <Stack.Screen
        name="DashboardSPChangePass"
        component={DashboardSPChangePass}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Change Password',

          headerLeft: () => (
            <View>
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Edit Service Provider Profile Screen....................... */}

      <Stack.Screen
        name="EditServiceProviderProfile"
        component={EditServiceProviderProfile}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Edit Profile',
          headerLeft: () => { },
          headerRight: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerRightContainerStyle: {
            // marginTop: hp(2),
            marginRight: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Search Professional Screen....................... */}

      <Stack.Screen
        name="ServiceProviderSearchProfessional"
        component={ServiceProviderSearchProfessional}
        options={{ headerShown: false }}
      />
      {/* ............................. Service Provider Search Results Screen....................... */}
      <Stack.Screen
        name="ServiceProviderSearchResults"
        component={ServiceProviderSearchResults}
        options={{ headerShown: false }}
      />
      {/* ............................. Service Provider Detail Screen....................... */}

      <Stack.Screen
        name="SPDetails"
        component={SPDetails}
        options={({ navigation }) => ({
          headerStyle: {
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 0,
            backgroundColor: colors.customer.primary,
          },
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <View>
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
        })}
      />
      {/* ............................. Service Provider WishList Screen....................... */}

      <Stack.Screen
        name="ServiceProviderWishList"
        component={ServiceProviderWishList}
        // options={{headerShown: false}}
        options={({ navigation }) => ({
          headerStyle: {
            elevation: 5,
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.serviceProvider.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Wish List',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.serviceProvider.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginLeft: wp(4),
          },
          headerTitleStyle: {
            color: colors.serviceProvider.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
    </Stack.Navigator>
  );
}
