import React, {useState} from 'react';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const CutomerPhoneLogin = ({route, navigation}) => {
  const [phone, setPhone] = useState('');
  const [toggle, setToggle] = useState(true);
  const [password, setPassword] = useState('');
  const [indicator, setIndicator] = useState(false);

  const {NotToken} = route.params;
  const LogIn = async () => {
    setIndicator(true);
    const formdata = new FormData();
    formdata.append('phone', phone);
    formdata.append('password', password);
    formdata.append('notification_token', NotToken);
    formdata.append('type', 'customer');
 console.log('HIIII',formdata);
    axios
      .post(URL + '/userlogin-with-phone', formdata)
      .then(async response => {
        console.log('response is', response);
        console.log('Token IS', response.data.successData.user.accessToken);
        await AsyncStorage.setItem(
          'User',
          JSON.stringify(response.data.successData.user),
        );
        await AsyncStorage.setItem(
          'AccessToken',
          JSON.stringify(response.data.successData.user.accessToken),
        ),
          setIndicator(false);
        navigation.navigate('Drawer', {
          routeDetails: 'FromPhoneLogin',
          OTP: response.data.successData.code,
          phoneNumber: phone,
          pass: password,
          NotToken: NotToken,
        });
      })
      .catch(error => {
        // Toast.show(error.response.data.message);
        setIndicator(false);
        console.log(error.response);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headingText}>Hi,</Text>
        <Text style={styles.subHeadingText}>
        Login into your account to explore more
        </Text>
        <InputIcon
          ViewStyle={styles.viewstyle}
          IconName={'phone'}
          IconType={'material-community'}
          IconColor={colors.customer.primary}
          IconSize={hp(4)}
          Placeholder={'Phone Number'}
          placeholderColor={colors.customer.primary}
          InputStyle={styles.inputstyle}
          TypeKeypad={'email-address'}
          secureTextEntry={false}
          onChangeText={text => setPhone(text)}
          Value={phone}
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
          Title="Login"
          Button={styles.button}
          TextStyle={styles.btntext}
          Indicator={indicator}
          btnPress={() => LogIn()}
        />
        <View style={styles.bottomText}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.customer.white,
                fontFamily: 'Poppins-Regular',
              }}>
              Are you new?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerSignUp')}>
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
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.customer.primary,
    paddingHorizontal: wp(2),
  },
  headingText: {
    color: colors.customer.secondary,
    fontSize: hp('4%'),
    // fontSize: 25,
    fontFamily: 'Poppins-Bold',
    // fontWeight: 'bold',
  },
  subHeadingText: {
    color: colors.customer.white,
    textAlign: 'center',
    width: wp(80),
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
    fontSize: hp('2%'),

    // fontSize: 25,
    // fontWeight: 'bold',
  },
  viewstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    height:hp(6),
    alignSelf: 'center',
    backgroundColor: colors.customer.white,
    borderRadius: 30,
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
    // backgroundColor:'gray',
  },
  inputstyle: {
    flex: 1,
    alignItems: 'flex-start',
    width: wp(50),
    paddingHorizontal: hp(1),
    fontFamily: 'Poppins-Regular',
    height:hp(6.5)


    // backgroundColor:'red',
  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.customer.secondary,
    borderColor: colors.blue,
    width: wp(80),
    height: hp(6),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
    shadowColor: colors.blue,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  bottomText: {
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // width: wp(130),
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 0,
    marginBottom: hp(1),
    marginLeft: wp(5),
  },
});
export default CutomerPhoneLogin;
