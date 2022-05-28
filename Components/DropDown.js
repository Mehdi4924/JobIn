import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import colors from '../Constants/colors';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Dropdown = props => {
  return (
    <View style={props.parentViewStyles}>
      <Icon
        style={props.leftIconStyle}
        name={props.leftIconName}
        type={props.leftIconType}
        size={props.leftIconSize}
        color={props.leftIconColor}
      />
      <ModalDropdown
        options={props.dropDownItems}
        style={props.DropdownStyle}
        defaultValue={props.dropDownDefaultValue}
        dropdownTextStyle={props.dropDownTextStyle}
        dropdownStyle={props.dropDownStyle}
        textStyle={props.textStyle}
        defaultTextStyle={props.defaultTextStyle}
        value={props.value}
        onSelect={props.onSelect}
        showsVerticalScrollIndicator={false}
      />
      <Icon
        style={props.rightIconStyle}
        name={props.rightIconName}
        type={props.rightIconType}
        size={props.rightIconSize}
        color={props.rightIconColor}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  line: {
    width: wp(42),
    height: hp(0.2),
    // backgroundColor: colors.gray,
  },
  dropDownText: {
    width: wp(25),
  },
  dropDownTextStyle: {
    fontSize: 15,
  },
});

export default Dropdown;
