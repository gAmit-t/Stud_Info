import React, {useEffect} from 'react';
import {Alert, StyleSheet, useColorScheme} from 'react-native';

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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import firebaseConfig from './firebaseConfig';
import {RootParamList} from './src/common/interfaces';
import Dashboard from './src/components/dashboard/dashboard';
import Login from './src/components/login/login';
import Notifications from './src/components/notifications/notifications';
import RegisterUser from './src/components/profile/registerUser';
import Profile from './src/components/profile/profile';

const Drawer = createDrawerNavigator();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
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
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage.notification?.body),
      );
    });
    return unsubscribe;
  }, []);

  const Stack = createNativeStackNavigator<RootParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
