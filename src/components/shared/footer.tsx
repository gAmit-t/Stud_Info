import auth from '@react-native-firebase/auth';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {viewheight} from '../../common/HelperFunctions';
import {DrawerParamList} from '../../common/Interfaces';
import {navigate} from '../../common/Providers/GlobalNavRef';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const FooterComponent = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSignOut = async () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          auth().signOut();
          navigate('Login', {});
        },
      },
    ]);
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.iconContainer}>
        <Image
          source={require('../../assets/home_icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.iconContainer}>
        <Image
          source={require('../../assets/logout_icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
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
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});

export default FooterComponent;
