import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {viewheight, viewwidth} from '../../common/HelperFunctions';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

interface FieldContainerProps {
  color: string;
  subColor: string;
  text: string;
  setHeight?: any | undefined;
  setWidth?: any | undefined;
  onPress?: () => void;
}

export const FieldContainer = ({
  color,
  subColor,
  text,
  setHeight,
  setWidth,
  onPress,
}: FieldContainerProps) => {
  const containerStyle: ViewStyle = {
    height: setHeight ?? viewheight(10),
    width: setWidth ?? viewwidth(45),
    borderRadius: 5,
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const circleStyle: ViewStyle = {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 110,
    height: 110,
    borderRadius: 50,
    backgroundColor: subColor,
    transform: [{translateY: -60}, {translateX: -20}],
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={containerStyle}>
        <View style={circleStyle} />
        <Text
          style={{
            fontSize: 19,
            fontWeight: '500',
            color: 'black',
            letterSpacing: 1,
          }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function MyTabBar({state, descriptors, navigation}: MaterialTopTabBarProps) {
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map(
        (route: {key: string | number; name: any}, index: any) => {
          const {options} = descriptors[route.key];
          const label = options.title || route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key.toString(),
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <FieldContainer
              key={route.key}
              color={isFocused ? '#f486c0' : '#8e8ffc'}
              subColor={isFocused ? '#f6a0cd' : '#a6a7fd'}
              text={label}
              onPress={onPress}
            />
          );
        },
      )}
    </View>
  );
}
export default MyTabBar;
