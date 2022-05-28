import React, {useState, useEffect} from 'react';
import {Text, View, Image, ScrollView, StyleSheet} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServiceProviderProfile = () => {
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
        console.log('user Data is:---------->>>>', userData);
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
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: colors.serviceProvider.white,
        }}>
        <View style={styles.container}>
          <Image
            source={
              userData != undefined && userData.image != null
                ? {uri: userData.image}
                : require('../../../Assets/dummy.png')
            }
            style={styles.imageStyle}
          />
          {userData != undefined && userData.first_name != null ? (
            <Text style={styles.nameText} numberOfLines={1}>
              {userData.first_name}
            </Text>
          ) : (
            <Text style={styles.nameText}>N/A</Text>
          )}

          {userData != undefined && userData.profession != null ? (
            <Text style={styles.professionText} numberOfLines={1}>
              {userData.profession}
            </Text>
          ) : (
            <Text style={styles.professionText}>N/A</Text>
          )}

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
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Gender</Text>
            {userData != undefined && userData.gender != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.gender}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Rates</Text>
            {userData != undefined && userData.start_from != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.start_from}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Profession</Text>
            {userData != undefined && userData.profession != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.profession}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Qualification</Text>
            {userData != undefined && userData.qualification != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.qualification}
              </Text>
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.infoTextHeading}>Description</Text>
            {userData != undefined && userData.description != null ? (
              <Text style={styles.infoText} numberOfLines={1}>
                {userData.description}
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
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: hp(5),
    marginBottom: hp(3),
  },
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
    color: colors.serviceProvider.secondary,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
    marginTop: hp(2),
    // alignSelf: 'center',
  },
  professionText: {
    // alignSelf: 'center',
    color: colors.serviceProvider.primary,
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginTop:hp(2)
  },
  box: {
    width: wp(80),
    height: hp(10),
    backgroundColor: colors.serviceProvider.primary,
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

export default ServiceProviderProfile;
