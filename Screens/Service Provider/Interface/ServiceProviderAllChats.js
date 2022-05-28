import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Chat from '../../../Components/Chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL from '../../../Constants/URL';
import { SwipeListView } from 'react-native-swipe-list-view';
const ServiceProviderAllChats = ({ navigation }) => {
  const [flatData, setFlatData] = useState(null);
  const [indicator, setIndicator] = useState(false);
  const [userId, setuserId] = useState('');

  useEffect(async () => {
    let data = JSON.parse(await AsyncStorage.getItem('User'));
    setuserId(data.id);
    getChatted();
  }, []);

  const getChatted = async () => {
    setIndicator(true);
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/chat-users`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All User chatted LIst is:---------->>>>', response);
        setFlatData(response.data.successData.chatuser);
        setIndicator(false);
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
        setIndicator(false);
      });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.sectionList}>
        {/* {console.log('HII', item)} */}
        {item.sender.id != userId || item.receiver.id != userId ? (
          <>
            <View>
              <Image
                source={
                  item.sender.id != userId
                    ? item.sender.image != null
                      ? { uri: item.sender.image }
                      : require('../../../Assets/dummy.png')
                    : item.receiver.id != userId
                      ? item.receiver.image != null
                        ? { uri: item.receiver.image }
                        : require('../../../Assets/dummy.png')
                      :
                      require('../../../Assets/dummy.png')
                }
                style={styles.userImage}
              />
            </View>
            <Pressable
              onPress={() => {
                console.log('profile click item', item);
                if (item.receiver.id != userId) {
                  console.log('go to chat 1');
                  navigation.navigate('ServiceProviderChat', {
                    userID: item.receiver.id,
                  });
                } else if (item.sender.id != userId) {
                  console.log('go to chat 2');
                  navigation.navigate('ServiceProviderChat', {
                    userID: item.sender.id,
                  })
                }


              }}>
              <View style={{ width: wp(70) }}>
                <View style={styles.descView}>
                  <Text style={styles.nameText}>
                    {item.sender.id != userId
                      ? item.sender.first_name
                      : item.receiver.id != userId
                        ? item.receiver.first_name
                        : 'Name'}
                  </Text>
                  <Text style={styles.timeText}>
                    {item.sender.id != userId
                      ? item.sender.start_from
                      : item.receiver.id != userId
                        ? item.receiver.start_from
                        : 'Rate'}
                  </Text>
                </View>
                <View style={{ width: wp(70), flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text numberOfLines={1} style={styles.messageText}>
                    Message Now...
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      name={'arrow-left'}
                      type={'material-community'}
                      color={colors.customer.secondary}
                      size={hp(2.5)}
                    />
                    <Text style={styles.swipeText}>Swipe</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider}></View>
            </Pressable>
          </>
        ) : (
          <></>
        )}
      </View>
    )
  }
  const deleteItem = async (data, rowMap) => {
    console.log('check your delete data ', data);
    console.log('check your id data ', userId);
    setIndicator(true);
    let rowKey = data.item;
    let form = new FormData();
    form.append('chat_user_id', data.item.receiver_id != userId ? data.item.receiver_id : data.item.sender_id   );
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .post(`${URL}/delete-chat-user`, form, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Delete Sucess is:---------->>>>', response);
        console.log('flatdata console', flatData);
        console.log('check the rowKey console', rowKey);
        console.log('check the rowMap console', rowMap);
        setFlatData(flatData.filter(e => e.id !== rowKey.id))
        openRef.forEach(item => {
          item.closeRow()
        })
        setIndicator(false);
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
        console.log('Error Responce', error.response);
        setIndicator(false);
      });
  }
  const renderHiddenItem = (data, rowMap) => (

    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={() => {
          console.log("adaddada", data)
          deleteItem(data, rowMap)
          // swiperRef.current.closeRow()
        }}
      >
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>

  );
  const openRef = []
  const openRow = (rowKey, rowMap) => {
    console.log('This row opened', rowKey, rowMap);
    openRef.push(rowMap[rowKey])
    console.log("all opened", openRef);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.serviceProvider.white }}>
      {/* {flatData!=null&& */}
      {indicator == null ? (
        <ActivityIndicator size={'small'} color={'red'} />
      ) : flatData == undefined || flatData.length == 0 ? (
        <Text style={styles.nothingFound}>Nothing Found</Text>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.serviceProvider.white }}>
          <SwipeListView
            // listViewRef={ref => swiperRef = ref}
            data={flatData}
            renderItem={renderItem}
            keyExtractor={(rowData, index) => {
              return rowData.id;
            }}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
            onRowDidOpen={(rowKey, rowMap) => openRow(rowKey, rowMap)}
            closeOnRowOpen={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  mainText: {
    color: colors.serviceProvider.white,
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    color: colors.serviceProvider.black,
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  parentView: {
    width: wp(100),
    height: hp(10),
    // backgroundColor: colors.customer.secondary,
    // borderBottomWidth: 1,
    borderColor: colors.serviceProvider.secondary,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 90,
    height: 75
  },
  deleteBtn: {
    backgroundColor: colors.customer.secondary,
    right: 0,
  },
  sectionList: {
    width: wp(100),
    height: hp(11),
    flexDirection: 'row',
    // borderBottomColor: 'white',
    // borderBottomWidth: 1,
    // justifyContent:'center
    alignItems: 'center',
    backgroundColor: colors.serviceProvider.white,
    // marginBottom:5
  },
  userImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 50,
    marginHorizontal: wp(5),
  },
  rowBack: {
    // alignItems: 'center',
    // backgroundColor: '#fff',
    flex: 1,
    //  width:'30%',
    // height:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  descView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Bold',
  },
  timeText: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
  },
  messageText: {
    color: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
  },
  swipeText: {
    color: colors.serviceProvider.secondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: wp(1)
  },
  nothingFound: {
    color: colors.customer.secondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: hp(2),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.serviceProvider.primary,
    width: wp(80),
    alignSelf: "flex-end",
    marginTop: hp(2)
  },
});


export default ServiceProviderAllChats;
