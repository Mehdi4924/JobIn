import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

const Button = props => {
  return (
    <TouchableOpacity onPress={props.btnPress} style={props.Button}>
      {props.Indicator ? (
        <ActivityIndicator color={props.indicatorColor} size={'small'} />
      ) : (
        <Text style={props.TextStyle}>{props.Title}</Text>
      )}
    </TouchableOpacity>
  );
};
export default Button;
