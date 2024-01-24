import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {RE_DIGIT, tealColor} from '../../common/Constants';
import {viewheight, viewwidth} from '../../common/HelperFunctions';
import FadeInView from '../../common/animations';
import OtpContainer from './OtpContainer';

// //Permission request for sending message on android
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

type MobileNumberTextInputProps = {
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirm: React.Dispatch<React.SetStateAction<object | null>>;
  // setFcmToken: React.Dispatch<React.SetStateAction<string>>;
  otpSent: boolean;
};

function Login(): React.JSX.Element {
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [confirm, setConfirm] = useState<object | null>(null);

  //Hook to capture DeviceId
  useEffect(() => {
    DeviceInfo.getUniqueId()
      .then(uniqueId => {
        setDeviceId(uniqueId);
      })
      .catch(error => {
        console.log('Error getting device ID: ', error);
      });
  }, []);

  //Hook to generate and store the FCM token
  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken();
      setFcmToken(token);
    };
    getToken();
  }, []);

  //Hook to listen and handle fcmToken changes when user resets data or reinstalls app
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(Token => {
      setFcmToken(Token);
    });
    return unsubscribe;
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <SplashImage></SplashImage>
      <Text style={styles.educationTxt}>EDUCATION</Text>
      <Text style={styles.studentAppTxt}>Student App</Text>
      <MobileNumberTextInput
        setOtpSent={setOtpSent}
        setConfirm={setConfirm}
        otpSent={otpSent}></MobileNumberTextInput>
      {otpSent ? (
        <OtpContainer
          otpSent={otpSent}
          confirm={confirm}
          timeLeft={timeLeft}
          deviceId={deviceId}
          fcmToken={fcmToken}
          setOtpSent={setOtpSent}
          setTimeLeft={setTimeLeft}></OtpContainer>
      ) : null}
    </ScrollView>
  );
}

function SplashImage(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          height: viewheight(20),
          width: viewwidth(60),
          margin: 70,
          marginBottom: 15,
          resizeMode: 'contain',
        }}
        source={require('../../assets/logo.png')}
      />
    </View>
  );
}

function MobileNumberTextInput({
  setOtpSent,
  setConfirm,
  otpSent,
}: MobileNumberTextInputProps): React.JSX.Element {
  const [number, onChangeNumber] = React.useState('');
  const [loading, setLoading] = useState(false);

  const restrictNumericInput = (text: string) => {
    if (!RE_DIGIT.test(text)) {
      return '';
    } else {
      return text;
    }
  };

  const handleSubmit = async () => {
    if (number.length !== 10) {
      Alert.alert('Please enter a 10 digit mobile number');
      return;
    }
    setLoading(true);
    // Send a verification code to the user's mobile number
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + number.toString(),
      );
      const verificationId: string = confirmation.verificationId as string;
      setConfirm(confirmation);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Mobile Number</Text>
      <TextInput
        style={styles.txtinput}
        onChangeText={text => onChangeNumber(restrictNumericInput(text))}
        value={number}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        placeholderTextColor="black"
        maxLength={10}></TextInput>
      {loading ? (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="large"
          color={tealColor}
        />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            {backgroundColor: number.length == 10 ? '#008080' : '#D3D3D3'},
          ]}>
          <View>
            <Text onPress={handleSubmit} style={styles.buttonText}>
              Get OTP
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {otpSent && (
        <FadeInView>
          <Text
            style={{
              alignSelf: 'center',
              color: 'grey',
              fontSize: 16,
              marginTop: 10,
            }}>
            OTP has been sent on your mobile number
          </Text>
        </FadeInView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  txt: {
    letterSpacing: 1,
    fontSize: 18,
    color: 'grey',
    marginTop: 20,
  },
  txtOtp: {
    fontWeight: 'normal',
    alignSelf: 'center',
  },
  txtinput: {
    color: 'black',
    marginTop: 5,
    height: viewheight(5.5),
    borderColor: '#ccc',
    borderWidth: 1.6,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
    // backgroundColor: '#D3D3D3',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
  },
  educationTxt: {
    fontWeight: '800',
    alignSelf: 'center',
    letterSpacing: 1,
    fontSize: 23,
    color: 'black',
  },
  studentAppTxt: {
    alignSelf: 'center',
    fontSize: 18,
    paddingTop: 5,
    color: 'black',
  },
});

export default Login;
