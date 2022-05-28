import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import axios from 'axios';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import PushNotification from 'react-native-push-notification';
import URL from '../../../Constants/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceProviderSocialLogin = ({navigation}) => {
  const [indicator, setIndicator] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [NotificationToken, setNotificationToken] = useState('');

  useEffect(() => {
    // <<<<<<<--------------------------Notificatoin Tہken-------------------->>>>>>>

    // initialize the Google SDK
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '905631795286-trnodia1d3ip81o4d398ieqa9d8tbhat.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: '905631795286-70b7fbjkc4btm2kahfl2lka7q19s0729.apps.googleusercontent.com',  // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    });
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        setNotificationToken(token.token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
    setToken();
  }, []);
  const setToken = async () => {
    await AsyncStorage.setItem('NotificationToken', NotificationToken);
  };
  // <<<<<<<--------------------------Facebook Sign In-------------------->>>>>>>

  const SignInFacebook = async () => {
    // handleFacebookLogin()
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    await LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('UserData', data);
            const {accessToken} = data;
            getuserInfo(accessToken);
          });
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
        }
      },
      function (error) {
        console.log(
          'Login fail with error: ',
          JSON.parse(JSON.stringify(error)),
        );
      },
    );
  };

  const getuserInfo = token => {
    console.log('Check token', token);
    setIndicator(true);
    axios
      .get(
        `https://graph.facebook.com/me?fields=email,name,friends,picture.type(large)&access_token=${token}&Limit=8`,
      )
      .then(response => {
        console.log('fbData', response);
        // If request is good...
        // setSocialData(response);
        //    axios call for LoginFB
        //  social_id , login_type , name ,  phone , email , image
        const fbdata = new FormData();
        fbdata.append('social_id', response.data.id);
        fbdata.append('login_type', 'facebook');
        fbdata.append('type', 'service_provider');
        fbdata.append('name', response.data.name);
        fbdata.append('email', response.data.email);
        fbdata.append('notification_token', NotificationToken);
        // fbdata.append('phone', '');
        // fbdata.append('image', response.data.picture.data.url);
        console.log('Facebook FOrmData', fbdata);

        axios
          .post(URL + '/social-login', fbdata)
          .then(async response => {
            console.log('Facebook Response', response);
            if (response.data.status == 200) {
              Toast.show(response.data.message);
              await AsyncStorage.setItem(
                'User',
                JSON.stringify(response.data.successData),
              );
              await AsyncStorage.setItem(
                'AccessToken',
                JSON.stringify(response.data.successData.accessToken),
              );
              navigation.replace('SPDrawer');
              setIndicator(false);
            } else {
              Toast.show(response.data.message, Toast.SHORT);
            }
          })
          .catch(error => {
            console.log(
              'Facebook Error Responce',
              JSON.parse(JSON.stringify(error)),
            );
            setIndicator(false);
            Toast.show(error.response.data.message, Toast.SHORT);
          });
      })
      .catch(error => {
        console.log('error ' + error);
        setIndicator(false);
      });
  };
  // <<<<<<<--------------------------Google Sign In-------------------->>>>>>>
  const signInGoogle = async () => {
    try {
      setIndicator2(true);
      // console.log('hi');
      await GoogleSignin.hasPlayServices();
      // console.log('hi 2');
      const userInfo = await GoogleSignin.signIn();
      console.log('UserInfo Recieved is', userInfo);
      const googleData = new FormData();
      googleData.append('social_id', userInfo.user.id);
      googleData.append('login_type', 'google');
      googleData.append('name', userInfo.user.name);
      googleData.append('email', userInfo.user.email);
      googleData.append('type', 'service_provider');
      googleData.append('notification_token', NotificationToken);
      // this.setState({ userInfo });
      console.log('Form data gf google contain', googleData);
      axios
        .post(URL + '/social-login', googleData)
        .then(async response => {
          console.log('Google Responce', response);
          if (response.data.status == 200) {
            Toast.show(response.data.message);
            await AsyncStorage.setItem(
              'User',
              JSON.stringify(response.data.successData),
            );
            await AsyncStorage.setItem(
              'AccessToken',
              JSON.stringify(response.data.successData.accessToken),
            );
            navigation.replace('SPDrawer');
            setIndicator2(false);
          } else {
            Toast.show(response.data.message, Toast.SHORT);
            setIndicator2(false);
          }
        })
        .catch(error => {
          console.log(
            'Google Error Responce',
            JSON.parse(JSON.stringify(error)),
          );
          setIndicator2(false);
          Toast.show(error.response.data.message, Toast.SHORT);
        });
    } catch (error) {
      setIndicator2(false);
      console.log('Error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show('cancelled by user');
        setIndicator2(false);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        setIndicator2(false);
        Toast.show('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setIndicator2(false);
        Toast.show('Play services not available');
      } else {
        // some other error happened
        setIndicator2(false);
        Toast.show('cancelled');
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.allButtons}>
          <Text style={styles.headingText}>Hi,</Text>
          <Text style={styles.subHeadingText}>
          Create you account on Jobin to connect with the service providers
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ServiceProviderLogin', {
                NotToken: NotificationToken,
              })
            }
            style={styles.buttonView}>
            <Icon
              name="email-outline"
              type="material-community"
              color={colors.customer.primary}
              size={hp(4)}
              style={{paddingHorizontal: wp(5)}}
            />
            <Text
              style={{paddingHorizontal: wp(3), fontFamily: 'Poppins-Regular'}}>
              Login With Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ServiceProviderPhoneLogin', {
                NotToken: NotificationToken,
              })
            }
            style={styles.buttonView}>
            <Icon
              name="phone"
              type="material-community"
              color={colors.customer.primary}
              size={hp(4)}
              style={{paddingHorizontal: wp(5)}}
            />
            <Text
              style={{paddingHorizontal: wp(3), fontFamily: 'Poppins-Regular'}}>
              Login With Phone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => SignInFacebook()}
            style={styles.buttonView}>
            {indicator ? (
              <ActivityIndicator
                style={{marginLeft: wp(32)}}
                color={colors.customer.primary}
                size={'small'}
              />
            ) : (
              <View style={styles.buttonView}>
                <Icon
                  name="facebook"
                  type="material-community"
                  color={colors.customer.primary}
                  size={hp(4)}
                  style={{paddingHorizontal: wp(5)}}
                />
                <Text
                  style={{
                    paddingHorizontal: wp(3),
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Login With Facebook
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signInGoogle()}
            style={styles.buttonView}>
            {indicator2 ? (
              <ActivityIndicator
                style={{marginLeft: wp(32)}}
                color={colors.customer.primary}
                size={'small'}
              />
            ) : (
              <>
                <Icon
                  name="google"
                  type="material-community"
                  color={colors.customer.primary}
                  size={hp(4)}
                  style={{paddingHorizontal: wp(5)}}
                />
                <Text
                  style={{
                    paddingHorizontal: wp(3),
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Login With Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {/* <----------------------SKIP LOGIN BUTTON-------------------> */}
        <View style={styles.bottomText}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.serviceProvider.black,
                opacity: 0.5,
                fontFamily: 'Poppins-Regular',
              }}>
              Are you new?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ServiceProviderSignup')}>
              <Text
                style={{
                  color: colors.serviceProvider.secondary,
                  fontFamily: 'Poppins-Regular',
                }}>
                {' '}
                Signup
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.bottomSkipText}
            onPress={
              () => navigation.replace('SPDrawer')
              // Toast.show('Work in progress')
            }>
            <Text
              style={{
                color: colors.serviceProvider.black,
                fontFamily: 'Poppins-Regular',
                opacity: 0.5,
              }}>
              Skip LogIn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.serviceProvider.white,
    // alignContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: wp(2),
    //
  },
  allButtons: {
    flex: 0.99,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',

    // fontSize: 25,
    // fontWeight: 'bold',
  },
  buttonView: {
    flexDirection: 'row',
    width: wp(70),
    backgroundColor: colors.serviceProvider.primary,
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: hp(30),
    marginVertical: hp(1),
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: wp(95),
    marginBottom: hp(1),
    // marginLeft: wp(5),
    // width: wp(130),
    // position: 'absolute',
    // bottom: 0,
    // backgroundColor: 'red',
    // marginBottom: hp(3),
    // marginLeft: wp(8),
    // marginTop: hp(30),
    // height:hp(30)
  },
  bottomSkipText: {
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // width: wp(130),
    // marginBottom: hp(3),
    // marginLeft: wp(40),
    // alignSelf: 'flex-start',
    // position: 'absolute',
    // bottom: hp(2),
    // right: wp(1),
  },
});
export default ServiceProviderSocialLogin;
