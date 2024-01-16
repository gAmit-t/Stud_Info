import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DrawerParamList, INotificationCardItem} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';
import NotificationCard from './NotificationCard';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<INotificationCardItem[]>([
    {
      id: '1',
      title: 'Title 1',
      timestamp: 'Timestamp 1',
      message: 'Message 1',
      isClosed: false,
    },
    {
      id: '2',
      title: 'Title 2',
      timestamp: 'Timestamp 2',
      message: 'Message 2',
      isClosed: false,
    },
  ]);

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
