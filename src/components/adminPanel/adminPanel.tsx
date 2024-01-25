import React, {useEffect, useState} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';
import {viewheight} from '../../common/HelperFunctions';
import {navigate} from '../../common/Providers/GlobalNavRef';

type User = {
  firstName: string;
  fcmToken: string;
  uid: string;
};

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await firestore().collection('Users').get();
      const users = usersSnapshot.docs.map(doc => doc.data()) as User[];
      setUsers(users);
    };

    fetchUsers();
  }, []);

  const handleCreateNotification = (user: any) => {
    navigate('CreateNotification', {user});
  };

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <ScrollView style={styles.usersContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>UID</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>
        {users.map(user => (
          <View key={user.uid} style={styles.row}>
            <Text style={styles.cell}>{user.firstName}</Text>
            <Text style={styles.cell}>{user.uid}</Text>
            <View style={styles.buttonCell}>
              <Button
                title="Create"
                onPress={() => handleCreateNotification(user)}
                color="#90a9f1"
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  usersContainer: {
    marginTop: 10,
    marginBottom: viewheight(8),
  },
  headerRow: {
    flexDirection: 'row',
    // backgroundColor: '#90a9f1',
    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#90a9f1',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#90a9f1',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 0.5,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminPanel;
