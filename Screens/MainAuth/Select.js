import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/colors';

const Select = ({navigation}) => {
  return (

   
      <View style={styles.container}>
         <StatusBar hidden />
        <Pressable
          onPress={() => {
            navigation.replace('CustomerNavigation');
          }}>
          <View style={styles.sub}>
            <View style={styles.imageView}>
              <Image
                source={require('../../Assets/Customer.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.subView}>
              <Text style={styles.subTextCustomer}>LOGIN AS</Text>
              <Text style={styles.headingTextCustomer} numberOfLines={1}>
                CUSTOMER?
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.replace('SPNavigation');
          }}>
          <View style={styles.sub}>
            <View style={styles.imageView}>
              <Image
                source={require('../../Assets/SP.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.subView}>
              <Text style={styles.subTextProvider}>LOGIN AS</Text>
              <Text style={styles.headingTextProvider}>SERVICE PROVIDER?</Text>
            </View>
          </View>
        </Pressable>
      </View>
    
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
  sub: {
    height: hp(20),
    width: wp(80),
    backgroundColor: colors.customer.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: hp(2),
    elevation: 2,
    // shadowColor: colors.customer.black,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
  },
  image: {
    height: hp(18),
    width: wp(25),
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
  imageView: {
    width: wp(30),
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  subView: {
    // backgroundColor:'brown',
    width: wp(40),
    marginLeft: wp(3),
  },
  subTextCustomer: {
    width: wp(25),
    color: colors.customer.secondary,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    fontSize: hp('2%'),
  },
  headingTextCustomer: {
    width: wp(40),
    color: colors.customer.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp('3%'),
    // fontWeight: 'bold',
  },
  subTextProvider: {
    color: colors.customer.primary,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    fontSize: hp('2%'),
  },
  headingTextProvider: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp('3.2%'),
    // fontSize: 20,
    // fontWeight: 'bold',
  },
});
export default Select;
