import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import colors from '../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    tokendata();
  }, []);
  const [authToken, setAuthToken] = useState('');

  const tokendata = async () => {
    let token = await AsyncStorage.getItem('AccessToken');
    let user = JSON.parse(await AsyncStorage.getItem('User'));
    console.log(user);
    if (token != null) {
      if (user.type == 'service_provider') {
        navigation.replace('SPNavigation', {screen: 'SPDrawer'});
      } else {
        navigation.replace('CustomerNavigation', {screen: 'Drawer'});
      }
    } else {
      setTimeout(() => {
        navigation.replace('Select');
      }, 1000);
    }
  };
  // setTimeout(() => {
  //   setAuthToken('');
  //   authToken != ''
  //     ? navigation.navigate('CustomerNavigation', {screen: 'Drawer'})
  //     : navigation.replace('Select');
  // }, 3000);

  return (
    <View style={styles.container}>
      <Image source={require('../../Assets/logo.png')} style={styles.logo} />
      {authToken != '' ? (
        <ActivityIndicator
          size="small"
          color={colors.customer.secondary}
          style={{position: 'absolute', bottom: hp(2)}}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.customer.primary,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 40,
    color: colors.customer.primary,
  },
  logo: {height: 200, width: 200, resizeMode: 'contain'},
});
export default SplashScreen;
