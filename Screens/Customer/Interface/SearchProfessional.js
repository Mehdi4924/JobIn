import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import colors from '../../../Constants/colors';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import Dropdown from '../../../Components/DropDown';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const SearchProfessional = ({navigation}) => {
  // const [name, setName] = useState('');
  // const [location, setLocation] = useState('');
  // const [searchResults, setSearchResults] = useState();
  const [userData, setuserData] = useState();
  const [profession, setProfession] = useState('');
  const [professionSearch, setProfessionSearch] = useState([]);
  const [indicator, setIndicator] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [myLatitude, setMyLatitude] = useState(0);
  const [myLongitude, setMyLongitude] = useState(0);

  useEffect(() => {
    getProfession();
    getPermissions();
  }, []);

  const getPermissions = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      try {
        // setIndicator2(true);
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
        // setIndicator2(false);
        if (granted == granted) {
          getLocation();
        } else {
          Toast.show('Permission Not Granted');
        }
        // console.log('grantedd is ', granted);
      } catch (err) {
        console.warn('This is error in access', err);
      }
    }
  };

  const getProfession = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    setuserData(User);
    // console.log('user Token is:---------->>>>', userToken);
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/profession`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        // console.log('All Profession Response is:---------->>>>', response);
        setProfessionSearch(
          response.data.successData.professions.map(item => {
            return item.name;
          }),
        );
      })
      .catch(error => {
        console.log(
          'All Profession error response',
          JSON.parse(JSON.stringify(error)),
          Toast.show('Professional Unavailable', Toast.SHORT),
        );
      });
  };

  const getLocation = async () => {
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
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const Search = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append('profession', profession);
    data.append('latitude', myLatitude);
    data.append('longitude', myLongitude);
    axios
      .post(URL + '/profession-location-service-provider', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Search Button Click Response', response);
        if (response.data.status == 200) {
          Toast.show('Search Successfull');
          setIndicator(false);
          navigation.navigate('SearchResults', {
            professionText: profession,
            searchResults: response.data.successData.professionals,
          });
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
        }
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        setIndicator(false);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.MainTopView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginTop: hp(2)}}>
            <Icon
              name="close"
              type="material-community"
              color={colors.customer.secondary}
              size={24}
            />
          </TouchableOpacity>
          <Dropdown
            parentViewStyles={styles.dropDownView}
            //   leftIconStyle={styles.dropDownIcon}
            leftIconName={''}
            leftIconType={''}
            leftIconSize={hp(3.5)}
            leftIconColor={colors.serviceProvider.secondary}
            dropDownItems={professionSearch}
            DropdownStyle={styles.Dropdown}
            dropDownDefaultValue={'Profession'}
            dropDownTextStyle={styles.dropDownTextStyle}
            dropDownStyle={styles.dropDownText}
            textStyle={styles.textStyles}
            defaultTextStyle={styles.defaultTextStyles}
            value={profession}
            onSelect={(index, value) => {
              setProfession(value);
            }}
            // rightIconStyle={styles.dropDownIcon}
            rightIconName={'menu-down'}
            rightIconType={'material-community'}
            rightIconSize={hp(3.5)}
            rightIconColor={colors.serviceProvider.secondary}
          />
        </View>
        <Button
          Title="SEARCH PROFESSIONALS"
          Button={styles.button}
          TextStyle={styles.btntext}
          Indicator={indicator}
          indicatorColor={colors.customer.primary}
          btnPress={() => Search()}
        />
      </View>
      <View style={styles.mapContainer}>
        {console.log('coordinates are ======>>', myLongitude, myLongitude)}
        <MapView
          style={styles.map}
          showsBuildings={true}
          region={{
            latitude: myLatitude,
            longitude: myLongitude,
            latitudeDelta: 0.0922 / 10,
            longitudeDelta: 0.0421 / 10,
          }}>
          <Marker
            title={'Name of person'}
            coordinate={{
              latitude: myLatitude,
              longitude: myLongitude,
            }}
            description={'Profession'}>
            {/* {console.log('user ka data', userData)} */}
            <View style={{alignItems: 'center'}}>
              <Image
                source={
                  userData != null && userData.image != null
                    ? {uri: userData.image}
                    : require('../../../Assets/profile.jpg')
                }
                style={styles.imageStyle}
              />
              {userData != null && userData.first_name != null ? (
                <Text
                  style={{
                    color: colors.customer.primary,
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
          </Marker>
        </MapView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.customer.primary,
    paddingHorizontal: wp(2),
    zIndex: 100,
  },
  MainTopView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  viewstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(39),
    backgroundColor: colors.customer.white,
    borderRadius: 30,
    marginVertical: hp(1),
    // justifyContent: 'space-between',
    // paddingHorizontal: wp(3),
    // alignSelf: 'center',
    // backgroundColor:'gray',
  },
  inputstyle: {
    flex: 1,
    alignItems: 'flex-start',
    width: wp(70),
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    paddingBottom: hp(1),
    paddingHorizontal: hp(0.1),
    // backgroundColor:'red',
  },
  button: {
    // borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.customer.secondary,
    // borderColor: colors.blue,
    width: wp(80),
    height: hp(6),
    alignItems: 'center',
    alignSelf: 'flex-end',
    // alignSelf: 'center',
    marginRight: wp(2),
    marginVertical: hp(2),
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
    paddingTop: hp(1),
  },
  Dropdown2: {
    width: wp(15),
    marginLeft: wp(6),
    marginTop: hp(2.1),
    color: colors.serviceProvider.primary,
    // borderBottomWidth: 1,
    // backgroundColor:'red'
  },
  dropDownView2: {
    marginLeft: wp(2),
    marginVertical: hp(1),
    width: wp(38),
    height: hp(7),
    borderColor: 'gray',
    borderRadius: 25,
    backgroundColor: colors.customer.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  Dropdown: {
    width: wp(65),
    marginLeft: wp(2),
    // backgroundColor:'red'
  },
  dropDownText: {
    width: wp(70),
    color: colors.serviceProvider.secondary,
    backgroundColor: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
  },
  dropDownView: {
    backgroundColor: colors.serviceProvider.white,
    marginTop: hp(2),
    width: wp(80),
    height: hp(6),
    borderColor: 'gray',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dropDownIcon: {
    marginLeft: wp(4),
  },
  dropDownTextStyle: {
    backgroundColor: colors.serviceProvider.secondary,
    color: colors.serviceProvider.primary,
    fontFamily: 'Poppins-Regular',
  },
  textStyles: {
    color: colors.customer.primary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  defaultTextStyles: {
    color: colors.serviceProvider.secondary,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    marginTop: hp(20),
    height: hp(100),
  },
  imageStyle: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderRadius: 100,
    resizeMode: 'cover',
  },
});
export default SearchProfessional;
