import React from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from '../login/login';
import Notifications from '../notifications/notifications';
import Profile from '../profile/profile';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';

function Dashboard(): React.JSX.Element {
  const Drawer = createDrawerNavigator();
  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <View style={styles.contentContainer}>
        <Text>This is dashboard</Text>
      </View>
      <FooterComponent></FooterComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Dashboard;
