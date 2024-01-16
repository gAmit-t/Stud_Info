import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { viewheight, viewwidth } from '../../common/HelperFunctions';
import { RE_DIGIT } from '../../common/Constants';
import OtpContainer from './OtpContainer';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';

//Permission request for sending message on android
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

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

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
    
    <ScrollView  contentContainerStyle={{
      flexGrow: 1, backgroundColor: 'white', flex: 1,
    }}>
      <SplashImage></SplashImage>
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
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          height: viewheight(20),
          width: viewwidth(60),
          marginTop: 80,
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
    if (number.length == 10) {
      setLoading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          '+91' + number.toString(),
        );
        setConfirm(confirmation);
        setOtpSent(true);
      } catch (error) {
        Snackbar.show({
          text: "Something went wrong",

        });
      } finally {
        setLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Enter valid number',

      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Education</Text>
      <Text style={styles.subtitle}>Student App</Text>
      <Text style={styles.centerLeftText}>Mobile Number</Text>

      <TextInput
        style={styles.txtinput}
        onChangeText={text => onChangeNumber(restrictNumericInput(text))}
        value={number}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        maxLength={10}></TextInput>
      {!loading && <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>}

      {loading && <ActivityIndicator style={{marginTop: 20}} size="large" color="#8FBC8F" />}
      {otpSent && (
        <Text style={styles.txtOtp}>
          OTP has been sent on your mobile number
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingHorizontal: 35,
    backgroundColor: '#D3D3D3',
    padding: 8,
    borderRadius: 5, // Rounded corners
  },
  buttonText: {
    color: '#404040', // Text color
    fontSize: 18,
  },
  container: {

    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    backgroundColor: 'white'
  },
  txt: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 28,
    letterSpacing: 1,
    color: 'black'
  },
  subtitle: {
    fontSize: 17,
    letterSpacing: 1,
    color: 'grey',
    marginLeft: 10
  },
  txtOtp: {
    fontWeight: 'normal',
    alignSelf: 'center',
    marginTop:10
  },
  txtinput: {
    width: viewwidth(85),
    height: 46,
    borderWidth: 0.8,
    borderColor: 'gray',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    borderRadius: 5,
  },

  centerLeftText: {
    marginTop: 30,
    alignSelf: 'flex-start',
    fontSize: 16,
    marginLeft: 30,
    color: 'grey'
  },
});

export default Login;
