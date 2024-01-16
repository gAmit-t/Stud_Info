import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DrawerParamList, INotificationCardItem} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';
import NotificationCard from './NotificationCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<INotificationCardItem[]>(
    [],
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = auth().currentUser?.uid || '';
      console.log(userId);
      if (!userId) return;

      try {
        const notificationsCollection = firestore().collection('Notifications');
        console.log('NotificationCollection: ', notificationsCollection);
        const querySnapshot = await notificationsCollection
          .where('userId', '==', userId)
          .get();

        const notificationsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as INotificationCardItem[];

        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleClose = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? {...notification, isClosed: true}
          : notification,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <View style={styles.notificationContainer}>
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
                onClose={() => handleClose(notification.id)}
              />
            ),
        )}
      </View>
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationContainer: {
    marginTop: 10,
  },
});

export default Notifications;
