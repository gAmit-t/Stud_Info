import {useRef, useEffect} from 'react';
import {Animated, ViewStyle} from 'react-native';

interface FadeInViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const FadeInView: React.FC<FadeInViewProps> = ({style, children}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...style,
        opacity: fadeAnim,
      }}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;
