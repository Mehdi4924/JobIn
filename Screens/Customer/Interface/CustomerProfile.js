import React, {useEffect, useState} from 'react';
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
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const CustomerProfile = () => {
  useEffect(() => {
    getProfile();
  }, []);
  const [userData, setuserData] = useState();

  const getProfile = async () => {
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));

    console.log('Data from async', User);
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/edit-profile`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('profile Data is:---------->>>>', response);
        setuserData(response.data.successData.user);
        // console.log('user Data is:---------->>>>', userData);
      })
      .catch(error => {
        console.log(
          'Facebook Error Responce',
          JSON.parse(JSON.stringify(error)),
        );
      });
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.customer.primary,
        }}>
        {console.log('UserDTA', userData)}
        <View style={{alignItems: 'center', marginTop: hp(5)}}>
          <Image
            source={
              userData != undefined && userData.image != null
                ? {uri: userData.image}
                : require('../../../Assets/dummy.png')
            }
            style={styles.imageStyle}
          />
          {userData != undefined && userData.first_name != null ? (
            <Text style={styles.nameText}>{userData.first_name}</Text>
          ) : (
            <Text style={styles.nameText}>N/A</Text>
          )}

          {/* <Text style={styles.professionText}>Profession</Text> */}
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Email</Text>
            {userData != undefined && userData.email != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.email}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          {/* <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Gender</Text>
            {userData != undefined && userData.gender != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.gender}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View> */}
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Mobile Number</Text>
            {userData != undefined && userData.phone != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.phone}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Address</Text>
            {userData != undefined && userData.address != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.address}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: colors.customer.primary,
    // backgroundColor: 'skyblue',
  },
  imageStyle: {
    height: 100,
    width: 100,
    // alignSelf: 'center',
    borderRadius: 100,
    // backgroundColor: 'red',
    resizeMode: 'cover',
  },
  nameText: {
    color: colors.customer.secondary,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
    marginTop: hp(2),
    // alignSelf: 'center',
  },
  professionText: {
    // alignSelf: 'center',
    color: colors.customer.secondary,
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginTop:hp(2)
  },
  box: {
    width: wp(80),
    height: hp(10),
    backgroundColor: colors.customer.white,
    marginTop: hp(2),
    borderRadius: 10,
    paddingHorizontal: wp(5),
    justifyContent: 'center',
  },
  infoTextHeading: {
    fontFamily: 'Poppins-Regular',
    // fontSize: 16,
    color: colors.customer.primary,
  },
  infoText: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: colors.customer.primary,
  },
});

export default CustomerProfile;
