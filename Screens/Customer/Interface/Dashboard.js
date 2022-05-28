import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import CategoriesComponent from '../../../Components/CategoriesComponent';
import ProfileView from '../../../Components/ProfileView';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

const Dashboard = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [indicator, setIndicator] = useState(false);
  const [lattitude, setlattitude] = useState();
  const [longitude, setlongitude] = useState();
  const [allData, setAllData] = useState(null);
  const [doc, setDoc] = useState(null);
  const [electrician, setElectrician] = useState(null);
  const [ID, setID] = useState();

  useEffect(() => {
    // SearchXYZ();
    const unsubscribe = navigation.addListener('focus', async () => {
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
    });
    return unsubscribe;
  }, [navigation]);

  const Search = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append('search', search);
    axios
      .post(URL + '/search-professionals', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Search Button Submit Response', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          navigation.navigate('SearchBarResults', {
            allUsers: response.data.successData.users,
          });
        } else {
          Toast.show(response.data.message, Toast.SHORT);
        }
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };

  const addWishList = async userId => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    console.log('User ID :::::::::::', userId);
    const data = new FormData();
    data.append('professional_id', userId);
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
          SearchUser();
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

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('locationnnnnn', position);
        // setMyLatitude(position.coords.latitude);
        // setMyLongitude(position.coords.longitude);
        setlongitude(position.coords.longitude);
        setlattitude(position.coords.latitude);
        SearchUser(position.coords.latitude, position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log('Yahan error h', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const SearchUser = async (lat, lng) => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    user != null ? setID(user.id) : null;
    console.log(user);
    // console.log('async user data ssssssss',user);
    const data = new FormData();
    data.append('latitude', lat != undefined ? lat : lattitude);
    data.append('longitude', lng != undefined ? lng : longitude);
    data.append('user_id', user != null && user.id != undefined ? user.id : '');
    axios
      .post(URL + '/home', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All data api Response', response);
        if (response.data.status == 200) {
          // Toast.show('Data Loaded Successfully');
          setAllData(response.data.successData);
          setDoc(response.data.successData.profession_users[0]);
          setElectrician(response.data.successData.profession_users[1]);
          // response.data.successData.profession_users.map(item => {
          //   // console.log('yeh item ha', item);
          //   {
          //     item.name == 'xyz' ? setDoc(item) : null;
          //   }
          //   {
          //     item.name == 'abc' ? setElectrician(item) : null;
          //   }
          // });
          setIndicator(false);
        } else {
          setIndicator(false);
          Toast.show(response.data.message, Toast.SHORT);
        }
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        Toast.show(error.response.data.message, Toast.SHORT);
        setIndicator(false);
      });
  };
  return (
    <>
      <TouchableOpacity
        style={styles.floating}
        onPress={() =>
          Linking.openURL(
            'mailto:jobinapp.official@gmail.com?subject=Customer Support&body=Description',
          )
        }>
        <Icon
          name="forum"
          type="material-community"
          color={colors.customer.primary}
          size={hp(4)}
          style={{marginHorizontal: wp(3)}}
        />
      </TouchableOpacity>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Heading */}
        <View style={{paddingBottom: hp(5)}}>
          <Text style={styles.headingText}>
            Find The Pakistan's Best Professionals
          </Text>
          {/* searchView */}
          <View style={styles.searchView}>
            <InputIcon
              ViewStyle={styles.viewstyle}
              IconName={'magnify'}
              IconType={'material-community'}
              IconColor={colors.customer.primary}
              IconSize={24}
              Placeholder={'Search Professionals'}
              placeholderColor={colors.customer.primary}
              InputStyle={styles.inputstyle}
              TypeKeypad={'default'}
              secureTextEntry={false}
              onChangeText={text => setSearch(text)}
              Value={search}
              onSubmitEditing={() =>
                ID != null
                  ? navigation.navigate('SearchBarResults', {
                      searchText: search,
                    })
                  : null
              }
              iconClick={() =>
                ID != null
                  ? search == ''
                    ? Toast.show('Enter Search Text')
                    : navigation.navigate('SearchBarResults', {
                        searchText: search,
                      })
                  : Toast.show('Please Login First')
              }
            />
            <Pressable
              onPress={() =>
                ID != null
                  ? navigation.navigate('SearchProfessional')
                  : Toast.show('Please Login First')
              }>
              <Icon
                name="tune-vertical"
                type="material-community"
                color={colors.customer.primary}
                size={24}
                style={{marginHorizontal: wp(3)}}
              />
            </Pressable>
          </View>
          {/* categories flatlist */}
          <View>
            <Text style={styles.subHeadingText}>Categories</Text>
            <View style={{marginLeft: wp(2), marginTop: hp(2)}}>
              {allData == undefined ? (
                <ActivityIndicator
                  size={'small'}
                  color={colors.customer.secondary}
                />
              ) : allData != undefined && allData.professions.length == 0 ? (
                <Text style={styles.nothingFound}>Nothing Found</Text>
              ) : (
                <CategoriesComponent
                  flatData={allData.professions}
                  horizontalView={true}
                  // numColumns={0}
                  catMainView={styles.catMainView}
                  catIcon={styles.catIcon}
                  catHeadingText={styles.catHeadingText}
                  catSubHeadingText={styles.catSubHeadingText}
                  catButton={[
                    styles.catButton,
                    {
                      backgroundColor: colors.customer.primary,
                    },
                  ]}
                  catButtonText={[
                    styles.catButtonText,
                    {
                      color: colors.customer.secondary,
                    },
                  ]}
                  onPressViewAll={item =>
                    ID != null
                      ? navigation.navigate('AllServiceProviders', {
                          routeDetails: 'fromViewAll',
                          searchName: item,
                        })
                      : Toast.show('Please Login First')
                  }
                  horizontalScroll={false}
                />
              )}
            </View>
          </View>
          {/* Top View professionals */}
          <View>
            <Text style={styles.subHeadingText}>
              Top Reviewed Professionals
            </Text>
            <View style={{marginLeft: wp(2), marginTop: hp(2)}}>
              {allData == undefined ? (
                <ActivityIndicator
                  size={'small'}
                  color={colors.customer.secondary}
                />
              ) : allData != undefined && allData.top_viewed.length == 0 ? (
                <Text style={styles.nothingFound}>Nothing Found</Text>
              ) : (
                <ProfileView
                  flatData={allData.top_viewed}
                  horizontalView={true}
                  numberOfLines={1}
                  // numColumns={0}
                  profileOnPresss={item =>
                    // console.log('profile on press item',item)
                    navigation.navigate('ServiceProviderDetails', {
                      user: item,
                    })
                  }
                  profileMainView={styles.profileMainView}
                  profileImageStyle={styles.profileImageStyle}
                  profileIconContainer={[
                    styles.profileIconContainer,
                    {backgroundColor: colors.customer.white},
                  ]}
                  iconName="heart-outline"
                  iconSize={hp(3)}
                  favIconName="heart"
                  favIconSize={hp(3)}
                  profileHeadingText={styles.profileHeadingText}
                  profileSubHeading={styles.profileSubHeading}
                  profileSubHeadingText={styles.profileSubHeadingText}
                  profilePriceText={styles.profilePriceText}
                  horizontalScroll={false}
                  onFavourite={item => {
                    console.log('item is ', item);
                    addWishList(item.id);
                  }}
                />
              )}
            </View>
          </View>

          {/* Near You */}
          <View>
            <Text style={styles.subHeadingText}>Near You</Text>
            <View style={{marginLeft: wp(2), marginTop: hp(2)}}>
              {allData == undefined ? (
                <ActivityIndicator
                  size={'small'}
                  color={colors.customer.secondary}
                />
              ) : allData != undefined && allData.nearBy.length == 0 ? (
                <Text style={styles.nothingFound}>Nothing Found</Text>
              ) : (
                <ProfileView
                  flatData={allData.nearBy}
                  horizontalView={true}
                  numberOfLines={1}
                  // numColumns={0}
                  profileOnPresss={item =>
                    // console.log('profile on press item',item)
                    navigation.navigate('ServiceProviderDetails', {
                      user: item,
                    })
                  }
                  profileMainView={styles.profileMainView}
                  profileImageStyle={styles.profileImageStyle}
                  profileIconContainer={[
                    styles.profileIconContainer,
                    {backgroundColor: colors.customer.white},
                  ]}
                  iconName="heart-outline"
                  iconSize={hp(3)}
                  favIconName="heart"
                  favIconSize={hp(3)}
                  profileHeadingText={styles.profileHeadingText}
                  profileSubHeading={styles.profileSubHeading}
                  profileSubHeadingText={styles.profileSubHeadingText}
                  profilePriceText={styles.profilePriceText}
                  horizontalScroll={false}
                  onFavourite={item => {
                    console.log('item is ', item);
                    addWishList(item.id);
                  }}
                />
              )}
            </View>
          </View>
          {/* Electricians */}
          <View>
            <Text style={styles.subHeadingText}>
              {electrician != undefined ? electrician.name : 'Loading'}
            </Text>
            <View style={{marginLeft: wp(2), marginTop: hp(2)}}>
              {allData == undefined ? (
                <ActivityIndicator
                  size={'small'}
                  color={colors.customer.secondary}
                />
              ) : allData != undefined &&
                (electrician == undefined ||
                  electrician.userprofession.length == 0) ? (
                <Text style={styles.nothingFound}>Nothing Found</Text>
              ) : (
                <ProfileView
                  flatData={electrician.userprofession}
                  horizontalView={true}
                  numberOfLines={1}
                  // numColumns={0}
                  profileOnPresss={item =>
                    // console.log('profile on press item',item)
                    navigation.navigate('ServiceProviderDetails', {
                      user: item,
                    })
                  }
                  profileMainView={styles.profileMainView}
                  profileImageStyle={styles.profileImageStyle}
                  profileIconContainer={[
                    styles.profileIconContainer,
                    {backgroundColor: colors.customer.white},
                  ]}
                  iconName="heart-outline"
                  iconSize={hp(3)}
                  favIconName="heart"
                  favIconSize={hp(3)}
                  profileHeadingText={styles.profileHeadingText}
                  profileSubHeading={styles.profileSubHeading}
                  profileSubHeadingText={styles.profileSubHeadingText}
                  profilePriceText={styles.profilePriceText}
                  horizontalScroll={false}
                  onFavourite={item => {
                    console.log('item is ', item);
                    addWishList(item.id);
                  }}
                />
              )}
            </View>
          </View>
          {/* Doctors */}
          <View>
            <Text style={styles.subHeadingText}>
              {doc != undefined ? doc.name : 'Loading'}
            </Text>
            <View style={{marginLeft: wp(2), marginTop: hp(2)}}>
              {allData == undefined ? (
                <ActivityIndicator
                  size={'small'}
                  color={colors.customer.secondary}
                />
              ) : allData != undefined &&
                (doc == undefined || doc.userprofession.length == 0) ? (
                <Text style={styles.nothingFound}>Nothing Found</Text>
              ) : (
                <ProfileView
                  flatData={doc.userprofession}
                  horizontalView={true}
                  numberOfLines={1}
                  // numColumns={0}
                  profileOnPresss={item =>
                    // console.log('profile on press item',item)
                    navigation.navigate('ServiceProviderDetails', {
                      user: item,
                    })
                  }
                  profileMainView={styles.profileMainView}
                  profileImageStyle={styles.profileImageStyle}
                  profileIconContainer={[
                    styles.profileIconContainer,
                    {backgroundColor: colors.customer.white},
                  ]}
                  iconName="heart-outline"
                  iconSize={hp(3)}
                  favIconName="heart"
                  favIconSize={hp(3)}
                  profileHeadingText={styles.profileHeadingText}
                  profileSubHeading={styles.profileSubHeading}
                  profileSubHeadingText={styles.profileSubHeadingText}
                  profilePriceText={styles.profilePriceText}
                  horizontalScroll={false}
                  onFavourite={item => {
                    console.log('item is ', item);
                    addWishList(item.id);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.primary,
    // paddingBottom: hp(5)
  },
  headingText: {
    color: colors.customer.secondary,
    fontSize: 24,
    // fontWeight: 'bold',
    marginVertical: hp(2),
    paddingHorizontal: wp(5),
    fontFamily: 'Poppins-Bold',
  },
  nothingFound: {
    color: colors.customer.white,
    fontSize: 15,
    // // fontWeight: 'bold',
    // marginVertical: hp(2),
    paddingHorizontal: wp(5),
    fontFamily: 'Poppins-Regular',
  },
  viewstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    alignSelf: 'center',
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    // backgroundColor:'gray',
  },
  inputstyle: {
    flex: 1,
    width: wp(70),
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    // paddingBottom: hp(1),
    // backgroundColor: 'red',
    // fontSize: 18,
    // alignItems: 'flex-start',
  },
  searchView: {
    height: hp(8),
    backgroundColor: colors.customer.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
  },
  subHeadingText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    // fontWeight: 'bold',
    marginLeft: wp(5),
    marginTop: hp(2),
  },
  catMainView: {
    height: hp(26),
    width: wp(40),
    backgroundColor: colors.customer.white,
    borderRadius: 20,
    marginLeft: wp(2),
    elevation: 5,
    marginBottom: hp(2),
    shadowOffset: {width: 3, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.4,
    // shadowColor: colors.serviceProvider.black,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
  catIcon: {
    height: hp(5),
    width: wp(9),
    borderRadius: 10,
    // marginLeft: wp(3),
    marginTop: hp(3),
    resizeMode: 'cover',
    backgroundColor: colors.customer.secondary,
  },
  catHeadingText: {
    marginTop: hp(2),
    width: wp(35),
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
    fontSize: 14,
  },
  catSubHeadingText: {
    marginTop: hp(1),
    color: colors.customer.primary,
    fontFamily: 'Poppins-Regular',
    // fontWeight: 'bold',
    fontSize: 12,
  },
  catButton: {
    alignSelf: 'center',
    marginTop: hp(2),
    paddingHorizontal: hp(3),
    paddingVertical: wp(1),
    borderRadius: 5,
    height: hp(4),
  },
  catButtonText: {
    fontFamily: 'Poppins-SemiBold',
    // marginTop: hp(1),
    // fontWeight: 'bold',
    // fontSize: 16,
  },
  profileImageStyle: {
    height: 150,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // borderRadius: 20,
    // borderWidth: 2,
    // borderColor: 'red',
    // marginLeft: wp(3),
    // marginTop: hp(3),
    resizeMode: 'cover',
    backgroundColor: colors.customer.secondary,
  },
  profileMainView: {
    height: 215,
    width: 180,
    backgroundColor: colors.customer.white,
    borderRadius: 20,
    marginLeft: wp(2),
    elevation: 5,
    marginBottom: hp(2),
    shadowOffset: {width: 3, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.4,

    // shadowColor: colors.serviceProvider.black,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
  profileIconContainer: {
    // marginLeft: wp(33),
    // alignSelf:"flex-end",
    marginTop: hp(1),
    width: 30,
    height: 30,
    position: 'absolute',
    right: wp(2),
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  profileHeadingText: {
    // width:wp(45),
    marginTop: hp(1),
    color: colors.customer.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 14,

    // fontSize: 16,
    // fontWeight: 'bold',
  },
  profileSubHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp(2),
    alignItems: 'center',
    // backgroundColor:'red',
    // marginTop: hp(.3),
  },
  profileSubHeadingText: {
    marginTop: hp(0.5),
    width: wp(20),
    color: colors.customer.primary,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    // backgroundColor: 'red',
    // fontWeight: 'bold',
  },
  profilePriceText: {
    marginTop: hp(0.5),
    fontFamily: 'Poppins-Bold',
    color: colors.customer.secondary,
    fontSize: 14,
    // fontSize: hp('1.7%'),

    // fontWeight: 'bold',
  },
  floating: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: colors.serviceProvider.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp(2),
    right: wp(3),
    zIndex: 100,
  },
});
export default Dashboard;
