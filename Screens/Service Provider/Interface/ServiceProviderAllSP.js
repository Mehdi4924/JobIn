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
import axios from 'axios';
import Toast from 'react-native-simple-toast';

const ServiceProviderAllSP = ({route, navigation}) => {
  useEffect(() => {
    {
      route.params.routeDetails == 'fromViewAll' ? Search() : getSPs();
    }
  }, []);
  const [allSP, setAllSP] = useState();
  const [indicator, setIndicator] = useState(false);

  const getSPs = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    console.log('get all sps chlaa');
    axios
      .get(`${URL}/service-provider`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All service Provider list is:---------->>>>', response);
        setAllSP(response.data.successData.service_provide);
        setIndicator(false);

        // console.log('user Data is:---------->>>>', userData);
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
        setIndicator(false);
      });
  };

  const Search = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    console.log('kis name sy search hue', route.params.searchName);
    data.append('name', route.params.searchName);
    axios
      .post(URL + '/professionals', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Search Button Submit Response', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          setAllSP(response.data.successData.professionals[0].userprofession);
          setIndicator(false);
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
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
      <ScrollView style={styles.container}>
        {indicator == true ? (
          <ActivityIndicator size={'small'} color={colors.customer.secondary} />
        ) : allSP != undefined && allSP.length == 0 ? (
          <Text style={styles.nothingFound}>Nothing Found</Text>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <View style={{marginTop: hp(2)}}>
              <AllSP
                flatData={allSP}
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
  nothingFound: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: hp(2),
  },
});

export default ServiceProviderAllSP;
