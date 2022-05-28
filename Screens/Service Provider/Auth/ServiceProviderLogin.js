import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServiceProviderLogin = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(true);
  const [indicator, setIndicator] = useState(false);

  const { NotToken } = route.params;
  const Login = async () => {
    // const token = await AsyncStorage.getItem('NotificationToken');
    // const token = route.params.NotToken;
    setIndicator(true);
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('notification_token', NotToken);
    data.append('type', 'service_provider');
    console.log('form data login', data);
    axios
      .post(URL + '/user-login', data)
      .then(async response => {
        console.log('Data Responce', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          await AsyncStorage.setItem(
            'User',
            JSON.stringify(response.data.successData.user),
          );
          await AsyncStorage.setItem(
            'AccessToken',
            JSON.stringify(response.data.successData.user.accessToken),
          );
          navigation.replace('SPDrawer');
          setIndicator(false);
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
        }
      })
      .catch(error => {
        console.log('Google Error Responce', JSON.parse(JSON.stringify(error)));
        setIndicator(false);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };

  return (
    <>
      <View style={styles.container}>
        {/* <ScrollView> */}
        <View style={{ height: '100%' }}>
          <View style={styles.inputFeilds}>
            <Text style={styles.headingText}>Hi,</Text>
            <Text style={styles.subHeadingText}>
            Login into your account to explore more
            </Text>
            <InputIcon
              ViewStyle={styles.viewstyle}
              IconName={'email-outline'}
              IconType={'material-community'}
              IconColor={colors.customer.primary}
              IconSize={hp(4)}
              Placeholder={'Email'}
              placeholderColor={colors.customer.primary}
              InputStyle={styles.inputstyle}
              TypeKeypad={'email-address'}
              secureTextEntry={false}
              onChangeText={text => setEmail(text)}
              Value={email}
            />
            <InputIcon
              ViewStyle={styles.viewstyle}
              IconName={'lock'}
              IconType={'material-community'}
              IconColor={colors.customer.primary}
              IconSize={hp(4)}
              Placeholder={'Password'}
              placeholderColor={colors.customer.primary}
              InputStyle={styles.inputstyle}
              TypeKeypad={'default'}
              secureTextEntry={toggle}
              onChangeText={text => setPassword(text)}
              Value={password}
              IconRightName={toggle ? 'eye' : 'eye-outline'}
              IconRightType={'material-community'}
              IconRightColor={colors.customer.primary}
              IconRightSize={hp(3)}
              toggleEye={() => {
                setToggle(!toggle);
              }}
            />
            <Button
              Title="LOGIN"
              Button={styles.button}
              TextStyle={styles.btntext}
              indicatorColor={colors.serviceProvider.primary}
              Indicator={indicator}
              btnPress={() => Login()}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: colors.serviceProvider.black,
                  fontFamily: 'Poppins-Regular',
                }}>
                Forgot Password?
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ServiceProviderForgotPassword')
                }>
                <Text
                  style={{
                    color: colors.customer.secondary,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {' '}
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomText}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: colors.serviceProvider.black,
                  fontFamily: 'Poppins-Regular',
                }}>
                Are you new?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ServiceProviderSignup')}>
                <Text
                  style={{
                    color: colors.customer.secondary,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {' '}
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.serviceProvider.white,
  },
  inputFeilds: {
    flex: 0.99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    color: colors.serviceProvider.primary,
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
  },
  subHeadingText: {
    color: colors.serviceProvider.secondary,
    textAlign: 'center',
    width: wp(80),
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
    // fontSize: 25,
    // fontWeight: 'bold',
  },
  viewstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    height: hp(6),
    alignSelf: 'center',
    backgroundColor: colors.serviceProvider.primary,
    borderRadius: 30,
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    // backgroundColor:'gray',
  },
  inputstyle: {
    flex: 1,
    alignItems: 'flex-start',
    width: wp(70),
    paddingHorizontal: hp(1),
    fontFamily: 'Poppins-Regular',
    height:hp(6.5)

  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.serviceProvider.secondary,
    borderColor: colors.serviceProvider.secondary,
    width: wp(80),
    height: hp(6),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.serviceProvider.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  bottomText: {
    width: wp(95),
    alignSelf: 'center',
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // width: wp(130),
    // alignSelf: 'flex-start',
    // position: 'absolute',
    // bottom: 0,
    // marginBottom: hp(3),
    // marginLeft: wp(8),
  },
});
export default ServiceProviderLogin;
