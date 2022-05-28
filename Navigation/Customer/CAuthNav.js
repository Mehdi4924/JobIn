import React from 'react';
import {Image, Pressable} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomerLogin from '../../Screens/Customer/Auth/CutomerLogin';
import CustomerSignUp from '../../Screens/Customer/Auth/CutomerSignup';
import CustomerForgotPassword from '../../Screens/Customer/Auth/CustomerForgotPassword';
import CustomerEnterPin from '../../Screens/Customer/Auth/CustomerEnterPin';
import CustomerChangePass from '../../Screens/Customer/Auth/CustomerChangePass';
import CustomerSocialLogin from '../../Screens/Customer/Auth/CustomerSocialLogin';
import CutomerPhoneLogin from '../../Screens/Customer/Auth/CutomerPhoneLogin';

const AuthStack = createStackNavigator();

function CAuthNav({navigation}) {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="CustomerSocialLogin"
        component={CustomerSocialLogin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CustomerLogin"
        component={CustomerLogin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CustomerSignUp"
        component={CustomerSignUp}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CustomerForgotPassword"
        component={CustomerForgotPassword}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CustomerEnterPin"
        component={CustomerEnterPin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CustomerChangePass"
        component={CustomerChangePass}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CutomerPhoneLogin"
        component={CutomerPhoneLogin}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}
export default CAuthNav;
