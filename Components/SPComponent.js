import React from 'react';
import {Text, View, Image, FlatList, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SPComponent = props => {
  const renderItems = ({item}) => {
    return (
      <View style={props.parentView}>
        <View>
          <Image source={item.image} style={props.userImage} />
        </View>
        <Pressable onPress={props.goToChat}>
          <View style={{width: wp(70)}}>
            <View style={props.descView}>
              <Text style={props.nameText}>{item.packageName}</Text>
              <Text style={props.timeText}>6:45 Pm</Text>
            </View>
            <View style={{width: wp(45)}}>
              <Text numberOfLines={1} style={props.messageText}>
                {item.packageDes}
              </Text>
            </View>
          </View>
        </Pressable>
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
    />
  );
};

export default SPComponent;
