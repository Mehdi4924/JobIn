import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../../Constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import URL from '../../../Constants/URL';
import {GiftedChat, InputToolbar, Bubble, Time} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';

const ServiceProviderChat = ({route}) => {
  const [message, setMessage] = useState([]);
  // const [prev, setPrev] = useState(false);
  const [myuser, setMyuser] = useState();
  const [uid, setuid] = useState();

  useEffect(async () => {
    getDetails();
    // getAllUsers();
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    const myuser = user.id;
    const uid = route.params.userID;

    const docid = uid > myuser ? myuser + '-' + uid : uid + '-' + myuser;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessage(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const getDetails = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    setMyuser(user.id);
    setuid(route.params.userID);
    console.log(route.params.userID);
    getAllMsg(route.params.userID, user.id);
  };

  const getAllMsg = async (userid, myid) => {
    const docid = userid > myid ? myid + '-' + userid : userid + '-' + myid;
    console.log('doc id is', docid);
    const querySnap = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    console.log('Get message repsonse', querySnap);

    const allMsg = querySnap.docs.map(docSnap => {
      // console.log('Get message repsonseeeeeeeeeeeee', docSnap.data());
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    console.log('all messages now contain', allMsg);
    setMessage(allMsg);
    // allMsg.length == 0 ? setPrev(true) : null;
  };

  const onSend = (messages = []) => {
    console.log('Message sent is :---', messages);
    const msg = messages[0];
    const mymsg = {
      ...msg,
      sentBy: myuser,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessage(previousMessages => GiftedChat.append(previousMessages, mymsg));

    const docid = uid > myuser ? myuser + '-' + uid : uid + '-' + myuser;
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
    sendID();
    sendNot();
  };

  const sendID = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append('receiver_id', uid);
    axios
      .post(URL + '/add-receiver-id', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Added User', response);
      })
      .catch(error => {
        console.log('Error Response', JSON.parse(JSON.stringify(error)));
        // Toast.show(error.response.data.message, Toast.SHORT);
      });
  };

  const sendNot = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('AccessToken'));
    const AuthStr = 'Bearer '.concat(userToken);
    const data = new FormData();
    data.append('user_id', uid);
    axios
      .post(URL + '/notification', data, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('notificaiton Data is:---------->>>>', response);
      })
      .catch(error => {
        console.log(
          'Notification error Response',
          JSON.parse(JSON.stringify(error)),
        );
      });
  };
  return (
    <>
      {console.log('UID is', uid)}
      {console.log('My id is', myuser)}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.serviceProvider.white,
        }}>
        <GiftedChat
          renderAvatar={null}
          messages={message}
          alwaysShowSend={true}
          onSend={messages => onSend(messages)}
          user={{
            _id: myuser,
          }}
          renderTime={props => {
            return (
              <Time
                {...props}
                timeTextStyle={{
                  left: {
                    color: colors.customer.white,
                  },
                  right: {
                    color: colors.customer.white,
                  },
                }}
              />
            );
          }}
          // renderInputToolbar={props => {
          //   return (
          //     <InputToolbar
          //       {...props}
          //       containerStyle={{
          //         height: hp(7),
          //         borderRadius: 30,
          //         backgroundColor: colors.customer.white,
          //         fontFamily: 'Poppins-Regular',
          //         marginBottom: hp(1),
          //         padding: 1,
          //         // width: wp(80),
          //         // marginHorizontal: wp(1),
          //         // marginTop: hp(3),
          //         // paddingHorizontal: wp(7),
          //         // paddingBottom: hp(1),
          //       }}
          //     />
          //   );
          // }}
          // renderSend={props => {
          //   return (
          //     <TouchableOpacity
          //       style={styles.sendButton}
          //       // onPress={()=>}
          //     >
          //       <Icon
          //         name={'arrow-right'}
          //         type={'material-community'}
          //         color={colors.customer.white}
          //         size={hp(5)}
          //       />
          //     </TouchableOpacity>
          //   );
          // }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: colors.serviceProvider.secondary,
                  },
                  left: {
                    color: colors.serviceProvider.white,
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.serviceProvider.primary,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginBottom: hp(1),
                  },
                  left: {
                    backgroundColor: colors.serviceProvider.secondary,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginBottom: hp(1),
                  },
                }}
              />
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dateTime: {
    color: colors.customer.secondary,
    alignSelf: 'center',
    marginVertical: hp(1),
    fontFamily: 'Poppins-Regular',
  },
  customerMessage: {
    backgroundColor: colors.customer.white,
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    width: wp(75),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    alignSelf: 'flex-start',
  },
  serviceProviderMessage: {
    backgroundColor: colors.customer.white,
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    width: wp(75),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    alignSelf: 'flex-end',
  },
  InputStyle: {
    width: wp(80),
    height: hp(7),
    backgroundColor: colors.customer.white,
    marginHorizontal: wp(1),
    marginTop: hp(3),
    borderRadius: 30,
    paddingHorizontal: wp(7),
    paddingBottom: hp(1),
    fontFamily: 'Poppins-Regular',
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp(2),
  },
  sendButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.customer.secondary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(1),
    marginBottom: hp(0.5),
  },
});

export default ServiceProviderChat;
