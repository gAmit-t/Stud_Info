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

  const handleSubmit = async () => {
    setOtpSent(true);
    const data = {MobileNo: number};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(
        // 'http://10.0.2.2/api/Authenticate/GetOtp',
        'http://agdisk.com/oldV/api/Authenticate/GetOtp',
        options,
      );
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }
      // console.log(response);
      const result = await response.json();
      console.log('Result: ', result);
    } catch (error) {
      console.log('Fetch failed: ', error);
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
