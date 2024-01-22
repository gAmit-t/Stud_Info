import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FooterComponent from '../shared/footer';
import HeaderComponent from '../shared/header';
import Calendar from './Calendar';
import Courses from './Courses';
import MyTabBar from './field_container';

const Tab = createMaterialTopTabNavigator();

function Dashboard(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
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
