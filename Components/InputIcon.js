import React from 'react';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const InputIcon = props => {
  return (
    <View style={props.ViewStyle}>
      <TouchableOpacity onPress={props.iconClick}>
        <Icon
          name={props.IconName}
          type={props.IconType}
          color={props.IconColor}
          size={props.IconSize}
          style={{marginHorizontal: wp(3)}}
        />
      </TouchableOpacity>
      <TextInput
        placeholder={props.Placeholder}
        placeholderTextColor={props.placeholderColor}
        style={props.InputStyle}
        onChangeText={props.onChangeText}
        value={props.Value}
        keyboardType={props.TypeKeypad}
        secureTextEntry={props.secureTextEntry}
        onSubmitEditing={props.onSubmitEditing}
      />
      <TouchableOpacity onPress={props.toggleEye}>
        <Icon
          name={props.IconRightName}
          type={props.IconRightType}
          color={props.IconRightColor}
          size={props.IconRightSize}
          style={{marginHorizontal: wp(3)}}
        />
      </TouchableOpacity>
    </View>
  );
};
export default InputIcon;
