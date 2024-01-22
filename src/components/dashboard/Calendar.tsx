import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Calendar: React.FC = () => {
  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
        Calendar
      </Text>
      <Text>Custom Calendar goes here</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Calendar;
