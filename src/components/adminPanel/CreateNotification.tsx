import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootParamList} from '../../common/Interfaces';
import {SERVER_KEY} from '../../common/Constants';
import Snackbar from 'react-native-snackbar';
import {StackNavigationProp} from '@react-navigation/stack';
import {createNotification} from '../../common/NotificationHandler';

type CreateNotificationScreenRouteProp = RouteProp<
  RootParamList,
  'CreateNotification'
>;

type Props = {
  route: CreateNotificationScreenRouteProp;
};

const CreateNotification: React.FC<Props> = ({route}) => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {user} = route.params || {};
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const sendNotification = async () => {
    if (!title) {
      Alert.alert(
        'Missing Title',
        'Please enter a title for the notification.',
      );
      return;
    }
    if (!body) {
      Alert.alert(
        'Missing Body',
        'Please enter a body text for the notification.',
      );
      return;
    }
    const FIREBASE_SERVER_KEY = SERVER_KEY;
    try {
      const message = {
        to: user.fcmToken,
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

      let response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });

      response = await response.json();
      console.log(response);

      if (response) {
        // Show success snackbar here
        Snackbar.show({
          text: 'Notification sent successfully',
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        Snackbar.show({
          text: 'Notification sending failed. Please try again',
          duration: Snackbar.LENGTH_LONG,
        });
      }
      // Then navigate to AdminPanel
      navigation.navigate('AdminPanel');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert(
        'Error',
        'Failed to send notification. Please try again later.',
      );
    }
  };

  return (
    <View>
      <TextInput placeholder="Title" onChangeText={setTitle} value={title} />
      <TextInput placeholder="Body" onChangeText={setBody} value={body} />
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
};

export default CreateNotification;
