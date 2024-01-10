import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import {DrawerParamList} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
      }}>
      <HeaderComponent></HeaderComponent>
      <Text>This is notification component</Text>
      <FooterComponent></FooterComponent>
    </View>
  );
};

export default Notifications;
