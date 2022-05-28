import React from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon, ListItem} from 'react-native-elements';
import colors from '../Constants/colors';
import {Button} from 'react-native';
import {Pressable} from 'react-native';

const ProfileView = props => {
  const renderItems = ({item}) => {
    // console.log('Items are', item);
    return (
      <View style={props.profileMainView}>
        <TouchableOpacity onPress={() => props.profileOnPresss(item)}>
          <Image
            source={
              item.image == null
                ? require('../Assets/dummy.png')
                : {uri: item.image}
            }
            style={props.profileImageStyle}
          />
          <TouchableOpacity
            style={props.profileIconContainer}
            onPress={() => props.onFavourite(item)}>
            {item.favourite == false ? (
              <Icon
                name={props.iconName}
                type="material-community"
                size={props.iconSize}
                color={colors.customer.primary}
              />
            ) : (
              <Icon
                name={props.favIconName}
                type="material-community"
                size={props.favIconSize}
                color={colors.customer.primary}
              />
            )}
          </TouchableOpacity>
          <View style={{paddingHorizontal: 10}}>
            <Text
              style={props.profileHeadingText}
              numberOfLines={props.numberOfLines}>
              {item.first_name} {item.last_name}
            </Text>
            <View style={props.profileSubHeading}>
              <Text
                style={props.profileSubHeadingText}
                numberOfLines={props.numberOfLines}>
                Starting From
              </Text>
              <Text style={props.profilePriceText}>{item.start_from}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <FlatList
      data={props.flatData}
      numColumns={props.numColumns}
      horizontal={props.horizontalView}
      renderItem={item => renderItems(item)}
      keyExtractor={item => item.packageName}
      showsHorizontalScrollIndicator={props.horizontalScroll}
    />
  );
};

export default ProfileView;
