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

//Permission request for sending message on android
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

type MobileNumberTextInputProps = {
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  otpSent: boolean;
};

function Login(): React.JSX.Element {
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <SplashImage></SplashImage>
      <MobileNumberTextInput
        setOtpSent={setOtpSent}
        otpSent={otpSent}></MobileNumberTextInput>
      {otpSent ? (
        <OtpContainer
          otpSent={otpSent}
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
  otpSent,
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
    const unsubscribe = messaging().onTokenRefresh(fcmToken => {
      console.log('FCM Token Refreshed: ', fcmToken);
      const data = {MobileNo: number, fcmToken: fcmToken};
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
    setOtpSent(true);
    const fcmToken = await messaging().getToken();

    const data = {MobileNo: number, fcmToken: fcmToken};
    console.log(JSON.stringify(data));
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
    const otp = 1234;
    await sendNotification(fcmToken, otp);
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
