import {Dimensions} from 'react-native';

export function viewwidth(percentage: number) {
  const value = (percentage * Dimensions.get('window').width) / 100;
  return Math.round(value);
}

export function viewheight(percentage: number) {
  const value = (percentage * Dimensions.get('window').height) / 100;
  return Math.round(value);
}
