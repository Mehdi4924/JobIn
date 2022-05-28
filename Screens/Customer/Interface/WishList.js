import React, { useState, useEffect } from 'react';
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

const WishList = ({ navigation }) => {
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
                  navigation.navigate('ServiceProviderDetails', {
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
                  navigation.navigate('ServiceProviderDetails', { user: item })
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
    backgroundColor: colors.serviceProvider.secondary,
    // paddingBottom: hp(5)
  },
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
    borderColor: colors.customer.secondary,
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
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
  },
  amountText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
  },
  startingText: {
    color: colors.customer.white,
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
export default WishList;
