import React from 'react';
import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import colors from '../Constants/colors';
import {Button} from 'react-native';

const CategoriesComponent = props => {
  const renderItems = ({item}) => {
    return (
      <View style={props.catMainView}>
        <View style={{marginLeft: wp(4)}}>
          <Image
            source={
              item.image != null
                ? {uri: item.image}
                : require('../Assets/dummy.png')
            }
            style={props.catIcon}
          />
          <Text numberOfLines={1} style={props.catHeadingText}>
            {item.name}
          </Text>
          <Text style={props.catSubHeadingText}>
            {item.userprofession_count} Professionals
          </Text>
        </View>
        <TouchableOpacity
          style={props.catButton}
          onPress={() => props.onPressViewAll(item.name)}>
          <Text style={props.catButtonText}>View All</Text>
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
export default CategoriesComponent;
