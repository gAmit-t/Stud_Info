import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {RouteProp} from '@react-navigation/native';
import {RootParamList} from '../../common/Interfaces';

type CreateNotificationScreenRouteProp = RouteProp<
  RootParamList,
  'CreateNotification'
>;

type Props = {
  route: CreateNotificationScreenRouteProp;
};

const CreateNotification: React.FC<Props> = ({route}) => {
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
    try {
      const message = {
        to: user.fcmToken,
        notification: {
          title,
          body,
        },
        fcmOptions: {},
      };

      const messageId = await messaging().sendMessage(message);
      console.log('Message ID:', messageId);

      Alert.alert(
        'Notification Sent',
        'The notification has been sent successfully.',
      );
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
