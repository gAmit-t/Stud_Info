import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {viewheight, viewwidth} from '../../common/HelperFunctions';
import {RE_DIGIT} from '../../common/Constants';
import OtpContainer from './OtpContainer';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';

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
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
          margin: 80,
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
    setLoading(true);
    // Send a verification code to the user's mobile number
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + number.toString(),
      );
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
      <Text style={styles.txt}>Sign In</Text>
      <TextInput
        style={styles.txtinput}
        onChangeText={text => onChangeNumber(restrictNumericInput(text))}
        value={number}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        maxLength={10}></TextInput>
      <Button
        title="Get Otp"
        onPress={handleSubmit}
        disabled={number.length !== 10}></Button>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {otpSent && (
        <Text style={styles.txtOtp}>
          OTP has been sent on your mobile number
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  txt: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  txtOtp: {
    fontWeight: 'normal',
    alignSelf: 'center',
  },
  txtinput: {
    fontWeight: 'normal',
    flexWrap: 'nowrap',
    alignSelf: 'center',
    paddingLeft: 4,
    textAlign: 'center',
    justifyContent: 'space-evenly',
  },
});

export default Login;
