import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast'
import { Icon, Badge } from 'react-native-elements';
import URL from '../../../Constants/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const CustomerNotifications = ({ navigation }) => {
  const [Count, setCount] = useState(0)

  useEffect(() => {
    // getNot();
    getNotification()
  }, []);

  const getNotification = async () => {
    // setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(URL + '/unread-notification', {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All Notification api Response', response);
        setCount(response.data.successData.count)
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        Toast.show(error.response.data.message, Toast.SHORT);
        // setIndicator(false);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.customer.primary,
      }}>
      <TouchableOpacity
        style={styles.parentView}
        onPress={() => navigation.navigate('CustomerAllChats')}>
        <View>
          <Icon
            name={'comment-account-outline'}
            type={'material-community'}
            color={colors.customer.secondary}
            size={hp(5)}
          />
        </View>
        <View style={{ marginLeft: wp(4) }}>
          <Text style={styles.mainText}>Chat Notifications</Text>
          <Text style={styles.subtext}>
            Notifications
          </Text>
        </View>
        <View style={{width: wp(15) }}>
            {Count >= 1 ?
              <Badge
                status="success"
                value={Count}
                containerStyle={{ position: 'absolute', top: -3, right: -4 }}
              />
              :
              <></>
            }
          </View>
      </TouchableOpacity>
      <View style={styles.divider}></View>
      <TouchableOpacity
        style={styles.parentView}
        onPress={() => navigation.navigate('WishList')}>
        <View>
          <Icon
            name={'heart-outline'}
            type={'material-community'}
            color={colors.customer.secondary}
            size={hp(5)}
          />
        </View>
        <View style={{ marginLeft: wp(4) }} >
          <Text style={styles.mainText}>Favourite</Text>
          <Text style={styles.subtext}>
            Notifications
          </Text>
        </View>
        <View style={{width: wp(15) }}>
            {Count >= 1 ?
              <Badge
                status="success"
                value={Count}
                // value="6"
                containerStyle={{ position: 'absolute', top: -3, right: -4 }}
              />
              :
              <></>
            }
          </View>
      </TouchableOpacity>
      <View style={styles.divider}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    width: wp(100),
    height: hp(10),
    // backgroundColor: colors.customer.secondary,
    // borderBottomWidth: 1,
    borderColor: colors.customer.secondary,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  mainText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    color: colors.customer.white,
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.serviceProvider.primary,
    width: wp(80),
    alignSelf: "flex-end"
  }
});

export default CustomerNotifications;
