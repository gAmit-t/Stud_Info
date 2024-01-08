import React, {useState} from 'react';
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
import {StackNavigationProp} from '@react-navigation/stack';

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
          height: viewheight(40),
          width: viewwidth(80),
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

  const handleSubmit = async () => {
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
    <>
      <Text>Mobile Number</Text>
      <TextInput
        onChangeText={text => onChangeNumber(restrictNumericInput(text))}
        value={number}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        maxLength={10}></TextInput>
      <Button
        title="Get Otp"
        onPress={handleSubmit}
        disabled={number.length !== 10}></Button>
      {otpSent && <Text>OTP has been sent on your mobile number</Text>}
    </>
  );
}

const styles = StyleSheet.create({});

export default Login;
