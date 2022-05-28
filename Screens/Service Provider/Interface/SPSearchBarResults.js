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
import AllSP from '../../../Components/AllSP';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const SPSearchBarResults = ({route, navigation}) => {
  const [Data, setData] = useState();
  const [search, setSearch] = useState();
  const [indicator, setIndicator] = useState(false);
  useEffect(() => {
    // SearchXYZ();
    Search();
  }, []);
  const Search = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append(
      'search',
      route.params.searchText != undefined ? route.params.searchText : search,
    );
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
          setData(response.data.successData.users);
          setIndicator(false);
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

  const addWishList = async userId => {
    setSearch(route.params.searchText);
    setIndicator(true);
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
          setIndicator(false);
          // getWishList();
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
        }
      })
      .catch(error => {
        console.log(
          'WishList add Error Response',
          JSON.parse(JSON.stringify(error)),
        );
        Toast.show(error.response.data.message, Toast.SHORT);
        setIndicator(false);
      });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {indicator == true ? (
          <ActivityIndicator
            size={'small'}
            color={colors.serviceProvider.primary}
          />
        ) : Data != undefined && Data.length == 0 ? (
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
                marginTop: hp(2),
                width: wp(100),
                alignItems: 'flex-start',
              }}>
              {/* <ProfileView
                flatData={Data}
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
                profileOnPresss={item =>
                  // console.log('profile on press item',item)
                  navigation.navigate('SPDetails', {
                    user: item,
                  })
                }
                onFavourite={item => {
                  console.log('item is ', item);
                  addWishList(item.id);
                }}
              /> */}
              <AllSP
                flatData={Data}
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
                  // console.log('profile on press item',item)
                  navigation.navigate('SPDetails', {
                    user: item,
                  })
                }
              />
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
  },
  parentView: {
    width: wp(100),
    height: hp(10),
    // backgroundColor: colors.customer.secondary,
    borderBottomWidth: 1,
    borderColor: colors.customer.secondary,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  mainText: {
    color: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    color: colors.serviceProvider.secondary,
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  parentView: {
    width: wp(100),
    height: hp(10),
    // backgroundColor: colors.customer.secondary,
    borderBottomWidth: 1,
    borderColor: colors.customer.secondary,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
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
    color: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Bold',
  },
  amountText: {
    color: colors.serviceProvider.secondary,
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
export default SPSearchBarResults;
