import React from 'react';
import {Text, View, Image, FlatList, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AllSP = props => {
  const renderItems = ({item}) => {
    return (
      <View style={props.topView}>
        <View>
          <Image
            source={
              item.image == null
                ? require('../Assets/dummy2.png')
                : {uri: item.image}
            }
            style={props.userImage}
          />
        </View>
        <View style={props.parentView}>
          <Pressable onPress={() => props.goToProfile(item)}>
            <View style={{width: wp(70)}}>
              <View style={{width: wp(45)}}>
                <Text style={props.serviceNameText}>
                  {item.first_name == null ? 'N/A' : item.first_name}
                </Text>
              </View>
              <View style={props.amountView}>
                <Text numberOfLines={1} style={props.startingText}>
                  Starting From
                </Text>
                <Text style={props.amountText}>
                  {item.start_from == null ? 'N/A' : item.start_from}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
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

export default AllSP;
