import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RouteProp} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {DrawerParamList, RootParamList} from '../../common/interfaces';
import {RE_DIGIT} from '../../common/Constants';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import HeaderComponent from '../shared/header';
import FooterComponent from '../shared/footer';

const RegisterUser = () => {
  const [fcmToken, setFCMToken] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [dob, setDob] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      setFCMToken(token);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFCMToken();
  }, []);

  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  const handleRegistration = async () => {
    console.log(
      firstName,
      lastName,
      rollNo,
      dob,
      gender,
      address1,
      address2,
      pinCode,
      city,
      state,
      email,
    );

    // Get the current signed-in user
    const user = auth().currentUser;

    // Update the user's document in Firestore
    if (user) {
      const dobTimestamp = firestore.Timestamp.fromDate(dob);
      // Update the user's document in Firestore
      await firestore().collection('Users').doc(user.uid).update({
        firstName: firstName,
        lastName: lastName,
        rollNo: rollNo,
        dob: dobTimestamp,
        gender: gender,
        address1: address1,
        address2: address2,
        pinCode: pinCode,
        city: city,
        state: state,
        email: email,
        isRegistered: true, // Set isRegistered to true after successful registration
      });

      // Display an alert upon successful registration
      Alert.alert(
        'Registration Successful',
        `Congratulations ${firstName} ${lastName}. You have successfully registered.`,
      );

      // Send a push notification to the user's device
      await messaging().sendMessage({
        to: fcmToken,
        notification: {
          title: 'Registration Successful',
          body: `Congratulations ${firstName} ${lastName}. You have successfully registered.`,
        },
      } as FirebaseMessagingTypes.RemoteMessage);

      // Save the push notification in Firestore
      const notificationRef = await firestore()
        .collection('Notifications')
        .add({
          userId: user.uid,
          title: 'Registration Successful',
          message: `Congratulations ${firstName} ${lastName}. You have successfully registered.`,
          timestamp: firestore.Timestamp.now(),
          isRead: false,
          isClosed: false,
        });

      // Update user's document to include the notification ID
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .update({
          notifications: firestore.FieldValue.arrayUnion(notificationRef.id),
        });

      // Navigate to the main dashboard
      navigation.navigate('Main', {
        screen: 'Dashboard',
      });
    } else {
      Alert.alert(
        'Please Login',
        `You are not logged in. Please login using your Mobile number`,
      );
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: React.SetStateAction<Date>) => {
    setDob(date);
    hideDatePicker();
  };

  const restrictNumericInput = (text: string) => {
    if (!RE_DIGIT.test(text)) {
      return '';
    } else {
      return text;
    }
  };

  return (
    <View>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={styles.labeltop}>Register User</Text>
              <View style={styles.contentContainerp}>
                <Image
                  source={require('../../assets/c1.jpg')}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={text => setfirstName(text)}
                  placeholder="Enter your first name"
                  placeholderTextColor="black"
                />
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={text => setlastName(text)}
                  placeholder="Enter your last name"
                  placeholderTextColor="black"
                />
                <Text style={styles.label}>Roll Number</Text>
                <TextInput
                  style={styles.input}
                  value={rollNo}
                  onChangeText={text => setRollNo(text)}
                  placeholder="Enter your roll number"
                  placeholderTextColor="black"
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholder="Enter your Email"
                  placeholderTextColor="black"
                />

                <Text style={styles.label}>Select Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={itemValue => setGender(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>

                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={showDatePicker}>
                  <Text style={styles.buttonText}>
                    {dob ? dob.toLocaleDateString() : 'Select Date of Birth'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  date={dob}
                  isVisible={datePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  maximumDate={new Date()}
                />

                <Text style={styles.label}>Address Line 1</Text>
                <TextInput
                  style={styles.input}
                  value={address1}
                  onChangeText={text => setAddress1(text)}
                  placeholder="Enter your Address 1 (Room no, Bld no, etc)"
                  placeholderTextColor="black"
                />

                <Text style={styles.label}>Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={address2}
                  onChangeText={text => setAddress2(text)}
                  placeholder="Enter your Address 2 (Street name, Area, etc)"
                  placeholderTextColor="black"
                />

                <Text style={styles.label}>Pin Code</Text>
                <TextInput
                  style={styles.input}
                  value={pinCode}
                  onChangeText={text => setPinCode(restrictNumericInput(text))}
                  placeholder="Enter your Pin Code"
                  keyboardType="numeric"
                  maxLength={6}
                />

                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={text => setCity(text)}
                  placeholder="Enter your city"
                  placeholderTextColor="black"
                />

                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={text => setState(text)}
                  placeholder="Enter your state"
                  placeholderTextColor="black"
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegistration}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'white',
    height: 50,
  },

  labeltop: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    color: 'black',
    borderRadius: 5,
  },
  pickerContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default RegisterUser;
