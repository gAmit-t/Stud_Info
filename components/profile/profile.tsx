import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {DrawerParamList} from '../../common/interfaces';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {viewheight} from '../../common/HelperFunctions';
import {scrollTo} from 'react-native-reanimated';

//Om ahe jdfshudfs

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const Profile = () => {
  const [StudName, setStudName] = useState('');
  const [RollNo, setRollNo] = useState('');
  const [DOB, setDob] = useState(new Date());
  const [Gender, setGender] = useState('');
  const [Stud_address, setStudAddress] = useState('');
  const [States, setStates] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCancel = () => {
    // Reset all state values to their initial state
    setStudName('');
    setRollNo('');
    setDob(new Date());
    setGender('');
    setStudAddress('');
    setStates('');
    setCity('');
    setEmail('');
  };

  const handleRegistration = () => {
    //    if (!StudName || !RollNo || !DOB || !Gender || !Stud_address || !States || !city || !email) {
    //   console.error('All fields are required.');
    //   return;
    // }
    // Prepare the registration data as a JSON string
    const registrationData = JSON.stringify({
      StudName,
      RollNo,
      DOB,
      Gender,
      Stud_address,
      States,
      city,
      email,
    });
    console.log(registrationData);

    // Make a POST request to your API
    fetch('http://agdisk.com/oldV/api/Student/ResgiterStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: registrationData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the API response data
        console.log('API Response:', data);
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
      });
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    const dateOnly = selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : '';
    setDob(dateOnly);
  };

  return (
    <View>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <HeaderComponent></HeaderComponent>
            <View style={styles.contentContainer}>
              <Text style={styles.labeltop}>Profile</Text>
              <View style={styles.contentContainerp}>
                <Image
                  source={require('../../assets/c1.jpg')}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={StudName}
                  onChangeText={text => setStudName(text)}
                  placeholder="Enter your name"
                />
                <Text style={styles.label}>Roll Number</Text>
                <TextInput
                  style={styles.input}
                  value={RollNo}
                  onChangeText={text => setRollNo(text)}
                  placeholder="Enter your roll number"
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholder="Enter your Email"
                />

                <Picker
                  selectedValue={Gender}
                  onValueChange={itemValue => setGender(itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.buttonText}>Select Date of Birth</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={DOB}
                    mode={'date'}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={Stud_address}
                  onChangeText={text => setStudAddress(text)}
                  placeholder="Enter your address"
                  multiline
                />

                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={States}
                  onChangeText={text => setStates(text)}
                  placeholder="Enter your state"
                />

                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={text => setCity(text)}
                  placeholder="Enter your city"
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegistration}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* <FooterComponent ></FooterComponent> */}

      <View style={styles.footer}>
        <FooterComponent></FooterComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingTop: 20, 
  },
  contentContainer: {
    marginTop: 10,
    // height: viewheight(100),
    overflow: 'scroll',
    paddingBottom: 100,
  },
  contentContainerp: {
    marginTop: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
  },

  footer: {
    position: 'absolute',
    // flex:0.1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    // flexDirection:'row',
    height: 50,
    // alignItems:'center',
  },

  labeltop: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  picker: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
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
