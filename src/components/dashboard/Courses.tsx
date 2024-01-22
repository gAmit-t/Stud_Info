import React from 'react';
import {Linking, View, Text, StyleSheet} from 'react-native';
import {FieldContainer} from './field_container';
import {viewheight, viewwidth} from '../../common/HelperFunctions';

const Courses: React.FC = () => {
  const courseLinks = {
    Python:
      'https://www.geeksforgeeks.org/python-programming-language/?ref=ghm',
    'C#': 'https://www.geeksforgeeks.org/c-plus-plus/?ref=ghm',
    SQL: 'https://www.geeksforgeeks.org/sql-tutorial/?ref=dhm',
  };
  return (
    <View style={styles.containerStyle}>
      <View style={styles.circleStyle} />
      <View style={styles.container}>
        <Text style={styles.header}>COURSE MATERIAL</Text>
        <View style={styles.underline} />
        {Object.entries(courseLinks).map(([text, url], index) => (
          <Text
            key={index}
            style={styles.link}
            onPress={() => Linking.openURL(url)}>
            <View style={styles.underline} />
            {text}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    color: 'black',
  },
  underline: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  link: {
    color: 'blue',
    marginBottom: 10,
    alignSelf: 'center',
  },

  containerStyle: {
    height: viewheight(60),
    width: viewwidth(85),
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: '#f486c0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  circleStyle: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 110,
    height: 110,
    borderRadius: 50,
    backgroundColor: '#f486c0',
    transform: [{translateY: -60}, {translateX: -20}],
  },
});

export default Courses;
