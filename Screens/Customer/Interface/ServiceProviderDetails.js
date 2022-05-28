import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Button from '../../../Components/Button';
import {Icon} from 'react-native-elements';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const ServiceProviderDetails = ({route, navigation}) => {
  const [favourite, setfavourite] = useState(route.params.user.favourite);
  useEffect(() => {
    addView();
  }, []);
  const [indicator, setIndicator] = useState(false);
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  console.log('userrrr is', route.params.user);
  const addView = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    setUser(JSON.parse(await AsyncStorage.getItem('User')));
    userToken != null ? setToken(userToken) : null;
    const AuthStr = 'Bearer '.concat(userToken);
    console.log(AuthStr);
    const data = new FormData();
    data.append('professional_id', route.params.user.id);
    axios
      .post(URL + '/add-views', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('View Added:---------->>>>', response);
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
      });
  };

  const addWishList = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    // console.log('User ID :::::::::::', userId);
    const data = new FormData();
    data.append('professional_id', route.params.user.id);
    axios
      .post(URL + '/add-wishlist', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('WishList add Response', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          setfavourite(!favourite);
          // SearchUser();
        } else {
          Toast.show(response.data.message, Toast.SHORT);
        }
      })
      .catch(error => {
        if (error.response.data.message == 'Unauthenticated.') {
          Toast.show('Please Login First');
        } else {
          console.log(
            'WishList add Error Response',
            JSON.parse(JSON.stringify(error.response)),
          );
          Toast.show(error.response.data.message, Toast.SHORT);
        }
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{alignItems: 'center'}}>
          <Image
            source={
              route.params.user.image == null
                ? require('../../../Assets/dummy2.png')
                : {uri: route.params.user.image}
            }
            style={styles.imageStyle}
          />
          <View style={styles.box}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.infoTextHeading}>
                {route.params.user.profession == null
                  ? 'N/A'
                  : route.params.user.profession}
              </Text>
              <TouchableOpacity onPress={() => addWishList()}>
                <Icon
                  style={{marginTop: hp(2)}}
                  name={favourite == true ? 'heart' : 'heart-outline'}
                  type="material-community"
                  size={hp(4)}
                  color={colors.customer.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>
              {route.params.user.first_name == null
                ? 'N/A'
                : `${route.params.user.first_name} ${
                    route.params.user.last_name != null
                      ? route.params.user.last_name
                      : ''
                  }`}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {route.params.user.address == null
                ? 'N/A'
                : route.params.user.address}{' '}
            </Text>
          </View>
          <View style={styles.detailsView}>
            <Text style={styles.profileTextHeading}>Profile Details</Text>
            <View style={styles.desView}>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.profileText}>
                  {route.params.user.description == null
                    ? 'N/A'
                    : route.params.user.description}{' '}
                </Text>
              </ScrollView>
            </View>
          </View>
          <View style={{alignItems: 'center', marginVertical: hp(2)}}>
            <Button
              Title="CHAT"
              Button={styles.button}
              TextStyle={styles.btntext}
              Indicator={indicator}
              btnPress={() =>
                token != undefined && route.params.user.id == user.id
                  ? Toast.show('Invalid Reciepient')
                  : token != undefined
                  ? navigation.navigate('CustomerChat', {
                      userID: route.params.user.id,
                    })
                  : Toast.show('Please Login First')
              }
            />
            <Button
              Title="CONTACT"
              Button={styles.button}
              TextStyle={styles.btntext}
              Indicator={indicator}
              btnPress={() => Linking.openURL(`tel:${route.params.user.phone}`)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.primary,
  },
  mainView: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: colors.customer.primary,
    // backgroundColor: 'skyblue',
  },
  imageStyle: {
    height: hp(40),
    width: wp(100),
    // alignSelf: 'center',
    // borderRadius: 100,
    // backgroundColor: 'red',
    resizeMode: 'cover',
  },
  nameText: {
    color: colors.customer.secondary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: hp(2),
    // alignSelf: 'center',
  },
  professionText: {
    // alignSelf: 'center',
    color: colors.customer.secondary,
    marginBottom: hp(2),
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginTop:hp(2)
  },
  box: {
    width: wp(100),
    height: hp(20),
    backgroundColor: colors.customer.secondary,
    // marginTop: hp(2),
    borderRadius: 20,
    paddingHorizontal: wp(5),
    // justifyContent: 'center',
    position: 'absolute',
    top: hp(35),
    // marginTop: hp(35),
    elevation: 5,
    // shadowColor: colors.serviceProvider.black,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
  infoTextHeading: {
    marginTop: hp(3),
    fontSize: 20,
    color: colors.customer.primary,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
  },
  infoText: {
    marginTop: hp(2),
    fontSize: 18,
    color: colors.customer.primary,
    fontFamily: 'Poppins-Regular',
    // fontWeight: 'bold',
  },
  addressText: {
    // marginTop: hp(2),
    // fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.customer.primary,
  },
  detailsView: {
    alignItems: 'flex-start',
    paddingHorizontal: wp(7),
    width: wp(100),
    // backgroundColor:'red'
  },
  profileTextHeading: {
    marginTop: hp(20),
    fontSize: 18,
    // fontWeight: 'bold',
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
  },
  profileText: {
    // marginTop: hp(20),
    // fontWeight: 'bold',
    fontSize: 12,

    // backgroundColor:'red',
    color: colors.customer.white,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.customer.secondary,
    borderColor: colors.customer.secondary,
    width: wp(70),
    height: hp(7),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
    shadowColor: colors.blue,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  desView: {
    height: hp(20),
    width: wp(85),
    paddingVertical: 10,
  },
});

export default ServiceProviderDetails;
