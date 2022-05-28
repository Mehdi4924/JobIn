import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ServiceProviderSocialLogin from '../../Screens/Service Provider/Auth/ServiceProviderSocialLogin';
import ServiceProviderLogin from '../../Screens/Service Provider/Auth/ServiceProviderLogin';
import ServiceProviderSignup from '../../Screens/Service Provider/Auth/ServiceProviderSignup';
import ServiceProviderForgotPassword from '../../Screens/Service Provider/Auth/ServiceProviderForgotPassword';
import ServiceProviderEnterPin from '../../Screens/Service Provider/Auth/ServiceProviderEnterPin';
import ServiceProviderChangePass from '../../Screens/Service Provider/Auth/ServiceProviderChangePass';
import ServiceProviderPhoneLogin from '../../Screens/Service Provider/Auth/ServiceProviderPhoneLogin';

const AuthStack = createStackNavigator();

function CAuthNav({navigation}) {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="ServiceProviderSocialLogin"
        component={ServiceProviderSocialLogin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderLogin"
        component={ServiceProviderLogin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderSignup"
        component={ServiceProviderSignup}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderForgotPassword"
        component={ServiceProviderForgotPassword}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderEnterPin"
        component={ServiceProviderEnterPin}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderChangePass"
        component={ServiceProviderChangePass}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="ServiceProviderPhoneLogin"
        component={ServiceProviderPhoneLogin}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}
export default CAuthNav;
