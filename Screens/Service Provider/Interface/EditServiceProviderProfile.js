import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Button from '../../../Components/Button';
import Dropdown from '../../../Components/DropDown';
import {Icon} from 'react-native-elements';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditServiceProviderProfile = ({navigation}) => {
  const [user, setuserData] = useState('');
  const [getUser, setGetUser] = useState('');
  const [image, setImage] = useState();
  const [indicator, setIndicator] = useState(false);
  const [professionSearch, setProfessionSearch] = useState([]);
  const [imageObj, setimageObj] = useState();
  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);

  useEffect(() => {
    getProfile();
    getProfession();
  }, []);

  const setUserValue = v => {
    setuserData({...user, ...v});
  };

  const getProfession = async () => {
    // const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    setuserData(User);
    // console.log('user Token is:---------->>>>', userToken);
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

  const Edit = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    // console.log('Data from async', User);
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append(
      'first_name',
      user.name != undefined ? user.name : getUser.first_name,
    );
    data.append('phone', user.phone != undefined ? user.phone : getUser.phone);
    data.append('email', user.email != undefined ? user.email : getUser.email);
    data.append('latitude', myLatitude != null ? myLatitude : getUser.latitude);
    data.append(
      'longitude',
      myLongitude != null ? myLongitude : getUser.longitude,
    );
    data.append(
      'address',
      user.address != undefined && user.address != null && user.address != ''
        ? user.address
        : getUser.address,
    );
    data.append(
      'start_from',
      user.rates != undefined && user.rates != null && user.rates != ''
        ? user.rates
        : getUser.start_from,
    );
    data.append(
      'description',
      user.desc != undefined && user.desc != null && user.desc != ''
        ? user.desc
        : getUser.description,
    );
    data.append(
      'profession',
      user.profession != undefined &&
        user.profession != null &&
        user.profession != ''
        ? user.profession
        : getUser.profession,
    );
    data.append(
      'qualification',
      user.qualification != undefined
        ? user.qualification
        : getUser.qualification,
    );
    data.append(
      'gender',
      user.gender != undefined && user.gender != null && user.gender != ''
        ? user.gender
        : getUser.gender,
    );
    data.append(
      'image',
      imageObj != undefined && imageObj != null
        ? imageObj
        : (getUser.image = !null ? '' : ''),
    );

    console.log('form dataaaaaaaaaaaaaaaaaaa', data);

    axios
      .post(URL + '/update-profile', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(async response => {
        console.log('Response update', response);
        if (response.data.status == 200) {
          Toast.show(response.data.message);
          await AsyncStorage.setItem(
            'User',
            JSON.stringify(response.data.successData.user),
          );
          navigation.navigate('ServiceProviderDashBoard');
          setIndicator(false);
        } else {
          Toast.show(response.data.message, Toast.SHORT);
          setIndicator(false);
        }
      })
      .catch(error => {
        console.log(
          'Error Response on update',
          JSON.parse(JSON.stringify(error)),
        );
        setIndicator(false);
        Toast.show(error.response.data.message, Toast.SHORT);
      });
  };

  const getProfile = async () => {
    const UserData = JSON.parse(await AsyncStorage.getItem('User'));
    console.log('Data from async', UserData);
    setGetUser(UserData);
    // const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    // const AuthStr = 'Bearer '.concat(userToken);
    // setToken(AuthStr);
    // axios
    //   .get(`${URL}/edit-profile`, {
    //     headers: {
    //       Authorization: AuthStr,
    //     },
    //   })
    //   .then(response => {
    //     console.log('profile Data is:---------->>>>', response);
    //   })
    //   .catch(error => {
    //     console.log('Error Responce', JSON.parse(JSON.stringify(error)));
    //   });
  };

  const imagePick = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      // console.log('Response by image pick===== ', response);
      imageObjCreate(response.assets[0]);
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setImage(response.assets[0].uri);
      // setimageObj(response.assets[0]);
    });
  };
  let imageToSend = {};
  const imageObjCreate = item => {
    imageToSend.name = item.fileName;
    imageToSend.type = item.type;
    imageToSend.uri = item.uri;
    setimageObj(imageToSend);
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
              <View style={{flexDirection: 'row', marginTop: hp(2)}}>
                <Image
                  source={
                    imageObj != null
                      ? {uri: imageObj.uri}
                      : getUser != undefined && getUser.image != null
                      ? {uri: getUser.image}
                      : image == undefined
                      ? require('../../../Assets/dummy.png')
                      : {uri: image}
                  }
                  style={styles.imageStyle}
                />
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => imagePick()}>
                  <Icon
                    name={'pencil-outline'}
                    type={'material-community'}
                    color={colors.customer.primary}
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder={
                  getUser != undefined &&
                  getUser.first_name != null &&
                  getUser.first_name != undefined
                    ? getUser.first_name
                    : 'Enter Name'
                }
                placeholderTextColor={colors.customer.primary}
                style={styles.InputStyle}
                onChangeText={text => setUserValue({name: text})}
                value={user.name}
                keyboardType="default"
                secureTextEntry={false}
              />
              <TextInput
                placeholder={
                  getUser != undefined &&
                  getUser.email != null &&
                  getUser.email != undefined
                    ? getUser.email
                    : 'Enter Email'
                }
                placeholderTextColor={colors.customer.primary}
                style={styles.InputStyle}
                onChangeText={text => setUserValue({email: text})}
                value={user.email}
                keyboardType="default"
                secureTextEntry={false}
              />
              <TextInput
                placeholder={
                  getUser != undefined &&
                  getUser.phone != null &&
                  getUser.phone != undefined
                    ? getUser.phone
                    : 'Enter Phone Number'
                }
                placeholderTextColor={colors.customer.primary}
                style={styles.InputStyle}
                onChangeText={text => setUserValue({phone: text})}
                value={user.phone}
                keyboardType="default"
                secureTextEntry={false}
              />
              <TextInput
                placeholder={
                  getUser != undefined &&
                  getUser.start_from != null &&
                  getUser.start_from != undefined
                    ? getUser.start_from
                    : 'Enter Rate'
                }
                placeholderTextColor={colors.customer.primary}
                style={styles.InputStyle}
                onChangeText={text => setUserValue({rates: text})}
                value={user.rates}
                keyboardType="default"
                secureTextEntry={false}
              />
              <TextInput
                placeholder={
                  getUser != undefined &&
                  getUser.qualification != null &&
                  getUser.qualification != undefined
                    ? getUser.qualification
                    : 'Choose Qualification'
                }
                placeholderTextColor={colors.customer.primary}
                style={styles.InputStyle}
                onChangeText={text => setUserValue({qualification: text})}
                value={user.qualification}
                keyboardType="default"
                secureTextEntry={false}
              />

              <GooglePlacesAutocomplete
                placeholder={
                  getUser != undefined &&
                  getUser.address != null &&
                  getUser.address != undefined
                    ? getUser.address
                    : 'Enter Address'
                }
                styles={{
                  container: {
                    width: wp(80),
                    // height:hp(6),
                    backgroundColor: colors.serviceProvider.primary,
                    multiline: false,
                    numberOfLines: 1,
                    borderRadius: 25,
                    marginTop: hp(2),
                  },
                  listView: {
                    width: wp(80),
                    alignSelf: 'center',
                    backgroundColor: colors.customer.primary,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  },
                  textInputContainer: {
                    width: wp(75),
                    marginLeft: wp(4),
                    // height: hp(7),
                    // paddingHorizontal: wp(3),
                  },
                  textInput: {
                    backgroundColor: colors.serviceProvider.primary,
                    borderRadius: 50,
                    color: colors.customer.primary,
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    // height: hp(8),
                    // marginLeft: wp(8),
                    // backgroundColor: 'red',
                  },
                  predefinedPlacesDescription: {
                    color: colors.customer.primary,
                  },
                  description: {
                    color: colors.serviceProvider.primary,
                    // marginLeft:10
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
                  console.log('Check long ,lat', details.geometry.location);
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
              <View style={{marginTop: hp(1)}}>
                <Dropdown
                  parentViewStyles={styles.dropDownView}
                  leftIconStyle={styles.dropDownIcon}
                  // leftIconName={''}
                  // leftIconType={''}
                  leftIconSize={hp(3.5)}
                  leftIconColor={colors.serviceProvider.secondary}
                  dropDownItems={professionSearch}
                  DropdownStyle={styles.Dropdown}
                  dropDownDefaultValue={
                    getUser != undefined && getUser.profession != null
                      ? getUser.profession
                      : 'Choose Profession'
                  }
                  dropDownTextStyle={styles.dropDownTextStyle}
                  dropDownStyle={styles.dropDownText}
                  textStyle={styles.textStyles}
                  defaultTextStyle={styles.defaultTextStyles}
                  value={user.profession}
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
                {console.log(
                  'lat long set hony ka bad',
                  myLatitude,
                  myLongitude,
                )}

                <Dropdown
                  parentViewStyles={styles.dropDownView}
                  leftIconStyle={styles.dropDownIcon}
                  // leftIconName={''}
                  // leftIconType={''}
                  leftIconSize={hp(3.5)}
                  leftIconColor={colors.serviceProvider.secondary}
                  dropDownItems={['Male', 'Female']}
                  DropdownStyle={styles.Dropdown}
                  dropDownDefaultValue={
                    getUser != undefined &&
                    getUser.gender != null &&
                    getUser.gender != undefined
                      ? getUser.gender
                      : 'Choose Gender'
                  }
                  dropDownTextStyle={styles.dropDownTextStyle}
                  dropDownStyle={styles.dropDownText}
                  textStyle={styles.textStyles}
                  defaultTextStyle={styles.defaultTextStyles}
                  value={user.qualification}
                  onSelect={(index, value) => {
                    setUserValue({gender: value});
                    // console.log('genderrrrrrr twxt', value);
                  }}
                  // rightIconStyle={styles.dropDownIcon}
                  rightIconName={'menu-down'}
                  rightIconType={'material-community'}
                  rightIconSize={hp(3.5)}
                  rightIconColor={colors.serviceProvider.secondary}
                />
              </View>
              <View style={styles.descInputStyle}>
                <TextInput
                  multiline={true}
                  numberOfLines={2}
                  placeholder={
                    getUser != undefined && getUser.description != null
                      ? getUser.description
                      : 'Enter Description'
                  }
                  placeholderTextColor={colors.customer.primary}
                  style={{fontFamily: 'Poppins-Regular'}}
                  onChangeText={text => setUserValue({desc: text})}
                  value={user.desc}
                  keyboardType="default"
                  secureTextEntry={false}
                />
              </View>
              <Button
                Title="UPDATE"
                Button={styles.button}
                TextStyle={styles.btntext}
                indicatorColor={colors.serviceProvider.primary}
                Indicator={indicator}
                btnPress={() => Edit()}
              />
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
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.serviceProvider.secondary,
    borderColor: colors.serviceProvider.secondary,
    width: wp(80),
    height: hp(6),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(2),
    elevation: 5,
  },
  btntext: {
    fontSize: 14,
    color: colors.serviceProvider.primary,
    marginVertical: hp(1),
    fontFamily: 'Poppins-SemiBold',
  },

  InputStyle: {
    width: wp(80),
    height: hp(6),
    backgroundColor: colors.serviceProvider.primary,
    marginTop: hp(2),
    borderRadius: 30,
    paddingHorizontal: wp(7),
    fontFamily: 'Poppins-Regular',
    paddingBottom: hp(1),
  },
  descInputStyle: {
    width: wp(80),
    height: hp(20),
    backgroundColor: colors.serviceProvider.primary,
    marginTop: hp(1),
    borderRadius: 30,
    paddingHorizontal: wp(7),
    fontFamily: 'Poppins-Regular',
    paddingBottom: hp(1),
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  editIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.customer.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 3,
  },
  Dropdown: {
    width: wp(65),
    marginLeft: wp(2),
  },
  dropDownText: {
    width: wp(68),
    color: colors.serviceProvider.secondary,
    backgroundColor: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
  },
  dropDownView: {
    backgroundColor: colors.serviceProvider.primary,
    marginVertical: hp(1),
    width: wp(80),
    height: hp(6),
    borderColor: 'gray',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dropDownIcon: {
    marginLeft: wp(4),
  },
  dropDownTextStyle: {
    backgroundColor: colors.serviceProvider.secondary,
    color: colors.serviceProvider.primary,
    fontFamily: 'Poppins-Regular',
  },
  textStyles: {
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
export default EditServiceProviderProfile;
