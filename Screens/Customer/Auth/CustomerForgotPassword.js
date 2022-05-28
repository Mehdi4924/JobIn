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
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const CustomerForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [indicator, setIndicator] = useState(false);

  const Reset = () => {
    setIndicator(true);
    const data = new FormData();
    data.append('email', email);
    axios
      .post(URL + '/forget-password', data)
      .then(response => {
        console.log('Google Responce', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          // console.log('Google Code is', response.data.successData);
          navigation.navigate('CustomerEnterPin', {
            routeDetails: 'FromForgotPassLogin',
            OTP: response.data.successData,
            userEmail: email
          });
          setIndicator(false);
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
        }
      })
      .catch(error => {
        console.log('Google Error Responce', JSON.parse(JSON.stringify(error.response)));
        setIndicator(false);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headingText}>Forgot Password?</Text>
        <Text style={styles.subHeadingText}>
        Submit the email you signed up with to reset your password
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
        <Button
          Title="Proceed"
          Button={styles.button}
          TextStyle={styles.btntext}
          Indicator={indicator}
          indicatorColor={colors.customer.primary}
          btnPress={() => Reset()}
        />
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
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  subHeadingText: {
    color: colors.customer.white,
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
    width: wp(70),
    paddingHorizontal: 10,
    // backgroundColor:'red',
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
    // paddingVertical: 6
    // alignSelf:'center',
    color: colors.white,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(130),
    position: 'absolute',
    bottom: 0,
    marginBottom: hp(3),
  },
});
export default CustomerForgotPassword;
