import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {DrawerParamList, RootParamList} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const HeaderComponent = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View
      style={{
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
      }}>
      <Text>This is header component</Text>
    </View>
  );
};

export default HeaderComponent;
