import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import {DrawerParamList} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';

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
      <Text>This is Notification component</Text>
    </View>
  );
};

export default Notifications;
