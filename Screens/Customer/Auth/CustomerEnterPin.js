import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'; 
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import colors from '../../../Constants/colors';
import Button from '../../../Components/Button';
import URL from '../../../Constants/URL';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const CELL_COUNT = 4;

export default function CustomerEnterPin({route, navigation}) {
  const [value, setValue] = useState('');
  const [indicator, setindicator] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [OTPcode, setOTPcode] = useState(route.params.OTP);

  const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onVerify = () => {
    setindicator(true);
    if (value == route.params.OTP || value == OTPcode) {
      Toast.show('Code Verified', Toast.SHORT);
      setindicator(false);
      //Route Check
      route.params.routeDetails == 'FromPhoneLogin'
        ? navigation.replace('Drawer')
        : navigation.navigate('CustomerChangePass', {
            userEmail: route.params.userEmail,
          });
    } else {
      setindicator(false);
      Toast.show('Invalid Code', Toast.SHORT);
    }
  };
  const Resend = async () => {
    // const token = await AsyncStorage.getItem('NotificationToken');
    setIndicator2(true);
    const formdata = new FormData();
    formdata.append('email', route.params.userEmail);
    axios
      .post(URL + '/forget-password', formdata)
      .then(async response => {
        console.log('response is OTP', response);
        setOTPcode(response.data.successData.code);
        Toast.show('Pin Resent', Toast.SHORT);
      })
      .catch(error => {
        // Toast.show(error.response.data.message);
        setIndicator2(false);
        console.log(error.response);
        Toast.show('Failed!', Toast.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topviewtext}>Enter Pin</Text>
      {/* <Text style={styles.text2}>
        Lorem Impusm Odor Lorem Impusm Odor Lorem Impusm Odor Lorem Impusm Odor
      </Text> */}
      <View style={{alignSelf: 'center'}}>
        {/* <Text style={styles.text2}>Welcome</Text> */}
        <Text style={styles.text2}>Email has been sent successfully</Text>
        <Text style={{fontSize: 16, color: 'white', alignSelf: 'center'}}>
          Note:
        </Text>
        <Text
          style={{
            width: '100%',
            fontSize: wp(3),
            // fontFamily: 'raleway-regular',
            marginTop: 5,
            color: '#fff',
            alignSelf: 'center',
          }}>
          If you are unable to find email,
        </Text>
        <Text
          style={{
            width: '100%',
            fontSize: wp(3),
            // fontFamily: 'raleway-regular',
            marginTop: 5,
            color: '#fff',
            alignSelf: 'center',
          }}>
          {' '}
          -Recheck provided email address
        </Text>
        <Text
          style={{
            width: '100%',
            fontSize: wp(3),
            // fontFamily: 'raleway-regular',
            fontWeight: 'bold',
            marginTop: 5,
            color: '#fff',
            alignSelf: 'center',
          }}>
          {' '}
          -Check the Spam/Junk/Promotion/folder in your Inbox
        </Text>
      </View>
      {/* <Text style={styles.text2}>{OTPcode}</Text> */}
      <View style={styles.code}>
        <CodeField
          //ref={ref}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      {console.log('this is code field value', value)}
      {console.log('Params sy any wala data', route.params.OTP)}
      <Button
        Title="CONFIRM"
        Button={styles.button}
        TextStyle={styles.btntext}
        Indicator={indicator}
        indicatorColor={colors.customer.primary}
        btnPress={() => onVerify()}
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={styles.opacity}>Did not receive the code?</Text>
        <TouchableOpacity onPress={() => Resend()}>
          <Text style={styles.resend}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 20,
    borderWidth: 2,
    borderColor: colors.customer.secondary,
    textAlign: 'center',
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    color: colors.customer.secondary,
  },
  focusCell: {
    borderColor: colors.customer.secondary,
  },
  code: {
    marginHorizontal: wp(15),
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.customer.primary,
  },
  text: {
    fontSize: 22,
    // fontFamily: 'Poppins-SemiBold',
    color: colors.customer.primary,
    alignSelf: 'center',
  },
  text2: {
    textAlign: 'center',
    marginVertical: hp(1),
    // fontSize: 15,
    color: colors.customer.white,
    width: wp(60),
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
  },
  email: {
    fontSize: hp(2.5),
    color: colors.customer.secondary,
    alignSelf: 'center',
    width: wp(70),
    marginHorizontal: wp(10),
    justifyContent: 'center',
    textAlign: 'center',
    marginVertical: hp(1),
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
    marginVertical: hp(3),
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
    color: colors.customer.primary,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },

  topview: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(10),
  },
  topviewtext: {
    color: colors.customer.secondary,
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
  },
  opacity: {
    // opacity: 0.25,
    color: colors.customer.white,
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  resend: {
    color: colors.customer.secondary,
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
