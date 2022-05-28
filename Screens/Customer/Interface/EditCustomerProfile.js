import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Dropdown from '../../../Components/DropDown';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import Button from '../../../Components/Button';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {color} from 'react-native-elements/dist/helpers';

const EditCustomerProfile = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState();
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [imageObj, setimageObj] = useState();
  const [indicator, setIndicator] = useState(false);
  const [userData, setuserData] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const User = JSON.parse(await AsyncStorage.getItem('User'));
    console.log('Data from async', User);
    setuserData(User);
  };

  const Edit = async () => {
    setIndicator(true);
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append(
      'first_name',
      username != undefined && username != null && username != ''
        ? username
        : userData.first_name,
    );
    data.append(
      'phone',
      phone != undefined && phone != '' ? phone : userData.phone,
    );
    data.append(
      'email',
      email != undefined && email != '' ? email : userData.email,
    );
    data.append(
      'address',
      address != undefined && address != '' ? address : userData.address,
    );
    data.append(
      'gender',
      gender != undefined && gender != '' ? gender : userData.gender,
    );
    data.append(
      'image',
      imageObj != undefined && imageObj != null
        ? imageObj
        : (userData.image = !null ? '' : ''),
    );

    console.log('form dataaaaaaaaaaaaaaaaaaa', data);
    axios
      .post(URL + '/customer-update-profile', data, {
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
          navigation.navigate('Dashboard');
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
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colors.customer.primary,
      }}
      behavior="padding"
      enabled>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: wp(30),
              alignSelf: 'center',
              marginTop: hp(10),
            }}>
            <Image
              source={
                imageObj != null
                  ? {uri: imageObj.uri}
                  : userData != undefined && userData.image != null
                  ? {uri: userData.image}
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
              userData != undefined && userData.first_name != null
                ? userData.first_name
                : 'Enter Name'
            }
            placeholderTextColor={colors.customer.primary}
            style={styles.InputStyle}
            onChangeText={setUsername}
            value={username}
            keyboardType="default"
            secureTextEntry={false}
          />
          <TextInput
            placeholder={
              userData != undefined && userData.email != null
                ? userData.email
                : 'Enter Email'
            }
            placeholderTextColor={colors.customer.primary}
            style={styles.InputStyle}
            onChangeText={setEmail}
            value={email}
            keyboardType="default"
            secureTextEntry={false}
          />
          <TextInput
            placeholder={
              userData != undefined && userData.phone != null
                ? userData.phone
                : 'Enter Phone'
            }
            placeholderTextColor={colors.customer.primary}
            style={styles.InputStyle}
            onChangeText={setPhone}
            value={phone}
            keyboardType="default"
            secureTextEntry={false}
          />
          <Dropdown
            parentViewStyles={styles.dropDownView}
            leftIconStyle={styles.dropDownIcon}
            leftIconName={''}
            leftIconType={''}
            leftIconSize={hp(3.5)}
            leftIconColor={colors.serviceProvider.secondary}
            dropDownItems={['Male', 'Female']}
            DropdownStyle={styles.Dropdown}
            dropDownDefaultValue={
              userData != undefined &&
              userData.gender != null &&
              userData.gender != 'undefined'
                ? userData.gender
                : 'Choose Gender'
            }
            dropDownTextStyle={styles.dropDownTextStyle}
            dropDownStyle={styles.dropDownText}
            textStyle={styles.textStyles}
            defaultTextStyle={styles.defaultTextStyles}
            value={gender}
            onSelect={(index, value) => {
              setGender(value);
            }}
            // rightIconStyle={styles.dropDownIcon}
            rightIconName={'menu-down'}
            rightIconType={'material-community'}
            rightIconSize={hp(3.5)}
            rightIconColor={colors.serviceProvider.secondary}
          />

          <TextInput
            placeholder={
              userData != undefined && userData.address != null
                ? userData.address
                : 'Enter Address'
            }
            placeholderTextColor={colors.customer.primary}
            style={styles.InputStyle}
            onChangeText={setAddress}
            value={address}
            keyboardType="default"
            secureTextEntry={false}
          />
          <Button
            Title="UPDATE"
            Button={styles.button}
            TextStyle={styles.btntext}
            Indicator={indicator}
            indicatorColor={colors.customer.primary}
            btnPress={() => Edit()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customer.primary,
    // justifyContent: 'center',
    alignItems: 'center',
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
    marginVertical: hp(2),
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

  InputStyle: {
    width: wp(80),
    height: hp(6),
    backgroundColor: colors.customer.white,
    // marginHorizontal: wp(1),
    marginTop: hp(2),
    borderRadius: 30,
    paddingHorizontal: wp(7),
    fontFamily: 'Poppins-Regular',
    paddingBottom: hp(1),
  },
  imageStyle: {
    height: 100,
    width: 100,
    // alignSelf: 'center',
    borderRadius: 100,
    // backgroundColor: 'red',
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
    width: wp(60),
    marginLeft: wp(3),
    height: hp(4),
    marginTop: hp(1),
    // justifyContent:'center',
    color: colors.serviceProvider.primary,
    // borderBottomWidth: 1,
    // backgroundColor:'red'
  },
  dropDownText: {
    width: wp(65),
    height: hp(15),
    backgroundColor: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
    color: colors.serviceProvider.primary,
  },
  dropDownView: {
    marginTop: hp(2),
    width: wp(80),
    height: hp(6),
    borderColor: 'gray',
    borderRadius: 25,
    backgroundColor: colors.customer.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  dropDownIcon: {
    marginLeft: wp(4),
  },
  dropDownTextStyle: {
    backgroundColor: colors.serviceProvider.secondary,
    color: colors.serviceProvider.white,
    fontFamily: 'Poppins-Regular',
  },
  textStyles: {
    color: colors.customer.primary,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  defaultTextStyles: {
    color: colors.serviceProvider.secondary,
    marginBottom: hp(1.5),
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
});
export default EditCustomerProfile;
