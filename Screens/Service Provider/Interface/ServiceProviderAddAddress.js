import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  PermissionsAndroid,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServiceProviderAddAddress = ({navigation}) => {
  useEffect(() => {
    getLocation();
  }, []);

  const [userData, setuserData] = useState();
  const [address, setAddress] = useState('');
  const [indicator, setIndicator] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [myLatitude, setMyLatitude] = useState('');
  const [myLongitude, setMyLongitude] = useState('');
  // console.log(Geolocation);

  const getLocation = async () => {
    try {
      setIndicator(true);
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Access Location',
          message: 'Grant Permission To Location ',
          // buttonNeutral: "Ask Me Later",
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn('This is error in access', err);
    }
    Geolocation.getCurrentPosition(
      position => {
        console.log('locationnnnnn', position);
        setMyLatitude(position.coords.latitude);
        setMyLongitude(position.coords.longitude);
        getUser();
      },
      error => {
        // See error code charts below.
        console.log('Yahan error h', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getUser = async () => {
    setuserData(JSON.parse(await AsyncStorage.getItem('User')));
    setIndicator(false);
  };

  const addLocation = async () => {
    setIndicator2(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append('latitude', myLatitude);
    data.append('longitude', myLongitude);
    axios
      .post(URL + '/location-service-provider', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(async response => {
        console.log('Response update', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          setIndicator2(false);
          navigation.navigate('ServiceProviderDashBoard');
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator2(false);
        }
      })
      .catch(error => {
        console.log(
          'Error Response on update',
          JSON.parse(JSON.stringify(error)),
        );
        setIndicator2(false);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };
  return (
    <>
      <View style={styles.container} keyboardShouldPersistTaps={'handled'}>
        {indicator == true ? (
          <ActivityIndicator
            color={colors.serviceProvider.primary}
            size={20}
            style={{alignSelf: 'center'}}
          />
        ) : (
          <>
            <View style={styles.mapContainer}>
              <MapView
                //  provider={PROVIDER_GOOGLE} // remove if  using Google Maps
                // loadingEnabled={true}
                style={styles.map}
                showsBuildings={true}
                region={{
                  latitude: myLatitude,
                  longitude: myLongitude,
                  latitudeDelta: 0.0922 / 10,
                  longitudeDelta: 0.0421 / 10,
                }}>
                <Marker
                  title={
                    userData != undefined && userData.first_name != null
                      ? userData.first_name
                      : 'Name'
                  }
                  coordinate={{
                    latitude: myLatitude,
                    longitude: myLongitude,
                  }}
                  // description={''}
                >
                  {console.log('user ka data', userData)}
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={
                        userData != null && userData.image != null
                          ? {uri: userData.image}
                          : require('../../../Assets/profile.jpg')
                      }
                      style={styles.imageStyle}
                    />
                    {userData != undefined && userData.first_name != null ? (
                      <Text
                        style={{
                          color: colors.serviceProvider.secondary,
                          fontFamily: 'Poppins-Bold',
                        }}>
                        {userData != undefined && userData.first_name != null
                          ? userData.first_name
                          : 'Name'}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          // backgroundColor: colors.customer.secondary,
                          // padding: 5,
                          // borderRadius: 5,
                          // margin: 5,
                          color: colors.serviceProvider.secondary,
                          fontFamily: 'Poppins-Bold',
                        }}>
                        Name
                      </Text>
                    )}

                    <Icon
                      name="map-marker"
                      type="material-community"
                      color={colors.serviceProvider.secondary}
                      size={hp(4)}
                    />
                  </View>
                </Marker>
              </MapView>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  backgroundColor: colors.serviceProvider.primary,
                  borderBottomRightRadius: 20,
                  borderBottomLeftRadius: 20,
                }}>
                <GooglePlacesAutocomplete
                  placeholder="Search Address"
                  styles={{
                    container: {
                      width: '100%',
                      // minHeight: hp(10),
                      // maxHeight: hp(15),
                      // alignSelf: 'center',
                      // backgroundColor: colors.customer.primary,
                      // zIndex: 1,
                      // opacity: 0.2,
                      // paddingTop: hp(1),
                    },
                    listView: {
                      backgroundColor: colors.customer.primary,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    },
                    textInputContainer: {
                      height: hp(7),
                      width: wp(90),
                      backgroundColor: colors.customer.primary,
                      borderRadius: 10,
                      marginHorizontal: wp(2),
                      multiline: false,
                      numberOfLines: 1,
                      marginVertical: 20,
                      // marginTop: hp(1),
                      alignSelf: 'center',
                    },
                    textInput: {
                      height: hp(7),
                      // backgroundColor: colors.customer.primary,
                    },
                    predefinedPlacesDescription: {
                      color: colors.customer.primary,
                    },
                    description: {
                      color: colors.serviceProvider.primary,
                    },
                    row: {
                      backgroundColor: colors.serviceProvider.secondary,
                    },
                    separator: {
                      backgroundColor: colors.serviceProvider.white,
                    },
                    poweredContainer: {
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    },
                  }}
                  fetchDetails={true}
                  onPress={(data, details = null, grometry) => {
                    console.log('data ha yh', data);
                    console.log('Check long ,lat', details);
                    console.log(JSON.stringify(details.geometry.location));
                    let location = details.geometry.location;
                    setMyLatitude(location.lat);
                    setMyLongitude(location.lng);
                  }}
                  onFail={error => console.error(error)}
                  query={{
                    key: 'AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4',
                    language: 'en',
                  }}
                />
              </View>
            </View>
          </>
        )}
        {/* <View style={styles.mainView}>
          <Pressable onPress={() => navigation.toggleDrawer()}>
            <Icon
              name="filter-variant"
              type="material-community"
              color={colors.customer.secondary}
              size={hp(4)}
            />
          </Pressable>
          <View style={styles.searchView}>
            <InputIcon
              ViewStyle={styles.viewstyle}
              IconName={'crosshairs'}
              IconType={'material-community'}
              IconColor={colors.customer.primary}
              IconSize={hp(3)}
              Placeholder={'Search Address'}
              placeholderColor={colors.customer.primary}
              InputStyle={styles.inputstyle}
              TypeKeypad={'default'}
              secureTextEntry={false}
              onChangeText={text => setAddress(text)}
              Value={address}
            />
          </View>
        </View>
        {indicator == false ? (
          <ActivityIndicator
            color={colors.customer.primary}
            size={20}
            style={{alignSelf: 'center'}}
          />
        ) : (
          <View style={styles.mapContainer}>
             <MapView
              //  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              // loadingEnabled={true}
              style={styles.map}
              showsBuildings={true}
              region={{
                latitude: myLatitude,
                longitude: myLongitude,
                latitudeDelta: 0.0922 / 10,
                longitudeDelta: 0.0421 / 10,
              }}>
              <Marker
                title={'New'}
                coordinate={{
                  latitude: myLatitude,
                  longitude: myLongitude,
                }}
                description={'This is a marker in React Natve'}></Marker>
            </MapView> 
          </View>
        )}

        */}
      </View>
      <View style={styles.buttonView}>
        <Button
          Title="ADD LOCATION"
          Button={styles.button}
          TextStyle={styles.btntext}
          indicatorColor={colors.serviceProvider.secondary}
          Indicator={indicator2}
          btnPress={() => addLocation()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: colors.customer.primary,
    // paddingBottom: hp(5)
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(3),
    paddingVertical: wp(7),
    backgroundColor: colors.customer.primary,
  },

  viewstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(70),
    alignSelf: 'center',
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    // backgroundColor: 'gray',
  },
  inputstyle: {
    flex: 1,
    alignItems: 'flex-start',
    width: wp(50),
    paddingHorizontal: 10,
    paddingBottom: hp(1),
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    // backgroundColor: 'red',
  },
  searchView: {
    height: hp(8),
    backgroundColor: colors.customer.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
  },
  buttonView: {
    position: 'absolute',
    bottom: 0,
    marginBottom: hp(3),
    alignSelf: 'center',
  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.serviceProvider.primary,
    borderColor: colors.serviceProvider.primary,
    width: wp(80),
    height: hp(7),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
    shadowColor: colors.serviceProvider.secondary,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.serviceProvider.secondary,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    // top: hp(15),
    height: hp(100),
    // zIndex: -1,
  },
  imageStyle: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderRadius: 100,
    // backgroundColor: 'red',
    resizeMode: 'cover',
  },
});
export default ServiceProviderAddAddress;
