import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {DrawerParamList, INotificationCardItem} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';
import NotificationCard from './NotificationCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {viewheight} from '../../common/HelperFunctions';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<INotificationCardItem[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Re-fetch notifications when the screen comes into focus
      fetchNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchNotifications = async () => {
    const userId = auth().currentUser?.uid || '';
    console.log(userId);
    if (!userId) return;

    try {
      const notificationsCollection = firestore().collection('Notifications');
      const querySnapshot = await notificationsCollection
        .where('userId', '==', userId)
        .orderBy('isRead', 'asc')
        .orderBy('timestamp', 'desc')
        .get();

      const notificationsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as INotificationCardItem[];

      const unreadNotifications = notificationsData.reduce(
        (count, notification) => (notification.isRead ? count : count + 1),
        0,
      );
      setUnreadCount(unreadNotifications);

      setNotifications(notificationsData);

      // Mark all notifications as read
      const batch = firestore().batch();
      notificationsData.forEach(notification => {
        if (!notification.isRead) {
          const notificationRef = firestore()
            .collection('Notifications')
            .doc(notification.id);
          batch.update(notificationRef, {isRead: true});
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClose = async (id: string) => {
    Alert.alert(
      'Close Notification',
      'Are you sure you want to remove this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setNotifications(prevNotifications =>
              prevNotifications.map(notification =>
                notification.id === id
                  ? {...notification, isClosed: true}
                  : notification,
              ),
            );

            try {
              await firestore().collection('Notifications').doc(id).update({
                isClosed: true,
              });

              setUnreadCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
            } catch (error) {
              console.error('Failed to update isClosed field:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <ScrollView style={styles.notificationContainer}>
        {notifications.map(
          notification =>
            !notification.isClosed && (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                title={notification.title}
                timestamp={notification.timestamp}
                message={notification.message}
                isClosed={notification.isClosed}
                isRead={notification.isRead}
                onClose={() => handleClose(notification.id)}
              />
            ),
        )}
      </ScrollView>
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  notificationContainer: {
    marginTop: 10,
    marginBottom: viewheight(8),
  },
});

export default Notifications;
