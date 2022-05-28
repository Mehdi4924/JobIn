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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CustomerChangePass = ({route, navigation}) => {
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [toggle, setToggle] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [indicator, setIndicator] = useState(false);

  const Change = async () => {
    if (password == conPassword) {
      // const user = JSON.parse(await AsyncStorage.getItem('User'));
      // const accessToken = user.data.successData.accessToken;
      // const AuthStr = 'Bearer '.concat(user.accessToken);
      setIndicator(true);
      const data = new FormData();
      data.append('email', route.params.userEmail);
      data.append('password', password);
      data.append('password_confirmation', conPassword);
      console.log('Formdata',data);
      axios
        .post(URL + '/reset-password', data)
        .then(response => {
          console.log('Google Responce', response);
          if (response.data.status == 200) {
            Toast.show(response.data.message);
            // console.log('Google Code is', response.data.successData);
            navigation.navigate('CustomerLogin');
            setIndicator(false);
          } else {
            Toast.show(response.data.message, Toast.SHORT);
            setIndicator(false);
          }
        })
        .catch(error => {
          console.log(
            'Google Error Responce',
            JSON.parse(JSON.stringify(error)),
          );
          setIndicator(false);
          Toast.show(error.response.data.message, Toast.SHORT);
        });
    } else {
      Toast.show("Password Don't Match", Toast.SHORT);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headingText}>Change Password</Text>
        <Text style={styles.subHeadingText}>
        Change your account password
        </Text>
        <InputIcon
          ViewStyle={styles.viewstyle}
          IconName={'lock'}
          IconType={'material-community'}
          IconColor={colors.customer.primary}
          IconSize={hp(4)}
          Placeholder={'Enter New Password'}
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
        <InputIcon
          ViewStyle={styles.viewstyle}
          IconName={'lock'}
          IconType={'material-community'}
          IconColor={colors.customer.primary}
          IconSize={hp(4)}
          Placeholder={'Re-Enter Password'}
          placeholderColor={colors.customer.primary}
          InputStyle={styles.inputstyle}
          TypeKeypad={'default'}
          secureTextEntry={toggle2}
          onChangeText={text => setConPassword(text)}
          Value={conPassword}
          IconRightName={toggle2 ? 'eye' : 'eye-outline'}
          IconRightType={'material-community'}
          IconRightColor={colors.customer.primary}
          IconRightSize={hp(3)}
          toggleEye={() => {
            setToggle2(!toggle2);
          }}
        />
        <Button
          Title="CHANGE"
          Button={styles.button}
          TextStyle={styles.btntext}
          Indicator={indicator}
          indicatorColor={colors.customer.primary}
          btnPress={() => Change()}
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
    fontFamily: 'Poppins-Bold',

    // fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(130),
    position: 'absolute',
    bottom: 0,
    marginBottom: hp(3),
  },
});
export default CustomerChangePass;
