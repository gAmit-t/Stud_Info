import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import OtpInput from './OtpInput';
import React, {useEffect, useState} from 'react';
import {OTP_COUNT} from '../../common/Constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '../../common/interfaces';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {getLocation} from '../../common/HelperFunctions';

type OtpContainerProps = {
  otpSent: boolean;
  timeLeft: number;
  confirm: any;
  deviceId: string;
  fcmToken: string;
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

function OtpContainer({
  otpSent,
  timeLeft,
  confirm,
  deviceId,
  fcmToken,
  setOtpSent,
  setTimeLeft,
}: OtpContainerProps) {
  const [isOtpFilled, setIsOtpFilled] = React.useState(false);
  const [code, onChangeCode] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  useEffect(() => {
    console.log(auth().currentUser);
    if (otpSent) {
      let countdown = 90;
      setTimeLeft(countdown);

      const intervalId = setInterval(() => {
        if (countdown > 0) {
          setTimeLeft(--countdown);
        } else {
          clearInterval(intervalId);
          setTimeLeft(0);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [otpSent, setTimeLeft]);

  const handleOtpVerification = async () => {
    const location = await getLocation();
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      const userCredential = await auth().signInWithCredential(credential);
      const user = userCredential.user;

      const userDoc = await firestore().collection('Users').doc(user.uid).get();

      if (userDoc.exists) {
        // User exists, update user data
        await firestore().collection('Users').doc(user.uid).update({
          // Add fields you want to update here
          lastLogin: Date.now(),
          fcmToken: fcmToken,
          deviceId: deviceId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        const userData = userDoc.data();

        if (userData?.isRegistered) {
          navigation.navigate('Main', {
            screen: 'Dashboard',
          });
        } else {
          navigation.navigate('RegisterUser');
        }
      } else {
        // User doesn't exist, create new user
        await firestore().collection('Users').doc(user.uid).set({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          fcmToken: fcmToken,
          deviceId: deviceId,
          isRegistered: false,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          courses: [],
          notifications: [],
        });
        navigation.navigate('RegisterUser');
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleOtpFilled(code: number): void {
    setIsOtpFilled(true);
  }

  const handleOtpChanged = (codes: number) => {
    console.log(codes);
    onChangeCode(codes.toString());
    if (codes.toString().length !== OTP_COUNT) {
      setIsOtpFilled(false);
    }
  };

  const handleOtpResend = async () => {
    console.log(otpSent);
    setOtpSent(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* <Text>Enter Otp</Text> */}
        <OtpInput
          otpCount={OTP_COUNT}
          autoFocus={false}
          onCodeFilled={handleOtpFilled}
          onCodeChanged={handleOtpChanged}
        />
        {otpSent ? (
          <Text onPress={handleOtpResend}>
            <Text style={styles.txtRsend}>Resend OTP</Text> in {timeLeft}{' '}
            seconds
          </Text>
        ) : null}
        <Button
          title="Verify OTP"
          onPress={handleOtpVerification}
          disabled={!isOtpFilled}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  txtRsend: {
    color: 'blue',
  },
});

export default OtpContainer;
