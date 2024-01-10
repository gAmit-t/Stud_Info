import React from 'react';
import {StyleSheet, Text, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from '../login/login';
import Notifications from '../notifications/notifications';
import Profile from '../profile/profile';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';

function Dashboard(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Drawer = createDrawerNavigator();
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <FooterComponent></FooterComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Dashboard;
