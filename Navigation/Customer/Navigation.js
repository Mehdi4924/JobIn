import React, {useState, useEffect} from 'react';
import {View,Text} from 'react-native';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import colors from '../../Constants/colors';
import {Icon,Badge} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CAuthNav from './CAuthNav';
import CSideBar from './CDrawer';
import Dashboard from '../../Screens/Customer/Interface/Dashboard';
import AllServiceProviders from '../../Screens/Customer/Interface/AllServiceProviders';
import WishList from '../../Screens/Customer/Interface/WishList';
import CustomerProfile from '../../Screens/Customer/Interface/CustomerProfile';
import ServiceProviderDetails from '../../Screens/Customer/Interface/ServiceProviderDetails';
import DashboardChangePass from '../../Screens/Customer/Interface/DashboardChangePass';
import AddAddress from '../../Screens/Customer/Interface/AddAddress';
import SearchProfessional from '../../Screens/Customer/Interface/SearchProfessional';
import SearchResults from '../../Screens/Customer/Interface/SearchResults';
import CustomerNotifications from '../../Screens/Customer/Interface/CustomerNotifications';
import CustomerChat from '../../Screens/Customer/Interface/CustomerChat';
import EditCustomerProfile from '../../Screens/Customer/Interface/EditCustomerProfile';
import CustomerAllChats from '../../Screens/Customer/Interface/CustomerAllChats';
import SearchBarResults from '../../Screens/Customer/Interface/SearchBarResults';
import axios from 'axios';
import Toast from 'react-native-simple-toast'
import URL from '../../Constants/URL';
const Stack = createStackNavigator();
const drawer = createDrawerNavigator();
const MainStack = createStackNavigator();

function Main({navigation}) {
  const [Count, setCount] = useState(0)
  useEffect(() => {
    getData();
    getNotification();
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
        name="Dashboard"
        component={Dashboard}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            elevation: 2,
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          headerTitle: '',
          headerLeft: () => (
            <View>
              <Icon
                name={'filter-variant'}
                type={'material-community'}
                color={colors.customer.secondary}
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
                  color={colors.customer.secondary}
                  size={25}
                  onPress={() => navigation.navigate('CustomerNotifications')}
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
            
            marginHorizontal: 20,
          },
          headerRightContainerStyle: {
          
            marginHorizontal: 20,
          },
        })}
      />
      {/* ............................. Add Address Screen....................... */}

      <MainStack.Screen
        name="AddAddress"
        component={AddAddress}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Address',
          headerLeft: () => (
            <View>
              <Icon
                name={'filter-variant'}
                type={'material-community'}
                color={colors.customer.secondary}
                size={25}
                onPress={() => navigation.toggleDrawer()}
              />
            </View>
          ),

          headerLeftContainerStyle: {
            marginTop: hp(2),
            marginLeft: wp(4),
            elevation: 3,
          },

          headerTitleStyle: {
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            marginTop: hp(2),
          },
        })}
      />
    </MainStack.Navigator>
  );
}

function Drawer(navigation) {
  return (
    <drawer.Navigator drawerContent={props => <CSideBar {...props} />}>
      <drawer.Screen
        component={Main}
        name="Main"
        // options={{ headerShown: false }}
      />
    </drawer.Navigator>
  );
}

export default function CustomerNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CAuthNav"
        component={CAuthNav}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Drawer"
        component={Drawer}
        options={{headerShown: false}}
      />
      {/* ............................. All Service Providers Screen....................... */}

      <Stack.Screen
        name="AllServiceProviders"
        component={AllServiceProviders}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            elevation: 2,
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          headerTitle: 'All Service Provider',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.customer.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            
            marginHorizontal: 20,
          },
          headerTitleStyle: {
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
          },
        })}
      />
      {/* ............................. WishList Screen....................... */}

      <Stack.Screen
        name="WishList"
        component={WishList}
        // options={{headerShown: false}}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          // headerTitle: '',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Search Bar Results Screen....................... */}

      <Stack.Screen
        name="SearchBarResults"
        component={SearchBarResults}
        // options={{headerShown: false}}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Results',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Customer Profile Screen....................... */}

      <Stack.Screen
        name="CustomerProfile"
        component={CustomerProfile}
        options={({navigation}) => ({
          // swipeEnabled: false,

          // gestureEnabled: false,
          // edgeWidth: -100,
          // drawerLockMode: 'locked-open',
          headerStyle: {
            height: hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
            backgroundColor: colors.customer.primary,
          },
          headerTitle: 'Profile',
          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
                color={colors.customer.secondary}
                size={25}
                onPress={() => navigation.navigate('EditCustomerProfile')}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Service Provider Detail Screen....................... */}

      <Stack.Screen
        name="ServiceProviderDetails"
        component={ServiceProviderDetails}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            elevation: 0,
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <View>
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
      {/* ............................. Change Pass Screen....................... */}
      <Stack.Screen
        name="DashboardChangePass"
        component={DashboardChangePass}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Change Password',

          headerLeft: () => (
            <View>
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />

      {/* ............................. Search Professional Screen....................... */}

      <Stack.Screen
        name="SearchProfessional"
        component={SearchProfessional}
        options={{headerShown: false}}
      />
      {/* ............................. Search Results Screen....................... */}
      <Stack.Screen
        name="SearchResults"
        component={SearchResults}
        options={{headerShown: false}}
      />
      {/* ............................. Customer Notifications Screen....................... */}
      <Stack.Screen
        name="CustomerNotifications"
        component={CustomerNotifications}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Notifications',
          headerLeft: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Customer Chat Screen....................... */}
      <Stack.Screen
        name="CustomerChat"
        component={CustomerChat}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Chat Person',
          headerLeft: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
      {/* ............................. Edit Customer Profile Screen....................... */}

      <Stack.Screen
        name="EditCustomerProfile"
        component={EditCustomerProfile}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Edit Profile',
          headerLeft: () => {},
          headerRight: () => (
            <View>
              <Icon
                name={'close'}
                type={'material-community'}
                color={colors.customer.secondary}
                size={25}
                onPress={() => navigation.dispatch(CommonActions.goBack())}
              />
            </View>
          ),
          headerLeftContainerStyle: {
            // marginTop: hp(2),
            marginRight: wp(4),
          },
          headerRightContainerStyle: {
            // marginTop: hp(2),
            marginRight: wp(4),
          },
          headerTitleStyle: {
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />

      {/* ............................. Customer All Chat Screen....................... */}
      <Stack.Screen
        name="CustomerAllChats"
        component={CustomerAllChats}
        options={({navigation}) => ({
          headerStyle: {
            elevation: 5,
            height:hp(9),
            shadowOffset: { width: 1, height: 2 },
            shadowColor:'black',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            backgroundColor: colors.customer.primary,
          },
          // headerTransparent: true,
          headerTitle: 'Chat',

          headerLeft: () => (
            <View>
              <Icon
                name={'chevron-left'}
                type={'material-community'}
                color={colors.customer.secondary}
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
            color: colors.customer.secondary,
            fontFamily: 'Poppins-Bold',
            // marginTop: hp(2),
          },
        })}
      />
    </Stack.Navigator>
  );
}
