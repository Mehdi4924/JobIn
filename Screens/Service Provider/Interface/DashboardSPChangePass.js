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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const DashboardSPChangePass = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [indicator, setIndicator] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);

  const Change = async () => {
    if (password == conPassword) {
      setIndicator(true);
      const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
      const AuthStr = 'Bearer '.concat(userToken);
      const data = new FormData();
      data.append('old_password', oldPassword);
      data.append('password', password);
      data.append('password_confirmation', conPassword);
      axios
        .post(URL + '/change-password', data, {
          headers: {
            Autorization: AuthStr,
          },
        })
        .then(response => {
          console.log('Password resetting Response', response);
          if (response.data.status == 200) {
            Toast.show(response.data.message);
            // console.log('Google Code is', response.data.successData);
            navigation.navigate('ServiceProviderDashBoard');
            setIndicator(false);
          } else {
            Toast.show(response.data.message, Toast.SHORT);
            setIndicator(false);
          }
        })
        .catch(error => {
          console.log(
            'Password Reset Response',
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
          Placeholder={'Enter Old Password'}
          placeholderColor={colors.customer.primary}
          InputStyle={styles.inputstyle}
          TypeKeypad={'default'}
          secureTextEntry={toggle}
          onChangeText={text => setOldPassword(text)}
          Value={oldPassword}
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
          Placeholder={'Enter New Password'}
          placeholderColor={colors.customer.primary}
          InputStyle={styles.inputstyle}
          TypeKeypad={'default'}
          secureTextEntry={toggle2}
          onChangeText={text => setPassword(text)}
          Value={password}
          IconRightName={toggle2 ? 'eye' : 'eye-outline'}
          IconRightType={'material-community'}
          IconRightColor={colors.customer.primary}
          IconRightSize={hp(3)}
          toggleEye={() => {
            setToggle2(!toggle2);
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
          secureTextEntry={toggle3}
          onChangeText={text => setConPassword(text)}
          Value={conPassword}
          IconRightName={toggle3 ? 'eye' : 'eye-outline'}
          IconRightType={'material-community'}
          IconRightColor={colors.customer.primary}
          IconRightSize={hp(3)}
          toggleEye={() => {
            setToggle3(!toggle3);
          }}
        />
        <Button
          Title="CHANGE"
          Button={styles.button}
          TextStyle={styles.btntext}
          indicatorColor={colors.serviceProvider.primary}
          Indicator={indicator}
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
    backgroundColor: colors.serviceProvider.white,
    paddingHorizontal: wp(2),
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
    marginVertical: hp(1),
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
    paddingHorizontal: 10,
    paddingBottom: hp(1),
    fontFamily: 'Poppins-Regular',
    // backgroundColor:'red',
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
    color: colors.serviceProvider.primary,
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
export default DashboardSPChangePass;
