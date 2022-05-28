import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
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

const CustomerLogin = ({route, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(true);
  const [indicator, setIndicator] = useState(false);

  const {NotToken} = route.params;
  const Login = async () => {
    setIndicator(true);
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('notification_token', NotToken);
    data.append('type', 'customer');
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
          navigation.replace('Drawer');
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
        <View style={{height: '100%'}}>
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
              Indicator={indicator}
              indicatorColor={colors.customer.primary}
              btnPress={() => Login()}
            />
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.customer.white,
                  fontFamily: 'Poppins-Regular',
                }}>
                Forgot Password?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CustomerForgotPassword')}>
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
        {/* </ScrollView> */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.primary,
  },
  inputFeilds: {
    flex: 0.99,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: hp(1),
    fontFamily: 'Poppins-Regular',
    height:hp(6.5)
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
    color: colors.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
    // paddingVertical: 6
    // alignSelf:'center',
  },
  bottomText: {
    width: wp(95),
    alignSelf: 'center',
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // position: 'absolute',
    // bottom: 0,
    // marginBottom: hp(3),
    // marginLeft: wp(8),
    // backgroundColor:"red"
  },
});
export default CustomerLogin;
