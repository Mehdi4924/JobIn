import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileView from '../../../Components/ProfileView';
import AllSP from '../../../Components/AllSP';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const ServiceProviderWishList = ({navigation}) => {
  useEffect(() => {
    getWishList();
  }, []);
  const [wishList, setWishList] = useState([]);
  const [indicator, setindicator] = useState(false);

  const getWishList = async () => {
    setindicator(true);
    // const User = JSON.parse(await AsyncStorage.getItem('User'));
    // console.log('Data from async', User);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/wishlist`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Wish list is:---------->>>>', response);
        let list = response.data.successData.wishlist;
        let userArray = [];
        list.map(item => {
          console.log(item);
          userArray.push(item.user);
        });
        setWishList(userArray);
        console.log('user wishlist map is:---------->>>>', userArray);
        setindicator(false);
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
        setindicator(false);
      });
  };

  const addWishList = async userId => {
    setindicator(true);
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
          // Toast.show('Added Wish List');
          setindicator(false);
          getWishList();
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setindicator(false);
        }
      })
      .catch(error => {
        console.log(
          'WishList add Error Response',
          JSON.parse(JSON.stringify(error)),
        );
        Toast.show(error.response.data.message, Toast.SHORT);
        setindicator(false);
      });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {indicator ? (
          <ActivityIndicator color={colors.customer.secondary} size={'small'} />
        ) : wishList.length == 0 ? (
          <Text style={styles.nothingFound}>Nothing Found</Text>
        ) : (
          <View
            style={{
              // justifyContent:'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                // marginLeft:wp(1),
                marginTop: hp(1),
                width: wp(100),
                alignItems: 'flex-start',
              }}>
              {/* <ProfileView
                flatData={wishList}
                horizontalView={false}
                numColumns={2}
                numberOfLines={1}
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
                onFavourite={item => {
                  console.log('item is ', item);
                  addWishList(item.id);
                }}
                profileOnPresss={item =>
                  // console.log('profile on press item',item)
                  navigation.navigate('SPDetails', {
                    user: item,
                  })
                }
              /> */}
              <AllSP
                flatData={wishList}
                horizontalView={false}
                // numColumns={0}
                topView={styles.topView}
                parentView={styles.parentView}
                userImage={styles.userImage}
                amountView={styles.amountView}
                serviceNameText={styles.serviceNameText}
                amountText={styles.amountText}
                startingText={styles.startingText}
                goToProfile={item =>
                  navigation.navigate('SPDetails', {user: item})
                }
              />
              {/* {console.log('wish list is', wishList)} */}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.serviceProvider.white,
    // paddingBottom: hp(5)
  },

  // profileImageStyle: {
  //   height: 150,
  //   width: '100%',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   // borderRadius: 20,
  //   // borderWidth: 2,
  //   // borderColor: 'red',
  //   // marginLeft: wp(3),
  //   // marginTop: hp(3),
  //   resizeMode: 'cover',
  //   backgroundColor: colors.customer.secondary,
  // },
  // profileMainView: {
  //   height: 215,
  //   width: 170,
  //   backgroundColor: colors.customer.white,
  //   borderRadius: 20,
  //   marginLeft: wp(1.5),
  //   elevation: 5,
  //   marginBottom: hp(2),
  //   // shadowColor: colors.serviceProvider.black,
  //   // shadowOffset: { width: 0, height: 1 },
  //   // shadowOpacity: 0.8,
  //   // shadowRadius: 2,
  // },
  // profileIconContainer: {
  //   // marginLeft: wp(33),
  //   // alignSelf:"flex-end",
  //   marginTop: hp(1),
  //   width: wp(7),
  //   height: hp(3.9),
  //   position: 'absolute',
  //   right: wp(2),
  //   zIndex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 20,
  // },

  // profileHeadingText: {
  //   // width:wp(45),
  //   marginTop: hp(1),
  //   color: colors.customer.primary,
  //   fontFamily: 'Poppins-Bold',
  //   fontSize: 14,

  //   // fontSize: 16,
  //   // fontWeight: 'bold',
  // },
  // profileSubHeading: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginRight: wp(2),
  //   alignItems: 'center',
  //   // backgroundColor:'red',
  //   // marginTop: hp(.3),
  // },
  // profileSubHeadingText: {
  //   marginTop: hp(0.5),
  //   width: wp(20),
  //   color: colors.customer.primary,
  //   fontSize: 10,
  //   fontFamily: 'Poppins-Regular',
  //   // backgroundColor: 'red',
  //   // fontWeight: 'bold',
  // },
  // profilePriceText: {
  //   marginTop: hp(0.5),
  //   fontFamily: 'Poppins-Bold',
  //   color: colors.customer.secondary,
  //   fontSize: 14,
  //   // fontSize: hp('1.7%'),

  //   // fontWeight: 'bold',
  // },
  nothingFound: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: hp(2),
  },
  parentView: {
    width: wp(100),
    height: hp(10),
    // backgroundColor: colors.customer.secondary,
    borderBottomWidth: 1,
    borderColor: colors.serviceProvider.secondary,
    flexDirection: 'row',
    // paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  userImage: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 50,
    marginRight: wp(3),
  },
  amountView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceNameText: {
    color: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Bold',
  },
  amountText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
  },
  startingText: {
    color: colors.serviceProvider.primary,
    fontFamily: 'Poppins-Regular',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    marginLeft: wp(3),
  },
});
export default ServiceProviderWishList;
