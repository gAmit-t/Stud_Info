import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerParamList} from '../../common/interfaces';
import {viewheight} from '../../common/HelperFunctions';
import auth from '@react-native-firebase/auth';

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
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
    // if (auth().currentUser) {
    //   await auth().signOut();
    // }
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
