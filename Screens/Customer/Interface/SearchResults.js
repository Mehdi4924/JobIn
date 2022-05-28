import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar
} from 'react-native';
import colors from '../../../Constants/colors';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const SearchResults = ({ route, navigation }) => {
  const [userData, setuserData] = useState();
  const [myLatitude, setMyLatitude] = useState(0);
  const [myLongitude, setMyLongitude] = useState(0);
  const [aroundMe, setAroundMe] = useState();

  useEffect(() => {
    // mapUsers();
    getResults();
  }, []);

  // const mapUsers = () => {
  //   let userArray = [];
  //   route.params.searchResults.map((users, index) => {
  //     console.log('map of marker', users);
  //     userArray.push(users);
  //     console.log('array of all users', userArray);
  //   });
  //   setAroundMe(userArray);
  // };
  // const showMarker = () => {
  //   return route.params.searchResults.map((users, index) => {
  //     <Marker
  //       title={
  //         users != null && users.profession != null
  //           ? users.profession
  //           : 'Profession'
  //       }
  //       coordinate={{
  //         latitude: 41.0082385,
  //         longitude: 28.9783595,
  //       }}
  //       description={
  //         users != null && users.start_from != null ? users.start_from : 'Rate'
  //       }>
  //       {console.log('user ka data', userData)}
  //       <View style={{alignItems: 'center'}}>
  //         <Image source={{uri: users.image}} style={styles.imageStyle} />
  //         {users != null && users.first_name != null ? (
  //           <Text
  //             style={{
  //               color: colors.customer.primary,
  //               fontFamily: 'Poppins-Bold',
  //             }}>
  //             {users.first_name}
  //           </Text>
  //         ) : (
  //           <Text
  //             style={{
  //               // backgroundColor: colors.customer.secondary,
  //               // padding: 5,
  //               // borderRadius: 5,
  //               // margin: 5,
  //               color: colors.customer.primary,
  //               fontFamily: 'Poppins-Bold',
  //             }}>
  //             Name
  //           </Text>
  //         )}

  //         <Icon
  //           name="map-marker"
  //           type="material-community"
  //           color={colors.customer.primary}
  //           size={hp(4)}
  //         />
  //       </View>
  //     </Marker>;
  //   });
  // };
  const getResults = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    setuserData(User);
    // try {
    //   // setIndicator(true);
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     {
    //       title: 'Access Location',
    //       message: 'Grant Permission To Location ',
    //       // buttonNeutral: "Ask Me Later",
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK',
    //     },
    //   );
    // } catch (err) {
    //   console.warn('This is error in access', err);
    // }
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      try {
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
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn('This is error in access', err);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('locationnnnnn', position);
        setMyLatitude(position.coords.latitude);
        setMyLongitude(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log('Yahan error h', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }
  return (
    <>
    <StatusBar
        animated={true}
        backgroundColor="red"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden} 
        />
      {console.log('Navigation Route Items', route.params)}
      {console.log('see around me', aroundMe)}
      <SafeAreaView style={{ flex: 1 }}>
      
      <View style={styles.container}>
              <View style={styles.topBar}>
                <Text style={styles.resultsText}>
                  {route.params.professionText}
                </Text>
              </View>
              <View style={styles.bottomItems}>
                <Text style={styles.numberProfessionals}>
                  {route.params.searchResults.length} {route.params.professionText + ' '}
                  Near You
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SearchProfessional')}>
                  <Icon
                    name="pencil-outline"
                    type="material-community"
                    color={colors.customer.secondary}
                    size={hp(4)}
                  />
                </TouchableOpacity>
              </View>
            </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsBuildings={true}
            region={{
              latitude: 31.4529666,
              longitude: 74.2998558,
              latitudeDelta: 0.1522,
              longitudeDelta: 0.1021,
            }}>
            {route.params.searchResults.map((users, index) => {
              console.log('users from map are', users);
              return (
                <MapView.Marker
                  coordinate={{
                    latitude:
                      userData != undefined && users.id != userData.id
                        ? JSON.parse(users.latitude) != null
                          ? JSON.parse(users.latitude)
                          : 31.4268999
                        : 31.4268999,
                    longitude:
                      userData != undefined && users.id != userData.id
                        ? JSON.parse(users.longitude) != null
                          ? JSON.parse(users.longitude)
                          : 74.2995454
                        : 31.4268999,

                    // latitude: 31.4268999,
                    // longitude: 74.2995454,
                  }}
                  title={
                    users.profession != null ? users.profession : 'Profession'
                  }
                  description={
                    users.start_from != null ? users.start_from : 'Rate'
                  }>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={
                        users != null && users.image != null
                          ? { uri: users.image }
                          : require('../../../Assets/dummy.png')
                      }
                      style={styles.imageStyle}
                    />
                    {users != null && users.first_name != null ? (
                      <Text
                        style={{
                          color: colors.customer.primary,
                          fontFamily: 'Poppins-Bold',
                        }}>
                        {users.first_name}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          // backgroundColor: colors.customer.secondary,
                          // padding: 5,
                          // borderRadius: 5,
                          // margin: 5,
                          color: colors.customer.primary,
                          fontFamily: 'Poppins-Bold',
                        }}>
                        Name
                      </Text>
                    )}

                    <Icon
                      name="map-marker"
                      type="material-community"
                      color={colors.customer.primary}
                      size={hp(4)}
                    />
                  </View>
                </MapView.Marker>
              );
            })}
            <Marker
              title={
                userData != null && userData.profession != null
                  ? userData.profession
                  : 'Profession'
              }
              coordinate={{
                latitude: myLatitude == undefined ? 74.2998558 : myLatitude,
                longitude: myLongitude == undefined ? 31.4529666 : myLongitude,

                // latitude: 31.4529766,
                // longitude: 74.259955,
              }}
              description={
                userData != null && userData.start_from != null
                  ? userData.start_from
                  : 'Rate'
              }>
              {console.log('user ka data', userData)}
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={
                    userData != null && userData.image != null
                      ? { uri: userData.image }
                      : require('../../../Assets/dummy.png')
                  }
                  style={styles.imageStyle}
                />
                {userData != null && userData.first_name != null ? (
                  <Text
                    style={{
                      color: colors.customer.secondary,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {userData.first_name}
                  </Text>
                ) : (
                  <Text
                    style={{
                      // backgroundColor: colors.customer.secondary,
                      // padding: 5,
                      // borderRadius: 5,
                      // margin: 5,
                      color: colors.customer.secondary,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    Name
                  </Text>
                )}

                <Icon
                  name="map-marker"
                  type="material-community"
                  color={colors.customer.secondary}
                  size={hp(4)}
                />
              </View>
            </Marker>
            
          </MapView>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    height: hp(18),
    // alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.customer.primary,
    paddingHorizontal: wp(2),
  },
  topBar: {
    width: wp(85),
    height: hp(6),
    backgroundColor: colors.customer.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: hp(1),
  },
  bottomItems: {
    width: wp(80),
    // backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  resultsText: {
    color: colors.customer.primary,
    fontFamily: 'Poppins-Bold',
    paddingTop: hp(0.5),
  },
  numberProfessionals: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
    paddingTop: hp(1),
  },
  mapContainer: {
    height: hp(100),
    flex:0.8
  },
  map: {
    // marginTop: hp(25)
    ...StyleSheet.absoluteFillObject,
  },
  imageStyle: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderRadius: 100,
    resizeMode: 'cover',
  },
});

export default SearchResults;
