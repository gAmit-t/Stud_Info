import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {DrawerParamList} from '../../common/interfaces';
import {viewheight} from '../../common/HelperFunctions';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

interface UserData {
  firstName: string;
  lastName: string;
}

const {width, height} = Dimensions.get('window');

const scale = (size: number) => (width / 350) * size;

const HeaderComponent = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore()
          .collection('Users')
          .doc(user.uid)
          .get();
        setUserData((userDoc.data() as UserData) || null);
      }
    };

    const fetchUnreadNotifications = async () => {
      const user = auth().currentUser;
      if (user) {
        const notifications = await firestore()
          .collection('Notifications')
          .where('userId', '==', user.uid)
          .where('isRead', '==', false)
          .get();
        setUnreadNotifications(notifications.docs.length);
      }
    };

    const intervalId = setInterval(() => {
      fetchUnreadNotifications();
    }, 60000); // Check every minute

    fetchUserData();
    fetchUnreadNotifications();

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.iconContainer}>
        <Image
          source={require('../../assets/menu_icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.text}>
        {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.iconContainer}>
        <Image
          source={require('../../assets/notifications_icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        {unreadNotifications > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadNotifications}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: viewheight(5),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconContainer: {
    height: '100%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: scale(18),
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
