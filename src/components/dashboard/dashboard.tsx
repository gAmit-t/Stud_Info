import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FooterComponent from '../shared/footer';
import HeaderComponent from '../shared/header';
import Calendar from './Calendar';
import Courses from './Courses';
import MyTabBar from './field_container';
import {viewheight} from '../../common/HelperFunctions';

const Tab = createMaterialTopTabNavigator();

function Dashboard(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <Tab.Navigator
        style={styles.contextContainer}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="Courses" component={Courses} />
        <Tab.Screen name="Calendar" component={Calendar} />
      </Tab.Navigator>
      <FooterComponent></FooterComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  contextContainer: {
    marginTop: 10,
    marginBottom: viewheight(8),
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Dashboard;
