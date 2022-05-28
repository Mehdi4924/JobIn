import React, {useEffect, useState} from 'react';
import {Text, View, Image, FlatList, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Chat = props => {
  const [userId, setuserId] = useState('');
  useEffect(async () => {
    let data = JSON.parse(await AsyncStorage.getItem('User'));
    setuserId(data.id);
    // console.log('check current user ID', userId);
    // console.log('Display chat data', props.flatData);
  }, []);
  const renderItems = ({item}) => {
    return (
      <View style={props.parentView}>
        {item.sender.id != userId || item.receiver.id != userId ? (
          <>
            <View>
              <Image
                source={
                  item.sender.id != userId
                    ? item.sender.image != null
                      ? {uri: item.sender.image}
                      : require('../Assets/dummy.png')
                    : item.receiver.id != userId
                    ? item.receiver.image != null
                      ? {uri: item.receiver.image}
                      : require('../Assets/dummy.png')
                    : require('../Assets/dummy.png')
                }
                style={props.userImage}
              />
            </View>
            <Pressable
              onPress={() => {
                if (item.receiver.id != userId) {
                  console.log('go to chat 1');
                  props.goToChat(item.receiver.id);
                } else if (item.sender.id != userId) {
                  console.log('go to chat 2');
                  props.goToChat(item.sender.id);
                }
              }}>
              <View style={{width: wp(70)}}>
                <View style={props.descView}>
                  <Text style={props.nameText}>
                    {item.sender.id != userId
                      ? item.sender.first_name
                      : item.receiver.id != userId
                      ? item.receiver.first_name
                      : 'Name'}
                  </Text>
                  <Text style={props.timeText}>
                    {item.sender.id != userId
                      ? item.sender.start_from
                      : item.receiver.id != userId
                      ? item.receiver.start_from
                      : 'Rate'}
                  </Text>
                </View>
                <View style={{width: wp(45)}}>
                  <Text numberOfLines={1} style={props.messageText}>
                    Message Now...
                  </Text>
                </View>
              </View>
            <View style={props.divider}></View>
            </Pressable>
          </>
        ) : (
          <></>
        )}
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

export default Chat;
