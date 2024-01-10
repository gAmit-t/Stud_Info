import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {DrawerParamList} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Profile = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  const handleRegistration = () => {
    console.log('Registration Data:', {name, rollNo, gender, address});
  };

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <Text style={styles.labeltop}>Profile</Text>
      {
        <Image
          source={require('../../assets/c1.jpg')}
          style={styles.profileImage}
        />
      }

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Roll Number</Text>
      <TextInput
        style={styles.input}
        value={rollNo}
        onChangeText={text => setRollNo(text)}
        placeholder="Enter your roll number"
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioButton}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setGender('male')}>
          <View style={styles.radioCircle}></View>
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setGender('female')}>
          <View style={styles.radioCircle}></View>
          <Text>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setGender('other')}>
          <View style={styles.radioCircle}></View>
          <Text>Other</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={text => setAddress(text)}
        placeholder="Enter your address"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  labeltop: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    width: 350,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'blue',
    marginRight: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Profile;
