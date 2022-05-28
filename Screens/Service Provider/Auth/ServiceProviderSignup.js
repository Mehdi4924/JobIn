import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputIcon from '../../../Components/InputIcon';
import Button from '../../../Components/Button';
import Dropdown from '../../../Components/DropDown';
import {TouchableOpacity} from 'react-native';
import URL from '../../../Constants/URL';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

const ServiceProviderSignup = ({navigation}) => {
  const [user, setuserData] = useState('');
  const [toggle, setToggle] = useState(true);
  const [indicator, setIndicator] = useState(false);
  const [professionSearch, setProfessionSearch] = useState([]);
  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);

  useEffect(() => {
    getProfession();
  }, []);

  const setUserValue = v => {
    setuserData({...user, ...v});
  };
  console.log('user isssss', user);
  console.log('user myLatitude', myLatitude);
  console.log('user myLongitude', myLongitude);

  const Signup = async () => {
    if (myLatitude == null && myLongitude == null) {
      Toast.show('Please Enter Valid Address');
    } else {
      setIndicator(true);
      const data = new FormData();
      data.append('first_name', user.firstName);
      data.append('last_name', user.secondName);
      data.append('phone', user.phone);
      data.append('email', user.email);
      data.append('qualification', user.qualification);
      data.append('profession', user.profession);
      data.append('address', user.address);
      data.append('start_from', user.rates);
      data.append('type', 'service_provider');
      data.append('password', user.password);
      data.append('latitude', myLatitude);
      data.append('longitude', myLongitude);
      axios
        .post(URL + '/service-provider-register', data)
        .then(response => {
          console.log('signup Response', response);
          if (response.data.status == 200) {
            Toast.show(response.data.message);
            // console.log('Google Code is', response.data.successData);
            navigation.navigate('ServiceProviderSocialLogin');
            setIndicator(false);
          } else {
            Toast.show(response.data.message, Toast.SHORT);
            setIndicator(false);
          }
        })
        .catch(error => {
          console.log('Error Responce', JSON.parse(JSON.stringify(error)));
          setIndicator(false);
          Toast.show(error.response.data.message, Toast.SHORT);
        });
    }
  };

  const getProfession = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    console.log('user Token is:---------->>>>', userToken);
    // const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/profession`)
      .then(response => {
        // console.log('All Profession Response is:---------->>>>', response);
        setProfessionSearch(
          response.data.successData.professions.map(item => {
            return item.name;
          }),
        );
      })
      .catch(error => {
        console.log(
          'All Profession error response',
          JSON.parse(JSON.stringify(error)),
          Toast.show('Professional Unavailable', Toast.SHORT),
        );
      });
  };
  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}
          enabled
          keyboardVerticalOffset={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
            <View style={styles.container}>
              <Text style={styles.toptext}>Welcome!</Text>
              <Text style={styles.subtext}>
                Don't have a account, Create your account and get started
              </Text>
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'account-outline'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'First Name'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'default'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({firstName: text})}
                Value={user.firstName}
              />
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'account-outline'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Last Name'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'default'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({secondName: text})}
                Value={user.secondName}
              />
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'phone-outline'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Phone Number'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'numeric'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({phone: text})}
                Value={user.phone}
              />
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'email-outline'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Email'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'email-address'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({email: text})}
                Value={user.email}
              />
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'school'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Qualification'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'email-address'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({qualification: text})}
                Value={user.qualification}
              />

              <Dropdown
                parentViewStyles={styles.dropDownView}
                leftIconStyle={styles.dropDownIcon}
                leftIconName={'briefcase-outline'}
                leftIconType={'material-community'}
                leftIconSize={hp(3.5)}
                leftIconColor={colors.serviceProvider.secondary}
                dropDownItems={professionSearch}
                DropdownStyle={styles.Dropdown}
                dropDownDefaultValue={'Profession'}
                dropDownTextStyle={styles.dropDownTextStyle}
                dropDownStyle={styles.dropDownText}
                textStyle={styles.textStyles}
                defaultTextStyle={styles.defaultTextStyles}
                value={user.qualification}
                onSelect={(index, value) => {
                  setUserValue({profession: value});
                  console.log('dropdown twxt', value);
                }}
                // rightIconStyle={styles.dropDownIcon}
                rightIconName={'menu-down'}
                rightIconType={'material-community'}
                rightIconSize={hp(3.5)}
                rightIconColor={colors.serviceProvider.secondary}
              />

              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'currency-usd'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Rates Starting From'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'default'}
                secureTextEntry={false}
                onChangeText={text => setUserValue({rates: text})}
                Value={user.rates}
              />
              <GooglePlacesAutocomplete
                placeholder="Add Address"
                renderLeftButton={() => (
                  <Icon
                    name="map-marker-outline"
                    type="material-community"
                    color={colors.serviceProvider.secondary}
                    size={hp(3.5)}
                    style={{
                      marginTop: hp(1),
                      marginLeft: wp(3),
                      // backgroundColor: colors.serviceProvider.primary,
                    }}
                  />
                )}
                styles={{
                  container: {
                    width: wp(80),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.serviceProvider.primary,
                    borderRadius: 40,
                    marginVertical: hp(0.7),
                  },
                  listView: {
                    width: wp(80),
                    alignSelf: 'center',
                    backgroundColor: colors.customer.primary,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  },
                  textInputContainer: {
                    height: hp(5.5),
                    width: wp(80),
                    multiline: false,
                    numberOfLines: 1,
                    marginVertical: hp(1),
                    alignSelf: 'center',
                    // borderRadius: 80,
                    // marginTop: hp(1),
                    // backgroundColor: colors.customer.primary,
                    // marginHorizontal: wp(2),
                  },
                  textInput: {
                    height: hp(5),
                    // width:wp(10),
                    backgroundColor: colors.serviceProvider.primary,
                    borderRadius: 20,
                    color: colors.customer.primary,
                    marginBottom: 8,
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    // backgroundColor: 'red',
                  },
                  predefinedPlacesDescription: {
                    color: colors.customer.primary,
                  },
                  description: {
                    color: colors.serviceProvider.primary,
                  },
                  row: {
                    backgroundColor: colors.serviceProvider.secondary,
                  },
                  separator: {
                    backgroundColor: colors.serviceProvider.white,
                  },
                  poweredContainer: {
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  },
                }}
                fetchDetails={true}
                onPress={(data, details = null, geometry) => {
                  console.log('data ha yh', data);
                  console.log('Check long ,lat', details);
                  setMyLatitude(details.geometry.location.lat);
                  setMyLongitude(details.geometry.location.lng);
                  setUserValue({address: data.description});
                }}
                onFail={error => console.error(error)}
                query={{
                  key: 'AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4',
                  language: 'en',
                }}
              />
              <InputIcon
                ViewStyle={styles.viewstyle}
                IconName={'lock-outline'}
                IconType={'material-community'}
                IconColor={colors.serviceProvider.secondary}
                IconSize={hp(3.5)}
                Placeholder={'Password'}
                placeholderColor={colors.serviceProvider.secondary}
                InputStyle={styles.inputstyle}
                TypeKeypad={'default'}
                secureTextEntry={toggle}
                onChangeText={text => setUserValue({password: text})}
                Value={user.password}
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
                indicatorColor={colors.serviceProvider.primary}
                Indicator={indicator}
                btnPress={() => {
                  Signup();
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ServiceProviderSocialLogin')
                }>
                <Text style={styles.lastview}>
                  Already have an account?{' '}
                  <Text style={styles.color}> Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  color: {
    color: colors.customer.secondary,
  },
  toptext: {
    color: colors.customer.secondary,
    marginTop: hp(8),
    marginVertical: 5,
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    fontSize: 16,
    color: colors.customer.black,
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
    height: hp(7),
    backgroundColor: colors.serviceProvider.primary,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.serviceProvider.primary,
    borderRadius: 25,
    marginVertical: hp(1),
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
    backgroundColor: colors.serviceProvider.secondary,
    borderColor: colors.serviceProvider.secondary,
    width: wp(80),
    height: hp(7),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
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
  lastview: {
    color: colors.serviceProvider.black,
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  Dropdown: {
    width: wp(60),
    marginLeft: wp(2),
  },
  dropDownText: {
    width: wp(60),
    color: colors.serviceProvider.secondary,
    backgroundColor: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
  },
  dropDownView: {
    backgroundColor: colors.serviceProvider.primary,
    marginVertical: hp(1),
    width: wp(80),
    height: hp(7),
    borderColor: 'gray',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dropDownIcon: {
    // marginLeft: wp(2),
  },
  dropDownTextStyle: {
    backgroundColor: colors.serviceProvider.secondary,
    color: colors.serviceProvider.primary,
    fontFamily: 'Poppins-Regular',
  },
  textStyles: {
    marginLeft: wp(3),
    color: colors.customer.primary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  defaultTextStyles: {
    color: colors.serviceProvider.secondary,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
});
export default ServiceProviderSignup;
