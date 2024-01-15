import React, {useEffect, useState} from 'react';
import {
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

type MobileNumberTextInputProps = {
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirm: React.Dispatch<React.SetStateAction<object | null>>;
  setFcmToken: React.Dispatch<React.SetStateAction<string>>;
  otpSent: boolean;
  deviceId: string;
  fcmToken: string;
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

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <SplashImage></SplashImage>
      <MobileNumberTextInput
        setOtpSent={setOtpSent}
        setConfirm={setConfirm}
        setFcmToken={setFcmToken}
        fcmToken={fcmToken}
        otpSent={otpSent}
        deviceId={deviceId}></MobileNumberTextInput>
      {otpSent ? (
        <OtpContainer
          otpSent={otpSent}
          confirm={confirm}
          timeLeft={timeLeft}
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
  setFcmToken,
  setConfirm,
  otpSent,
  deviceId,
  fcmToken,
}: MobileNumberTextInputProps): React.JSX.Element {
  const [number, onChangeNumber] = React.useState('');

  const restrictNumericInput = (text: string) => {
    if (!RE_DIGIT.test(text)) {
      return '';
    } else {
      return text;
    }
  };

  //Hook to listen and handle fcmToken changes when user resets data or reinstalls app
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(Token => {
      setFcmToken(Token);
      const data = {MobileNo: number, fcmToken: fcmToken, deviceId: deviceId};
      // Send the new FCM token to your server here
      //   const options = {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data),
      //   };
      //   try {
      //     const response = await fetch(
      //       'http://agdisk.com/oldV/api/Authenticate/GetOtp',
      //       options,
      //     );
      //     if (!response.ok) {
      //       console.log(`HTTP error! status: ${response.status}`);
      //     }
      //     const result = await response.json();
      //     console.log('Result: ', result);
      //   } catch (error) {
      //     console.log('Fetch failed: ', error);
      //   }
    });
    return unsubscribe;
  }, []);

  //Function to send notification when the API call to generate otp is successfull
  const sendNotification = async (fcmToken: string, otp: number) => {
    const message = {
      to: fcmToken,
      notification: {
        title: 'OTP',
        body: `Your OTP is ${otp}`,
      },
    };
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=AAAAry3VVUo:APA91bHXx9YbsSXsjvBPd18JPVh_6wasD9zSTXH7i3smKc6KVJB0UF1PsRjR_CpEAMQ6DcMJQEOQDqfMGHh0oNnBIemf9AZAQdpd1zn_r44Zs_PwrySyBuo3fT8DfDBhZwb5YkUGcdQt`,
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleSubmit = async () => {
    const Token = await messaging().getToken();
    setFcmToken(Token);
    const data = {MobileNo: number, fcmToken: fcmToken, deviceId: deviceId};
    console.log(JSON.stringify(data));

    // Send a verification code to the user's mobile number
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + number.toString(),
      );
      console.log(confirmation);
      setConfirm(confirmation);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
    }
    //After the user enters the verification code, get the user's account
    // const userCredential = await confirmation.confirm(code);
    // const user = userCredential.user;

    // // Update the user's profile with the mobile number
    // await user.updateProfile({phoneNumber: number});

    // // Register the mobile number to the user's email address
    // await user.linkWithCredential(
    //   auth.PhoneAuthProvider.credential(confirmation.verificationId, code),
    // );

    // // Now the user's mobile number is linked to their email address
    // console.log("Mobile number is now linked to the user's email address.");

    //   const options = {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   };
    //   try {
    //     const response = await fetch(
    //       'http://agdisk.com/oldV/api/Authenticate/GetOtp',
    //       options,
    //     );
    //     if (!response.ok) {
    //       console.log(`HTTP error! status: ${response.status}`);
    //     }
    //     const result = await response.json();
    //     console.log('Result: ', result);
    //   } catch (error) {
    //     console.log('Fetch failed: ', error);
    //   }
    // const otp = 1234;
    // await sendNotification(fcmToken, otp);
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
