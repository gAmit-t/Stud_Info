import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';

export const createNotification = async (
  uid: string,
  title: string,
  body: string,
) => {
  const notificationRef = await firestore().collection('Notifications').add({
    userId: uid,
    title: title,
    message: body,
    timestamp: firestore.Timestamp.now(),
    isRead: false,
    isClosed: false,
  });
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({
      notifications: firestore.FieldValue.arrayUnion(notificationRef.id),
    });
};

export const sendLocalNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: 'channel-id',
    title: title,
    message: message,
  });
};
