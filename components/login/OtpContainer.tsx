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

type OtpContainerProps = {
  otpSent: boolean;
  timeLeft: number;
  confirm: any;
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

function OtpContainer({
  otpSent,
  timeLeft,
  confirm,
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
    let user = auth().currentUser;
    console.log(user);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      console.log(credential);
      const userCredential = await auth().signInWithCredential(credential);
      const user = userCredential.user;
      console.log(user);
      // Handle successful verification here
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('Main', {
      screen: 'Dashboard',
    });
    //navigation.canGoBack();
    // try {
    //   await fetch('apiEndpoint', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({otp: otpCode}),
    //   });
    // } catch (error) {
    //   console.error('Error:', error);
    // }
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
    // try {
    //     await fetch('apiEndpoint', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ number }),
    //     });
    // } catch (error) {
    //     console.error('Error:', error);
    // }
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
