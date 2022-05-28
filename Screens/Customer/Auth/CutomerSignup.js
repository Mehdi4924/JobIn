import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,ScrollView,
  Pressable,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import {TouchableOpacity} from 'react-native';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CustomerSignup = ({navigation}) => {
  const [email, setemail] = useState('');
  const [username, setusername] = useState('');
  const [phone, setphone] = useState('');
  const [password, setpassword] = useState('');
  const [toggle, setToggle] = useState(true);
  const [indicator, setIndicator] = useState(false);

  const Signup = async () => {
    setIndicator(true);
    const data = new FormData();
    data.append('first_name', username);
    data.append('phone', phone);
    data.append('email', email);
    data.append('password', password);
    axios
      .post(URL + '/user-register', data)
      .then(response => {
        console.log('Google Responce', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          // console.log('Google Code is', response.data.successData);
          navigation.navigate('CustomerSocialLogin');
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
    <KeyboardAvoidingView
      style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
      behavior="padding"
      enabled>
        <View style={styles.container}>
          <Text style={styles.toptext}>Welcome!</Text>
          <Text style={styles.subtext}>
            Don't have a account, Create your account and get started
          </Text>
          <InputIcon
            ViewStyle={styles.viewstyle}
            IconName={'account-outline'}
            IconType={'material-community'}
            IconColor={colors.customer.primary}
            IconSize={hp(3.5)}
            Placeholder={'Username'}
            placeholderColor={colors.customer.primary}
            InputStyle={styles.inputstyle}
            TypeKeypad={'email-address'}
            SecureText={false}
            onChangeText={text => setusername(text)}
            Value={username}
          />
          <InputIcon
            ViewStyle={styles.viewstyle}
            IconName={'phone-outline'}
            IconType={'material-community'}
            IconColor={colors.customer.primary}
            IconSize={hp(3.5)}
            Placeholder={'Phone Number'}
            placeholderColor={colors.customer.primary}
            InputStyle={styles.inputstyle}
            TypeKeypad={'default'}
            SecureText={false}
            onChangeText={text => setphone(text)}
            Value={phone}
          />
          <InputIcon
            ViewStyle={styles.viewstyle}
            IconName={'email-outline'}
            IconType={'material-community'}
            IconColor={colors.customer.primary}
            IconSize={hp(3.5)}
            Placeholder={'Email'}
            placeholderColor={colors.customer.primary}
            InputStyle={styles.inputstyle}
            TypeKeypad={'email-address'}
            SecureText={false}
            onChangeText={text => setemail(text)}
            Value={email}
          />
          <InputIcon
            ViewStyle={styles.viewstyle}
            IconName={'lock-outline'}
            IconType={'material-community'}
            IconColor={colors.customer.primary}
            IconSize={hp(3.5)}
            Placeholder={'Password'}
            placeholderColor={colors.customer.primary}
            InputStyle={styles.inputstyle}
            TypeKeypad={'default'}
            secureTextEntry={toggle}
            onChangeText={text => setpassword(text)}
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
            Title="SIGNUP"
            Button={styles.button}
            TextStyle={styles.btntext}
            indicatorColor={colors.customer.primary}
            Indicator={indicator}
            btnPress={() => Signup()}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerSocialLogin')}>
            <Text style={styles.lastview}>
              Already have an account?
              <Text style={styles.color}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  color: {
    color: colors.customer.secondary,
  },
  toptext: {
    color: colors.customer.secondary,
    // fontWeight: 'bold',
    // marginVertical: 5,
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    // fontSize: 16,
    color: colors.customer.white,
    fontWeight: '500',
    width: wp(65),
    textAlign: 'center',
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
  },
  viewstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    height: hp(6),
    backgroundColor: colors.customer.white,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.customer.white,
    borderRadius: 25,
    marginVertical: hp(1),
    paddingHorizontal: wp(5),
  },
  inputstyle: {
    flex: 1,
    width: wp(70),
    // backgroundColor:'red',
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    height: hp(6.5),
  },
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.customer.secondary,
    borderColor: colors.customer.secondary,
    width: wp(80),
    height: hp(6),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.customer.primary,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  lastview: {
    color: colors.customer.white,
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
export default CustomerSignup;
