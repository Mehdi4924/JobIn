import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { Icon, Divider } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../Constants/colors';

export default function SPSideBar(props) {
  const [userData, setuserData] = useState();
  const isDrawerOpen = useIsDrawerOpen();
  console.log('drawer focus check kro is sy', isDrawerOpen);

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [isDrawerOpen]),
  );

  // }, [])
  const OnLogOut = async () => {
    await AsyncStorage.removeItem('AccessToken');
    await AsyncStorage.removeItem('User');
    props.navigation.replace('SPAuthNav');
  };
  const getUser = async () => {
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    console.log('Drawer Data from async', User);
    setuserData(User);
  };
  return (
    <>
      {userData != null || userData != undefined ? (
        <View style={styles.mainView}>
          <ScrollView
            style={{ margin: wp(7), marginVertical: hp(5) }}
            showsVerticalScrollIndicator={false}>
            <Image
              source={
                userData != undefined && userData.image != null
                  ? { uri: userData.image }
                  : require('../../Assets/dummy.png')
              }
              style={styles.imageStyle}
            />
            {userData != undefined && userData.first_name != null ? (
              <Text style={styles.nameText}>{userData.first_name}</Text>
            ) : (
              <Text style={styles.nameText}>N/A</Text>
            )}

            {userData != undefined && userData.profession != null ? (
              <Text style={styles.professionText}>{userData.profession}</Text>
            ) : (
              <Text style={styles.professionText}>N/A</Text>
            )}

            <View style={{ marginVertical: hp(3) }}>

              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderDashBoard');
                }}>
                <Icon
                  name="home-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderProfile');
                }}>
                <Icon
                  name="account-circle-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderAddAddress');
                }}>
                <Icon
                  name="crosshairs"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Address</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderAllSP', {
                    routeDetails: '',
                  });
                }}>
                <Icon
                  name="account-box-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Service Provider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderWishList');
                }}>
                <Icon
                  name="heart-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Wish List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('ServiceProviderAllChats');
                }}>
                <Icon
                  name="message-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  props.navigation.navigate('DashboardSPChangePass');
                }}>
                <Icon
                  name="lock-outline"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabstyle}
                onPress={() => {
                  OnLogOut();
                }}>
                <Icon
                  name="logout-variant"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={20}
                  style={{ marginRight: wp(1) }}
                />
                <Text style={styles.screentxt}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mainView}>
          <ScrollView
            style={{ margin: wp(7), marginVertical: hp(6) }}
            showsVerticalScrollIndicator={false}>
            <Image
              source={
                userData != undefined && userData.image != null
                  ? { uri: userData.image }
                  : require('../../Assets/dummy.png')
              }
              style={styles.imageStyle}
            />
            {userData != undefined && userData.first_name != null ? (
              <Text style={styles.nameText}>{userData.first_name}</Text>
            ) : (
              <Text style={styles.nameText}>N/A</Text>
            )}

            {userData != undefined && userData.profession != null ? (
              <Text style={styles.professionText}>{userData.profession}</Text>
            ) : (
              <Text style={styles.professionText}>N/A</Text>
            )}

            <TouchableOpacity
              style={styles.tabstyle}
              onPress={() => {
                props.navigation.navigate('Dashboard');
              }}>
              <Icon
                name="home-outline"
                type="material-community"
                color={colors.customer.secondary}
                size={20}
                style={{ marginRight: wp(1) }}
              />
              <Text style={styles.screentxt}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabstyle}
              onPress={() => {
                props.navigation.replace('SPAuthNav');
              }}>
              <Icon
                name="logout-variant"
                type="material-community"
                color={colors.customer.secondary}
                size={20}
                style={{ marginRight: wp(1) }}
              />
              <Text style={styles.screentxt}>Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    // alignItems: 'flex-start',
    backgroundColor: colors.customer.primary,
    // backgroundColor: 'skyblue',
  },
  tabstyle: {
    borderBottomColor: colors.customer.secondary,
    width: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // marginVertical: wp(1),
    // backgroundColor:'red'
  },
  imageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    borderRadius: 100,
    // backgroundColor: 'red',
    resizeMode: 'cover',
  },

  nameText: {
    color: colors.customer.secondary,
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginTop: hp(2),
    alignSelf: 'center',
  },
  professionText: {
    alignSelf: 'center',
    color: colors.customer.secondary,
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginTop:hp(2)
  },
  screentxt: {
    fontSize: 18,
    // fontFamily: 'Poppins-SemiBold',
    color: colors.customer.secondary,
    margin: 8,
    fontFamily: 'Poppins-Regular',
  },

  usertxt: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    margin: 2,
  },
});
