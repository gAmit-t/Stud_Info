import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OtpInput from './OtpInput';
import React, {useEffect, useState} from 'react';
import {OTP_COUNT, tealColor} from '../../common/Constants';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '../../common/Interfaces';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {getLocation} from '../../common/HelperFunctions';
import {Colors} from 'react-native-elements';

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
  const [isVerifying, setisVerifying] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  useEffect(() => {
    console.log(auth().currentUser, fcmToken);
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
    setisVerifying(true);
    const location = await getLocation();
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      const userCredential = await auth().signInWithCredential(credential);
      const user = userCredential.user;

      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      console.log('User: ', userDoc.data());

      if (userDoc.exists) {
        // User exists, update user data
        await firestore().collection('Users').doc(user.uid).update({
          // Add fields you want to update here
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          lastLogin: Date.now(),
          fcmToken: fcmToken,
          deviceId: deviceId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        const userData = userDoc.data();
        console.log(userData);

        if (userData?.isRegistered) {
          setisVerifying(false);
          // navigation.navigate('Main', {
          //   screen: 'Dashboard',
          // });
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        } else {
          setisVerifying(false);
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
        setisVerifying(false);
        navigation.navigate('RegisterUser');
      }
    } catch (error) {
      setisVerifying(false);
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

  const handleOtpResend = async () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <Text>Enter Otp</Text> */}
        <OtpInput
          otpCount={OTP_COUNT}
          autoFocus={false}
          onCodeFilled={handleOtpFilled}
          onCodeChanged={handleOtpChanged}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {otpSent ? (
            <Text
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={handleOtpResend}>
              <Text style={styles.txtRsend}>Resend OTP</Text>{' '}
              {timeLeft ? (
                <Text style={{color: 'black'}}>in {timeLeft} seconds</Text>
              ) : null}
            </Text>
          ) : null}
        </View>
        {isVerifying ? (
          <ActivityIndicator
            style={{marginTop: 20}}
            size="large"
            color={tealColor}
          />
        ) : (
          <TouchableOpacity
            onPress={handleOtpVerification}
            style={styles.continueBtn}>
            <View>
              <Text style={{color: 'white', fontSize: 17}}>Continue</Text>
            </View>
          </TouchableOpacity>
        )}
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
    marginTop: '5%',
    color: '#4169E1',
    fontSize: 17,
  },
  continueBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: '20%',
    backgroundColor: '#008080',
    padding: 8,
    borderRadius: 5,
  },
});

export default OtpContainer;
