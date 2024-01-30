import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {viewheight} from '../../common/HelperFunctions';
import {navigate} from '../../common/Providers/GlobalNavRef';
import FooterComponent from '../shared/footer';
import HeaderComponent from '../shared/header';
import {useFocusEffect} from '@react-navigation/native';
import {SERVER_KEY, tealColor} from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';

type User = {
  firstName: string;
  lastName: string;
  fcmToken: string;
  uid: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  gender: string;
  rollNo: string;
};

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await firestore().collection('Users').get();
      const users = usersSnapshot.docs.map(doc => doc.data()) as User[];
      setUsers(users);
      setisLoading(false);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
      return () => {};
    }, []),
  );

  const handleCreateNotification = (user: any) => {
    setSelectedUser(user);
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUserPress = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleNotificationSend = async () => {
    const FIREBASE_SERVER_KEY = SERVER_KEY;
    try {
      const message = {
        to: selectedUser?.fcmToken,
        notification: {
          title,
          body,
        },
        fcmOptions: {},
      };

      let headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'key=' + FIREBASE_SERVER_KEY,
      });
      setIsSending(true);
      let response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });

      response = await response.json();
      if (response) {
        // Show success snackbar here
        Snackbar.show({
          text: 'Notification sent successfully',
          duration: Snackbar.LENGTH_LONG,
        });
        setIsSending(false);
      } else {
        Snackbar.show({
          text: 'Notification sending failed. Please try again',
          duration: Snackbar.LENGTH_LONG,
        });
        setIsSending(false);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      Snackbar.show({
        text: 'Failed to send notification. Please try again later.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setTitle('');
    setBody('');
    setModalVisible(false);
  };

  const renderItem = ({item, index}: {item: User; index: number}) => (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.collapsibleContainer}
        onPress={() => handleUserPress(item.uid)}>
        <Text style={styles.placeholderContainer}>
          {item.gender == 'Male' ? '🙍🏻‍♂️' : '👩🏻'}
        </Text>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.firstName}</Text>
          <Text style={styles.userContact}>{item.phoneNumber}</Text>
        </View>
      </TouchableOpacity>

      {expandedUser === item.uid && (
        <View>
          <View style={styles.expandedContent}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                marginBottom: 5,
              }}>
              Address: {item.address1 + ', ' + item.address2}
            </Text>
            <Text style={{color: 'black', fontSize: 18, marginBottom: 5}}>
              Gender: {item.gender}
            </Text>
            <Text style={{color: 'black', fontSize: 18, marginBottom: 5}}>
              Roll No: {item.rollNo}
            </Text>
            {/* Add other user details as needed */}
          </View>

          <TouchableOpacity
            style={styles.sendNotificationButton}
            onPress={() => handleCreateNotification(item)}>
            <Text style={styles.buttonText}>Send Notification</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <HeaderComponent></HeaderComponent>
      <View style={styles.usersContainer}>
        {isLoading ? (
          <ActivityIndicator
            style={{
              marginTop: '20%',
              flex: 1,
              width: '100%',
              alignSelf: 'center',
            }}
            size="large"
            color={tealColor}
          />
        ) : (
          <View style={{marginTop: '3%', marginBottom: '8%'}}>
            <FlatList
              style={{marginHorizontal: 10, borderRadius: 20}}
              data={users}
              keyExtractor={item => item.uid}
              renderItem={renderItem}
            />
          </View>
        )}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.5}>
          <View style={styles.modalContainer}>
            <Text style={styles.selectedUserName}>
              Send Notification to {selectedUser?.firstName}
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Title"
              placeholderTextColor="grey"
              value={title}
              onChangeText={text => setTitle(text)}
            />

            {/* Message Textfield */}
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="grey"
              multiline
              value={body}
              onChangeText={text => setBody(text)}
            />

            {isSending ? (
              <ActivityIndicator
                style={{
                  alignSelf: 'center',
                }}
                size="large"
                color={tealColor}
              />
            ) : (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleNotificationSend}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </View>
      <FooterComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  usersContainer: {
    marginTop: 10,
    marginBottom: viewheight(8),
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginTop: 20,
    // justifyContent: 'space-between',
    // Light grey background for the entire list
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container: {
    backgroundColor: '#d3d3d3',
    elevation: 10, // For Android elevation
    shadowColor: 'rgba(0, 0, 0, 0.1)', // For iOS shadow
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 10,
    padding: 7,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    marginBottom: 10, // Add margin to create a gap between containers
  },
  collapsibleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
    color: 'black',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  userContact: {
    fontSize: 14,
    color: 'black',
  },
  expandedContent: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  placeholderContainer: {
    fontSize: 40,
    marginRight: 15,
  },
  sendNotificationButton: {
    backgroundColor: tealColor, // Green color, you can change it to your desired color
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    color: 'black',
    backgroundColor: '#f0f0f0', // Light grey background
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
    fontSize: 17,
  },
  messageInput: {
    color: 'black',
    fontSize: 17,
    backgroundColor: '#f0f0f0', // Light grey background
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 25,
    height: 100,
  },
  sendButton: {
    backgroundColor: tealColor, // Green color, you can change it to your desired color
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  sendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedUserName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: tealColor,
    alignSelf: 'center',
    marginBottom: 15,
  },
});

export default AdminPanel;
