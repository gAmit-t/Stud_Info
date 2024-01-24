import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet} from 'react-native';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  CommonActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import PushNotification, {Importance} from 'react-native-push-notification';
import firebaseConfig from './firebaseConfig';
import {RootParamList} from './src/common/interfaces';
import {
  createNotification,
  sendLocalNotification,
} from './src/common/notificationHandler';
import Dashboard from './src/components/dashboard/dashboard';
import Login from './src/components/login/login';
import Notifications from './src/components/notifications/notifications';
import Profile from './src/components/profile/profile';
import RegisterUser from './src/components/profile/registerUser';

const Drawer = createDrawerNavigator();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

function ScreenToNavigate() {
  const navigation = useNavigation();
  if (auth().currentUser) {
    auth().signOut();
  }
  useEffect(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      }),
    );
  }, [navigation]);

  return <Login></Login>;
}

const MainStack = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="View Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Logout"
        component={ScreenToNavigate}
        options={{headerShown: false, unmountOnBlur: true}}
      />
    </Drawer.Navigator>
  );
};

function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState('Login');
  useEffect(() => {
    initPushNotification();
  }, []);

  // Initiate Push notification, create channel
  const initPushNotification = () => {
    PushNotification.configure({
      onRegister: function (token: any) {},
      onNotification: function (notification: any) {},

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.createChannel(
      {
        channelId: 'channel-id',
        channelName: 'My channel',
        channelDescription: 'A channel to categorise notifications',
        playSound: false,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );
  };

  const user = auth().currentUser;
  // Save in firestore when app in background(push notification is automatically handled)
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (user) {
      createNotification(
        user?.uid,
        remoteMessage.notification!['title'] ?? 'N/A',
        remoteMessage.notification!['body'] ?? 'N/A',
      );
      console.log('creates onBackground');
    }
  });

  // Send push notification and save in firestore when app in foreground
  messaging().onMessage(async remoteMessage => {
    if (user) {
      sendLocalNotification(
        remoteMessage.notification!['title'] ?? 'N/A',
        remoteMessage.notification!['body'] ?? 'N/A',
      );
      createNotification(
        user?.uid,
        remoteMessage.notification!['title'] ?? 'N/A',
        remoteMessage.notification!['body'] ?? 'N/A',
      );
      console.log(remoteMessage);
    }
  });

  const Stack = createNativeStackNavigator<RootParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainStack}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
